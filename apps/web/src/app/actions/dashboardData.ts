"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET! ;

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

export async function getDashboardStatsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  try {
    const [
      goalsTotal,
      goalsCompleted,
      tasksTotal,
      tasksCompleted,
      debts,
      budgets,
      recentActivities,
    ] = await Promise.all([
      prisma.goal.count({ where: { userId } }),
      prisma.goal.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.debt.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { currentBalance: true, originalAmount: true },
      }),
      prisma.budget.findMany({
        where: { userId },
        orderBy: { month: 'desc' },
        take: 6,
      }),
      prisma.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
    const originalDebt = debts.reduce((sum, d) => sum + d.originalAmount, 0);
    const debtPaidOff = originalDebt - totalDebt;

    const currentMonthBudget = budgets[0] || null;

    // Bouw groeidata op voor grafieken (laatste 6 maanden)
    const growthData = budgets.reverse().map(b => ({
      month: new Date(b.month).toLocaleString('nl-NL', { month: 'short' }),
      income: b.totalIncome,
      expenses: b.totalExpenses,
      savings: b.totalIncome - b.totalExpenses,
    }));

    return {
      success: true,
      stats: {
        goals: {
          total: goalsTotal,
          completed: goalsCompleted,
          inProgress: goalsTotal - goalsCompleted,
          completionRate: goalsTotal > 0 ? Math.round((goalsCompleted / goalsTotal) * 100) : 0,
        },
        tasks: {
          total: tasksTotal,
          completed: tasksCompleted,
          pending: tasksTotal - tasksCompleted,
        },
        finances: {
          totalDebt: Math.round(totalDebt),
          originalDebt: Math.round(originalDebt),
          debtPaidOff: Math.round(debtPaidOff),
          debtProgress: originalDebt > 0 ? Math.round((debtPaidOff / originalDebt) * 100) : 0,
          monthlyIncome: currentMonthBudget?.totalIncome || 0,
          monthlyExpenses: currentMonthBudget?.totalExpenses || 0,
          monthlySavings: currentMonthBudget
            ? currentMonthBudget.totalIncome - currentMonthBudget.totalExpenses
            : 0,
        },
        growthData,
        recentActivity: recentActivities.map(a => ({
          id: a.id,
          type: a.entityType,
          description: a.action,
          createdAt: a.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error("getDashboardStatsAction error:", error);
    return { success: false };
  }
}

export async function getGoalsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, goals: [] };

  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return { success: true, goals };
  } catch (error) {
    return { success: false, goals: [] };
  }
}

export async function getTasksAction(status?: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, tasks: [] };

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    });
    return { success: true, tasks };
  } catch (error) {
    return { success: false, tasks: [] };
  }
}

export async function getDebtsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, debts: [] };

  try {
    const debts = await prisma.debt.findMany({
      where: { userId },
      orderBy: [{ priority: 'desc' }, { currentBalance: 'desc' }],
    });
    return { success: true, debts };
  } catch (error) {
    return { success: false, debts: [] };
  }
}

export async function getBudgetAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, budget: null };

  try {
    const budget = await prisma.budget.findFirst({
      where: { userId },
      orderBy: { month: 'desc' },
      include: { categories: true },
    });
    return { success: true, budget };
  } catch (error) {
    return { success: false, budget: null };
  }
}

export async function createTaskAction(data: {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  goalId?: string;
}) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Niet ingelogd" };

  try {
    const task = await prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        goalId: data.goalId,
        status: 'PENDING',
      },
    });
    return { success: true, task };
  } catch (error) {
    return { success: false, error: "Kon taak niet aanmaken" };
  }
}

export async function updateTaskStatusAction(taskId: string, status: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  try {
    const task = await prisma.task.update({
      where: { id: taskId, userId },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });
    return { success: true, task };
  } catch (error) {
    return { success: false };
  }
}
