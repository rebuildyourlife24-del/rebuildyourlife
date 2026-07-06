import { AuditService } from '../audit/audit.service.js';
import { BillingService } from '../billing/billing.service.js';
import { AgentRegistryService } from '../agent-registry/agent-registry.service.js';
import { KnowledgeService } from '../knowledge/knowledge.service.js';
import { CostIntelligenceService } from '../cost-intelligence/cost-intelligence.service.js';
import { AgentSandboxService, SandboxConfig } from './sandbox.service.js';

export class AiRuntimeService {
  /**
   * Executes an AI Agent task. This orchestrates all Modular Monolith domains.
   */
  static async executeTask(data: {
    workspaceId: string;
    agentId: string;
    prompt: string;
    correlationId: string;
  }) {
    console.log(`[AI-Runtime] Initiating task for Agent ${data.agentId}`);

    // 1. Fetch Agent Definition
    const agent = await AgentRegistryService.getAgent(data.agentId);

    // 2. Cost Intelligence (D0.5) - Enforce Budget & Kill Switch
    const estimatedTokens = 1500;
    await CostIntelligenceService.enforceBudget({
      workspaceId: data.workspaceId,
      estimatedCost: (estimatedTokens / 1000) * 0.03, // approx cost
      correlationId: data.correlationId
    });

    // 3. Fetch RAG Context
    const context = await KnowledgeService.searchContext({
      workspaceId: data.workspaceId,
      query: data.prompt,
      limit: 3,
      correlationId: data.correlationId
    });

    // 4. Sandbox Isolation (D0.4)
    const sandboxConfig: SandboxConfig = {
      workspaceId: data.workspaceId,
      agentId: data.agentId,
      maxMemoryBytes: 512 * 1024 * 1024, // 512MB limit
      maxDurationMs: 30000, // 30s timeout
      allowedTools: agent.capabilities,
      correlationId: data.correlationId
    };

    const simulatedResponse = await AgentSandboxService.executeInSandbox(sandboxConfig, async () => {
      // Inside Sandbox: The Agent attempts to use a tool
      AgentSandboxService.authorizeToolUsage(sandboxConfig, 'slack'); // Fails if not in allowedTools

      // LLM execution happens here...
      return `[Sandboxed Output] Task completed. Context used: ${context.length} docs.`;
    });

    // 5. Finalize Billing
    await BillingService.deductTokens({
      workspaceId: data.workspaceId,
      tokenCount: estimatedTokens,
      model: 'gpt-4',
      idempotencyKey: `ai_exec_${Date.now()}`,
      correlationId: data.correlationId
    });

    // 6. Audit
    await AuditService.logAction({
      correlationId: data.correlationId,
      action: 'AI_TASK_EXECUTED',
      resource: 'AiRuntimeService',
      workspaceId: data.workspaceId,
      details: { agentId: data.agentId, tokens: estimatedTokens, status: 'SUCCESS' }
    });

    return {
      status: 'SUCCESS',
      output: simulatedResponse,
      tokensUsed: estimatedTokens
    };
  }
}
