import { Router } from 'express';
import { IdentityController } from './identity.controller.js';

const router = Router();

// /api/v1/identity/organizations
router.post('/organizations', IdentityController.createOrganization);

// /api/v1/identity/organizations/:id/workspaces
router.post('/organizations/:organizationId/workspaces', IdentityController.createWorkspace);

export default router;
