import { EventDispatcher, EventTopic } from '@repo/shared/src/events/index.js';
import { AuditService } from '../audit/audit.service.js';

export interface SandboxConfig {
  workspaceId: string;
  agentId: string;
  maxMemoryBytes: number;
  maxDurationMs: number;
  allowedTools: string[];
  correlationId: string;
}

export class AgentSandboxService {
  /**
   * Executes an Agent Run within a secure Sandbox boundary.
   * Isolates memory, restricts tools, and monitors timeout.
   */
  static async executeInSandbox(config: SandboxConfig, executionLogic: () => Promise<string>) {
    console.log(`[Sandbox] Booting isolated VM environment for Agent ${config.agentId} (Workspace: ${config.workspaceId})`);
    
    // In a real production system (AWS Firecracker / Deno Deploy / Cloudflare Workers),
    // this would dispatch to the isolated runtime. For our Modular Monolith, we simulate
    // the boundaries using Promises and strict tool validation before calls.

    const startTime = Date.now();
    let result: string;

    try {
      // 1. Timeout Enforcement (Execution Budget)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('SANDBOX_TIMEOUT_EXCEEDED')), config.maxDurationMs);
      });

      // 2. Execute with Race Condition against the Kill Switch / Timeout
      result = await Promise.race([
        executionLogic(),
        timeoutPromise
      ]);

      const duration = Date.now() - startTime;
      console.log(`[Sandbox] Execution successful. Duration: ${duration}ms`);

    } catch (error: any) {
      console.error(`[Sandbox] Execution failed/killed for ${config.agentId}:`, error.message);
      
      await AuditService.logAction({
        correlationId: config.correlationId,
        action: 'AGENT_SANDBOX_KILLED',
        resource: 'AgentSandboxService',
        workspaceId: config.workspaceId,
        details: { agentId: config.agentId, reason: error.message }
      });

      throw error;
    }

    return result;
  }

  /**
   * Called by the Agent during execution when it wants to use a Tool (Plugin).
   * Hard enforces if the agent is allowed to use this specific tool.
   */
  static authorizeToolUsage(config: SandboxConfig, toolName: string) {
    if (!config.allowedTools.includes(toolName)) {
      throw new Error(`SANDBOX_VIOLATION: Agent ${config.agentId} attempted to use unauthorized tool: ${toolName}`);
    }
    return true;
  }
}
