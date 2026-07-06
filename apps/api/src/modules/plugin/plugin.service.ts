import { AuditService } from '../audit/audit.service.js';

export class PluginService {
  /**
   * Registers a 3rd party plugin (e.g., Slack, Shopify) for a Workspace.
   */
  static async connectPlugin(data: {
    workspaceId: string;
    userId: string;
    pluginName: string;
    authCredentials: string; // usually an encrypted OAuth token
    correlationId: string;
  }) {
    console.log(`[Plugin] Connecting ${data.pluginName} for Workspace ${data.workspaceId}`);

    // 1. Validate Plugin Type & Verify Token against provider
    if (!['slack', 'shopify', 'hubspot', 'gmail'].includes(data.pluginName)) {
      throw new Error('UNSUPPORTED_PLUGIN');
    }

    // 2. Encrypt and store credentials (simulate DB insert)
    // await prisma.apiIntegration.create(...)
    
    // 3. Audit Log
    await AuditService.logAction({
      correlationId: data.correlationId,
      action: 'PLUGIN_CONNECTED',
      resource: 'PluginService',
      workspaceId: data.workspaceId,
      userId: data.userId,
      details: { pluginName: data.pluginName }
    });

    return {
      status: 'CONNECTED',
      pluginName: data.pluginName
    };
  }

  /**
   * Disconnects a plugin.
   */
  static async disconnectPlugin(workspaceId: string, pluginName: string, userId: string, correlationId: string) {
    // await prisma.apiIntegration.delete(...)
    
    await AuditService.logAction({
      correlationId,
      action: 'PLUGIN_DISCONNECTED',
      resource: 'PluginService',
      workspaceId,
      userId,
      details: { pluginName }
    });

    return { status: 'DISCONNECTED' };
  }
}
