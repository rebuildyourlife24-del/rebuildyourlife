import { Request, Response, NextFunction } from 'express';
import { Logger } from '../observability/logger.js';

export const requirePermission = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // In a real app, `req.user` is populated by an Auth Middleware (e.g. JWT verification)
    const userRole = (req as any).user?.role || 'GUEST';

    const roleHierarchy: Record<string, number> = {
      'GUEST': 0,
      'VIEWER': 1,
      'EDITOR': 2,
      'ADMIN': 3,
      'SUPERADMIN': 4
    };

    const userLevel = roleHierarchy[userRole] ?? 0;
    const requiredLevel = roleHierarchy[requiredRole] ?? 99;

    if (userLevel < requiredLevel) {
      Logger.warn(`[RBAC] Access denied for role ${userRole}. Requires ${requiredRole}`, { path: req.path });
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. Requires role: ${requiredRole}`,
          correlationId: (req as any).correlationId
        }
      });
    }

    next();
  };
};

export const requireTenantIsolation = (req: Request, res: Response, next: NextFunction) => {
  const reqWorkspaceId = req.headers['x-workspace-id'];
  const userWorkspaces = (req as any).user?.workspaces || [];

  if (!reqWorkspaceId || !userWorkspaces.includes(reqWorkspaceId)) {
    Logger.error(`[Security] Tenant Isolation Violation attempt. User has no access to workspace ${reqWorkspaceId}`);
    return res.status(403).json({
      error: {
        code: 'TENANT_ISOLATION_VIOLATION',
        message: 'You do not have access to this workspace context.',
        correlationId: (req as any).correlationId
      }
    });
  }

  next();
};
