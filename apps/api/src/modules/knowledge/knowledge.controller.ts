import { Request, Response } from 'express';
import { KnowledgeService } from './knowledge.service.js';

export class KnowledgeController {
  
  static async ingest(req: Request, res: Response) {
    try {
      const { workspaceId, fileId, content } = req.body;

      if (!workspaceId || !fileId || !content) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields: workspaceId, fileId, content',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await KnowledgeService.ingestDocument({
        workspaceId,
        fileId,
        content,
        correlationId: req.correlationId
      });
      
      res.status(200).json({
        data: result,
        correlationId: req.correlationId
      });

    } catch (error: any) {
      res.status(500).json({
        error: {
          code: 'internal_error',
          message: error.message,
          correlationId: req.correlationId,
          retryable: true
        }
      });
    }
  }
}
