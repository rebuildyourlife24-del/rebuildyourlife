import { NextResponse } from 'next/server';
import { PrismaClient } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

export async function GET() {
  try {
    // Verifieer authenticatie
    const token = cookies().get("ryl_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Sessie verlopen" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !['SUPREME_OVERSEER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: "Geen toegang. God-Mode vereist." }, { status: 403 });
    }

    // Haal echte metrics op uit de database
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsers,
      freeUsers,
      premiumUsers,
      enterpriseUsers,
      pendingTasks,
      completedTasksThisMonth,
      totalDebts,
      recentBudget,
      auditLogsToday,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      prisma.user.count({ where: { subscriptionTier: 'FREE' } }),
      prisma.user.count({ where: { subscriptionTier: 'PREMIUM' } }),
      prisma.user.count({ where: { subscriptionTier: 'ENTERPRISE' } }),
      prisma.task.count({ where: { status: 'PENDING' } }),
      prisma.task.count({ where: { status: 'COMPLETED', completedAt: { gte: startOfMonth } } }),
      prisma.debt.aggregate({ _sum: { currentBalance: true } }),
      prisma.budget.findFirst({ orderBy: { month: 'desc' } }),
      prisma.auditLog.count({ where: { createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } }),
    ]);

    // Bereken MRR
    const premiumMRR = premiumUsers * 14.95;
    const enterpriseMRR = enterpriseUsers * 49.95;
    const totalMRR = premiumMRR + enterpriseMRR;

    return NextResponse.json({
      status: 'ok',
      overseer: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
      kpis: {
        totalUsers,
        activeUsers,
        freeUsers,
        premiumUsers,
        enterpriseUsers,
        mrr: totalMRR,
        arr: totalMRR * 12,
      },
      operations: {
        pendingTasks,
        completedTasksThisMonth,
        auditLogsToday,
      },
      financials: {
        totalDebtManaged: totalDebts._sum.currentBalance || 0,
        currentMonthIncome: recentBudget?.totalIncome || 0,
        currentMonthExpenses: recentBudget?.totalExpenses || 0,
      },
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("CEO Metrics error:", error);
    return NextResponse.json({ error: "Database verbinding gefaald." }, { status: 500 });
  }
}
