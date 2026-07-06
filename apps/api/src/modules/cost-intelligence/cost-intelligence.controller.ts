import { Request, Response } from 'express';
import { CostIntelligenceService } from './cost-intelligence.service.js';

export class CostIntelligenceController {
  
  static async triggerKillSwitch(req: Request, res: Response) {
    try {
      const { workspaceId, reason, costAtKill, agentId } = req.body;

      if (!workspaceId || !reason) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields: workspaceId, reason',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await CostIntelligenceService.triggerKillSwitch({
        workspaceId,
        reason,
        costAtKill: costAtKill || 0,
        agentId,
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
