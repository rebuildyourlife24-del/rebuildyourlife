import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditService {
  /**
   * Logs a critical action to the database immutably.
   * This is an internal API function called by other services in the monolith.
   */
  static async logAction(data: {
    userId?: string;
    workspaceId?: string;
    organizationId?: string;
    action: string;
    resource: string;
    details: any;
    correlationId: string;
  }) {
    // Note: Since Prisma doesn't have an explicit Audit table in the current v1 schema,
    // we would write this to a dedicated Audit log table. For now, we simulate the logger.
    // In a real-world scenario we do: await prisma.auditLog.create({ data })

    console.log(`[AUDIT LOG] [${data.correlationId}] ${data.action} on ${data.resource}`);
    console.log(`Details:`, JSON.stringify(data.details));

    // TODO: Write to `AuditLog` table once it is added to `schema.prisma`.
  }
}
