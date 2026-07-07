import uuid
from datetime import datetime
import logging
from typing import List, Optional
from syndicate.db import supabase

logger = logging.getLogger(__name__)

async def store_memory(
    user_id: str, 
    content: str, 
    memory_type: str = "SYSTEM_DECISION", 
    intensity: int = 5,
    emotional_tone: str = "Neutral"
) -> bool:
    """
    Store an insight, decision, or memory into the Orion LTM (Long Term Memory) system.
    Returns True if successful.
    """
    if not supabase:
        logger.warning("Supabase not initialized. Orion cannot store memory.")
        return False
        
    try:
        now_str = datetime.utcnow().isoformat()
        data = {
            "id": str(uuid.uuid4()),
            "userId": user_id,
            "memoryType": memory_type,
            "content": content,
            "intensity": intensity,
            "emotionalTone": emotional_tone,
            "createdAt": now_str,
            "updatedAt": now_str
        }
        res = supabase.table("OrionMemory").insert(data).execute()
        if res.data:
            logger.info(f"Orion Memory Stored: {content[:50]}...")
            return True
        return False
    except Exception as e:
        logger.error(f"Orion Failed to store memory: {e}")
        return False

async def retrieve_context(user_id: str, memory_type: Optional[str] = None, limit: int = 5) -> List[dict]:
    """
    Retrieve recent relevant memories for a given user from Orion LTM.
    """
    if not supabase:
        logger.warning("Supabase not initialized. Orion cannot retrieve context.")
        return []

    try:
        query = supabase.table("OrionMemory").select("*").eq("userId", user_id)
        if memory_type:
            query = query.eq("memoryType", memory_type)
            
        # Order by most recent descending
        query = query.order("createdAt", desc=True).limit(limit)
        
        res = query.execute()
        return res.data if res.data else []
    except Exception as e:
        logger.error(f"Orion Failed to retrieve context: {e}")
        return []
