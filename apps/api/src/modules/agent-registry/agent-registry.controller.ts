import { Request, Response } from 'express';
import { AgentRegistryService } from './agent-registry.service.js';

export class AgentRegistryController {
  
  static async register(req: Request, res: Response) {
    try {
      const { workspaceId, userId, name, description, systemPrompt, capabilities } = req.body;

      if (!workspaceId || !name || !systemPrompt) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing workspaceId, name, or systemPrompt',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await AgentRegistryService.registerAgent({
        workspaceId,
        userId,
        name,
        description,
        systemPrompt,
        capabilities: capabilities || [],
        correlationId: req.correlationId
      });
      
      res.status(201).json({
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
