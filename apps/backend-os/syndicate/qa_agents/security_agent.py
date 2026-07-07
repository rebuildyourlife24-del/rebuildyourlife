from langchain_core.messages import SystemMessage, HumanMessage
from syndicate.router import sovereign_router

async def evaluate_security(diff_text: str) -> str:
    """
    Evaluates code changes for security vulnerabilities.
    """
    if not diff_text.strip():
        return "PASS: No meaningful changes."
        
    dynamic_llm = sovereign_router.get_llm()
    sys_msg = SystemMessage(content=(
        "You are the Security Reviewer. Review the provided git diff. "
        "Identify any security vulnerabilities (e.g. injection, exposed secrets, unvalidated input). "
        "Provide a concise report, and score security out of 100."
    ))
    human_msg = HumanMessage(content=f"DIFF:\n{diff_text}")
    
    response = await dynamic_llm.ainvoke([sys_msg, human_msg])
    return response.content
