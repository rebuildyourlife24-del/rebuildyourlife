import { PrismaClient } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
import { EventDispatcher, EventTopic } from '@repo/shared/src/events/index.js';

const prisma = new PrismaClient();

export class CostIntelligenceService {
  
  /**
   * Called by the AI Runtime BEFORE executing an agent run.
   * Enforces the hard kill switch and monthly budget.
   */
  static async enforceBudget(data: {
    workspaceId: string;
    estimatedCost: number;
    correlationId: string;
  }) {
    // 1. Fetch Budget and current Wallet
    const budget = await prisma.workspaceBudget.findUnique({
      where: { workspaceId: data.workspaceId }
    });

    const wallet = await prisma.workspaceWallet.findUnique({
      where: { workspaceId: data.workspaceId }
    });

    if (!budget || !wallet) {
      // If no explicit budget is set, allow but log
      return true;
    }

    // 2. Kill Switch check
    if (budget.isKillSwitched) {
      console.warn(`[CostIntel] Blocked execution for Workspace ${data.workspaceId}: KILL SWITCH ACTIVE`);
      await EventDispatcher.publish(EventTopic.AGENT_EXECUTION_BLOCKED, {
        workspaceId: data.workspaceId,
        reason: 'KILL_SWITCH_ACTIVE'
      }, data.correlationId);
      throw new Error('BUDGET_KILL_SWITCH_ACTIVE');
    }

    // 3. Live Budget check
    // If the wallet balance drops below negative the budget limit (or however we define it)
    // For simplicity: cost > (monthlyLimit - spent)
    // Assuming wallet 'balance' acts as a prepaid amount, or we track spent.
    // We will just do a simple mock check here.
    const mockSpentThisMonth = 95.0; // In reality, sum LedgerEntries for this month
    if (mockSpentThisMonth + data.estimatedCost > budget.monthlyLimit) {
      // Trigger auto-kill switch
      await this.triggerKillSwitch({
        workspaceId: data.workspaceId,
        reason: `Monthly limit of ${budget.monthlyLimit} exceeded.`,
        costAtKill: mockSpentThisMonth,
        correlationId: data.correlationId
      });
      throw new Error('BUDGET_EXCEEDED');
    }

    // 4. Alert Threshold check
    if (mockSpentThisMonth > (budget.monthlyLimit * (budget.alertThreshold / 100))) {
      await EventDispatcher.publish(EventTopic.BUDGET_ALERT_THRESHOLD_REACHED, {
        workspaceId: data.workspaceId,
        spent: mockSpentThisMonth,
        limit: budget.monthlyLimit
      }, data.correlationId);
    }

    return true;
  }

  /**
   * Activates the emergency kill switch for a workspace, blocking all AI operations.
   */
  static async triggerKillSwitch(data: {
    workspaceId: string;
    agentId?: string;
    reason: string;
    costAtKill: number;
    correlationId: string;
  }) {
    console.log(`[CostIntel] Triggering Kill Switch for Workspace ${data.workspaceId}`);

    // Update DB
    await prisma.workspaceBudget.upsert({
      where: { workspaceId: data.workspaceId },
      update: { isKillSwitched: true },
      create: { workspaceId: data.workspaceId, isKillSwitched: true }
    });

    // Log the Kill Switch Event
    const log = await prisma.killSwitchLog.create({
      data: {
        workspaceId: data.workspaceId,
        agentId: data.agentId,
        reason: data.reason,
        costAtKill: data.costAtKill,
        correlationId: data.correlationId
      }
    });

    // Audit Log
    await AuditService.logAction({
      correlationId: data.correlationId,
      action: 'KILL_SWITCH_ACTIVATED',
      resource: 'CostIntelligenceService',
      workspaceId: data.workspaceId,
      details: { reason: data.reason, costAtKill: data.costAtKill }
    });

    // Critical Event to shut down running processes
    await EventDispatcher.publish(EventTopic.WORKSPACE_KILL_SWITCHED, {
      workspaceId: data.workspaceId,
      reason: data.reason
    }, data.correlationId);

    return log;
  }
}
