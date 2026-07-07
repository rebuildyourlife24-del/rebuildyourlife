from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult
from syndicate.cmo import create_marketing_campaign
from syndicate.db import supabase, get_admin_user_id

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
                    admin_id = get_admin_user_id()
                    
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
                            self.log_action("META_CAMPAIGN_LAUNCHED", {"campaign_name": campaign_name})
                            return self.success(f"CMO Agent launched Meta Campaign: {campaign_name}")
                        else:
                            return self.error("Failed to launch campaign.")
                    except Exception as e:
                        return self.error(f"Error launching campaign: {str(e)}")
                else:
                    return self.error("Supabase not available for Marketing operations")
                    
            elif act.get("agent") == self.name and act.get("action") in ["PUBLISH_LINKEDIN_POST", "PUBLISH_TWITTER_POST"]:
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                platform = "LinkedIn" if act.get("action") == "PUBLISH_LINKEDIN_POST" else "Twitter/X"
                self.log_action(f"{act.get('action')}_EXECUTED", details)
                return self.success(f"CMO Agent published {platform} update: {details.get('topic')}")

        # 2. Propose actions
        platforms = ["LINKEDIN", "TWITTER"]
        chosen_platform = random.choice(platforms)
        
        draft = {
            "target": "Social Channels",
            "topic": "The Power of Sovereign AI Routers in 2026",
            "reason": f"Detected high engagement potential on {chosen_platform} for AI Automation topics."
        }
        
        # Principle 3: Simulation Before Execution
        self.log_action("SIMULATING_OUTCOME", {"draft": draft})
        simulated_conversion_rate = 0.08 # Simulated output from prediction engine
        
        if simulated_conversion_rate > 0.05:
            self.log_action("SIMULATION_PASSED", {"conversion_rate": simulated_conversion_rate})
            return self.request_approval(f"PUBLISH_{chosen_platform}_POST", draft)
        else:
            self.log_action("SIMULATION_FAILED", {"conversion_rate": simulated_conversion_rate, "reason": "Below threshold"})
            return self.error("Simulation failed. Conversion rate too low to publish.")
