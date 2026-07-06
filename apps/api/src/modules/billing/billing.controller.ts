import { Request, Response } from 'express';
import { BillingService } from './billing.service.js';

export class BillingController {
  
  static async creditWallet(req: Request, res: Response) {
    try {
      const { workspaceId, amount, currency, description } = req.body;
      const idempotencyKey = req.headers['idempotency-key'] as string;

      if (!workspaceId || !amount || !currency || !idempotencyKey) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields: workspaceId, amount, currency, or Idempotency-Key header',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const ledgerEntry = await BillingService.creditWallet({
        workspaceId,
        amount,
        currency,
        description: description || 'Manual Credit',
        idempotencyKey,
        correlationId: req.correlationId
      });
      
      res.status(201).json({
        data: ledgerEntry,
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
