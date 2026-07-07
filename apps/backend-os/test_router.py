import asyncio
from langchain_core.messages import SystemMessage, HumanMessage
from syndicate.router import sovereign_router

async def main():
    print("\n[+] Testing Sovereign AI Router with Fallbacks")
    
    # Intentionally corrupt the first Groq key to force a fallback
    if sovereign_router.groq_pool:
        print("[!] Intentionally corrupting the primary Groq API key...")
        sovereign_router.groq_pool[0].groq_api_key = "gsk_fake_key_that_will_fail"
    
    try:
        dynamic_llm = sovereign_router.get_llm()
        print(f"[+] Retrieved Dynamic LLM Route: {dynamic_llm}")
        
        sys_msg = SystemMessage(content="You are a fallback testing system. Respond with exactly 'FALLBACK_SUCCESS'.")
        
        response = await dynamic_llm.ainvoke([sys_msg])
        
        print("\n=== ROUTER RESPONSE ===")
        print(response.content)
        print("=======================")
        
        if "FALLBACK_SUCCESS" in response.content:
            print("[+] SUCCESS: The router correctly fell back to a secondary key/provider after the primary failed!")
        else:
            print("[-] WARNING: The response didn't match the expected output, but the API call succeeded.")
            
    except Exception as e:
        print(f"\n[-] ROUTER FAILED. All fallbacks exhausted or fatal error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
