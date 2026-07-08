import os
import asyncio
import uuid
from supabase import create_client, Client
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

hermes_url = os.getenv("HERMES_SUPABASE_URL")
hermes_key = os.getenv("HERMES_SUPABASE_KEY")

# 1. ORION (LOBE 1) - Human Data
if supabase_url and supabase_key:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
    except Exception as e:
        logger.error(f"Failed to init Supabase Orion: {e}")
        supabase = None
else:
    supabase = None

# 2. HERMES (LOBE 2) - Agent Registry & Memory
if hermes_url and hermes_key:
    try:
        hermes_db: Client = create_client(hermes_url, hermes_key)
    except Exception as e:
        logger.error(f"Failed to init Supabase Hermes: {e}")
        hermes_db = None
else:
    hermes_db = None

quantum_url = os.getenv("QUANTUM_SUPABASE_URL")
quantum_key = os.getenv("QUANTUM_SUPABASE_KEY")

# 3. QUANTUM (LOBE 3) - Deep Analytics & RAG
if quantum_url and quantum_key:
    try:
        quantum_db: Client = create_client(quantum_url, quantum_key)
    except Exception as e:
        logger.error(f"Failed to init Supabase Quantum: {e}")
        quantum_db = None
else:
    quantum_db = None

async def log_dossier_async(agent_type: str, action: str, details: str, status: str = "SUCCESS"):
    """
    Asynchronously log agent actions to the Supabase AgentDossier table.
    Follows Rule 7 (Defensive Engineering): handles failures gracefully without crashing the main loop.
    """
    if not supabase:
        logger.warning(f"Supabase not initialized. Skipping dossier log for {agent_type}")
        return
        
    def _execute():
        try:
            data = {
                "id": str(uuid.uuid4()),
                "agentType": agent_type,
                "action": action,
                "details": details,
                "status": status
            }
            res = supabase.table("AgentDossier").insert(data).execute()
            logger.info(f"Supabase inserted AgentDossier: {res.data}")
        except Exception as e:
            logger.error(f"Failed to insert into Supabase: {e}")

    # Fire and forget in a background thread to prevent blocking the async event loop
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, _execute)

def get_admin_user_id() -> str:
    """
    Resolves the God-Mode Admin user ID dynamically.
    Searches for role='ADMIN', falls back to first user, or a zero-UUID.
    """
    if not supabase:
        return "00000000-0000-0000-0000-000000000000"
    
    try:
        # Priority 1: Find an explicit admin
        res = supabase.table("User").select("id").eq("role", "ADMIN").limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]["id"]
            
        # Priority 2: Find the oldest user (likely the founder)
        res = supabase.table("User").select("id").order("createdAt", desc=False).limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]["id"]
    except Exception as e:
        logger.error(f"Failed to fetch dynamic admin ID: {e}")
        
    return "00000000-0000-0000-0000-000000000000"
