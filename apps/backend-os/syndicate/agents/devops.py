from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class DevOpsArchitectAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="DevOps / Cloud Architect",
            role="Vercel deployments, Supabase health, CI/CD pipelines"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "SCALE_INFRASTRUCTURE":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("SCALE_INFRASTRUCTURE_EXECUTED", details)
                return self.success(f"DevOps / Cloud Architect executed SCALE_INFRASTRUCTURE successfully.")

        # 2. Propose action
        draft = {
            "target": "System",
            "reason": "Standard operational cycle."
        }
        
        return self.request_approval("SCALE_INFRASTRUCTURE", draft)
