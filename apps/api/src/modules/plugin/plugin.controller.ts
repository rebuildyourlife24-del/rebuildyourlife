import { Request, Response } from 'express';
import { PluginService } from './plugin.service.js';

export class PluginController {
  
  static async connect(req: Request, res: Response) {
    try {
      const { workspaceId, userId, pluginName, authCredentials } = req.body;

      if (!workspaceId || !userId || !pluginName || !authCredentials) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Missing required fields',
            correlationId: req.correlationId,
            retryable: false
          }
        });
      }

      const result = await PluginService.connectPlugin({
        workspaceId,
        userId,
        pluginName,
        authCredentials,
        correlationId: req.correlationId
      });
      
      res.status(201).json({
        data: result,
        correlationId: req.correlationId
      });

    } catch (error: any) {
      res.status(500).json({
        error: {
          code: error.message === 'UNSUPPORTED_PLUGIN' ? 'bad_request' : 'internal_error',
          message: error.message,
          correlationId: req.correlationId,
          retryable: true
        }
      });
    }
  }
}
