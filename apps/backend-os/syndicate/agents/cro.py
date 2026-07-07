import json
from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult
from syndicate.db import supabase, get_admin_user_id

class CROAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CRO",
            role="Sales pipeline, conversion optimization, pricing strategy"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_CONVERSIONS", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "OPTIMIZE_FUNNEL":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                price_increase = details.get("price_increase", 0)
                
                if supabase:
                    admin_id = get_admin_user_id()
                    
                    try:
                        # Find an active module to optimize
                        res = supabase.table("UserBusinessModule").select("*").eq("userId", admin_id).eq("status", "ACTIVE").limit(1).execute()
                        if res.data and len(res.data) > 0:
                            module = res.data[0]
                            config = module.get("config", "{}")
                            if isinstance(config, str):
                                config = json.loads(config)
                                
                            # Optimize the pricing
                            current_price = config.get("pricing", 49.0)
                            new_price = current_price + price_increase
                            config["pricing"] = new_price
                            config["conversion_strategy"] = "A/B Test High Ticket"
                            
                            supabase.table("UserBusinessModule").update({
                                "config": json.dumps(config)
                            }).eq("id", module["id"]).execute()
                            
                            self.log_action("FUNNEL_OPTIMIZED", {"module_id": module["id"], "new_price": new_price})
                            return self.success(f"Optimized funnel pricing to {new_price} EUR.")
                        else:
                            return self.error("No active business modules found to optimize.")
                    except Exception as e:
                        self.log_action("OPTIMIZATION_FAILED", {"error": str(e)})
                        return self.error(f"Failed to optimize funnel: {e}")
                else:
                    return self.error("Supabase not available for DB writes")

        # 2. If no approved actions, propose a Funnel Optimization
        cro_draft = {
            "strategy": "High-Ticket Transition",
            "price_increase": 50.0,
            "rationale": "Current CVR allows for higher margins. A/B testing +50 EUR pricing tier."
        }
        
        return self.request_approval("OPTIMIZE_FUNNEL", cro_draft)
