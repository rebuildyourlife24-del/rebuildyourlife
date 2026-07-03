import { TwitterApi } from 'twitter-api-v2';

export interface SocialPostConfig {
  text: string;
  mediaUrls?: string[];
  platforms: ('twitter' | 'instagram' | 'tiktok')[];
}

export class SovereignSocialEngine {
  private twitterClient: TwitterApi | null = null;

  constructor() {
    this.initTwitter();
  }

  private initTwitter() {
    const appKey = process.env.TWITTER_API_KEY;
    const appSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (appKey && appSecret && accessToken && accessSecret) {
      this.twitterClient = new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret,
      });
      console.log('[SovereignSocialEngine] Twitter API geconfigureerd.');
    } else {
      console.warn('[SovereignSocialEngine] Waarschuwing: Twitter API keys ontbreken in de .env');
    }
  }

  /**
   * Publiceert de gegenereerde content ECHT naar de geselecteerde platformen.
   */
  public async publish(config: SocialPostConfig): Promise<{ success: boolean; results: any }> {
    const results: any = {};
    let success = true;

    for (const platform of config.platforms) {
      try {
        if (platform === 'twitter') {
          results.twitter = await this.postToTwitter(config);
        } else if (platform === 'instagram') {
          // TODO: Instagram Graph API integratie
          results.instagram = { status: 'pending_implementation', message: 'Instagram Graph API logic coming soon.' };
        } else if (platform === 'tiktok') {
          // TODO: TikTok Content API integratie
          results.tiktok = { status: 'pending_implementation', message: 'TikTok API logic coming soon.' };
        }
      } catch (error: any) {
        success = false;
        results[platform] = { error: error.message };
        console.error(`[SovereignSocialEngine] Fout bij publiceren naar ${platform}:`, error);
      }
    }

    return { success, results };
  }

  /**
   * Fysieke post via de officiële Twitter API v2.
   */
  private async postToTwitter(config: SocialPostConfig) {
    if (!this.twitterClient) {
      throw new Error('Twitter API is niet geconfigureerd in de environment variables.');
    }

    // Alleen tekst voor nu (media upload vereist Twitter API v1.1 endpoint via de library)
    const tweet = await this.twitterClient.v2.tweet(config.text);
    console.log(`[SovereignSocialEngine] Tweet succesvol geplaatst! ID: ${tweet.data.id}`);
    
    return {
      status: 'success',
      tweetId: tweet.data.id,
      text: tweet.data.text
    };
  }
}
