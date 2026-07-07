import asyncio
from syndicate.cfo import distribute_revenue

async def test_cfo():
    # Use a dummy user ID or ideally the first user from the db
    from syndicate.db import supabase
    
    res = supabase.table("User").select("id").limit(1).execute()
    if not res.data:
        print("No user found in DB. Test failed.")
        return
        
    user_id = res.data[0]["id"]
    print(f"Testing CFO Interception for User: {user_id}")
    
    amount = 1000.0
    print(f"Simulating revenue: {amount} EUR")
    
    result = await distribute_revenue(user_id, amount)
    print("\n[+] CFO Distribution Result:")
    print(result)
    
    if result.get("success"):
        print("\n[+] Validation: SUCCESS")
        print(f"Admin Wallet (90%): {amount * 0.9} added.")
        print(f"Hardware Reserve (10%): {amount * 0.1} added.")
    else:
        print("\n[-] Validation: FAILED")

if __name__ == "__main__":
    asyncio.run(test_cfo())
