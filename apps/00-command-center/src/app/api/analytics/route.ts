import { NextResponse } from 'next/server';
import { PrismaClient } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { fetchWithCache } from '@/lib/redis';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const db = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";
const CACHE_TTL_MINUTES = 5; // Cache 5 minuten geldig

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'MONTHLY';
    const type = searchParams.get('type') || 'full';

    // Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get("cc_session")?.value || cookieStore.get("ryl_session")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.userId;
      } catch {}
    }

    if (!userId) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const cacheKey = `analytics_${userId}_${period}_${type}`;

    const data = await fetchWithCache(cacheKey, async () => {
      const now = new Date();
      const startDate = period === 'DAILY' ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) :
                        period === 'WEEKLY' ? new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000) :
                        period === 'MONTHLY' ? new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000) :
                        new Date(now.getTime() - 4 * 3 * 30 * 24 * 60 * 60 * 1000);

      // Haal budgetten op
      const budgets = await db.budget.findMany({
        where: { userId, month: { gte: startDate } },
        orderBy: { month: 'asc' },
      });

      // Haal schulden op
      const debts = await db.debt.findMany({ where: { userId } });
      const totalDebt = debts.reduce((s: number, d: any) => s + d.currentBalance, 0);
      const originalDebt = debts.reduce((s: number, d: any) => s + d.originalAmount, 0);

      // Haal betalingen op
      const payments = await db.debtPayment.findMany({
        where: { debt: { userId }, paidAt: { gte: startDate } },
        include: { debt: true },
        orderBy: { paidAt: 'asc' },
      });

      // Totalen
      const totalRevenue = budgets.reduce((s: number, b: any) => s + b.totalIncome, 0);
      const totalExpenses = budgets.reduce((s: number, b: any) => s + b.totalExpenses, 0);
      const netProfit = totalRevenue - totalExpenses;

      // Gemiste inkomsten berekening (simpel: als uitgaven > 40% van inkomsten = gemiste winst)
      const missedRevenue = budgets.reduce((s: number, b: any) => {
        const ratio = b.totalIncome > 0 ? b.totalExpenses / b.totalIncome : 0;
        if (ratio > 0.6) return s + (b.totalExpenses - b.totalIncome * 0.4);
        return s;
      }, 0);

      // Groeidata voor grafieken
      const growthData = budgets.map((b: any) => ({
        period: new Date(b.month).toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' }),
        inkomsten: Math.round(b.totalIncome),
        uitgaven: Math.round(b.totalExpenses),
        winst: Math.round(b.totalIncome - b.totalExpenses),
        spaarquote: b.totalIncome > 0 ? Math.round(((b.totalIncome - b.totalExpenses) / b.totalIncome) * 100) : 0,
      }));

      // KPIs voor CEO widget
      const currentMonth = budgets[budgets.length - 1];
      const prevMonth = budgets[budgets.length - 2];
      const revenueGrowth = currentMonth && prevMonth && prevMonth.totalIncome > 0
        ? ((currentMonth.totalIncome - prevMonth.totalIncome) / prevMonth.totalIncome * 100).toFixed(1)
        : '0.0';

      // Premium/enterprise users (MRR)
      const premiumUsers = await db.user.count({ where: { subscriptionTier: 'PREMIUM' } });
      const enterpriseUsers = await db.user.count({ where: { subscriptionTier: 'ENTERPRISE' } });
      const mrr = premiumUsers * 14.95 + enterpriseUsers * 49.95;

      // Voor-na analyse (snapshot vergelijking)
      const beforeSnapshot = {
        period: 'Vorig',
        revenue: prevMonth?.totalIncome || 0,
        expenses: prevMonth?.totalExpenses || 0,
        profit: prevMonth ? prevMonth.totalIncome - prevMonth.totalExpenses : 0,
      };
      const afterSnapshot = {
        period: 'Huidig',
        revenue: currentMonth?.totalIncome || 0,
        expenses: currentMonth?.totalExpenses || 0,
        profit: currentMonth ? currentMonth.totalIncome - currentMonth.totalExpenses : 0,
      };

      return {
        summary: {
          totalRevenue: Math.round(totalRevenue),
          totalExpenses: Math.round(totalExpenses),
          netProfit: Math.round(netProfit),
          missedRevenue: Math.round(missedRevenue),
          totalDebt: Math.round(totalDebt),
          originalDebt: Math.round(originalDebt),
          debtPaidOff: Math.round(originalDebt - totalDebt),
          debtProgress: originalDebt > 0 ? Math.round(((originalDebt - totalDebt) / originalDebt) * 100) : 0,
          mrr: Math.round(mrr * 100) / 100,
          arr: Math.round(mrr * 12 * 100) / 100,
          revenueGrowth,
          premiumUsers,
          enterpriseUsers,
        },
        growthData,
        beforeAfter: { before: beforeSnapshot, after: afterSnapshot },
        payments: payments.slice(0, 20).map((p: any) => ({
          amount: p.amount,
          date: p.paidAt,
          creditor: p.debt.creditorName,
        })),
        timestamp: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      period,
      ...data,
    });

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Analytics fout" }, { status: 500 });
  }
}

// Forceer cache invalidatie
export async function DELETE() {
  try {
    await db.analyticsCache.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    return NextResponse.json({ success: true, message: "Cache geleegd" });
  } catch {
    return NextResponse.json({ error: "Cache cleanup fout" }, { status: 500 });
  }
}
