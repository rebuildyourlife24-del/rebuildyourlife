import uuid
from datetime import datetime
import logging
from syndicate.db import supabase

logger = logging.getLogger(__name__)

async def get_or_create_platform_integration(user_id: str, platform_name: str = "META") -> str:
    """
    Returns the platformId. Creates a mock platform integration if none exists for testing.
    """
    if not supabase:
        logger.warning("Supabase not initialized. Cannot fetch platform integration.")
        return ""
        
    try:
        # Check if exists
        res = supabase.table("SocialPlatformIntegration").select("id").eq("userId", user_id).eq("platform", platform_name).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]["id"]
            
        # Create
        now_str = datetime.utcnow().isoformat()
        new_id = str(uuid.uuid4())
        data = {
            "id": new_id,
            "userId": user_id,
            "platform": platform_name,
            "status": "ACTIVE",
            "createdAt": now_str,
            "updatedAt": now_str
        }
        res_insert = supabase.table("SocialPlatformIntegration").insert(data).execute()
        if res_insert.data:
            return new_id
    except Exception as e:
        logger.error(f"Failed to get/create platform integration: {e}")
        
    return ""

async def create_marketing_campaign(user_id: str, campaign_name: str, objective: str, headline: str, body: str, budget: float = 50.0):
    """
    Creates the full hierarchy: SocialCampaign -> AdSet -> AdCreative
    """
    if not supabase:
        logger.warning("Supabase not initialized. Cannot create campaign.")
        return False
        
    try:
        platform_id = await get_or_create_platform_integration(user_id)
        if not platform_id:
            return False
            
        now_str = datetime.utcnow().isoformat()
        
        # 1. Create SocialCampaign
        campaign_id = str(uuid.uuid4())
        campaign_data = {
            "id": campaign_id,
            "platformId": platform_id,
            "campaignName": campaign_name,
            "campaignType": objective,
            "budgetDaily": budget,
            "status": "DRAFT",
            "createdAt": now_str,
            "updatedAt": now_str
        }
        supabase.table("SocialCampaign").insert(campaign_data).execute()
        
        # 2. Create AdSet
        ad_set_id = str(uuid.uuid4())
        ad_set_data = {
            "id": ad_set_id,
            "campaignId": campaign_id,
            "name": f"AI Audience - {campaign_name}",
            "targetAudience": "AI Detected Prospect Audience",
            "dailyBudget": budget,
            "status": "ACTIVE",
            "createdAt": now_str,
            "updatedAt": now_str
        }
        supabase.table("AdSet").insert(ad_set_data).execute()
        
        # 3. Create AdCreative
        creative_id = str(uuid.uuid4())
        creative_data = {
            "id": creative_id,
            "adSetId": ad_set_id,
            "headline": headline[:255],
            "body": body,
            "status": "ACTIVE",
            "createdAt": now_str,
            "updatedAt": now_str
        }
        supabase.table("AdCreative").insert(creative_data).execute()
        
        logger.info(f"Successfully deployed marketing campaign '{campaign_name}' to Supabase.")
        return True
    except Exception as e:
        logger.error(f"Failed to create marketing campaign hierarchy: {e}")
        return False
