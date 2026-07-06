import { Router } from 'express';
import { EventBusController } from './event-bus.controller.js';

const router = Router();

// /api/v1/event-bus/webhook
router.post('/webhook', EventBusController.handleExternalWebhook);

export default router;
