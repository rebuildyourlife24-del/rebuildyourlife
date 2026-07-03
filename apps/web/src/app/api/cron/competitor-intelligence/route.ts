import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    // Security check: ensure this is only called by Vercel Cron or with a secret
    const authHeader = request.headers.get('authorization');
    if (
      process.env.NODE_ENV === 'production' && 
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = [];
    logs.push("CMO Agent: Initiating Competitor Intelligence Scan...");

    // Get a user to attach the AgentAction to
    const users = await prisma.user.findMany({ take: 1 });
    if (users.length === 0) {
      return NextResponse.json({ error: 'No user found to attach agent actions' }, { status: 400 });
    }
    const userId = users[0].id;

    // 1. Simulate scraping competitor Facebook Ads and pricing
    const scrapedInsights = {
      competitor: "Competitor X",
      discovery: "Launched a new 50% discount ad campaign on Facebook.",
      platform: "Facebook Ads Library",
      pricingImpact: "High",
      scrapedAt: new Date().toISOString(),
      rawCopy: "Stop struggling with your business. Get 50% off our masterclass today only!",
      estimatedAdSpend: "$5000/day",
    };

    logs.push(`CMO Agent: Scraped insights - ${scrapedInsights.discovery}`);

    // Determine if it's a strategic move
    const isStrategicMove = true; // For simulation, let's say a 50% discount is highly strategic

    // 2. Log intelligence discovery for CMO
    await prisma.agentAction.create({
      data: {
        userId: userId,
        agentType: 'CMO',
        actionType: 'COMPETITOR_ANALYSIS_COMPLETED',
        title: 'Competitor Ad Campaign Detected',
        description: `Competitor intelligence gathered: ${scrapedInsights.discovery}`,
        status: 'SUCCESS',
        resultData: scrapedInsights,
        riskLevel: 'MEDIUM',
        estimatedCost: 0,
        estimatedRevenue: 0,
        payload: JSON.stringify({ action: "REVIEW_COMPETITOR_ADS" }),
      }
    });
    logs.push("CMO Agent: Logged AgentAction for CMO.");

    // 3. Log it for CEO if it's a strategic move
    if (isStrategicMove) {
      await prisma.agentAction.create({
        data: {
          userId: userId,
          agentType: 'CEO',
          actionType: 'COMPETITOR_ANALYSIS_COMPLETED',
          title: 'Strategic Threat: Aggressive Competitor Pricing',
          description: `Strategic alert: ${scrapedInsights.competitor} is running an aggressive 50% discount campaign. CEO review required to adjust overall pricing strategy.`,
          status: 'SUCCESS',
          resultData: scrapedInsights,
          riskLevel: 'HIGH',
          estimatedCost: 0,
          estimatedRevenue: 0,
          payload: JSON.stringify({ action: "REVIEW_STRATEGIC_THREAT" }),
        }
      });
      logs.push("CEO Agent: Logged strategic threat AgentAction for CEO.");
    }

    return NextResponse.json({ success: true, logs, scrapedInsights });
  } catch (error: any) {
    console.error("Cron Competitor Intelligence Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
