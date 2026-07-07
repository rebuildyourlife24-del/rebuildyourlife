from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class QALeadAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="QA Lead",
            role="Testing, build verification, breaking build prevention"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "BLOCK_BUILD":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("BLOCK_BUILD_EXECUTED", details)
                return self.success(f"QA Lead executed BLOCK_BUILD successfully.")

        # 2. Propose action
        draft = {
            "target": "System",
            "reason": "Standard operational cycle."
        }
        
        return self.request_approval("BLOCK_BUILD", draft)
