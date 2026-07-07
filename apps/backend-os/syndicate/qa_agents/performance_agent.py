from langchain_core.messages import SystemMessage, HumanMessage
from syndicate.router import sovereign_router

async def evaluate_performance(diff_text: str) -> str:
    """
    Evaluates code changes for performance and resource impact.
    """
    if not diff_text.strip():
        return "PASS: No meaningful changes."
        
    dynamic_llm = sovereign_router.get_llm()
    sys_msg = SystemMessage(content=(
        "You are the Performance Reviewer. Review the provided git diff. "
        "Look for O(N^2) loops, memory leaks, unoptimized queries, or heavy synchronous operations. "
        "Provide a concise report, and score performance out of 100."
    ))
    human_msg = HumanMessage(content=f"DIFF:\n{diff_text}")
    
    response = await dynamic_llm.ainvoke([sys_msg, human_msg])
    return response.content
