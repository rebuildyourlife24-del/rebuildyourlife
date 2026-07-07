import os
import random
from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult
from syndicate.cfo import distribute_revenue
from syndicate.db import supabase, get_admin_user_id

# Mollie SDK mock integration (since keys are provided by user in .env)
def fetch_recent_mollie_payments():
    """Mocks fetching recent successful payments from Mollie API."""
    if os.environ.get("MOLLIE_API_KEY"):
        # Real SDK call would go here
        pass
    # We simulate a 20% chance of a new payment coming in via Mollie
    if random.random() < 0.2:
        return [{"id": f"tr_mock_{random.randint(1000, 9999)}", "amount": 149.00, "currency": "eur"}]
    return []

class CFOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CFO",
            role="Wallet splitting (90/10), budget allocation, financial auditing"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_TREASURY", {"state_keys": list(state.keys())})
        
        # 0. Check real-world API connections (Mollie)
        new_payments = fetch_recent_mollie_payments()
        for payment in new_payments:
            amount = payment["amount"]
            self.log_action("MOLLIE_PAYMENT_DETECTED", {"amount": amount, "id": payment["id"]})
            # Propose immediate split for this new payment
            return self.request_approval("SPLIT_REVENUE", {
                "target": "Treasury",
                "reason": f"New Mollie payment detected ({payment['id']}). Split required.",
                "amount": amount
            })
        
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

        # 2. Default standard financial audit
        draft = {
            "target": "Budget",
            "reason": "Standard operational treasury sync."
        }
        
        return self.request_approval("SPLIT_REVENUE", split_draft)
