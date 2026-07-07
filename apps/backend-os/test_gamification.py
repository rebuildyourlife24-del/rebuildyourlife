import asyncio
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_gamification():
    logger.info("Testing Gamification API Endpoint (Rule 10)...")
    
    # Needs to run against the FastAPI server. But we can also test the function directly.
    # We will test the function directly so we don't need Uvicorn running in the background for this script.
    from syndicate.gamification import process_gamification_event
    from syndicate.db import supabase
    
    # Get dummy user ID
    res = supabase.table("User").select("id, experiencePoints, clearanceLevel").eq("email", "dummy@rebuildyourlife.eu").execute()
    if not res.data:
        logger.error("Dummy user not found.")
        return
        
    dummy_id = res.data[0]['id']
    old_xp = res.data[0]['experiencePoints']
    old_level = res.data[0]['clearanceLevel']
    
    logger.info(f"Dummy User before: Level {old_level}, XP {old_xp}")
    
    # Simulate a lesson completion
    result = await process_gamification_event(dummy_id, "LESSON_COMPLETED", {"lesson_id": "123"})
    
    logger.info(f"Result: {result}")
    
    # Verify in DB
    res2 = supabase.table("User").select("experiencePoints, clearanceLevel").eq("id", dummy_id).execute()
    new_xp = res2.data[0]['experiencePoints']
    new_level = res2.data[0]['clearanceLevel']
    
    logger.info(f"Dummy User after: Level {new_level}, XP {new_xp}")
    
    assert new_xp == old_xp + 100, "XP should increase by 100"
    logger.info("Gamification test passed successfully.")

if __name__ == "__main__":
    asyncio.run(test_gamification())
