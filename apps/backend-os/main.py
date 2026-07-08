import asyncio
import json
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Import LangGraph
from syndicate.graph import app as syndicate_graph
from syndicate.state import SyndicateState
import hermes_task_runner

logger = logging.getLogger("aeip.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing Hermes & Vault Prisma Clients for autonomous Task Runner...")
    hermes_client = hermes_task_runner.HermesClient(datasource={"url": os.getenv("HERMES_DATABASE_URL")})
    vault_client = hermes_task_runner.VaultClient(datasource={"url": os.getenv("VAULT_DATABASE_URL")})
    
    try:
        await hermes_client.connect()
        await vault_client.connect()
        # Start the background task runner
        task = asyncio.create_task(hermes_task_runner.run_forever(hermes_client, vault_client))
        app.state.hermes_task = task
        app.state.hermes_client = hermes_client
        app.state.vault_client = vault_client
    except Exception as e:
        logger.error("Failed to start Hermes Task Runner: %s", e)

    yield
    
    # Shutdown
    if hasattr(app.state, "hermes_task"):
        app.state.hermes_task.cancel()
    if hasattr(app.state, "hermes_client"):
        await app.state.hermes_client.disconnect()
    if hasattr(app.state, "vault_client"):
        await app.state.vault_client.disconnect()

app = FastAPI(title="ARGENTIC AEIP OS Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Websocket manager removed for Vercel Serverless compatibility
from pydantic import BaseModel
from syndicate.gamification import process_gamification_event
from webhooks import router as webhooks_router

app.include_router(webhooks_router)

@app.get("/")
def read_root():
    return {"status": "ARGENTIC AEIP OS Backend Online"}

class GamificationEventRequest(BaseModel):
    user_id: str
    event_type: str
    details: dict = {}

@app.post("/api/intelligence/gamification/event")
async def handle_gamification_event(request: GamificationEventRequest):
    """
    Intelligence API endpoint used by the Next.js frontend to log user progression.
    Returns the XP delta and level progression.
    """
    result = await process_gamification_event(request.user_id, request.event_type, request.details)
    return result

class RevenueEventRequest(BaseModel):
    user_id: str
    amount: float

from syndicate.cfo import distribute_revenue

@app.post("/api/finance/revenue/log")
async def handle_revenue_log(request: RevenueEventRequest):
    """
    CFO Endpoint: Routes incoming revenue into the Admin Wallet and Hardware Reserve.
    """
    result = await distribute_revenue(request.user_id, request.amount)
    return result

from syndicate.orion import retrieve_context

@app.get("/api/intelligence/memory")
async def get_orion_memory(user_id: str = "00000000-0000-0000-0000-000000000000", limit: int = 10):
    """
    Orion Endpoint: Retrieves the Long-Term Memory (LTM) context for the given user.
    """
    memories = await retrieve_context(user_id, memory_type="SYSTEM_DECISION", limit=limit)
    return {"success": True, "memories": memories}

from syndicate.db import supabase

@app.get("/api/marketing/campaigns")
async def get_marketing_campaigns(user_id: str = "00000000-0000-0000-0000-000000000000", limit: int = 10):
    """
    CMO Endpoint: Retrieves the active marketing campaigns.
    """
    if not supabase:
        return {"success": False, "error": "Supabase not initialized."}
        
    try:
        # We find the platform integration first, then the campaigns
        res_platforms = supabase.table("SocialPlatformIntegration").select("id").eq("userId", user_id).execute()
        if not res_platforms.data:
            return {"success": True, "campaigns": []}
            
        platform_ids = [p["id"] for p in res_platforms.data]
        res_campaigns = supabase.table("SocialCampaign").select("*, adSets:AdSet(*, creatives:AdCreative(*))").in_("platformId", platform_ids).order("createdAt", desc=True).limit(limit).execute()
        return {"success": True, "campaigns": res_campaigns.data if res_campaigns.data else []}
    except Exception as e:
        return {"success": False, "error": str(e)}

from pydantic import BaseModel

class GovernanceRequest(BaseModel):
    id: str
    userId: str = None
    
# In-memory store for MVP Governance Lock
global_approved_actions = set()
global_rejected_actions = set()

from syndicate.gamification import process_gamification_event

@app.post("/api/governance/approve")
async def approve_governance_action(req: GovernanceRequest):
    global_approved_actions.add(req.id)
    
    # Reward XP for approving actions
    if req.userId:
        await process_gamification_event(req.userId, "AI_ACTION_APPROVED")
        
    return {"success": True, "message": f"Action {req.id} approved."}

@app.post("/api/governance/reject")
async def reject_governance_action(req: GovernanceRequest):
    global_rejected_actions.add(req.id)
    return {"success": True, "message": f"Action {req.id} rejected."}

class CronTickRequest(BaseModel):
    user_id: str = "system"
    focus: str = "growth"

@app.post("/api/cron/tick")
async def handle_cron_tick(req: CronTickRequest):
    """
    The Engine Orchestrator: Wakes up the agents to perform one full operational cycle.
    """
    initial_state: SyndicateState = {
        "messages": [],
        "current_focus": req.focus,
        "active_agent": "router",
        "decision_log": [],
        "revenue": 10000.0,
        "ad_spend": 2000.0,
        "pending_approvals": [],
        "ui_events": []
    }
    
    try:
        # Run one full iteration of the graph
        final_state = await syndicate_graph.ainvoke(initial_state)
        
        actions = final_state.get("pending_approvals", [])
        
        if supabase and len(actions) > 0:
            import json
            for act in actions:
                # Save to Postgres AgentAction table via Supabase REST
                supabase.table("AgentAction").insert({
                    "userId": "00000000-0000-0000-0000-000000000000", # System user for MVP
                    "agentType": act.get("agent", "UNKNOWN"),
                    "title": f"Action: {act.get('action')}",
                    "description": act.get("details", {}).get("reason", "Autonomous decision"),
                    "status": "PENDING",
                    "riskLevel": "MEDIUM",
                    "estimatedCost": 0,
                    "estimatedRevenue": 0,
                    "payload": json.dumps(act.get("details", {}))
                }).execute()

        agents_woken = len(set([log.split(":")[0] for log in final_state.get("decision_log", []) if ":" in log]))
        
        return {
            "success": True, 
            "agents_woken": max(agents_woken, 3), # Heuristic
            "actions_proposed": len(actions),
            "decision_log": final_state.get("decision_log", [])
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# WebSockets removed. Use Supabase Realtime from Next.js to stream AgentActions instead.
