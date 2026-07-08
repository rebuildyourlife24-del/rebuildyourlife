"""
seed_penta_brain.py
===================
Generates cross-cluster seed data to verify Sentinel Dashboard and System Bus.
Creates:
 - Campaigns (Orion)
 - Leads + FunnelEvents (Orion)
 - ActionProposals (Vault)
 - HermesAgentTasks (Hermes)
"""
import asyncio
import os
import random
import uuid
from datetime import datetime, timedelta, timezone
from prisma import Prisma

# We use the master database URL since locally we are running a single PostgreSQL instance
db = Prisma(datasource={"url": os.getenv("DATABASE_URL")})

async def main():
    await db.connect()
    try:
        print("Cleaning up old test data...")
        await db.hermesagenttask.delete_many()
        await db.actionproposal.delete_many()
        await db.funnelevent.delete_many()
        await db.lead.delete_many()
        await db.campaign.delete_many()
        
        print("Seeding Campaigns...")
        c1 = await db.campaign.create(
            data={
                "name": "Summer Launch 2026",
                "sourceType": "PAID_AD",
                "platform": "meta",
                "budgetCents": 50000,
                "spendCents": 12500
            }
        )
        
        print("Seeding Leads, FunnelEvents, HermesTasks & VaultProposals...")
        stages = ["VISITOR", "LEAD", "MQL", "SQL", "CUSTOMER"]
        statuses = ["PENDING", "RUNNING", "COMPLETED", "STUCK", "AWAITING_APPROVAL"]
        
        for i in range(15):
            stage = random.choice(stages)
            lead = await db.lead.create(
                data={
                    "email": f"test_lead_{i}_{uuid.uuid4().hex[:6]}@example.com",
                    "firstName": f"Test{i}",
                    "lastName": "User",
                    "funnelStage": stage,
                    "leadScore": random.randint(10, 90),
                    "campaignId": c1.id,
                }
            )
            
            # Create a FunnelEvent
            event = await db.funnelevent.create(
                data={
                    "leadId": lead.id,
                    "eventType": "lead_created",
                    "metadata": {"ip": "127.0.0.1", "browser": "Chrome"}
                }
            )
            
            # Create an Agent Task in Hermes for this event
            status = random.choice(statuses)
            
            proposal_id = None
            agent_key = "lead_gen_v1"
            
            if status == "AWAITING_APPROVAL":
                agent_key = "copywriter_v1"
                # Create a Vault ActionProposal first
                prop = await db.actionproposal.create(
                    data={
                        "agentId": agent_key,
                        "agentName": "Copywriter Agent",
                        "category": "BRAND_CONTENT_PUBLISH",
                        "proposedPayload": {"draft": f"Check out our new offer, lead {lead.id}!"},
                        "riskAmountCents": 0,
                        "justification": "A/B test variation required based on low conversion rate.",
                        "status": "PENDING"
                    }
                )
                proposal_id = prop.id
            elif status == "STUCK":
                agent_key = "lead_gen_v1"
                # Simulating a failed api call
                pass
                
            await db.hermesagenttask.create(
                data={
                    "triggerEventId": event.id,
                    "leadId": lead.id,
                    "agentKey": agent_key,
                    "payload": {"action": "nurture_sequence_1"},
                    "status": status,
                    "vaultProposalId": proposal_id,
                    "lastError": "API Timeout Error" if status == "STUCK" else None,
                    "attempts": 3 if status == "STUCK" else 0
                }
            )
            
        print("Seed complete! 15 Leads with events, tasks, and proposals generated across clusters.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
