import json
import random
import uuid
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
            if act.get("agent") == self.name:
                if act.get("action") == "DEPLOY_BUSINESS_MODULE":
                    state["approved_actions"].remove(act) # Consume the event
                    
                    details = act.get("details", {})
                    module_type = details.get("module_type", "SAAS")
                    config_str = json.dumps(details.get("config", {}))
                    
                    if supabase:
                        # Fetch admin user to bind module to (Technical Debt workaround)
                        users = supabase.table("User").select("id").limit(1).execute()
                        admin_id = users.data[0]["id"] if users.data else "00000000-0000-0000-0000-000000000000"
                        
                        try:
                            supabase.table("UserBusinessModule").insert({
                                "userId": admin_id,
                                "moduleType": f"{module_type}_{str(uuid.uuid4())[:8]}", # Make unique
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

                elif act.get("action") == "TRIGGER_VERCEL_DEPLOYMENT":
                    state["approved_actions"].remove(act) # Consume the event
                    
                    project_name = act.get("details", {}).get("project_name", "rebuildyourlife-core")
                    
                    # Simulating a Vercel deploy hook
                    try:
                        self.log_action("VERCEL_DEPLOYMENT_TRIGGERED", {"project": project_name, "status": "BUILDING"})
                        return self.success(f"Vercel deployment triggered for {project_name}")
                    except Exception as e:
                        return self.error(f"Vercel deployment failed: {e}")

        # 2. If no approved actions, propose a new one occasionally
        if random.random() > 0.5:
            module_draft = {
                "module_type": "SAAS",
                "config": {
                    "features": ["Auth", "Payments", "Dashboard"],
                    "version": "1.0.0"
                }
            }
            return self.request_approval("DEPLOY_BUSINESS_MODULE", module_draft)
        else:
            deploy_draft = {
                "project_name": "rebuildyourlife-core",
                "environment": "Production",
                "target_branch": "main"
            }
            return self.request_approval("TRIGGER_VERCEL_DEPLOYMENT", deploy_draft)
