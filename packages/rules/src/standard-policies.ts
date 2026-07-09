import { Rule } from './engine';

/**
 * Standard C-Suite Policies that dictate AI Agent Behavior on a global level.
 * These are evaluated by the Meta-Orchestrator or the Event Bus before an action executes.
 */
export const StandardEnterpriseRules: Record<string, Rule> = {
  // If an agent tries to spend more than 500 dollars (50000 cents) without explicit CEO context, escalate.
  RequireHumanApprovalForHighSpend: {
    id: 'rule_high_spend_escalation',
    name: 'Require Human Approval for High Spend',
    description: 'Escalates any transaction above $500 to a human owner.',
    action: 'ESCALATE',
    conditions: [
      {
        field: 'amountInCents',
        operator: 'GREATER_THAN',
        value: 50000 
      }
    ]
  },
  
  // If an agent reports a confidence score lower than 40%, it should trigger a review workflow rather than executing.
  HaltOnLowConfidence: {
    id: 'rule_low_confidence_halt',
    name: 'Halt on Low Confidence',
    description: 'Triggers a manual review workflow if an agent is unsure about a critical task.',
    action: 'TRIGGER_WORKFLOW',
    metadata: {
      workflowType: 'Manual_Review'
    },
    conditions: [
      {
        field: 'agentConfidenceScore',
        operator: 'LESS_THAN',
        value: 40
      }
    ]
  },

  // Phase 14: Autonomous Optimization (FinOps)
  HaltOnHighCloudCost: {
    id: 'rule_finops_cloud_cost_limit',
    name: 'Halt on High Cloud Cost (FinOps)',
    description: 'Triggers a self-healing or alert workflow when cloud API usage exceeds the daily threshold.',
    action: 'TRIGGER_WORKFLOW',
    metadata: {
      workflowType: 'FinOps_Optimization'
    },
    conditions: [
      {
        field: 'dailyApiCostCents',
        operator: 'GREATER_THAN',
        value: 15000 
      }
    ]
  }
};
