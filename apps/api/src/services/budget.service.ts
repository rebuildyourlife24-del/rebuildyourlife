import { prisma } from "@rebuildyourlife/database";
import { Decimal } from "@prisma/client/runtime/library";
import { NotFoundError, ForbiddenError } from "../middleware/errorHandler.js";

export interface CreateBudgetInput {
  month: string; // ISO date string, e.g. "2026-06-01"
  totalIncome: number;
  totalExpenses: number;
  savingsTarget: number;
  categories?: CreateCategoryInput[];
}

export interface CreateCategoryInput {
  name: string;
  planned: number;
  actual?: number;
}

export interface UpdateBudgetInput {
  totalIncome?: number;
  totalExpenses?: number;
  savingsTarget?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  planned?: number;
  actual?: number;
}

function toNumber(val: Decimal | number): number {
  return typeof val === "number" ? val : Number(val);
}

export async function createBudget(userId: string, input: CreateBudgetInput) {
  const monthDate = new Date(input.month);

  const budget = await prisma.budget.create({
    data: {
      userId,
      month: monthDate,
      totalIncome: input.totalIncome,
      totalExpenses: input.totalExpenses,
      savingsTarget: input.savingsTarget,
      categories: input.categories
        ? {
            create: input.categories.map((c) => ({
              name: c.name,
              planned: c.planned,
              actual: c.actual ?? 0,
            })),
          }
        : undefined,
    },
    include: { categories: true },
  });

  return formatBudget(budget);
}

export async function getBudgets(userId: string) {
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { categories: true },
    orderBy: { month: "desc" },
  });

  return budgets.map(formatBudget);
}

export async function getBudgetById(userId: string, budgetId: string) {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: { categories: true },
  });

  if (!budget) throw new NotFoundError("Budget");
  if (budget.userId !== userId) throw new ForbiddenError();

  return formatBudget(budget);
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  input: UpdateBudgetInput,
) {
  const existing = await prisma.budget.findUnique({ where: { id: budgetId } });
  if (!existing) throw new NotFoundError("Budget");
  if (existing.userId !== userId) throw new ForbiddenError();

  const budget = await prisma.budget.update({
    where: { id: budgetId },
    data: {
      ...(input.totalIncome !== undefined && { totalIncome: input.totalIncome }),
      ...(input.totalExpenses !== undefined && {
        totalExpenses: input.totalExpenses,
      }),
      ...(input.savingsTarget !== undefined && {
        savingsTarget: input.savingsTarget,
      }),
    },
    include: { categories: true },
  });

  return formatBudget(budget);
}

export async function deleteBudget(userId: string, budgetId: string) {
  const existing = await prisma.budget.findUnique({ where: { id: budgetId } });
  if (!existing) throw new NotFoundError("Budget");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.budget.delete({ where: { id: budgetId } });
}

export async function addCategory(
  userId: string,
  budgetId: string,
  input: CreateCategoryInput,
) {
  const budget = await prisma.budget.findUnique({ where: { id: budgetId } });
  if (!budget) throw new NotFoundError("Budget");
  if (budget.userId !== userId) throw new ForbiddenError();

  const category = await prisma.budgetCategory.create({
    data: {
      budgetId,
      name: input.name,
      planned: input.planned,
      actual: input.actual ?? 0,
    },
  });

  return {
    id: category.id,
    name: category.name,
    planned: toNumber(category.planned),
    actual: toNumber(category.actual),
  };
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  input: UpdateCategoryInput,
) {
  const category = await prisma.budgetCategory.findUnique({
    where: { id: categoryId },
    include: { budget: true },
  });

  if (!category) throw new NotFoundError("Budgetcategorie");
  if (category.budget.userId !== userId) throw new ForbiddenError();

  const updated = await prisma.budgetCategory.update({
    where: { id: categoryId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.planned !== undefined && { planned: input.planned }),
      ...(input.actual !== undefined && { actual: input.actual }),
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    planned: toNumber(updated.planned),
    actual: toNumber(updated.actual),
  };
}

export async function deleteCategory(userId: string, categoryId: string) {
  const category = await prisma.budgetCategory.findUnique({
    where: { id: categoryId },
    include: { budget: true },
  });

  if (!category) throw new NotFoundError("Budgetcategorie");
  if (category.budget.userId !== userId) throw new ForbiddenError();

  await prisma.budgetCategory.delete({ where: { id: categoryId } });
}

export async function getMonthlySummary(userId: string, monthStr: string) {
  // monthStr format: "2026-06" → parse to start of month
  const [year, month] = monthStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const budget = await prisma.budget.findFirst({
    where: {
      userId,
      month: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: { categories: true },
  });

  if (!budget) {
    return {
      month: monthStr,
      hasBudget: false,
      totalIncome: 0,
      totalExpenses: 0,
      savingsTarget: 0,
      totalPlanned: 0,
      totalActual: 0,
      balance: 0,
      categories: [],
    };
  }

  const totalPlanned = budget.categories.reduce(
    (sum, c) => sum + toNumber(c.planned),
    0,
  );
  const totalActual = budget.categories.reduce(
    (sum, c) => sum + toNumber(c.actual),
    0,
  );

  return {
    month: monthStr,
    hasBudget: true,
    totalIncome: toNumber(budget.totalIncome),
    totalExpenses: toNumber(budget.totalExpenses),
    savingsTarget: toNumber(budget.savingsTarget),
    totalPlanned,
    totalActual,
    balance: toNumber(budget.totalIncome) - totalActual,
    categories: budget.categories.map((c) => ({
      id: c.id,
      name: c.name,
      planned: toNumber(c.planned),
      actual: toNumber(c.actual),
      remaining: toNumber(c.planned) - toNumber(c.actual),
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatBudget(budget: any) {
  return {
    id: budget.id,
    month: budget.month.toISOString().slice(0, 10),
    totalIncome: toNumber(budget.totalIncome),
    totalExpenses: toNumber(budget.totalExpenses),
    savingsTarget: toNumber(budget.savingsTarget),
    categories: budget.categories?.map((c: any) => ({
      id: c.id,
      name: c.name,
      planned: toNumber(c.planned),
      actual: toNumber(c.actual),
    })) ?? [],
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}
