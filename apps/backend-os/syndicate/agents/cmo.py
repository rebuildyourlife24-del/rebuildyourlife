from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult
from syndicate.cmo import create_marketing_campaign
from syndicate.db import supabase

class CMOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CMO",
            role="Campaign strategy, market analysis, audience targeting"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_MARKET_OPPORTUNITIES", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "LAUNCH_META_CAMPAIGN":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                campaign_name = details.get("campaign_name", "AI Generated Campaign")
                objective = details.get("objective", "CONVERSION")
                headline = details.get("headline", "Join the revolution.")
                body = details.get("body", "Scale your business autonomously.")
                budget = details.get("budget", 100.0)
                
                if supabase:
                    # Fetch admin user to bind module to (Technical Debt workaround)
                    users = supabase.table("User").select("id").limit(1).execute()
                    admin_id = users.data[0]["id"] if users.data else "00000000-0000-0000-0000-000000000000"
                    
                    try:
                        # Call the existing implementation in syndicate.cmo
                        success = await create_marketing_campaign(
                            user_id=admin_id,
                            campaign_name=campaign_name,
                            objective=objective,
                            headline=headline,
                            body=body,
                            budget=budget
                        )
                        if success:
                            # Simulated Meta API Call
                            self.log_action("META_API_TRIGGERED", {"status": "SUCCESS", "campaign": campaign_name})
                            return self.success(f"Launched Meta campaign '{campaign_name}'")
                        else:
                            return self.error("Failed to create campaign records in Supabase.")
                    except Exception as e:
                        self.log_action("LAUNCH_FAILED", {"error": str(e)})
                        return self.error(f"Failed to launch campaign: {e}")
                else:
                    return self.error("Supabase not available for DB writes")

        # 2. If no approved actions, propose a new Meta campaign
        campaign_draft = {
            "campaign_name": "Autonomous Growth Q3",
            "objective": "CONVERSION",
            "headline": "Stop coding. Start building an Empire.",
            "body": "The Syndicate gives you a 18-person AI Council to scale your business.",
            "budget": 250.0
        }
        
        return self.request_approval("LAUNCH_META_CAMPAIGN", campaign_draft)
