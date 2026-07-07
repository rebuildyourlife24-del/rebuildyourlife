import os
import asyncio
import json
import uuid
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from firecrawl import FirecrawlApp
from syndicate.state import SyndicateState

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY_1", "")
has_valid_key = api_key != ""

llm = ChatOpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
    model="openai/gpt-4o",
    temperature=0
) if has_valid_key else None

# -----------------------------------------------------------------------------
# TOOLS (Firecrawl + Pinecone)
# -----------------------------------------------------------------------------
firecrawl_api = os.getenv("FIRECRAWL_API_KEY", "")
fc = FirecrawlApp(api_key=firecrawl_api) if firecrawl_api else None

pc_api_key = os.getenv("PINECONE_API_KEY", "")
pc_index = os.getenv("PINECONE_INDEX_NAME", "sovereign-os")

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001") if os.getenv("GOOGLE_API_KEY") else None

@tool
def scrape_competitor(url: str) -> str:
    """Scrapes a URL to analyze competitor market data."""
    if fc:
        try:
            res = fc.scrape_url(url, params={'formats': ['markdown']})
            return res.get('markdown', 'No data')[:1000] # return snippet
        except Exception as e:
            return f"Scrape failed: {e}"
    return "Firecrawl not initialized."

# Bind tools to LLMs
if llm:
    cmo_llm_with_tools = llm.bind_tools([scrape_competitor])
else:
    cmo_llm_with_tools = None

# =====================================================================
# AGENT NODE FUNCTIONS
# =====================================================================

async def router_node(state: SyndicateState):
    state["active_agent"] = "router"
    state["ui_events"].append({"id": "router", "status": "active", "task": "Routing data stream..."})
    await asyncio.sleep(1.0)
    return state

async def ceo_node(state: SyndicateState):
    state["active_agent"] = "ceo"
    state["ui_events"].append({"id": "ceo", "status": "thinking", "task": "Evaluating strategic options with GPT-4o"})
    
    if has_valid_key:
        sys_msg = SystemMessage(content="You are the CEO AI. Decide if we focus on 'growth' (marketing) or 'operations' (logistics). Reply short.")
        human_msg = HumanMessage(content=f"Rev: ${state['revenue']}, Spend: ${state['ad_spend']}. Focus?")
        
        try:
            response = await llm.ainvoke([sys_msg, human_msg])
            decision = response.content
            state["ui_events"].append({"id": "ceo", "status": "active", "task": decision[:50] + "..."})
            state["decision_log"].append(f"CEO: {decision}")
            
            if "growth" in decision.lower() or "marketing" in decision.lower():
                state["current_focus"] = "growth"
            else:
                state["current_focus"] = "operations"
        except Exception as e:
            state["ui_events"].append({"id": "ceo", "status": "active", "task": f"API Error"})
            state["current_focus"] = "growth"
    else:
        await asyncio.sleep(1.0)
        state["current_focus"] = "growth"
        
    return state

async def cmo_node(state: SyndicateState):
    state["active_agent"] = "cmo"
    state["ui_events"].append({"id": "cmo", "status": "thinking", "task": "Running Firecrawl market analysis..."})
    
    if cmo_llm_with_tools:
        sys_msg = SystemMessage(content="You are CMO. Always use the scrape_competitor tool on 'apple.com' to get a market vibe, then output an ad slogan.")
        try:
            response = await cmo_llm_with_tools.ainvoke([sys_msg])
            
            if response.tool_calls:
                for tc in response.tool_calls:
                    if tc["name"] == "scrape_competitor":
                        state["ui_events"].append({"id": "cmo", "status": "active", "task": f"[TOOL RUN] Scraping {tc['args'].get('url')} via Firecrawl..."})
                        tool_res = scrape_competitor.invoke(tc["args"])
                        
                        # second pass
                        final_res = await llm.ainvoke([
                            sys_msg, 
                            response, 
                            ToolMessage(tool_call_id=tc["id"], content=tool_res, name="scrape_competitor")
                        ])
                        state["ad_spend"] += 500.0
                        state["ui_events"].append({"id": "cmo", "status": "active", "task": f"Ad: {final_res.content[:40]} (+ $500)"})
            else:
                state["ui_events"].append({"id": "cmo", "status": "active", "task": f"Ad: {response.content[:40]}"})
                
        except Exception as e:
             state["ui_events"].append({"id": "cmo", "status": "active", "task": f"CMO Error: {e}"})
    else:
        await asyncio.sleep(1.0)
    
    return state

async def coo_node(state: SyndicateState):
    state["active_agent"] = "coo"
    state["ui_events"].append({"id": "coo", "status": "thinking", "task": "Optimizing logistics..."})
    await asyncio.sleep(1.5)
    state["ui_events"].append({"id": "coo", "status": "active", "task": "Logistics optimized."})
    return state

async def orion_node(state: SyndicateState):
    state["active_agent"] = "orion"
    state["ui_events"].append({"id": "orion", "status": "thinking", "task": "Embedding memory to Pinecone..."})
    
    if pc_api_key and embeddings:
        try:
            vectorstore = PineconeVectorStore(index_name=pc_index, embedding=embeddings, pinecone_api_key=pc_api_key)
            last_decision = state["decision_log"][-1] if state["decision_log"] else "No recent decisions."
            
            # Save to Pinecone
            await vectorstore.aadd_texts([last_decision], metadatas=[{"agent": "syndicate", "timestamp": str(uuid.uuid4())}])
            state["ui_events"].append({"id": "orion", "status": "active", "task": "[SAVED TO PINECONE] Vector embedded."})
        except Exception as e:
            state["ui_events"].append({"id": "orion", "status": "active", "task": f"Pinecone Error: {str(e)[:30]}"})
    else:
        await asyncio.sleep(1.0)
        state["ui_events"].append({"id": "orion", "status": "active", "task": "Skipped Pinecone (Missing setup)"})
        
    return state

# =====================================================================
# EDGE ROUTING LOGIC
# =====================================================================

def ceo_router(state: SyndicateState):
    if state["current_focus"] == "growth":
        return "cmo"
    return "coo"

workflow = StateGraph(SyndicateState)
workflow.add_node("router", router_node)
workflow.add_node("ceo", ceo_node)
workflow.add_node("cmo", cmo_node)
workflow.add_node("coo", coo_node)
workflow.add_node("orion", orion_node)

workflow.set_entry_point("router")
workflow.add_edge("router", "ceo")
workflow.add_conditional_edges("ceo", ceo_router, {"cmo": "cmo", "coo": "coo"})
workflow.add_edge("cmo", "orion")
workflow.add_edge("coo", "orion")
workflow.add_edge("orion", END)
app = workflow.compile()
