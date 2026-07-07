import { PrismaClient } from '@prisma/client';
import { PerceptionEngine } from './Perception';

const prisma = new PrismaClient();
const perception = new PerceptionEngine();

/**
 * Reality Gateway
 * Phase 3 - Connects the external world to the Cognitive Architecture.
 * Gathers hard data (Revenue, Ads, System Health) and pushes it to Perception.
 */
export class RealityGateway {
  /**
   * Syncs current reality and triggers the Cognitive Loop.
   * Can be called by a CRON job or a webhook.
   */
  async syncReality(userId: string) {
    console.log(`[Reality Gateway] Initiating Reality Sync for User: ${userId}`);

    // 1. Gather Reality Signals
    const revenueSignal = await this.gatherRevenueSignal(userId);
    const campaignSignal = await this.gatherCampaignSignal(userId);

    // 2. Package into a unified Market Reality Signal
    const realitySignal = {
      source: 'RealityGateway_Cron',
      timestamp: new Date().toISOString(),
      data: {
        revenue: revenueSignal,
        campaigns: campaignSignal
      }
    };

    // 3. Trigger Perception (Layer 1 of the Cognitive Loop)
    const perceptionResult = await perception.observe(realitySignal);

    if (!perceptionResult) {
      console.log(`[Reality Gateway] Signal ignored by Perception (Constraint Violation or Noise).`);
      return { status: 'IGNORED', message: 'Signal dropped by constraints.' };
    }

    console.log(`[Reality Gateway] Signal accepted by Perception. Passing to Reasoning...`);
    
    // In a full implementation, we'd now pass this to Reasoning, Planning, Execution.
    // For Phase 3, we validate that Perception successfully ingested and filtered the data.
    
    return {
      status: 'PROCESSED',
      perceptionData: perceptionResult
    };
  }

  private async gatherRevenueSignal(userId: string) {
    // Get the latest revenue snapshot
    const snapshot = await prisma.revenueSnapshot.findFirst({
      where: { userId },
      orderBy: { snapshotDate: 'desc' }
    });
    return snapshot || { totalRevenue: 0, netProfit: 0, cashRunwayDays: 200 };
  }

  private async gatherCampaignSignal(userId: string) {
    // Get active social campaigns
    const campaigns = await prisma.socialCampaign.findMany({
      where: { 
        platform: { userId },
        status: 'ACTIVE' 
      },
      take: 5,
      orderBy: { updatedAt: 'desc' }
    });
    return campaigns;
  }
}
