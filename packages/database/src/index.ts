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
  // Core
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
  PasswordResetToken,
  ApiKey,
  HealthLog,
  SocialContact,
  BusinessClient,
  BusinessInvoice,

  // Enterprise Documents
  EnterpriseFolder,
  EnterpriseDocument,

  // Orion Memory & Analytics
  OrionMemory,
  RevenueSnapshot,
  AnalyticsCache,

  // Agent Systems (Phase 2+)
  AgentAction,
  AgentBudget,
  VirtualCard,

  // Social Engine (Phase 3+)
  SocialPlatformIntegration,
  SocialCampaign,
  SystemHealthLog,

  // Banking (Phase 6)
  BankConnection,
  FinancialTransaction,

  // Swarm (Phase 3)
  AgentDossier,
  ShopifyStore,
  ShopifyProduct,
  SocialMediaPost,
  InterceptionAlert,

  // Wealth & Tax (Phase 3+)
  TreasuryVault,
  TaxStrategy,

  // Debt Negotiator (Phase 7)
  CreditorDossier,
  LegalContact,
  JusticeLedger,

  // AI Concierge (Phase 8)
  GoalDossier,
  EmergencyRequest,
  AIConciergeLog,

  // Opportunity Engine (Phase 9)
  OpportunityReport,
  OpportunityMedia,

  // Marketing
  MarketingCampaign,
  MarketingClick,
  MarketingConversion,

  // Webhooks
  WebhookEvent,
} from "@prisma/client";
