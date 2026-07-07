import asyncio
from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from ..router import sovereign_router
from ..qa_agents.architect_agent import evaluate_architecture
from ..qa_agents.security_agent import evaluate_security
from ..qa_agents.performance_agent import evaluate_performance
from .base_agent import BaseAgent, AgentResult

class CISOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CISO (Guardian)",
            role="Chief Information Security Officer & Deployment QA"
        )

    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        diff_text = state.get("diff_text", "")
        self.log_action("STARTING_MULTI_AGENT_CODE_REVIEW", {"diff_length": len(diff_text)})
        
        if not diff_text.strip():
            return AgentResult(
                status="SUCCESS",
                data={
                    "score": 100,
                    "verdict": "APPROVED",
                    "reason": "No meaningful changes.",
                    "reports": {}
                },
                metrics={"agents_ran": 0}
            )

        # Run specialized QA agents concurrently
        try:
            architect_report, security_report, performance_report = await asyncio.gather(
                evaluate_architecture(diff_text),
                evaluate_security(diff_text),
                evaluate_performance(diff_text)
            )
            
            dynamic_llm = sovereign_router.get_llm()
            sys_msg = SystemMessage(content=(
                "You are the CISO / Deployment Guardian AI. You receive reports from Architect, Security, and Performance sub-agents. "
                "Your job is to read them, and calculate a single final DEPLOYMENT SCORE between 0 and 100. "
                "If the score is < 90, the verdict is REJECTED. Otherwise, APPROVED. "
                "Return the result strictly as valid JSON without markdown wrapping or code blocks. "
                "Schema: {\"score\": int, \"verdict\": \"APPROVED\"|\"REJECTED\", \"reason\": \"str\"}"
            ))
            
            combined_reports = f"ARCHITECT:\n{architect_report}\n\nSECURITY:\n{security_report}\n\nPERFORMANCE:\n{performance_report}"
            human_msg = HumanMessage(content=f"REPORTS:\n{combined_reports}\n\nDIFF:\n{diff_text}")
            
            response = await dynamic_llm.ainvoke([sys_msg, human_msg])
            content = response.content.replace("```json", "").replace("```", "").strip()
            
            import json
            guardian_decision = json.loads(content)
            
            data = {
                "score": guardian_decision.get("score", 0),
                "verdict": guardian_decision.get("verdict", "REJECTED"),
                "reason": guardian_decision.get("reason", "Unknown parsing behavior"),
                "reports": {
                    "architect": architect_report,
                    "security": security_report,
                    "performance": performance_report
                }
            }
            
            self.log_action("COMPLETED_CODE_REVIEW", {"verdict": data["verdict"], "score": data["score"]})
            
            # Since this is a QA job, it doesn't modify state, just returns the decision. 
            # Approval not needed for read-only QA, but we return SUCCESS.
            return AgentResult(
                status="SUCCESS",
                data=data,
                metrics={"qa_agents_ran": 3}
            )
            
        except Exception as e:
            self.log_action("ERROR_CODE_REVIEW", {"error": str(e)})
            return AgentResult(
                status="FAILED",
                data={"score": 0, "verdict": "REJECTED", "reason": f"Guardian failed to parse response: {e}"},
                metrics={"error": True}
            )
