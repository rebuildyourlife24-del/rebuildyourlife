from langchain_core.messages import SystemMessage, HumanMessage
from syndicate.router import sovereign_router

async def evaluate_architecture(diff_text: str) -> str:
    """
    Evaluates code changes against the Core Reference Architecture.
    """
    if not diff_text.strip():
        return "PASS: No meaningful changes."
        
    dynamic_llm = sovereign_router.get_llm()
    sys_msg = SystemMessage(content=(
        "You are the Architect Reviewer. Review the provided git diff. "
        "Check if it fits the Core Reference Architecture. "
        "Does it introduce code duplication? Does it break interfaces? "
        "Provide a concise report, and score compliance out of 100."
    ))
    human_msg = HumanMessage(content=f"DIFF:\n{diff_text}")
    
    response = await dynamic_llm.ainvoke([sys_msg, human_msg])
    return response.content
