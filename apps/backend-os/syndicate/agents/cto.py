import json
from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult
from syndicate.db import supabase

class CTOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CTO",
            role="Chief Technology Officer & Autonomous Product Builder"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_PRODUCT_REQUIREMENTS", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "DEPLOY_BUSINESS_MODULE":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                module_type = details.get("module_type", "SAAS")
                config_str = json.dumps(details.get("config", {}))
                
                if supabase:
                    # Fetch admin user to bind module to (Technical Debt workaround)
                    users = supabase.table("User").select("id").limit(1).execute()
                    admin_id = users.data[0]["id"] if users.data else "00000000-0000-0000-0000-000000000000"
                    
                    try:
                        # Since userId+moduleType is unique in schema, we use upsert or just insert if it's new
                        # To avoid crash on duplicate, we can delete the old one or just insert.
                        # For simplicity, we just insert and catch the error.
                        supabase.table("UserBusinessModule").insert({
                            "userId": admin_id,
                            "moduleType": f"{module_type}_{len(config_str)}", # Make somewhat unique
                            "config": config_str,
                            "status": "ACTIVE"
                        }).execute()
                        self.log_action("BUSINESS_MODULE_DEPLOYED", {"module": module_type})
                        return self.success(f"Deployed module {module_type}")
                    except Exception as e:
                        self.log_action("DEPLOYMENT_FAILED", {"error": str(e)})
                        return self.error(f"Failed to deploy module: {e}")
                else:
                    return self.error("Supabase not available for DB writes")

        # 2. If no approved actions, propose a new one occasionally
        module_draft = {
            "module_type": "SAAS",
            "config": {
                "features": ["Auth", "Payments", "Dashboard"],
                "version": "1.0.0"
            }
        }
        
        return self.request_approval("DEPLOY_BUSINESS_MODULE", module_draft)
