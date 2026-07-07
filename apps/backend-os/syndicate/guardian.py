import asyncio
from langchain_core.messages import SystemMessage, HumanMessage
from syndicate.router import sovereign_router
from syndicate.qa_agents.architect_agent import evaluate_architecture
from syndicate.qa_agents.security_agent import evaluate_security
from syndicate.qa_agents.performance_agent import evaluate_performance

async def deployment_guardian(diff_text: str) -> dict:
    """
    Acts as the Deployment Guardian. Coordinates the multi-agent code review
    and outputs a final Deployment Score.
    """
    if not diff_text.strip():
        return {
            "score": 100,
            "verdict": "APPROVED",
            "reason": "No meaningful changes.",
            "reports": {}
        }

    print("\n[Guardian] Initiating Multi-Agent Code Review...")
    
    # Run specialized agents concurrently
    architect_report, security_report, performance_report = await asyncio.gather(
        evaluate_architecture(diff_text),
        evaluate_security(diff_text),
        evaluate_performance(diff_text)
    )
    
    print("\n[Guardian] Compiling Agent Reports and calculating Deployment Score...")
    
    dynamic_llm = sovereign_router.get_llm()
    sys_msg = SystemMessage(content=(
        "You are the Deployment Guardian AI. You receive reports from the Architect, Security, and Performance agents. "
        "Your job is to read them, and calculate a single final DEPLOYMENT SCORE between 0 and 100. "
        "If the score is < 90, the verdict is REJECTED. Otherwise, APPROVED. "
        "Return the result strictly as valid JSON without markdown wrapping or code blocks. "
        "Schema: {\"score\": int, \"verdict\": \"APPROVED\"|\"REJECTED\", \"reason\": \"str\"}"
    ))
    
    combined_reports = f"ARCHITECT:\n{architect_report}\n\nSECURITY:\n{security_report}\n\nPERFORMANCE:\n{performance_report}"
    human_msg = HumanMessage(content=f"REPORTS:\n{combined_reports}\n\nDIFF:\n{diff_text}")
    
    try:
        response = await dynamic_llm.ainvoke([sys_msg, human_msg])
        content = response.content.replace("```json", "").replace("```", "").strip()
        import json
        guardian_decision = json.loads(content)
        
        guardian_decision["reports"] = {
            "architect": architect_report,
            "security": security_report,
            "performance": performance_report
        }
        return guardian_decision
    except Exception as e:
        print(f"[Guardian] Parsing error: {e}")
        return {
            "score": 0,
            "verdict": "REJECTED",
            "reason": f"Guardian failed to parse response: {e}",
            "reports": {}
        }
