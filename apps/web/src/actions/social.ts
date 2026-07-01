'use server';

import { db } from '@/lib/db';
import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { MetaMarketingAPI } from '@/lib/meta-api';
import { TikTokMarketingAPI } from '@/lib/tiktok-api';

// Haal social media posts op
export async function getSocialPosts() {
  try {
    const user = await db.user.findFirst();
    if (!user) return [];

    const posts = await db.socialMediaPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return posts;
  } catch (error) {
    console.error('Failed to get social posts:', error);
    return [];
  }
}

// Update post status
export async function updateSocialPostStatus(id: string, status: string) {
  try {
    const post = await db.socialMediaPost.update({
      where: { id },
      data: { status }
    });

    revalidatePath('/dashboard/social');
    return post;
  } catch (error) {
    console.error('Failed to update social post status:', error);
    throw new Error('Failed to update status');
  }
}

// Maak een nieuwe post (simulatie van campaign launch)
export async function createSocialPost(title: string, platform: string, budget: number) {
  try {
    const user = await db.user.findFirst();
    if (!user) throw new Error("Unauthorized");

    // Simulatie: we gebruiken 'views' en 'engagement' voor budget en spent omdat er geen aparte tabel is
    const post = await db.socialMediaPost.create({
      data: {
        userId: user.id,
        platform,
        content: title,
        status: 'PENDING_APPROVAL',
        publishAt: new Date(),
        views: budget,
        engagement: 0,
      }
    });

    revalidatePath('/dashboard/social');
    return post;
  } catch (error) {
    console.error('Failed to create social post:', error);
    throw new Error('Failed to create post');
  }
}

// Lanceer een betaalde Ad Campagne via Agency Reseller Model
export async function launchAdCampaign(userId: string, campaignName: string, platform: string, totalBudget: number) {
  try {
    // Start een veilige database transactie
    const result = await prisma.$transaction(async (tx) => {
      // 1. Haal de wallet op
      const wallet = await tx.userWallet.findUnique({
        where: { userId }
      });

      if (!wallet || wallet.fiatBalance < totalBudget) {
        throw new Error('Onvoldoende RYL Ad-Tegoed. Waardeer je wallet op.');
      }

      // 2. Trek het budget af van de wallet
      const updatedWallet = await tx.userWallet.update({
        where: { id: wallet.id },
        data: { fiatBalance: { decrement: totalBudget } }
      });

      // 3. Log de afschrijving
      const transaction = await tx.platformCreditTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -totalBudget,
          type: 'AD_SPEND',
          description: `Budget voor ${platform} campagne: ${campaignName}`,
          status: 'COMPLETED'
        }
      });

      // 4. Maak de campagne aan
      const campaign = await tx.adCampaign.create({
        data: {
          userId,
          campaignName,
          platform,
          totalBudget,
          walletTxId: transaction.id,
          status: 'ACTIVE'
        }
      });

      // 5. Memory log voor de AI
      await tx.aIMemory.create({
        data: {
          userId,
          agentType: 'MARKETING',
          memoryType: 'AD_LAUNCH',
          content: `Gebruiker heeft de campagne "${campaignName}" op ${platform} gelanceerd met een budget van €${totalBudget}. Restant saldo: €${updatedWallet.fiatBalance}.`
        }
      });

      return { campaign, remainingBalance: updatedWallet.fiatBalance };
    });

    revalidatePath('/klanten');
    revalidatePath('/dashboard/social');
    
    // 6. Roep de daadwerkelijke API aan afhankelijk van het platform
    let apiResult = null;
    const platformUpper = platform.toUpperCase();

    if (platformUpper === 'META' || platformUpper === 'FACEBOOK' || platformUpper === 'INSTAGRAM') {
      console.log(`[SOCIAL ACTION] Pushing to Meta API...`);
      apiResult = await MetaMarketingAPI.publishCampaign({
        campaignName: campaignName,
        budget: totalBudget,
        adText: `Automatisch gegenereerde advertentie door RYL AI voor ${campaignName}`
      });
    } else if (platformUpper === 'TIKTOK') {
      console.log(`[SOCIAL ACTION] Pushing to TikTok API...`);
      apiResult = await TikTokMarketingAPI.publishCampaign({
        campaignName: campaignName,
        budget: totalBudget,
        adText: `TikTok Ad door RYL AI: ${campaignName}`
      });
    } else if (platformUpper === 'SNAPCHAT') {
      console.log(`[SOCIAL ACTION] Simulating Snapchat API (Not yet implemented)`);
      apiResult = { success: true, simulated: true, campaignId: 'sim_snap_' + Date.now() };
    }
    
    // Update campaign status based on API result
    if (apiResult?.success) {
      await prisma.adCampaign.update({
        where: { id: result.campaign.id },
        data: { status: apiResult.simulated ? 'ACTIVE_SIMULATED' : 'ACTIVE_LIVE' }
      });
    }
    
    return { success: true, apiResult, ...result };
  } catch (error: any) {
    console.error('Failed to launch Ad Campaign:', error);
    return { success: false, error: error.message };
  }
}


