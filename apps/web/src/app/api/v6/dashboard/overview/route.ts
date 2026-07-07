import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function GET() {
  try {
    // 1. Check if we need to seed fallback data (for empty databases)
    const actionCount = await prisma.agentAction.count();
    
    if (actionCount === 0) {
      console.log('No agent actions found. Seeding fallback V6.0 Dashboard data...');
      
      // Seed a dummy user if none exists to attach data to
      let demoUser = await prisma.user.findFirst();
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@rebuildyourlife.eu',
            passwordHash: 'hashed_password_dummy',
            firstName: 'Demo',
            lastName: 'User',
            role: 'ADMIN',
          }
        });
      }

      // Seed Agent Actions
      await prisma.agentAction.createMany({
        data: [
          {
            userId: demoUser.id,
            agentType: 'Product Research Agent',
            title: 'Found winning product: Smart Watch Pro',
            description: 'Analyzed 400+ trending products on TikTok. High ROAS potential.',
            status: 'COMPLETED',
            riskLevel: 'LOW',
            netProfitImpact: 38000
          },
          {
            userId: demoUser.id,
            agentType: 'Ad Creative Agent',
            title: 'Generated 4 video variations',
            description: 'Created 4 hook variations for Smart Watch Pro using AI Voice.',
            status: 'COMPLETED',
            riskLevel: 'LOW',
          },
          {
            userId: demoUser.id,
            agentType: 'Store Optimizer Agent',
            title: 'A/B Test Started: CTA Colors',
            description: 'Testing Green vs Red Add-to-Cart buttons.',
            status: 'ACTIVE',
            riskLevel: 'LOW',
          },
          {
            userId: demoUser.id,
            agentType: 'Pricing Agent',
            title: 'Dynamic pricing adjustment',
            description: 'Increased price by $2.00 during high traffic peak.',
            status: 'COMPLETED',
            riskLevel: 'MEDIUM',
          }
        ]
      });

      // Seed Revenue Snapshots
      await prisma.revenueSnapshot.create({
        data: {
          userId: demoUser.id,
          snapshotDate: new Date(),
          period: 'TODAY',
          totalRevenue: 2431245,
          totalExpenses: 1589107,
          netProfit: 842138,
          hardwareReserve: 243124, // 10%
        }
      });

      // Seed Shopify Stores
      await prisma.shopifyStore.createMany({
        data: [
          { userId: demoUser.id, shopUrl: 'main-brand.myshopify.com', accessToken: 'dummy', totalRevenue: 1245020 },
          { userId: demoUser.id, shopUrl: 'niche-store-1.myshopify.com', accessToken: 'dummy', totalRevenue: 632485 },
          { userId: demoUser.id, shopUrl: 'niche-store-2.myshopify.com', accessToken: 'dummy', totalRevenue: 342775 }
        ]
      });

      // Seed System Health
      await prisma.systemHealthLog.create({
        data: {
          component: 'Decision Engine V6',
          status: 'OPERATIONAL',
          latencyMs: 42,
        }
      });
    }

    // 2. Fetch Live Data from Database
    const recentActions = await prisma.agentAction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const revenueSnapshots = await prisma.revenueSnapshot.findMany({
      orderBy: { snapshotDate: 'desc' },
      take: 1,
    });

    const stores = await prisma.shopifyStore.findMany({
      orderBy: { totalRevenue: 'desc' },
      take: 5,
    });

    const healthLog = await prisma.systemHealthLog.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // 3. Calculate Stats
    const totalDecisions = await prisma.agentAction.count();
    const completedDecisions = await prisma.agentAction.count({ where: { status: 'COMPLETED' }});
    const automationRate = totalDecisions > 0 ? (completedDecisions / totalDecisions) * 100 : 95.4;

    const currentRevenue = revenueSnapshots.length > 0 ? revenueSnapshots[0] : {
      totalRevenue: 0,
      netProfit: 0,
    };

    // 4. Return formatted data for the dashboard
    return NextResponse.json({
      finance: {
        totalRevenue: currentRevenue.totalRevenue,
        netProfit: currentRevenue.netProfit,
        orders: 24342, // For demo purposes, order count can be added to RevenueSnapshot later
      },
      agentActivity: recentActions.map(a => ({
        id: a.id,
        name: a.agentType,
        task: a.title,
        status: a.status,
      })),
      decisionEngine: {
        totalDecisionsToday: totalDecisions,
        automationPercentage: automationRate,
      },
      storePerformance: stores.map(s => ({
        name: s.shopUrl.split('.')[0],
        rev: s.totalRevenue,
        trend: '+21.4%', // Dummy trend
      })),
      systemStatus: {
        status: healthLog?.status === 'OPERATIONAL' ? 'All Systems Operational' : 'Warning',
        uptime: '99.98%',
      }
    });

  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
