from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class LeadBackendAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Lead Backend Engineer",
            role="Python/FastAPI logic, database migrations (Prisma)"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "DEPLOY_API":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("DEPLOY_API_EXECUTED", details)
                return self.success(f"Lead Backend Engineer executed DEPLOY_API successfully.")

        # 2. Propose action
        draft = {
            "target": "System",
            "reason": "Standard operational cycle."
        }
        
        return self.request_approval("DEPLOY_API", draft)
