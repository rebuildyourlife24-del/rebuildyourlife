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

if supabase_url and supabase_key:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
    except Exception as e:
        logger.error(f"Failed to init Supabase: {e}")
        supabase = None
else:
    supabase = None

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
