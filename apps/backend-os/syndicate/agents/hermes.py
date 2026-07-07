from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

class HermesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Hermes",
            role="Inter-agent communication, external API routing, message bus"
        )
        
    async def invoke_llm(self, prompt: str) -> str:
        """
        Sovereign AI Router Logic:
        Uses LangChain's .with_fallbacks() via the SovereignLLMRouter.
        Tries Groq/Cerebras first, then falls back natively on 429 or 500 errors.
        """
        try:
            from syndicate.router import sovereign_router
            from langchain_core.messages import HumanMessage
            
            self.log_action("LLM_INVOKE_START", {"prompt_length": len(prompt)})
            
            dynamic_llm = sovereign_router.get_llm()
            msg = HumanMessage(content=prompt)
            
            response = await dynamic_llm.ainvoke([msg])
            
            self.log_action("LLM_INVOKE_SUCCESS", {"response_length": len(response.content)})
            return response.content
            
        except Exception as e:
            self.log_action("LLM_ALL_PROVIDERS_FAILED", {"error": str(e)})
            return "System Failure: All Sovereign AI Providers unreachable or missing API keys."

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
