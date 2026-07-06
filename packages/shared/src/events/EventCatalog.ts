export enum EventTopic {
  // Identity Domain
  ORGANIZATION_CREATED = 'identity.organization.created',
  WORKSPACE_CREATED = 'identity.workspace.created',
  USER_JOINED_WORKSPACE = 'identity.user.joined_workspace',
  ROLE_UPDATED = 'identity.role.updated',

  // Billing Domain
  INVOICE_PAID = 'billing.invoice.paid',
  WALLET_CREDITED = 'billing.wallet.credited',
  WALLET_BALANCE_LOW = 'billing.wallet.balance_low',

  // AI Runtime Domain
  AGENT_CREATED = 'ai.agent.created',
  AGENT_PAUSED = 'ai.agent.paused',
  AGENT_ERROR = 'ai.agent.error',
  AGENT_RESUMED = 'ai.agent.resumed',

  // Workflow / Tasks
  TASK_QUEUED = 'queue.task.queued',
  TASK_STARTED = 'queue.task.started',
  TASK_FAILED = 'queue.task.failed',
  TASK_COMPLETED = 'queue.task.completed',

  // Commerce Domain
  ORDER_CREATED = 'commerce.order.created',
}

export interface BaseEventPayload {
  organizationId?: string;
  workspaceId?: string;
  userId?: string;
  timestamp: string;
  correlationId: string;
}

export interface OrganizationCreatedPayload extends BaseEventPayload {
  organizationId: string;
  name: string;
  slug: string;
}

export interface InvoicePaidPayload extends BaseEventPayload {
  invoiceId: string;
  amount: number;
  currency: string;
}

export type EventPayloadMap = {
  [EventTopic.ORGANIZATION_CREATED]: OrganizationCreatedPayload;
  [EventTopic.INVOICE_PAID]: InvoicePaidPayload;
  // Add other payload types mapped to topics as needed
  [key: string]: BaseEventPayload | any; 
};
