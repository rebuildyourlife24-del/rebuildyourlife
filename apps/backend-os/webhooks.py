"""
webhooks.py
============
The entry points that create the very first FunnelEvent for a lead,
and the events that mark a conversion. Everything downstream
(aeip_system_bus.py, hermes_task_runner.py) depends entirely on these
being correct and idempotent — a duplicate "purchase" event here
means a duplicate agent task, possibly a duplicate onboarding email
or a double-charged customer support headache.

Endpoints:
  POST /api/leads/capture   — from your own landing pages (Academy squeeze pages)
  POST /webhooks/stripe     — Stripe subscription lifecycle
  POST /webhooks/mollie     — Mollie payment lifecycle

Design principles enforced:
1. IDEMPOTENCY via WebhookEventLog. A retried webhook delivery must
   never create a second FunnelEvent or a second Subscription.
2. SIGNATURE VERIFICATION is mandatory for Stripe, not optional.
   Mollie has no signature scheme — trust is established by fetching
   the object back from Mollie's own authenticated API, never by
   trusting the raw webhook payload directly.
3. Lead+FunnelEvent (and User+Subscription+FunnelEvent) are written
   in a single transaction — one business fact, one event, always.

NOTE: this is a working skeleton, not a drop-in production file —
product_id resolution, error responses, and the Mollie client call
are marked as integration seams below.
"""

import logging
import os

import stripe
from fastapi import APIRouter, Request, HTTPException, Header
from prisma import Prisma
import os

OrionClient = Prisma

logger = logging.getLogger("aeip.webhooks")
router = APIRouter()

orion = OrionClient(datasource={"url": os.getenv("ORION_DATABASE_URL")})

STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
stripe.api_key = os.environ.get("STRIPE_API_KEY", "")


# ---------------------------------------------------------------------------
# 1. LEAD CAPTURE — the very first FunnelEvent in a person's lifecycle
# ---------------------------------------------------------------------------

@router.post("/api/leads/capture")
async def capture_lead(payload: dict):
    """
    Called from your Next.js API route (which owns the origin/CSRF
    check and any shared-secret validation) — this endpoint trusts
    its caller, it is not meant to be hit directly from the browser.
    """
    email = payload.get("email")
    if not email:
        raise HTTPException(400, "email is required")

    async with orion.tx() as tx:
        lead = await tx.lead.upsert(
            where={"email": email},
            data={
                "create": {
                    "email": email,
                    "firstName": payload.get("firstName"),
                    "lastName": payload.get("lastName"),
                    "sourceType": payload.get("sourceType", "UNKNOWN"),
                    "campaignId": payload.get("campaignId"),
                    "utmSource": payload.get("utmSource"),
                    "utmMedium": payload.get("utmMedium"),
                    "utmCampaign": payload.get("utmCampaign"),
                    "funnelStage": "LEAD",
                },
                "update": {},  # returning lead — never overwrite existing attribution
            },
        )

        await tx.funnelevent.create(
            data={
                "leadId": lead.id,
                "eventType": "lead_created",
                "metadata": {"raw_payload_keys": list(payload.keys())},
            }
        )

    logger.info("Lead captured: %s", email)
    return {"status": "ok", "leadId": lead.id}


# ---------------------------------------------------------------------------
# 2. STRIPE — signature verification is not optional
# ---------------------------------------------------------------------------

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    raw_body = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            raw_body, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        # Never process an unverified payload — this is the single
        # most important line in this entire file.
        raise HTTPException(400, "invalid signature")

    async with orion.tx() as tx:
        already_seen = await tx.webhookeventlog.find_unique(
            where={"provider_externalEventId": {"provider": "STRIPE", "externalEventId": event["id"]}}
        )
        if already_seen:
            logger.info("Stripe event %s already processed, ignoring", event["id"])
            return {"status": "already_processed"}

        await tx.webhookeventlog.create(
            data={"provider": "STRIPE", "externalEventId": event["id"]}
        )

        obj = event["data"]["object"]

        if event["type"] == "checkout.session.completed":
            await _handle_stripe_checkout_completed(tx, obj)
        elif event["type"] == "customer.subscription.updated":
            await _handle_stripe_subscription_updated(tx, obj)
        elif event["type"] == "customer.subscription.deleted":
            await _handle_stripe_subscription_canceled(tx, obj)
        else:
            logger.debug("Unhandled Stripe event type: %s", event["type"])

    return {"status": "ok"}


async def _handle_stripe_checkout_completed(tx, session: dict) -> None:
    email = session["customer_details"]["email"]
    stripe_customer_id = session["customer"]

    user = await tx.user.upsert(
        where={"email": email},
        data={
            "create": {"email": email, "stripeCustomerId": stripe_customer_id},
            "update": {"stripeCustomerId": stripe_customer_id},
        },
    )

    # Integration seam: map session.metadata (set when the checkout
    # session was created, on the Next.js side) to your internal Product.id
    product_id = session.get("metadata", {}).get("product_id")

    await tx.subscription.upsert(
        where={"externalSubId": session["subscription"]},
        data={
            "create": {
                "userId": user.id,
                "productId": product_id,
                "provider": "STRIPE",
                "externalSubId": session["subscription"],
                "status": "ACTIVE",
            },
            "update": {"status": "ACTIVE"},
        },
    )

    # Bridge back to the Lead this person originally was — this is what
    # closes the acquisition -> conversion loop for attribution reporting.
    lead = await tx.lead.find_unique(where={"email": email})
    if lead:
        await tx.lead.update(where={"id": lead.id}, data={"funnelStage": "CUSTOMER"})
        await tx.funnelevent.create(
            data={
                "leadId": lead.id,
                "eventType": "purchase",
                "metadata": {"productId": product_id, "provider": "STRIPE"},
            }
        )


async def _handle_stripe_subscription_updated(tx, subscription: dict) -> None:
    await tx.subscription.update_many(
        where={"externalSubId": subscription["id"]},
        data={"status": _map_stripe_status(subscription["status"])},
    )


async def _handle_stripe_subscription_canceled(tx, subscription: dict) -> None:
    await tx.subscription.update_many(
        where={"externalSubId": subscription["id"]},
        data={"status": "CANCELED"},
    )


def _map_stripe_status(stripe_status: str) -> str:
    return {
        "trialing": "TRIALING",
        "active": "ACTIVE",
        "past_due": "PAST_DUE",
        "canceled": "CANCELED",
        "paused": "PAUSED",
    }.get(stripe_status, "ACTIVE")


# ---------------------------------------------------------------------------
# 3. MOLLIE — no signature scheme; trust is the round-trip fetch, not the payload
# ---------------------------------------------------------------------------

@router.post("/webhooks/mollie")
async def mollie_webhook(request: Request):
    form = await request.form()
    payment_id = form.get("id")
    if not payment_id:
        raise HTTPException(400, "missing payment id")

    # Mollie's webhook body contains ONLY an id. You must fetch the
    # object from Mollie's authenticated API rather than trust anything
    # in the raw POST — that round-trip IS your verification mechanism.
    payment = _fetch_mollie_payment(payment_id)  # integration seam, see below

    async with orion.tx() as tx:
        dedup_key = f"{payment_id}:{payment['status']}"
        already_seen = await tx.webhookeventlog.find_unique(
            where={"provider_externalEventId": {"provider": "MOLLIE", "externalEventId": dedup_key}}
        )
        if already_seen:
            return {"status": "already_processed"}

        await tx.webhookeventlog.create(
            data={"provider": "MOLLIE", "externalEventId": dedup_key}
        )

        if payment["status"] == "paid":
            await _handle_mollie_paid(tx, payment)

    return {"status": "ok"}


def _fetch_mollie_payment(payment_id: str) -> dict:
    # Integration seam: replace with e.g.
    #   from mollie.api.client import Client
    #   mollie_client = Client(); mollie_client.set_api_key(os.environ["MOLLIE_API_KEY"])
    #   return mollie_client.payments.get(payment_id)
    raise NotImplementedError("wire up the mollie-api-python client here")


async def _handle_mollie_paid(tx, payment: dict) -> None:
    # metadata must be set when the payment/checkout was created —
    # Mollie echoes back whatever metadata you attached at creation time
    email = payment["metadata"]["email"]
    product_id = payment["metadata"]["product_id"]

    user = await tx.user.upsert(
        where={"email": email},
        data={
            "create": {"email": email, "mollieCustomerId": payment.get("customerId")},
            "update": {"mollieCustomerId": payment.get("customerId")},
        },
    )

    await tx.subscription.upsert(
        where={"externalSubId": payment["id"]},
        data={
            "create": {
                "userId": user.id,
                "productId": product_id,
                "provider": "MOLLIE",
                "externalSubId": payment["id"],
                "status": "ACTIVE",
            },
            "update": {"status": "ACTIVE"},
        },
    )

    lead = await tx.lead.find_unique(where={"email": email})
    if lead:
        await tx.lead.update(where={"id": lead.id}, data={"funnelStage": "CUSTOMER"})
        await tx.funnelevent.create(
            data={
                "leadId": lead.id,
                "eventType": "purchase",
                "metadata": {"productId": product_id, "provider": "MOLLIE"},
            }
        )
