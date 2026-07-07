from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class HeadOfSEOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Head of SEO & Content",
            role="Organic traffic, keyword strategy, copywriting"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "GENERATE_CONTENT":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("GENERATE_CONTENT_EXECUTED", details)
                return self.success(f"Head of SEO & Content executed GENERATE_CONTENT successfully.")

        # 2. Propose action
        draft = {
            "target": "System",
            "reason": "Standard operational cycle."
        }
        
        return self.request_approval("GENERATE_CONTENT", draft)
