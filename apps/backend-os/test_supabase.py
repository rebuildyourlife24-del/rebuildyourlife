import asyncio
from syndicate.db import log_dossier_async
import logging

logging.basicConfig(level=logging.INFO)

async def test_supabase_integration():
    print("Testing Supabase Integration (Rule 10)...")
    await log_dossier_async("SYS_TEST", "Integration Test", "Testing Supabase DB persistence layer.", "SUCCESS")
    # Small sleep to allow the async executor thread to finish
    await asyncio.sleep(2.0)
    print("Test request dispatched. Check Supabase DB for 'SYS_TEST' agentType.")

if __name__ == "__main__":
    asyncio.run(test_supabase_integration())
