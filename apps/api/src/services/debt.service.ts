import { prisma } from "@rebuildyourlife/database";
import { DebtStatus } from "@rebuildyourlife/shared";
import { Decimal } from "@prisma/client/runtime/library";
import { MAX_DEBTS_PER_USER } from "@rebuildyourlife/shared";
import {
  NotFoundError,
  ForbiddenError,
  AppError,
} from "../middleware/errorHandler.js";

function toNumber(val: Decimal | number): number {
  return typeof val === "number" ? val : Number(val);
}

export interface CreateDebtInput {
  creditorName: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  monthlyPayment: number;
  dueDate?: string;
  notes?: string;
  priority?: number;
}

export interface UpdateDebtInput {
  creditorName?: string;
  currentBalance?: number;
  interestRate?: number;
  minimumPayment?: number;
  monthlyPayment?: number;
  dueDate?: string | null;
  status?: DebtStatus;
  notes?: string | null;
  priority?: number;
}

export interface AddPaymentInput {
  amount: number;
  paidAt?: string;
  notes?: string;
}

export async function createDebt(userId: string, input: CreateDebtInput) {
  const count = await prisma.debt.count({ where: { userId } });
  if (count >= MAX_DEBTS_PER_USER) {
    throw new AppError(
      `Je hebt het maximum van ${MAX_DEBTS_PER_USER} schulden bereikt.`,
      400,
      "DEBT_LIMIT_REACHED",
    );
  }

  const debt = await prisma.debt.create({
    data: {
      userId,
      creditorName: input.creditorName,
      originalAmount: input.originalAmount,
      currentBalance: input.currentBalance,
      interestRate: input.interestRate,
      minimumPayment: input.minimumPayment,
      monthlyPayment: input.monthlyPayment,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      notes: input.notes ?? null,
      priority: input.priority ?? 0,
    },
  });

  return formatDebt(debt);
}

export async function getDebts(userId: string) {
  const debts = await prisma.debt.findMany({
    where: { userId },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return debts.map(formatDebt);
}

export async function getDebtById(userId: string, debtId: string) {
  const debt = await prisma.debt.findUnique({
    where: { id: debtId },
    include: {
      payments: { orderBy: { paidAt: "desc" }, take: 50 },
    },
  });

  if (!debt) throw new NotFoundError("Schuld");
  if (debt.userId !== userId) throw new ForbiddenError();

  return {
    ...formatDebt(debt),
    payments: debt.payments.map(formatPayment),
  };
}

export async function updateDebt(
  userId: string,
  debtId: string,
  input: UpdateDebtInput,
) {
  const existing = await prisma.debt.findUnique({ where: { id: debtId } });
  if (!existing) throw new NotFoundError("Schuld");
  if (existing.userId !== userId) throw new ForbiddenError();

  const debt = await prisma.debt.update({
    where: { id: debtId },
    data: {
      ...(input.creditorName !== undefined && {
        creditorName: input.creditorName,
      }),
      ...(input.currentBalance !== undefined && {
        currentBalance: input.currentBalance,
      }),
      ...(input.interestRate !== undefined && {
        interestRate: input.interestRate,
      }),
      ...(input.minimumPayment !== undefined && {
        minimumPayment: input.minimumPayment,
      }),
      ...(input.monthlyPayment !== undefined && {
        monthlyPayment: input.monthlyPayment,
      }),
      ...(input.dueDate !== undefined && {
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.priority !== undefined && { priority: input.priority }),
    },
  });

  return formatDebt(debt);
}

export async function deleteDebt(userId: string, debtId: string) {
  const existing = await prisma.debt.findUnique({ where: { id: debtId } });
  if (!existing) throw new NotFoundError("Schuld");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.debt.delete({ where: { id: debtId } });
}

export async function addPayment(
  userId: string,
  debtId: string,
  input: AddPaymentInput,
) {
  const debt = await prisma.debt.findUnique({ where: { id: debtId } });
  if (!debt) throw new NotFoundError("Schuld");
  if (debt.userId !== userId) throw new ForbiddenError();

  const payment = await prisma.debtPayment.create({
    data: {
      debtId,
      amount: input.amount,
      paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
      notes: input.notes ?? null,
    },
  });

  // Update current balance
  const newBalance = Math.max(0, toNumber(debt.currentBalance) - input.amount);
  const isSettled = newBalance <= 0;

  await prisma.debt.update({
    where: { id: debtId },
    data: {
      currentBalance: newBalance,
      ...(isSettled && { status: "SETTLED" as DebtStatus }),
    },
  });

  return formatPayment(payment);
}

export async function getPaymentHistory(
  userId: string,
  debtId: string,
  page = 1,
  pageSize = 20,
) {
  const debt = await prisma.debt.findUnique({ where: { id: debtId } });
  if (!debt) throw new NotFoundError("Schuld");
  if (debt.userId !== userId) throw new ForbiddenError();

  const skip = (page - 1) * pageSize;

  const [payments, total] = await Promise.all([
    prisma.debtPayment.findMany({
      where: { debtId },
      orderBy: { paidAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.debtPayment.count({ where: { debtId } }),
  ]);

  return {
    data: payments.map(formatPayment),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getDebtOverview(userId: string) {
  const debts = await prisma.debt.findMany({
    where: { userId },
    include: {
      payments: true,
    },
  });

  const totalOwed = debts.reduce(
    (sum: any, d: any) => sum + toNumber(d.currentBalance),
    0,
  );
  const totalMonthlyPayments = debts
    .filter((d: any) => d.status === "ACTIVE" || d.status === "PAYMENT_PLAN")
    .reduce((sum: any, d: any) => sum + toNumber(d.monthlyPayment), 0);
  const totalPaid = debts.reduce(
    (sum: any, d: any) =>
      sum + d.payments.reduce((ps: any, p: any) => ps + toNumber(p.amount), 0),
    0,
  );

  const debtsByStatus: Record<string, number> = {};
  for (const status of Object.values(DebtStatus)) {
    debtsByStatus[status] = debts.filter((d: any) => d.status === status).length;
  }

  return {
    totalDebts: debts.length,
    totalOwed: Math.round(totalOwed * 100) / 100,
    totalMonthlyPayments: Math.round(totalMonthlyPayments * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    debtsByStatus,
  };
}

interface DebtForScenario {
  id: string;
  creditorName: string;
  currentBalance: number;
  interestRate: number; // APR as percentage, e.g. 18.5
  minimumPayment: number;
  monthlyPayment: number;
}

interface ScenarioPaymentDetail {
  debtId: string;
  creditorName: string;
  amount: number;
  remainingBalance: number;
}

interface PayoffMonthDetail {
  month: number;
  date: string;
  payments: ScenarioPaymentDetail[];
  totalPaid: number;
  totalRemaining: number;
}

interface PayoffScenarioResult {
  method: "snowball" | "avalanche";
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  monthlyBreakdown: PayoffMonthDetail[];
}

export async function calculatePayoffScenarios(
  userId: string,
  extraPayment = 0,
): Promise<PayoffScenarioResult[]> {
  const debtsRaw = await prisma.debt.findMany({
    where: {
      userId,
      status: { in: ["ACTIVE", "PAYMENT_PLAN"] },
    },
  });

  if (debtsRaw.length === 0) {
    return [];
  }

  const debts: DebtForScenario[] = debtsRaw.map((d: any) => ({
    id: d.id,
    creditorName: d.creditorName,
    currentBalance: toNumber(d.currentBalance),
    interestRate: toNumber(d.interestRate),
    minimumPayment: toNumber(d.minimumPayment),
    monthlyPayment: toNumber(d.monthlyPayment),
  }));

  const snowball = calculatePayoff(
    debts,
    extraPayment,
    "snowball",
  );
  const avalanche = calculatePayoff(
    debts,
    extraPayment,
    "avalanche",
  );

  return [snowball, avalanche];
}

function calculatePayoff(
  debtsInput: DebtForScenario[],
  extraPayment: number,
  method: "snowball" | "avalanche",
): PayoffScenarioResult {
  // Deep clone debts for simulation
  const debts = debtsInput.map((d) => ({ ...d, balance: d.currentBalance }));

  // Sort by method
  if (method === "snowball") {
    debts.sort((a, b) => a.balance - b.balance);
  } else {
    debts.sort((a, b) => b.interestRate - a.interestRate);
  }

  const monthlyBreakdown: PayoffMonthDetail[] = [];
  let totalInterestPaid = 0;
  let totalPaid = 0;
  let monthCount = 0;
  const maxMonths = 360; // 30 year cap
  const now = new Date();

  while (debts.some((d) => d.balance > 0.01) && monthCount < maxMonths) {
    monthCount++;
    const monthDate = new Date(now.getFullYear(), now.getMonth() + monthCount, 1);
    const monthPayments: ScenarioPaymentDetail[] = [];

    // Apply monthly interest to all debts
    for (const debt of debts) {
      if (debt.balance <= 0) continue;
      const monthlyRate = debt.interestRate / 100 / 12;
      const interest = debt.balance * monthlyRate;
      debt.balance += interest;
      totalInterestPaid += interest;
    }

    // Calculate available extra payment (sum of freed-up minimums from paid debts + user extra)
    let availableExtra = extraPayment;
    for (const debt of debts) {
      if (debt.balance <= 0) {
        availableExtra += debt.minimumPayment;
      }
    }

    // Pay minimum on all debts first
    for (const debt of debts) {
      if (debt.balance <= 0) continue;
      const payment = Math.min(debt.minimumPayment, debt.balance);
      debt.balance -= payment;
      totalPaid += payment;

      monthPayments.push({
        debtId: debt.id,
        creditorName: debt.creditorName,
        amount: Math.round(payment * 100) / 100,
        remainingBalance: Math.round(Math.max(0, debt.balance) * 100) / 100,
      });
    }

    // Apply extra payment to focus debt (first in sorted order with balance > 0)
    for (const debt of debts) {
      if (debt.balance <= 0 || availableExtra <= 0) continue;
      const extraPay = Math.min(availableExtra, debt.balance);
      debt.balance -= extraPay;
      totalPaid += extraPay;
      availableExtra -= extraPay;

      // Update the existing payment entry for this debt
      const existing = monthPayments.find((p) => p.debtId === debt.id);
      if (existing) {
        existing.amount =
          Math.round((existing.amount + extraPay) * 100) / 100;
        existing.remainingBalance =
          Math.round(Math.max(0, debt.balance) * 100) / 100;
      }
      break; // Snowball/avalanche focuses extra on one debt at a time
    }

    const totalRemaining = debts.reduce(
      (s, d) => s + Math.max(0, d.balance),
      0,
    );

    monthlyBreakdown.push({
      month: monthCount,
      date: monthDate.toISOString().slice(0, 10),
      payments: monthPayments,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalRemaining: Math.round(totalRemaining * 100) / 100,
    });
  }

  return {
    method,
    totalMonths: monthCount,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    monthlyBreakdown,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDebt(debt: any) {
  return {
    id: debt.id,
    creditorName: debt.creditorName,
    originalAmount: toNumber(debt.originalAmount),
    currentBalance: toNumber(debt.currentBalance),
    interestRate: toNumber(debt.interestRate),
    minimumPayment: toNumber(debt.minimumPayment),
    monthlyPayment: toNumber(debt.monthlyPayment),
    dueDate: debt.dueDate?.toISOString() ?? null,
    status: debt.status,
    notes: debt.notes,
    priority: debt.priority,
    createdAt: debt.createdAt.toISOString(),
    updatedAt: debt.updatedAt.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPayment(payment: any) {
  return {
    id: payment.id,
    amount: toNumber(payment.amount),
    paidAt: payment.paidAt.toISOString(),
    notes: payment.notes,
  };
}
