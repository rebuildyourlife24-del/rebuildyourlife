import { Request, Response } from 'express';
import { WorkflowService } from './workflow.service.js';

export class WorkflowController {
  
  static async trigger(req: Request, res: Response) {
    try {
      const { workspaceId, workflowId, payload } = req.body;

      if (!workspaceId || !workflowId) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing workspaceId or workflowId',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await WorkflowService.triggerWorkflow({
        workspaceId,
        workflowId,
        payload,
        correlationId: req.correlationId
      });
      
      res.status(202).json({
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
