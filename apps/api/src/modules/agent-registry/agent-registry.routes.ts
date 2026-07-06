import { Router } from 'express';
import { AgentRegistryController } from './agent-registry.controller.js';

const router = Router();

// /api/v1/agents/register
router.post('/register', AgentRegistryController.register);

export default router;
