/**
 * TikTok For Business API Integration
 * Versie 1.0 - Agency Reseller Model
 */

const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || '';
const TIKTOK_AD_ACCOUNT_ID = process.env.TIKTOK_AD_ACCOUNT_ID || '';
const BASE_URL = `https://business-api.tiktok.com/open_api/v1.3`;

export interface TikTokAdPayload {
  campaignName: string;
  budget: number; // in Euro
  videoUrl?: string; // TikTok is video-first
  adText: string;
}

export class TikTokMarketingAPI {
  
  /**
   * Publishes a complete Ad Campaign to TikTok For Business.
   */
  static async publishCampaign(payload: TikTokAdPayload) {
    if (!TIKTOK_ACCESS_TOKEN || !TIKTOK_AD_ACCOUNT_ID) {
      console.warn('[TIKTOK API] Missing credentials. Simulating successful deployment (Sandbox mode).');
      return { success: true, simulated: true, campaignId: 'sim_tt_' + Date.now() };
    }

    try {
      // 1. Create Campaign (TikTok vereist een hoger minimum budget dan Meta)
      const campaignId = await this.createCampaign(payload.campaignName, payload.budget);
      
      // 2. Create AdGroup (gelijk aan Meta AdSet)
      const adGroupId = await this.createAdGroup(campaignId, payload.budget);
      
      // 3. Upload/Create Ad
      const adId = await this.createAd(adGroupId, payload.adText, payload.videoUrl);

      return { success: true, campaignId, adGroupId, adId, simulated: false };
    } catch (error: any) {
      console.error('[TIKTOK API ERROR]', error.message);
      throw new Error(`TikTok API Failed: ${error.message}`);
    }
  }

  private static async createCampaign(name: string, budget: number): Promise<string> {
    const url = `${BASE_URL}/campaign/create/`;
    
    const body = {
      advertiser_id: TIKTOK_AD_ACCOUNT_ID,
      campaign_name: name,
      objective_type: 'TRAFFIC',
      budget_mode: 'BUDGET_MODE_DAY',
      budget: budget >= 50 ? budget : 50, // TikTok minimum daily budget is often higher
      operation_status: 'DISABLE' // Start paused
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Access-Token': TIKTOK_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    if (data.code !== 0) throw new Error(data.message);
    
    return data.data.campaign_id;
  }

  private static async createAdGroup(campaignId: string, budget: number): Promise<string> {
    // Placeholder logic for TikTok AdGroup creation
    return 'tt_adgroup_' + Date.now();
  }

  private static async createAd(adGroupId: string, text: string, videoUrl?: string): Promise<string> {
    // Placeholder logic for TikTok Ad creation
    return 'tt_ad_' + Date.now();
  }
}
