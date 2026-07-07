from typing import TypedDict, Annotated, List, Dict, Any
from operator import add
from langchain_core.messages import BaseMessage

class SyndicateState(TypedDict):
    # LangChain Chat History
    messages: Annotated[List[BaseMessage], add]
    
    # Global context of the enterprise
    current_focus: str
    active_agent: str
    decision_log: Annotated[List[str], add]
    
    # Financials & Metrics
    revenue: float
    ad_spend: float
    
    # WebSocket broadcast queue
    ui_events: Annotated[List[Dict[str, Any]], add]
