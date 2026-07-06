import { Router } from 'express';
import { WorkflowController } from './workflow.controller.js';

const router = Router();

// /api/v1/workflows/trigger
router.post('/trigger', WorkflowController.trigger);

export default router;
