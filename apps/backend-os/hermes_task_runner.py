"""
hermes_task_runner.py
======================
Consumes HermesAgentTask rows created by aeip_system_bus.py, invokes
the correct agent, and closes the loop on two possible outcomes:

  A) The agent can act directly (e.g. send a pre-approved nurture
     email) -> execute, mark COMPLETED.
  B) The agent's proposed action needs a human sign-off (spend,
     publish, refund, pricing) -> create a Vault.ActionProposal,
     mark the task AWAITING_APPROVAL, and STOP. This runner does
     NOT execute the action itself in that case.

A second function, resolve_approved_tasks(), is what actually closes
loop (B): it polls Vault for proposals that have since been approved
or rejected, and finishes the corresponding Hermes task accordingly.
Without this second function, an approved proposal would sit in Vault
forever with no mechanism ever coming back to execute it.

Retry policy: exponential backoff via nextAttemptAt, hard ceiling via
maxAttempts. A task that exhausts its attempts becomes STUCK — never
retried forever, always surfaced for a human (see the Sentinel
Dashboard's "Stuck Tasks" view, which is just a query on this status).

NOTE ON API SURFACE: as before, treat the Prisma client calls here as
illustrative of the intended pattern; verify exact method signatures
against your generated prisma-client-py version.
"""

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Callable, Awaitable

from prisma import Prisma
import os

HermesClient = Prisma   # Cluster 2
VaultClient = Prisma    # Cluster 4

logger = logging.getLogger("aeip.task_runner")

BATCH_SIZE = 20
POLL_INTERVAL_SECONDS = 3
BACKOFF_BASE_SECONDS = 30   # attempt 1 -> 30s, attempt 2 -> 60s, attempt 3 -> 120s ...


class ActionType(str, Enum):
    EXECUTE_DIRECT = "EXECUTE_DIRECT"       # low-risk, agent's own mandate covers it
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"  # must go through Vault first


@dataclass
class AgentResult:
    action_type: ActionType
    # For EXECUTE_DIRECT: the result of the already-performed action.
    # For REQUIRES_APPROVAL: the payload to hand to Vault.ActionProposal.
    payload: dict = field(default_factory=dict)
    category: str | None = None          # Vault.ActionCategory, required if REQUIRES_APPROVAL
    risk_amount_cents: int | None = None
    justification: str | None = None     # required if REQUIRES_APPROVAL — agents never
                                          # propose a spend/publish action without stating why


# ---------------------------------------------------------------------------
# AGENT REGISTRY — one entry per agentKey. This is intentionally a thin,
# swappable seam: llm_router.py does the actual model call, this file
# only wires the task's context into the right handler and interprets
# the outcome.
# ---------------------------------------------------------------------------

AgentHandler = Callable[[dict], Awaitable[AgentResult]]


import llm_router

async def handle_lead_gen_v1(task_payload: dict) -> AgentResult:
    """
    Example: a brand-new lead needs an initial nurture sequence started.
    Selecting from pre-approved templates is EXECUTE_DIRECT — no new
    brand content is being invented, so no governance gate is needed.
    """
    result_payload = await llm_router.invoke("lead_gen_v1", context=task_payload)
    return AgentResult(
        action_type=ActionType.EXECUTE_DIRECT,
        payload=result_payload,
    )


async def handle_copywriter_v1(task_payload: dict) -> AgentResult:
    """
    Example: the agent drafted genuinely new ad copy for external
    publication. That is exactly the case the Governance API exists
    for — it must go through Vault before anything gets published.
    """
    draft_payload = await llm_router.invoke("copywriter_v1", context=task_payload)
    return AgentResult(
        action_type=ActionType.REQUIRES_APPROVAL,
        payload=draft_payload,
        category="BRAND_CONTENT_PUBLISH",
        justification="New ad variant proposed for underperforming campaign X, based on LLM contextual analysis.",
    )


AGENT_REGISTRY: dict[str, AgentHandler] = {
    "lead_gen_v1": handle_lead_gen_v1,
    "copywriter_v1": handle_copywriter_v1,
    # register the remaining agents here as they come online
}


# ---------------------------------------------------------------------------
# MAIN RUN LOOP: pick up PENDING tasks whose backoff window has passed
# ---------------------------------------------------------------------------

async def run_pending_tasks(hermes: HermesClient, vault: VaultClient) -> int:
    async with hermes.tx() as tx:
        tasks = await tx.query_raw(
            """
            SELECT id, "agentKey", payload, attempts, "maxAttempts"
            FROM "HermesAgentTask"
            WHERE status = 'PENDING'
              AND "nextAttemptAt" <= now()
            ORDER BY priority ASC, "createdAt" ASC
            LIMIT $1
            FOR UPDATE SKIP LOCKED
            """,
            BATCH_SIZE,
        )

        if not tasks:
            return 0

        # Claim them immediately so a slow agent call doesn't get
        # re-picked-up by another worker mid-execution.
        for t in tasks:
            await tx.hermesagenttask.update(
                where={"id": t["id"]},
                data={"status": "RUNNING", "startedAt": datetime.now(timezone.utc)},
            )

    processed = 0
    for t in tasks:
        await _execute_one_task(hermes, vault, t)
        processed += 1

    return processed


async def _execute_one_task(hermes: HermesClient, vault: VaultClient, task_row: dict) -> None:
    handler = AGENT_REGISTRY.get(task_row["agentKey"])

    if handler is None:
        # An unregistered agentKey is a configuration bug, not a transient
        # failure — no point retrying, surface it immediately.
        await hermes.hermesagenttask.update(
            where={"id": task_row["id"]},
            data={"status": "STUCK", "lastError": f"No handler registered for agentKey={task_row['agentKey']}"},
        )
        logger.error("Unregistered agentKey %s on task %s", task_row["agentKey"], task_row["id"])
        return

    try:
        result = await handler(task_row["payload"])

        if result.action_type == ActionType.EXECUTE_DIRECT:
            # Real implementation: actually perform the action here
            # (send the email, update the lead score, etc.) before
            # marking COMPLETED — omitted, this is the integration seam.
            await hermes.hermesagenttask.update(
                where={"id": task_row["id"]},
                data={"status": "COMPLETED", "completedAt": datetime.now(timezone.utc)},
            )
            logger.info("Task %s completed directly", task_row["id"])

        elif result.action_type == ActionType.REQUIRES_APPROVAL:
            if not result.justification or not result.category:
                raise ValueError(
                    "Agent returned REQUIRES_APPROVAL without justification/category — "
                    "refusing to create an unaccountable ActionProposal"
                )

            proposal = await vault.actionproposal.create(
                data={
                    "agentId": task_row["agentKey"],
                    "agentName": task_row["agentKey"],
                    "category": result.category,
                    "proposedPayload": result.payload,
                    "riskAmountCents": result.risk_amount_cents,
                    "justification": result.justification,
                    "status": "PENDING",
                }
            )

            await hermes.hermesagenttask.update(
                where={"id": task_row["id"]},
                data={"status": "AWAITING_APPROVAL", "vaultProposalId": proposal.id},
            )
            logger.info(
                "Task %s paused pending human approval (proposal %s)",
                task_row["id"], proposal.id,
            )

    except Exception as exc:  # noqa: BLE001
        await _record_failure(hermes, task_row, exc)


async def _record_failure(hermes: HermesClient, task_row: dict, exc: Exception) -> None:
    attempts = task_row["attempts"] + 1
    max_attempts = task_row["maxAttempts"]

    if attempts >= max_attempts:
        await hermes.hermesagenttask.update(
            where={"id": task_row["id"]},
            data={"status": "STUCK", "attempts": attempts, "lastError": str(exc)[:500]},
        )
        logger.warning("Task %s marked STUCK after %d attempts", task_row["id"], attempts)
    else:
        backoff = timedelta(seconds=BACKOFF_BASE_SECONDS * (2 ** (attempts - 1)))
        await hermes.hermesagenttask.update(
            where={"id": task_row["id"]},
            data={
                "status": "PENDING",
                "attempts": attempts,
                "lastError": str(exc)[:500],
                "nextAttemptAt": datetime.now(timezone.utc) + backoff,
            },
        )
        logger.warning(
            "Task %s failed (attempt %d/%d), retrying in %s",
            task_row["id"], attempts, max_attempts, backoff,
        )


# ---------------------------------------------------------------------------
# CLOSING THE APPROVAL LOOP: without this, an APPROVED proposal in Vault
# never actually gets executed — this is what makes the human's click on
# the Sentinel Dashboard actually do something.
# ---------------------------------------------------------------------------

async def resolve_approved_tasks(hermes: HermesClient, vault: VaultClient) -> int:
    awaiting = await hermes.hermesagenttask.find_many(
        where={"status": "AWAITING_APPROVAL"}
    )
    if not awaiting:
        return 0

    resolved = 0
    for task in awaiting:
        proposal = await vault.actionproposal.find_unique(where={"id": task.vaultProposalId})
        if proposal is None:
            continue

        if proposal.status == "APPROVED":
            # Real implementation: actually publish/spend here, using
            # proposal.proposedPayload — omitted, integration seam.
            await hermes.hermesagenttask.update(
                where={"id": task.id},
                data={"status": "COMPLETED", "completedAt": datetime.now(timezone.utc)},
            )
            logger.info("Task %s executed after human approval", task.id)
            resolved += 1

        elif proposal.status in ("REJECTED", "EXPIRED"):
            await hermes.hermesagenttask.update(
                where={"id": task.id},
                data={"status": "FAILED", "lastError": f"Vault proposal {proposal.status}"},
            )
            logger.info("Task %s closed: proposal %s", task.id, proposal.status)
            resolved += 1

        # status == PENDING: still waiting on you, nothing to do yet

    return resolved


# ---------------------------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------------------------

async def run_forever(hermes: HermesClient, vault: VaultClient) -> None:
    while True:
        try:
            n_run = await run_pending_tasks(hermes, vault)
            n_resolved = await resolve_approved_tasks(hermes, vault)
            if n_run or n_resolved:
                logger.info("Ran %d tasks, resolved %d approval decisions", n_run, n_resolved)
        except Exception:
            logger.exception("Task runner loop error — will retry next cycle")
        await asyncio.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    hermes = HermesClient(datasource={"url": os.getenv("HERMES_DATABASE_URL")})
    vault = VaultClient(datasource={"url": os.getenv("VAULT_DATABASE_URL")})

    async def main() -> None:
        await hermes.connect()
        await vault.connect()
        try:
            await run_forever(hermes, vault)
        finally:
            await hermes.disconnect()
            await vault.disconnect()

    asyncio.run(main())
