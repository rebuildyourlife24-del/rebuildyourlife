"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

async function getAuthenticatedUserId(): Promise<string | null> {
  const token = (await cookies()).get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function getWarRoomStatsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const [
      // Monitor 1: Wealth & Capital
      vaults,
      debts,
      budgets,
      
      // Monitor 2: Syndicate & Traffic
      prCampaignsCount,
      shopifyStoresCount,
      syndicatePostsCount,
      platformRevenues,

      // Monitor 4: Vitality & Mindset
      programs,
      pendingTasksCount,
      healthLogs,

      // Monitor 5: Sovereign Core
      apiKeysCount,
      systemLogs
    ] = await Promise.all([
      // Monitor 1
      prisma.treasuryVault.findMany({ where: { userId } }),
      prisma.debt.findMany({ where: { userId } }),
      prisma.budget.findFirst({ where: { userId }, orderBy: { month: "desc" } }),

      // Monitor 2
      prisma.pRCampaign ? prisma.pRCampaign.count({ where: { franchise: { userId } } }) : Promise.resolve(0),
      prisma.shopifyStore.count({ where: { userId } }),
      prisma.syndicatePost.count({ where: { authorId: userId } }),
      prisma.platformRevenue ? prisma.platformRevenue.findMany({ where: { franchise: { userId } } }) : Promise.resolve([]),

      // Monitor 4
      prisma.rebuildProgram.findMany({ where: { userId, isActive: true }, include: { milestones: true } }),
      prisma.task.count({ where: { userId, status: "PENDING" } }),
      prisma.healthLog.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 5 }),

      // Monitor 5
      prisma.apiKey.count({ where: { userId } }),
      prisma.systemActivityLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 })
    ]);

    // Calculations
    const totalVaultBalance = vaults.reduce((sum, v) => sum + (v.balance || 0), 0);
    const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
    const totalPlatformRevenue = (platformRevenues as any[]).reduce((sum, r) => sum + (r.amount || 0), 0);

    return {
      success: true,
      stats: {
        monitor1: {
          vaultsCount: vaults.length,
          totalVaultBalance,
          totalDebt,
          monthlyIncome: budgets?.totalIncome || 0,
          monthlyExpenses: budgets?.totalExpenses || 0
        },
        monitor2: {
          prCampaignsCount,
          shopifyStoresCount,
          syndicatePostsCount,
          totalPlatformRevenue
        },
        monitor4: {
          activeProgramsCount: programs.length,
          pendingTasksCount,
          latestHealthLog: healthLogs[0] || null,
          programProgress: programs[0]?.progress || 0
        },
        monitor5: {
          apiKeysCount,
          recentLogs: systemLogs.map(log => ({
            id: log.id,
            action: log.action,
            entityType: log.category,
            createdAt: log.createdAt.toISOString()
          }))
        }
      }
    };
  } catch (error) {
    console.error("getWarRoomStatsAction error:", error);
    return { success: false, error: String(error) };
  }
}
