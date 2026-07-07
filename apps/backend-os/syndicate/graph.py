import os
import asyncio
from langgraph.graph import StateGraph, END
from .state import SyndicateState
from .agents import *

# Instantiate the 18 AI Council Members
agents_pool = {
    "orion": OrionAgent(),
    "cfo": CFOAgent(),
    "coo": COOAgent(),
    "cmo": CMOAgent(),
    "cto": CTOAgent(),
    "cro": CROAgent(),
    "ciso": CISOAgent(),
    "hermes": HermesAgent(),
    "lead_data_scientist": LeadDataScientistAgent(),
    "head_of_seo": HeadOfSEOAgent(),
    "lead_frontend": LeadFrontendAgent(),
    "lead_backend": LeadBackendAgent(),
    "qa_lead": QALeadAgent(),
    "head_of_growth": HeadOfGrowthAgent(),
    "customer_success": CustomerSuccessAgent(),
    "legal_compliance": LegalComplianceAgent(),
    "market_intelligence": MarketIntelligenceAgent(),
    "devops": DevOpsArchitectAgent()
}

# =====================================================================
# GENERIC AGENT NODE WRAPPER
# =====================================================================
def create_agent_node(agent_id: str, agent_instance):
    """Creates a LangGraph node for a specific 18-Council Agent"""
    async def node_func(state: SyndicateState):
        state["active_agent"] = agent_id
        state["ui_events"].append({"id": agent_id, "status": "thinking", "task": f"{agent_instance.name} is working..."})
        
        try:
            # Execute the agent logic
            result = await agent_instance.execute(state)
            
            # Governance Plane: Check if approval is requested
            if result.status == "PENDING_APPROVAL":
                state["ui_events"].append({"id": agent_id, "status": "waiting", "task": f"Waiting for Operator Approval for: {result.data.get('action')}"})
                
                # We need to initialize the list if it's missing (LangGraph add reducer will append)
                if "pending_approvals" not in state or not state["pending_approvals"]:
                    state["pending_approvals"] = []
                
                # We use list append via the reducer
                state["pending_approvals"].append({
                    "agent": agent_instance.name,
                    "action": result.data.get("action"),
                    "details": result.data.get("details")
                })
            else:
                state["ui_events"].append({"id": agent_id, "status": "active", "task": f"Task completed with status: {result.status}"})
                
        except Exception as e:
            state["ui_events"].append({"id": agent_id, "status": "error", "task": f"Agent crashed: {str(e)[:40]}"})
            
        return state
    return node_func

from langchain_core.messages import SystemMessage, HumanMessage
from .router import sovereign_router

async def router_node(state: SyndicateState):
    """Hermes / Sovereign Router Node determining the task delegation"""
    state["active_agent"] = "router"
    state["ui_events"].append({"id": "router", "status": "thinking", "task": "Hermes is scanning the enterprise state..."})
    
    # Priority 1: Execute Approved Actions from the Governance Lock
    approved_actions = state.get("approved_actions", [])
    if approved_actions:
        next_act = approved_actions[0]
        target_name = next_act.get("agent")
        for k, v in agents_pool.items():
            if v.name == target_name:
                state["next_agent"] = k
                state["ui_events"].append({"id": "router", "status": "active", "task": f"Routing approved action to: {k}"})
                return state
                
    # Priority 2: LLM Decision
    try:
        dynamic_llm = sovereign_router.get_llm()
        available_agents = list(agents_pool.keys())
        
        sys_msg = SystemMessage(content=f"""You are Hermes, the Sovereign Router for the ARGENTIC AI Council.
Your job is to read the current state of the enterprise and decide EXACTLY WHICH ONE of the 18 AI agents should take the next action.
You must output ONLY the agent_id, nothing else. No markdown, no punctuation.

Available agents: {', '.join(available_agents)}
""")
        
        human_msg = HumanMessage(content=f"Current Focus: {state.get('current_focus')}\nRevenue: ${state.get('revenue')}\nAd Spend: ${state.get('ad_spend')}\nPick the next agent_id:")
        
        response = await dynamic_llm.ainvoke([sys_msg, human_msg])
        chosen_agent = response.content.strip().lower()
        
        if chosen_agent in agents_pool:
            state["next_agent"] = chosen_agent
            state["ui_events"].append({"id": "router", "status": "active", "task": f"Delegated task to: {chosen_agent}"})
        else:
            state["next_agent"] = "orion" # Fallback
            state["ui_events"].append({"id": "router", "status": "active", "task": f"LLM returned invalid agent '{chosen_agent}', fallback to orion"})
            
    except Exception as e:
        state["next_agent"] = "orion"
        state["ui_events"].append({"id": "router", "status": "error", "task": f"Router LLM Error: {str(e)[:40]}"})
        
    return state

def hermes_router_edge(state: SyndicateState):
    """Dynamic Edge Routing based on LLM decision"""
    return state.get("next_agent", "orion")

# =====================================================================
# GRAPH COMPILATION
# =====================================================================
workflow = StateGraph(SyndicateState)

# Add standard entry node
workflow.add_node("router", router_node)

# Add all 18 nodes dynamically
for agent_id, agent_instance in agents_pool.items():
    workflow.add_node(agent_id, create_agent_node(agent_id, agent_instance))

workflow.set_entry_point("router")

# Map Hermes router to the respective agent nodes
agent_routing_map = {agent_id: agent_id for agent_id in agents_pool.keys()}

workflow.add_conditional_edges(
    "router", 
    hermes_router_edge, 
    agent_routing_map
)

# Every agent paths back to Orion for final sync, or END
for agent_id in agents_pool.keys():
    if agent_id != "orion":
        workflow.add_edge(agent_id, "orion")

workflow.add_edge("orion", END)

# Compile with Governance Interrupt
# If an agent added something to pending_approvals, we could interrupt, but for now we just log it to DB.
app = workflow.compile()
