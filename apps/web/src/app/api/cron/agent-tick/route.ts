import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

// Opt into the Next.js edge runtime if desired, or stay on node runtime.
export const maxDuration = 300; // Allows up to 5 minutes on Vercel Pro

export async function GET(request: Request) {
  // Security check: ensure this is only called by Vercel Cron or with a secret
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = [];

  try {
    // 1. Proactive Agent: System Health Check (COO Agent)
    logs.push("COO Agent: Starting system health check...");
    
    // Simulate finding a minor issue
    const healthCheckResult = Math.random();
    if (healthCheckResult > 0.8) {
      const users = await prisma.user.findMany({ take: 1 });
      if (users.length > 0) {
        await prisma.agentAction.create({
          data: {
            userId: users[0].id,
            agentType: 'COO',
            title: 'Stripe Webhook Mismatch Detected',
            description: 'Er is een lichte vertraging in de webhook synchronisatie met Stripe gevonden. Wil je dat ik de sync forceer?',
            status: 'PENDING',
            riskLevel: 'LOW',
            estimatedCost: 0,
            estimatedRevenue: 0,
            payload: JSON.stringify({ action: "FORCE_STRIPE_SYNC" })
          }
        });
        logs.push("COO Agent: Found issue and created AgentAction for review.");
      }
    } else {
      logs.push("COO Agent: All systems nominal.");
    }

    // 2. Proactive Agent: CFO Revenue Scan
    logs.push("CFO Agent: Scanning profit margins...");
    const cfoResult = Math.random();
    if (cfoResult > 0.9) {
      const users = await prisma.user.findMany({ take: 1 });
      if (users.length > 0) {
        await prisma.agentSharedMemory.create({
          data: {
            sourceAgent: "CFO",
            targetAgent: "CMO",
            content: "We hebben extra marge vrij op productlijn A. Verhoog de ad spend op Meta met 15% vandaag.",
            importance: 0.8
          }
        });
        logs.push("CFO Agent: Saved directive to Hive Mind for CMO.");
      }
    }

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Cron Agent Tick Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
