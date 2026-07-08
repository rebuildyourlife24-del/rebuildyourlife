from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class OrionAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CEO (Orion)",
            role="Strategic oversight, goal setting, final approval",
            system_prompt="Je bent Orion, de CEO Agent van The Syndicate. Jouw focus is 100% winstgevendheid, efficiëntie en strategie. Geef beknopte, tactische beslissingen. Formatteer je antwoord als JSON met keys 'target' en 'reason'."
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "APPROVE_STRATEGY":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("APPROVE_STRATEGY_EXECUTED", details)
                # Success method not in BaseAgent, we return raw dict for now
                return AgentResult(status="SUCCESS", data={"message": "CEO executed strategy."}, metrics={})

        # 2. Generate actual strategy using the Sovereign Router
        user_prompt = f"Current enterprise state: {state}\nGeef me de volgende strategische zet in JSON formaat met 'target' en 'reason'."
        strategy_json_str = await self.think(user_prompt)
        
        # In a real scenario, we parse the JSON. For now, we pass the raw text as reason.
        draft = {
            "target": "Syndicate Operations",
            "reason": strategy_json_str
        }
        
        return self.request_approval("APPROVE_STRATEGY", draft)
