import { Request, Response } from 'express';
import { StorageService } from './storage.service.js';

export class StorageController {
  
  static async upload(req: Request, res: Response) {
    try {
      const { workspaceId, userId } = req.body;
      const file = (req as any).file; // Assuming multer or similar middleware is used

      if (!workspaceId || !userId || !file) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields or file payload.',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await StorageService.uploadFile({
        workspaceId,
        userId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        buffer: file.buffer,
        correlationId: req.correlationId
      });
      
      res.status(201).json({
        data: result,
        correlationId: req.correlationId
      });

    } catch (error: any) {
      res.status(500).json({
        error: {
          code: error.message === 'FILE_TOO_LARGE' ? 'payload_too_large' : 'internal_error',
          message: error.message,
          correlationId: req.correlationId,
          retryable: true
        }
      });
    }
  }
}
