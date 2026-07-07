import uuid
import logging
from syndicate.db import supabase

logger = logging.getLogger(__name__)

async def distribute_revenue(user_id: str, amount: float):
    """
    CFO AI Vault Logic (Phase 8)
    Distributes revenue according to the 2-wallet system:
    - 90% -> Admin Wallet
    - 10% -> Hardware Reserve
    """
    if not supabase:
        logger.warning("Supabase not initialized. Cannot distribute revenue.")
        return {"success": False, "error": "Supabase not initialized"}

    try:
        admin_split = amount * 0.90
        hardware_split = amount * 0.10

        logger.info(f"CFO Intercepted {amount} EUR. Splitting: 90% ({admin_split}) Admin, 10% ({hardware_split}) Hardware")

        # Get or Create Admin Wallet Vault
        admin_vault = _get_or_create_vault(user_id, "ADMIN_WALLET")
        # Get or Create Hardware Reserve Vault
        hardware_vault = _get_or_create_vault(user_id, "HARDWARE_RESERVE")

        if not admin_vault or not hardware_vault:
            return {"success": False, "error": "Could not retrieve/create Vaults."}

        # Update Admin Vault
        supabase.table("TreasuryVault").update({
            "balance": admin_vault["balance"] + admin_split
        }).eq("id", admin_vault["id"]).execute()

        # Log Admin Transaction
        _log_transaction(user_id, admin_vault["id"], admin_split, "INCOME_ADMIN")

        # Update Hardware Vault
        supabase.table("TreasuryVault").update({
            "balance": hardware_vault["balance"] + hardware_split
        }).eq("id", hardware_vault["id"]).execute()

        # Log Hardware Transaction
        _log_transaction(user_id, hardware_vault["id"], hardware_split, "INCOME_HARDWARE")

        return {
            "success": True,
            "amount": amount,
            "admin_wallet": admin_vault["balance"] + admin_split,
            "hardware_reserve": hardware_vault["balance"] + hardware_split
        }
    except Exception as e:
        logger.error(f"CFO Distribution failed: {e}")
        return {"success": False, "error": str(e)}

def _get_or_create_vault(user_id: str, vault_type: str):
    res = supabase.table("TreasuryVault").select("*").eq("userId", user_id).eq("vaultType", vault_type).execute()
    if len(res.data) > 0:
        return res.data[0]
    
    from datetime import datetime
    new_vault = {
        "id": str(uuid.uuid4()),
        "userId": user_id,
        "vaultType": vault_type,
        "balance": 0.0,
        "status": "ACTIVE",
        "updatedAt": datetime.utcnow().isoformat()
    }
    insert_res = supabase.table("TreasuryVault").insert(new_vault).execute()
    if len(insert_res.data) > 0:
        return insert_res.data[0]
    return None

def _log_transaction(user_id: str, vault_id: str, amount: float, tx_type: str):
    tx_data = {
        "id": str(uuid.uuid4()),
        "userId": user_id,
        "vaultId": vault_id,
        "amount": amount,
        "type": tx_type,
        "executedBy": "CFO_AGENT",
        "status": "COMPLETED",
        "description": f"Automated CFO 90/10 split routing ({tx_type})"
    }
    supabase.table("WalletTransaction").insert(tx_data).execute()
