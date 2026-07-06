import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * IdentityService
 * Responsibilities: Managing Organizations, Workspaces, and RBAC.
 */
export class IdentityService {
  /**
   * Creates a new organization and implicitly makes the creator the OWNER.
   */
  static async createOrganization(data: { name: string; slug: string; creatorUserId: string }) {
    const org = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        members: {
          create: {
            userId: data.creatorUserId,
            role: 'OWNER'
          }
        }
      }
    });

    // TODO: Emit Event `identity.organization.created` to Kafka/EventBus
    return org;
  }

  /**
   * Creates a workspace within an organization.
   */
  static async createWorkspace(data: { organizationId: string; name: string; slug: string; creatorUserId: string }) {
    // 1. Verify creator is part of organization and has permissions
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: data.organizationId, userId: data.creatorUserId } }
    });

    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new Error('UNAUTHORIZED: Only Admins or Owners can create workspaces.');
    }

    // 2. Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        organizationId: data.organizationId,
        members: {
          create: {
            userId: data.creatorUserId,
            role: 'ADMIN'
          }
        }
      }
    });

    // TODO: Emit Event `identity.workspace.created`
    return workspace;
  }

  /**
   * Checks if a user has a specific permission in a workspace.
   * This is the internal API used by other modules (e.g. Billing) to authorize actions.
   */
  static async checkPermission(userId: string, workspaceId: string, action: string, resource: string): Promise<boolean> {
    // 1. Check if user is workspace member
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } }
    });

    if (!member) return false;
    
    if (member.role === 'ADMIN') return true; // Admins have all permissions

    // 2. Resolve Role -> Permissions (Normally cached in Redis!)
    // For now, doing direct DB lookup
    const role = await prisma.role.findUnique({
      where: { name: member.role },
      include: { permissions: { include: { permission: true } } }
    });

    if (!role) return false;

    const hasPerm = role.permissions.some(rp => rp.permission.action === action && rp.permission.resource === resource);
    return hasPerm;
  }
}
