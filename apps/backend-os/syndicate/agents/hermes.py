from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class HermesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Hermes",
            role="Inter-agent communication, external API routing, message bus"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "ROUTE_TRAFFIC":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("ROUTE_TRAFFIC_EXECUTED", details)
                return self.success(f"Hermes executed ROUTE_TRAFFIC successfully.")

        # 2. Propose action
        draft = {
            "target": "System",
            "reason": "Standard operational cycle."
        }
        
        return self.request_approval("ROUTE_TRAFFIC", draft)
