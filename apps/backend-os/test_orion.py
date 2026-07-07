import asyncio
from syndicate.orion import store_memory, retrieve_context

async def test_orion():
    print("Testing Orion Memory Engine...")
    user_id = "00000000-0000-0000-0000-000000000000"
    
    # 1. Store a memory
    content = "CEO decided to focus on GROWTH because revenue dipped below 5000."
    print(f"\n[1] Storing Memory: {content}")
    success = await store_memory(user_id, content, memory_type="SYSTEM_DECISION", intensity=8, emotional_tone="Urgent")
    print(f"Store Success: {success}")
    
    # 2. Retrieve memories
    print("\n[2] Retrieving Memories:")
    memories = await retrieve_context(user_id, memory_type="SYSTEM_DECISION", limit=2)
    for i, m in enumerate(memories):
        print(f"  {i+1}. {m['createdAt']} | {m['content']}")

if __name__ == "__main__":
    asyncio.run(test_orion())
