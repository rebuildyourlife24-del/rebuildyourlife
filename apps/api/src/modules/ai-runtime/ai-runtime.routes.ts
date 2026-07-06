import { Router } from 'express';
import { AiRuntimeController } from './ai-runtime.controller.js';

const router = Router();

// /api/v1/ai-runtime/execute
router.post('/execute', AiRuntimeController.execute);

export default router;
