import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { CompetitorExtremeService } from '@/lib/services/competitor.service.extreme';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const eliteUsers = await prisma.user.findMany({
      where: { OR: [{ subscriptionTier: 'ELITE' }, { role: 'SUPER_ADMIN' }] },
      include: {
        apiIntegrations: {
          where: { provider: 'META_ADS' } // The actual API they have already connected 500 times
        }
      }
    });

    for (const user of eliteUsers) {
      console.log(`[HERMES CRON] Verifying Meta Ads Integration for ${user.email}...`);
      
      const metaIntegration = user.apiIntegrations[0];
      if (!metaIntegration || !metaIntegration.apiKey) {
        console.log(`[HERMES CRON] User ${user.email} has no Meta Ads API key connected. Skipping.`);
        continue;
      }

      // 1. Run the real Espionage logic using the connected META_ADS API key
      await CompetitorExtremeService.runAdLibraryEspionage(user.id);

      // 2. Log naar de Godbrain
      const hermesAgent = await prisma.agentRegistry.findFirst({ where: { name: 'Hermes' }});
      if (hermesAgent) {
        await prisma.globalNeuralNetwork.create({
          data: {
            agentId: hermesAgent.id,
            sourceType: 'AUTONOMOUS_CRON',
            actionType: 'ANALYSIS',
            content: `[24/7 Oracle Sync] Echte Meta Ad Library Scrape voltooid via gekoppelde API. Concurrentie geanalyseerd op prijs-dalingen en agressieve opschaling.`,
            impactScore: 0.8
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Oracle Direct-API sync complete' });
  } catch (error: any) {
    console.error('Oracle Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
