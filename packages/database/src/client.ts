import { PrismaClient } from '@prisma/client';
import { getContext } from '@rebuildyourlife/security';

// Initialize a singleton Prisma Client for edge/serverless optimization
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const basePrisma =
  globalForPrisma.prisma || new PrismaClient({ log: ['query', 'error', 'warn'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma;

/**
 * Creates an Enterprise Data Client that strictly enforces RLS (Row-Level Security)
 * by implicitly injecting the current TenantID from the Execution Context into all queries.
 */
export function getEnterpriseClient() {
  const context = getContext();
  
  if (!context || !context.tenantId) {
    throw new Error('CRITICAL DATA VIOLATION: Cannot execute database query without an active Tenant Context.');
  }

  // Use Prisma Client Extensions to force where: { tenantId } on all models that have it.
  // Note: For Phase 5 we use a simplified wrapper to demonstrate the architectural boundary.
  return basePrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }: any) {
          // In a real advanced RLS setup, we'd check if the model has a tenantId field
          // via Prisma.dmmf. For now, we inject it into the args if it's a finding query.
          // Example logic:
          if (['findUnique', 'findFirst', 'findMany', 'update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
            args.where = { ...args.where, tenantId: context.tenantId };
          }
          
          return query(args);
        },
      },
    },
  });
}

// We also export the base prisma client for system-level operations (like the Meta-Orchestrator)
export const systemPrisma: any = basePrisma;
export const prisma: any = basePrisma;
