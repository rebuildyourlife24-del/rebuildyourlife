import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Import LangGraph
from syndicate.graph import app as syndicate_graph
from syndicate.state import SyndicateState

app = FastAPI(title="ARGENTIC AEIP OS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

from pydantic import BaseModel
from syndicate.gamification import process_gamification_event

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

@app.websocket("/ws/agents")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Initial State
        state: SyndicateState = {
            "messages": [],
            "current_focus": "growth", # Alternates between growth and operations
            "active_agent": "router",
            "decision_log": [],
            "revenue": 10000.0,
            "ad_spend": 2000.0,
            "pending_approvals": [],
            "ui_events": []
        }
        
        # Import agents pool to dynamically list agents
        from syndicate.graph import agents_pool

        # Infinite loop to simulate continuous OS operation
        iteration = 0
        while True:
            state["ui_events"] = [] # Clear events for this run
            state["current_focus"] = "growth" if iteration % 2 == 0 else "operations"
            
            # Execute LangGraph asynchronously
            async for output in syndicate_graph.astream(state):
                for node_name, node_state in output.items():
                    if "ui_events" in node_state and len(node_state["ui_events"]) > 0:
                        # Grab the latest event to broadcast
                        latest_event = node_state["ui_events"][-1]
                        
                        # Dynamically reset all 18 agents to idle
                        agents_payload = [{"id": "router", "name": "Sovereign Router", "role": "Traffic Controller", "status": "idle", "task": "Waiting"}]
                        for agent_id, agent_instance in agents_pool.items():
                            agents_payload.append({
                                "id": agent_id,
                                "name": agent_instance.name,
                                "role": agent_instance.role,
                                "status": "idle",
                                "task": "Waiting"
                            })
                        
                        # Apply the active event
                        for ag in agents_payload:
                            if ag["id"] == latest_event["id"]:
                                ag["status"] = latest_event["status"]
                                ag["task"] = latest_event["task"]

                        event_msg = {
                            "type": "AGENT_UPDATE",
                            "payload": {
                                "agents": agents_payload
                            }
                        }
                        await websocket.send_text(json.dumps(event_msg))
                    
                    # Check for pending approvals and remove them if they have been approved globally
                    if "pending_approvals" in node_state and len(node_state["pending_approvals"]) > 0:
                        # Convert to dict format with generated IDs if missing
                        for approval in node_state["pending_approvals"]:
                            if "id" not in approval:
                                import uuid
                                approval["id"] = str(uuid.uuid4())
                        
                        # Filter out approved or rejected ones
                        active_approvals = []
                        newly_approved = []
                        
                        for a in node_state["pending_approvals"]:
                            if a["id"] in global_approved_actions:
                                newly_approved.append(a)
                            elif a["id"] not in global_rejected_actions:
                                active_approvals.append(a)
                                
                        # Move newly approved into the state
                        if newly_approved:
                            if "approved_actions" not in state:
                                state["approved_actions"] = []
                            # We just append them so the agents can pick them up in the next loop
                            for approved_act in newly_approved:
                                state["approved_actions"].append(approved_act)
                                # Optionally, remove from global set to prevent double processing, 
                                # but usually we keep it so it doesn't reappear in pending.
                        
                        state["pending_approvals"] = active_approvals
                        
                        approval_msg = {
                            "type": "WS_APPROVALS_UPDATE",
                            "payload": {
                                "pending_approvals": active_approvals
                            }
                        }
                        await websocket.send_text(json.dumps(approval_msg))
                        
            iteration += 1
            await asyncio.sleep(5) # Pause before the next OS cycle

    except WebSocketDisconnect:
        manager.disconnect(websocket)
