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

@app.get("/")
def read_root():
    return {"status": "ARGENTIC AEIP OS Backend Online"}

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
            "ui_events": []
        }

        # Infinite loop to simulate continuous OS operation
        iteration = 0
        while True:
            state["ui_events"] = [] # Clear events for this run
            state["current_focus"] = "growth" if iteration % 2 == 0 else "operations"
            
            # Execute LangGraph asynchronously
            # In a real app, you'd iterate over graph events stream, but we use ainvoke for simplicity here
            # and let the nodes themselves append to ui_events.
            
            # Stream the execution so we can see node-by-node updates
            async for output in syndicate_graph.astream(state):
                # output is a dict of {node_name: state_update}
                # Find the latest state from the output
                for node_name, node_state in output.items():
                    if "ui_events" in node_state and len(node_state["ui_events"]) > 0:
                        # Grab the latest event to broadcast
                        latest_event = node_state["ui_events"][-1]
                        
                        # Reset all other agents to idle
                        agents_payload = [
                            {"id": "router", "status": "idle", "task": "Waiting"},
                            {"id": "ceo", "status": "idle", "task": "Waiting"},
                            {"id": "cmo", "status": "idle", "task": "Waiting"},
                            {"id": "coo", "status": "idle", "task": "Waiting"},
                            {"id": "orion", "status": "idle", "task": "Waiting"}
                        ]
                        
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
                        
            iteration += 1
            await asyncio.sleep(5) # Pause before the next OS cycle

    except WebSocketDisconnect:
        manager.disconnect(websocket)
