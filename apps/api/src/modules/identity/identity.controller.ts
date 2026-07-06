import { Request, Response } from 'express';
import { IdentityService } from './identity.service.js';

export class IdentityController {
  
  static async createOrganization(req: Request, res: Response) {
    try {
      const { name, slug, creatorUserId } = req.body;
      
      // Basic Input Validation
      if (!name || !slug || !creatorUserId) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields: name, slug, creatorUserId',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const org = await IdentityService.createOrganization({ name, slug, creatorUserId });
      
      res.status(201).json({
        data: org,
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

  static async createWorkspace(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const { name, slug, creatorUserId } = req.body;

      if (!name || !slug || !creatorUserId) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields: name, slug, creatorUserId',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const workspace = await IdentityService.createWorkspace({ organizationId, name, slug, creatorUserId });
      
      res.status(201).json({
        data: workspace,
        correlationId: req.correlationId
      });

    } catch (error: any) {
      if (error.message.includes('UNAUTHORIZED')) {
        return res.status(403).json({
          error: {
            code: 'forbidden',
            message: error.message,
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

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
