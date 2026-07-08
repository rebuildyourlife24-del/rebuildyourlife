"""
aeip_system_bus.py
===================
The routing brain of AEIP OS.

Responsibility: take FunnelEvents that occurred in Orion and decide
which Hermes agent(s), if any, should react — then create a
HermesAgentTask that a separate task runner will execute.

Explicitly NOT responsible for:
- Calling the LLM itself (that is llm_router.py's job downstream)
- Deciding whether an action needs human approval (that lives in
  the agent's own logic + Vault.ActionProposal, further downstream)

Three design principles enforced here, all non-negotiable given
what this system does with real ad spend and real leads:

1. AT-LEAST-ONCE DELIVERY. Events are claimed via a dispatch-flag
   poll, not fire-and-forget. If this process crashes mid-batch,
   unclaimed events are simply picked up on the next cycle. A lead
   is never silently lost because a webhook handler happened to
   also try to call an agent inline and failed.

2. IDEMPOTENT TASK CREATION. One FunnelEvent can never spawn two
   HermesAgentTask rows, enforced by the unique constraint on
   triggerEventId — not by "try to remember if we already did this".

3. DATA-DRIVEN ROUTING. Which agent reacts to which event is a
   database table (EventRoutingRule), not an if/elif chain. Rolling
   out agent #4 through #272 means inserting rows, not shipping code.

NOTE ON API SURFACE: the Prisma Python client (prisma-client-py) API
shown below (transactions, raw SQL, .find_many/.create/.update) is
illustrative of the pattern — verify exact method signatures against
the client version you generate, particularly around FOR UPDATE SKIP
LOCKED inside a transaction, which may need a raw connection instead
of the high-level client depending on your prisma-client-py version.
"""

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime, timezone

from prisma import Prisma
import os

OrionClient = Prisma
HermesClient = Prisma

logger = logging.getLogger("aeip.system_bus")

BATCH_SIZE = 50
POLL_INTERVAL_SECONDS = 5
MAX_DISPATCH_ATTEMPTS = 5   # after this many failed dispatch attempts, the
                            # event is left undispatched and surfaced on the
                            # Sentinel Dashboard for a human to look at —
                            # NOT retried forever (see 24.5 loop-prevention)


@dataclass
class RoutingDecision:
    agent_key: str
    task_payload: dict
    priority: int = 100  # lower = more urgent


# ---------------------------------------------------------------------------
# 1. ROUTING — pure function, no I/O, fully unit-testable in isolation
# ---------------------------------------------------------------------------

def route_event(
    event_type: str,
    funnel_stage: str,
    product_tier: str | None,
    rules: list[dict],
) -> RoutingDecision | None:
    """
    Match a FunnelEvent against the active EventRoutingRule set.

    Returns None if no agent should react. This is deliberate: most
    events (routine page_views, for instance) are NOT supposed to wake
    an agent. Waking an agent for every event would be expensive and
    would flood the Sentinel Dashboard with noise — the agentic
    equivalent of alert fatigue.
    """
    candidates = [
        r for r in rules
        if r["eventType"] == event_type
        and (r["funnelStage"] is None or r["funnelStage"] == funnel_stage)
        and (r["productTier"] is None or r["productTier"] == product_tier)
        and r["isActive"]
    ]
    if not candidates:
        return None

    # Most specific rule wins: exact tier+stage match beats a wildcard.
    best = sorted(
        candidates,
        key=lambda r: (r["productTier"] is None, r["funnelStage"] is None, r["priority"]),
    )[0]

    return RoutingDecision(
        agent_key=best["agentKey"],
        task_payload={"rule_id": best["id"]},
        priority=best["priority"],
    )


# ---------------------------------------------------------------------------
# 2. DISPATCH LOOP — the actual cron worker body
# ---------------------------------------------------------------------------

async def dispatch_pending_events(orion: OrionClient, hermes: HermesClient) -> int:
    """
    One pass: claim a batch of undispatched FunnelEvents, route each one,
    create the corresponding HermesAgentTask, and mark the source event
    as dispatched. Safe to run from multiple worker instances concurrently
    — FOR UPDATE SKIP LOCKED means two workers never grab the same event.
    """
    async with orion.tx() as tx:
        events = await tx.query_raw(
            """
            SELECT fe.id, fe."leadId", fe."eventType", fe.metadata, l."funnelStage"
            FROM "FunnelEvent" fe
            JOIN "Lead" l ON l.id = fe."leadId"
            WHERE fe."dispatchedAt" IS NULL
              AND fe."dispatchAttempts" < $1
            ORDER BY fe."createdAt" ASC
            LIMIT $2
            FOR UPDATE OF fe SKIP LOCKED
            """,
            MAX_DISPATCH_ATTEMPTS,
            BATCH_SIZE,
        )

        if not events:
            return 0

        rules = await hermes.eventroutingrule.find_many(where={"isActive": True})
        rules_dicts = [r.dict() for r in rules]

        dispatched = 0

        for event in events:
            decision = route_event(
                event_type=event["eventType"],
                funnel_stage=event["funnelStage"],
                product_tier=None,  # extend once tier-specific routing is needed
                rules=rules_dicts,
            )

            try:
                if decision is not None:
                    # Idempotency guard: the unique constraint on triggerEventId
                    # is the real safety net here, not this find-first check —
                    # this just avoids a noisy constraint-violation log entry.
                    existing = await hermes.hermesagenttask.find_unique(
                        where={"triggerEventId": event["id"]}
                    )
                    if existing is None:
                        await hermes.hermesagenttask.create(
                            data={
                                "triggerEventId": event["id"],
                                "leadId": event["leadId"],
                                "agentKey": decision.agent_key,
                                "payload": decision.task_payload,
                                "priority": decision.priority,
                                "status": "PENDING",
                            }
                        )
                        logger.info(
                            "Routed event %s (%s) -> agent %s",
                            event["id"], event["eventType"], decision.agent_key,
                        )
                    else:
                        logger.info("Event %s already has a task, skipping", event["id"])
                else:
                    logger.debug(
                        "No routing rule for event %s (%s) — no agent woken",
                        event["id"], event["eventType"],
                    )

                await tx.funnelevent.update(
                    where={"id": event["id"]},
                    data={"dispatchedAt": datetime.now(timezone.utc)},
                )
                dispatched += 1

            except Exception as exc:  # noqa: BLE001 — one bad event must not sink the batch
                logger.exception("Failed to route event %s", event["id"])
                await tx.funnelevent.update(
                    where={"id": event["id"]},
                    data={
                        "dispatchAttempts": {"increment": 1},
                        "lastDispatchError": str(exc)[:500],
                    },
                )

        return dispatched


async def run_forever(orion: OrionClient, hermes: HermesClient) -> None:
    """Entry point for the cron worker process (one of your 5 background workers)."""
    while True:
        try:
            n = await dispatch_pending_events(orion, hermes)
            if n:
                logger.info("Dispatched %d funnel events this cycle", n)
        except Exception:
            logger.exception("Dispatch loop error — will retry next cycle, not crash the worker")
        await asyncio.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    orion = OrionClient(datasource={"url": os.getenv("ORION_DATABASE_URL")})
    hermes = HermesClient(datasource={"url": os.getenv("HERMES_DATABASE_URL")})

    async def main() -> None:
        await orion.connect()
        await hermes.connect()
        try:
            await run_forever(orion, hermes)
        finally:
            await orion.disconnect()
            await hermes.disconnect()

    asyncio.run(main())
