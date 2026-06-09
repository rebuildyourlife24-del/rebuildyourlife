import bcrypt from "bcryptjs";
import { prisma } from "@rebuildyourlife/database";
import { NotFoundError, UnauthorizedError, AppError } from "../middleware/errorHandler.js";

const SALT_ROUNDS = 12;

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      subscriptionTier: true,
      onboardingCompleted: true,
      openaiKey: true,
      isEmailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("Gebruiker");
  }

  return {
    ...user,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  openaiKey?: string | null;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("Gebruiker");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
      ...(input.openaiKey !== undefined && { openaiKey: input.openaiKey }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      subscriptionTier: true,
      onboardingCompleted: true,
      openaiKey: true,
      createdAt: true,
    },
  });

  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  };
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("Gebruiker");
  }

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError("Huidig wachtwoord is onjuist.");
  }

  if (input.currentPassword === input.newPassword) {
    throw new AppError(
      "Het nieuwe wachtwoord mag niet hetzelfde zijn als het huidige.",
      400,
      "SAME_PASSWORD",
    );
  }

  const newHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  // Invalidate all sessions except current
  await prisma.session.deleteMany({
    where: { userId },
  });
}

export async function deleteAccount(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("Gebruiker");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError("Wachtwoord is onjuist. Account niet verwijderd.");
  }

  // Cascade delete handles all related records
  await prisma.user.delete({ where: { id: userId } });
}

export async function getDashboardStats(userId: string) {
  const activeGoals = await prisma.goal.count({
    where: { userId, status: "IN_PROGRESS" }
  });

  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonthDate = new Date(`${currentMonthStr}-01T00:00:00Z`);
  const budget = await prisma.budget.findFirst({
    where: { userId, month: currentMonthDate }
  });

  const totalDebtRes = await prisma.debt.aggregate({
    where: { userId },
    _sum: { currentBalance: true }
  });

  const tasksDue = await prisma.task.count({
    where: { userId, status: { in: ["PENDING", "IN_PROGRESS"] } }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasksDueToday = await prisma.task.count({
    where: { 
      userId, 
      status: "PENDING",
      dueDate: { gte: today, lt: tomorrow }
    }
  });

  const tasksOverdue = await prisma.task.count({
    where: { 
      userId, 
      status: "PENDING",
      dueDate: { lt: today }
    }
  });

  const activePrograms = await prisma.rebuildProgram.count({
    where: { userId, isActive: true }
  });

  return {
    activeGoals,
    monthlyBudget: budget?.totalIncome || 0,
    totalDebt: totalDebtRes._sum.currentBalance || 0,
    tasksDue,
    goalsCompletedThisMonth: 0,
    debtPaidThisMonth: 0,
    completedGoals: 0,
    monthlyBudgetBalance: 0,
    tasksDueToday,
    tasksOverdue,
    activePrograms
  };
}

export async function getDashboardActivities(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { userId, status: "COMPLETED", completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    take: 3
  });

  const messages = await prisma.aIMessage.findMany({
    where: { 
      conversation: { userId },
      role: "assistant"
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { conversation: true }
  });

  const activities: any[] = [];
  
  tasks.forEach(t => {
    activities.push({
      id: `task-${t.id}`,
      userId,
      type: 'task_completed',
      title: 'Taak Voltooid',
      description: `Je hebt de taak "${t.title}" afgerond.`,
      createdAt: t.completedAt!.toISOString()
    });
  });

  messages.forEach(m => {
    activities.push({
      id: `msg-${m.id}`,
      userId,
      type: 'ai_interaction',
      title: 'Sessie met AI Coworker',
      description: `Je had een sessie met de ${m.conversation.agentType} AI.`,
      createdAt: m.createdAt.toISOString()
    });
  });

  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return activities.slice(0, 5);
}
