import { Request, Response } from 'express';
import { AiRuntimeService } from './ai-runtime.service.js';

export class AiRuntimeController {
  
  static async execute(req: Request, res: Response) {
    try {
      const { workspaceId, agentId, prompt } = req.body;

      if (!workspaceId || !agentId || !prompt) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing workspaceId, agentId, or prompt',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await AiRuntimeService.executeTask({
        workspaceId,
        agentId,
        prompt,
        correlationId: req.correlationId
      });
      
      res.status(200).json({
        data: result,
        correlationId: req.correlationId
      });

    } catch (error: any) {
      res.status(500).json({
        error: {
          code: error.message === 'INSUFFICIENT_FUNDS' ? 'payment_required' : 'internal_error',
          message: error.message,
          correlationId: req.correlationId,
          retryable: true
        }
      });
    }
  }
}
