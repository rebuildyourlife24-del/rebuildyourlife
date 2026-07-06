import { Router } from 'express';
import { PluginController } from './plugin.controller.js';

const router = Router();

// /api/v1/plugins/connect
router.post('/connect', PluginController.connect);

export default router;
