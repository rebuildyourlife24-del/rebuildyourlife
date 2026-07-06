import { Router } from 'express';
import { KnowledgeController } from './knowledge.controller.js';

const router = Router();

// /api/v1/knowledge/ingest
router.post('/ingest', KnowledgeController.ingest);

export default router;
