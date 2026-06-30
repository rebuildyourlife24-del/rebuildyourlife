"use server";

import { prisma } from "@rebuildyourlife/database";
import { getSessionAction } from "@/app/actions/auth";

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const session = await getSessionAction();
    if (session.success && session.user) {
      return session.user.id;
    }
  } catch (err) {
    console.error("[warRoomData] Auth check failed", err);
  }
  return null;
}

export async function getWarRoomStatsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const [
      vaults,
      debts,
      opportunities,
      systemLogs
    ] = await Promise.all([
      prisma.treasuryVault.findMany({ where: { userId } }),
      prisma.debt.findMany({ where: { userId } }),
      prisma.opportunity.findMany({ 
        where: { status: 'AVAILABLE' },
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.systemActivityLog.findMany({ 
        where: { userId }, 
        orderBy: { createdAt: "desc" }, 
        take: 5 
      })
    ]);

    // Calculate totals
    const totalVaultBalance = vaults.reduce((sum, v) => sum + (v.balance || 0), 0);
    const totalDebt = debts.reduce((sum, d) => sum + (d.currentBalance || 0), 0);
    
    // Map opportunities to expected format
    const formattedOpportunities = opportunities.map(opp => ({
      title: opp.title,
      type: opp.category,
      estValue: opp.payout || 0
    }));

    // Map system logs to alerts
    const alerts = systemLogs.map(log => ({
      time: log.createdAt.toLocaleTimeString('nl-NL', { hour: '2-digit', minute:'2-digit' }),
      message: log.action
    }));

    // Determine threat level (just a basic logic based on debt ratio)
    let threatLevel = 'SECURE';
    if (totalDebt > totalVaultBalance * 2) {
      threatLevel = 'ELEVATED';
    }
    if (totalDebt > totalVaultBalance * 5 && totalDebt > 10000) {
      threatLevel = 'CRITICAL';
    }

    return {
      success: true,
      totalVaultBalance,
      totalDebt,
      incomeStreams: [], // Or fetch from ShopifyStore / TradingBot if needed
      opportunities: formattedOpportunities,
      threatLevel,
      alerts,
      systemLoad: 12 // Base load
    };
  } catch (error) {
    console.error("getWarRoomStatsAction error:", error);
    return { success: false, error: String(error) };
  }
}
