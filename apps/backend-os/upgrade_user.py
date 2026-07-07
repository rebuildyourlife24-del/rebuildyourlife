import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(supabase_url, supabase_key)

def manage_users():
    # 1. Fetch all users
    response = supabase.table("User").select("*").execute()
    users = response.data
    
    admin_promoted = False
    dummy_exists = False
    
    for u in users:
        if u['email'] == 'dummy@rebuildyourlife.eu':
            dummy_exists = True
        elif not admin_promoted:
            # Promote the first non-dummy user to SUPER_ADMIN max level
            print(f"Promoting user: {u['email']} to SUPER_ADMIN Level 99")
            supabase.table("User").update({
                "role": "SUPER_ADMIN",
                "clearanceLevel": 99,
                "experiencePoints": 99000
            }).eq("id", u["id"]).execute()
            admin_promoted = True

    # 2. Create dummy account if it doesn't exist
    if not dummy_exists:
        print("Creating dummy account: dummy@rebuildyourlife.eu")
        dummy_id = str(uuid.uuid4())
        # In a real scenario we'd use Supabase Auth to create the user, but since Prisma is handling it 
        # and we only need the public.User record for Gamification tests:
        try:
            supabase.table("User").insert({
                "id": dummy_id,
                "email": "dummy@rebuildyourlife.eu",
                "passwordHash": "$2b$10$dummyhashedpasswordnotreal",
                "firstName": "Dummy",
                "lastName": "Operator",
                "role": "USER",
                "clearanceLevel": 1,
                "experiencePoints": 0,
                "updatedAt": "2026-07-07T16:00:00Z"
            }).execute()
            print("Dummy account created.")
        except Exception as e:
            print(f"Failed to create dummy user: {e}")

if __name__ == "__main__":
    manage_users()
