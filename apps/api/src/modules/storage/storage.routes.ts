import { Router } from 'express';
import { StorageController } from './storage.controller.js';

const router = Router();

// /api/v1/storage/upload
router.post('/upload', StorageController.upload);

export default router;
