import logging
from syndicate.db import supabase

logger = logging.getLogger(__name__)

XP_REWARDS = {
    "TASK_COMPLETED": 50,
    "HABIT_COMPLETED": 20,
    "LESSON_COMPLETED": 100,
    "FINANCIAL_MILESTONE": 500,
    "AI_ACTION_APPROVED": 250,
    "DEFAULT": 10
}

RANKS = [
    (1, "Initiate", 0),
    (2, "Apprentice", 1000),
    (3, "Operative", 2500),
    (4, "Specialist", 5000),
    (5, "Strategist", 10000),
    (6, "Director", 20000),
    (7, "Executive", 35000),
    (8, "Commander", 55000),
    (9, "Visionary", 85000),
    (10, "Mastermind", 130000),
    (11, "Syndicate Boss", 200000),
    (12, "The Architect", 350000)
]

def calculate_xp(event_type: str) -> int:
    return XP_REWARDS.get(event_type.upper(), XP_REWARDS["DEFAULT"])

def get_rank_info(current_xp: int):
    """Returns the current level, rank name, and xp needed for the next level."""
    current_level = 1
    rank_name = RANKS[0][1]
    next_level_xp = RANKS[1][2]
    
    for level, name, xp_threshold in RANKS:
        if current_xp >= xp_threshold:
            current_level = level
            rank_name = name
            
            # Look ahead for next level
            next_idx = level # Since 1-indexed, next is index = level
            if next_idx < len(RANKS):
                next_level_xp = RANKS[next_idx][2]
            else:
                next_level_xp = current_xp # Max level reached
    
    return current_level, rank_name, next_level_xp

def check_level_up(current_level: int, current_xp: int) -> bool:
    """Legacy wrapper, we calculate everything via get_rank_info now."""
    new_lvl, _, _ = get_rank_info(current_xp)
    return new_lvl > current_level

async def process_gamification_event(user_id: str, event_type: str, details: dict = None):
    """
    Processes a gamification event.
    1. Fetches the user.
    2. Calculates XP.
    3. Checks for level up.
    4. Updates the User record.
    5. Returns the delta/result.
    """
    if not supabase:
        logger.warning("Supabase client not initialized, skipping gamification event.")
        return {"error": "Supabase client not available"}

    try:
        # Fetch current user stats
        response = supabase.table("User").select("id, experiencePoints, clearanceLevel").eq("id", user_id).execute()
        if not response.data:
            logger.error(f"User {user_id} not found for gamification event.")
            return {"error": "User not found"}

        user = response.data[0]
        current_xp = user.get("experiencePoints", 0)
        current_level = user.get("clearanceLevel", 1)

        # Calculate new XP
        xp_gained = calculate_xp(event_type)
        new_xp = current_xp + xp_gained

        # Check level up directly using the new RANKS matrix
        new_level, rank_name, next_level_xp = get_rank_info(new_xp)
        level_up = new_level > current_level

        # Update Database
        update_data = {
            "experiencePoints": new_xp,
            "clearanceLevel": new_level
        }
        
        supabase.table("User").update(update_data).eq("id", user_id).execute()

        logger.info(f"User {user_id} earned {xp_gained} XP. Total: {new_xp}. Rank: {rank_name} (Level {new_level}).")

        return {
            "success": True,
            "xp_gained": xp_gained,
            "new_xp": new_xp,
            "level_up": level_up,
            "new_level": new_level
        }

    except Exception as e:
        logger.error(f"Failed to process gamification event: {e}")
        return {"error": str(e)}
