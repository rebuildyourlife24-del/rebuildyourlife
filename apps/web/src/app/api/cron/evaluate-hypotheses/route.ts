import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch active ad campaigns
    const campaigns = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] }
      }
    });

    // 2. Fetch the system agent to associate knowledge entries
    let systemAgent = await prisma.agentRegistry.findFirst({
      where: { name: { contains: 'Hermes' } }
    });

    // Fallback: if no Hermes agent exists, find first agent registry
    if (!systemAgent) {
      systemAgent = await prisma.agentRegistry.findFirst();
    }

    if (!systemAgent) {
      return NextResponse.json({ success: true, evaluated: 0, message: "No active agents found in registry to link knowledge." });
    }

    let evaluatedCount = 0;
    const results = [];

    for (const campaign of campaigns) {
      let type = "HYPOTHESIS";
      let confidence = 0.5;
      const evidence = `Clicks: ${campaign.clicks}, Conversies: ${campaign.conversions}, ROAS: ${campaign.roas}`;

      if (campaign.roas >= 2.0) {
        type = "VERIFIED";
        confidence = 0.9;
      } else if (campaign.roas < 1.0 && campaign.amountSpent > 10) {
        type = "FAILURE";
        confidence = 0.1;
      } else {
        // Underperforming or not enough data yet
        continue;
      }

      // Create entry in AgentKnowledgeBase
      const claim = `Ad Campaign [${campaign.campaignName}] on [${campaign.platform}] with ROAS ${campaign.roas} is classified as ${type}.`;
      
      await prisma.agentKnowledgeBase.create({
        data: {
          agentId: systemAgent.id,
          domain: "MARKETING",
          type,
          claim,
          evidence,
          confidence,
          status: "ACTIVE"
        }
      });

      evaluatedCount++;
      results.push({ campaign: campaign.campaignName, type, roas: campaign.roas });
    }

    return NextResponse.json({
      success: true,
      evaluatedCount,
      evaluations: results
    });
  } catch (error: any) {
    console.error("Cron evaluation failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
