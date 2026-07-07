from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class HeadOfGrowthAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Head of Growth",
            role="Viral loops, A/B testing, rapid experimentation"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "LAUNCH_EXPERIMENT":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("LAUNCH_EXPERIMENT_EXECUTED", details)
                return self.success(f"Head of Growth executed LAUNCH_EXPERIMENT successfully.")

        # 2. Propose action
        draft = {
            "target": "System",
            "reason": "Standard operational cycle."
        }
        
        return self.request_approval("LAUNCH_EXPERIMENT", draft)
