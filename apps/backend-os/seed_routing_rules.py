"""
seed_routing_rules.py
======================
Initial EventRoutingRule set for the three agents you're actually
spinning up first (Lead Gen, Copywriter, CMO). Deliberately narrow —
add rows as each new agent goes live, don't pre-seed rules for agents
that don't exist yet.
"""

import asyncio
from prisma import Prisma
import os

HermesClient = Prisma

RULES = [
    {
        "eventType": "lead_created",
        "funnelStage": "LEAD",
        "productTier": None,
        "agentKey": "lead_gen_v1",
        "priority": 10,   # highest priority — start nurturing immediately
    },
    {
        "eventType": "email_clicked",
        "funnelStage": "MQL",
        "productTier": None,
        "agentKey": "lead_gen_v1",
        "priority": 50,   # engaged lead — advance the sequence
    },
    {
        "eventType": "checkout_started",
        "funnelStage": None,   # matches regardless of stage
        "productTier": None,
        "agentKey": "lead_gen_v1",
        "priority": 5,    # abandoned-checkout recovery is time-sensitive
    },
    {
        "eventType": "campaign_underperforming",   # emitted by a scheduled
                                                    # analytics check, not a
                                                    # user action
        "funnelStage": None,
        "productTier": None,
        "agentKey": "copywriter_v1",
        "priority": 20,
    },
    # Deliberately NOT seeded yet: anything for a CMO agent that would
    # touch budget across multiple campaigns at once — that agent's
    # mandate isn't defined narrowly enough yet to route events to it
    # safely. Add its rule only once that mandate is explicit.
]


async def main() -> None:
    hermes = HermesClient(datasource={"url": os.getenv("HERMES_DATABASE_URL")})
    await hermes.connect()
    try:
        for rule in RULES:
            existing = await hermes.eventroutingrule.find_first(
                where={
                    "eventType": rule["eventType"],
                    "funnelStage": rule["funnelStage"],
                    "productTier": rule["productTier"],
                    "agentKey": rule["agentKey"],
                }
            )
            if existing is None:
                await hermes.eventroutingrule.create(data=rule)
                print(f"Seeded rule: {rule['eventType']} -> {rule['agentKey']}")
            else:
                print(f"Rule already exists: {rule['eventType']} -> {rule['agentKey']}")
    finally:
        await hermes.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
