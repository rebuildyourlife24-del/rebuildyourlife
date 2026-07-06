import { Router } from 'express';
import { CostIntelligenceController } from './cost-intelligence.controller.js';

const router = Router();

// /api/v1/cost-intelligence/kill-switch
router.post('/kill-switch', CostIntelligenceController.triggerKillSwitch);

export default router;
