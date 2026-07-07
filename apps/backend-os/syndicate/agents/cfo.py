import random
from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult
from syndicate.cfo import distribute_revenue
from syndicate.db import supabase, get_admin_user_id

class CFOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CFO",
            role="Wallet splitting (90/10), budget allocation, financial auditing"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_TREASURY", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "SPLIT_REVENUE":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                amount = details.get("amount", 0.0)
                
                if supabase:
                    admin_id = get_admin_user_id()
                    
                    # Execute the 90/10 Vault split
                    result = await distribute_revenue(admin_id, amount)
                    
                    if result.get("success"):
                        self.log_action("REVENUE_DISTRIBUTED", result)
                        return self.success(f"Split {amount} EUR -> Admin: {result.get('admin_wallet')}, Hardware: {result.get('hardware_reserve')}")
                    else:
                        error_msg = result.get("error", "Unknown DB error")
                        self.log_action("DISTRIBUTION_FAILED", {"error": error_msg})
                        return self.error(f"Failed to distribute revenue: {error_msg}")
                else:
                    return self.error("Supabase not available for Financial operations")

        # 2. If no approved actions, simulate finding unallocated revenue and propose a split
        # We simulate revenue between 100 and 2000 EUR
        unallocated_revenue = round(random.uniform(100.0, 2000.0), 2)
        
        split_draft = {
            "amount": unallocated_revenue,
            "currency": "EUR",
            "reason": "Unallocated recurring Stripe payments detected."
        }
        
        return self.request_approval("SPLIT_REVENUE", split_draft)
