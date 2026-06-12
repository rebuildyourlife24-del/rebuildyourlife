import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// Singleton PrismaClient
// Prevents multiple instances during hot-reload in development.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ---------------------------------------------------------------------------
// Re-export everything consumers need from Prisma Client
// ---------------------------------------------------------------------------

export { PrismaClient } from "@prisma/client";

export type {
  User,
  Session,
  LifeArea,
  Goal,
  Task,
  Budget,
  BudgetCategory,
  Debt,
  DebtPayment,
  RebuildProgram,
  ProgramMilestone,
  AIConversation,
  AIMessage,
  AIMemory,
  Notification,
  AuditLog,
  FeatureFlag,
} from "@prisma/client";


