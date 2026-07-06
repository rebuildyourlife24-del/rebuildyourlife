export enum EventTopic {
  USER_CREATED = 'USER_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  AGENT_TASK_COMPLETED = 'AGENT_TASK_COMPLETED',
  COST_THRESHOLD_EXCEEDED = 'COST_THRESHOLD_EXCEEDED',
  AUDIT_LOG_CREATED = 'AUDIT_LOG_CREATED',
  KNOWLEDGE_ADDED = 'KNOWLEDGE_ADDED',
  WORKFLOW_STARTED = 'WORKFLOW_STARTED',
  WALLET_CREDITED = 'WALLET_CREDITED',
  WALLET_BALANCE_LOW = 'WALLET_BALANCE_LOW',
  AGENT_EXECUTION_BLOCKED = 'AGENT_EXECUTION_BLOCKED',
  BUDGET_ALERT_THRESHOLD_REACHED = 'BUDGET_ALERT_THRESHOLD_REACHED',
  WORKSPACE_KILL_SWITCHED = 'WORKSPACE_KILL_SWITCHED',
  INVOICE_PAID = 'INVOICE_PAID'
}

export type EventPayloadMap = any;

export class EventDispatcher {
  static async publish(topic: any, _payload?: any, _options?: any) {
    console.log(`[EventDispatcher] Published ${topic}`);
  }
}

export class CorrelationManager {
  static getCorrelationId() { return 'system-generated-id'; }
  static setCorrelationId(_id: string) {}
}
