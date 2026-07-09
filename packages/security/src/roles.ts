export enum HumanRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

export enum AgentCapability {
  READ_CRM = 'READ_CRM',
  WRITE_CRM = 'WRITE_CRM',
  SPEND_MONEY = 'SPEND_MONEY',
  DEPLOY_CODE = 'DEPLOY_CODE',
  SEND_EMAIL = 'SEND_EMAIL',
  DELETE_FILES = 'DELETE_FILES',
}

export interface AgentRole {
  id: string;
  name: string;
  capabilities: AgentCapability[];
  maxSpendLimit?: number; // In cents
}

// Pre-defined Agent Roles for the C-Suite
export const DefaultAgentRoles: Record<string, AgentRole> = {
  CEO_AGENT: {
    id: 'role_ceo',
    name: 'CEO Agent',
    capabilities: [AgentCapability.READ_CRM, AgentCapability.WRITE_CRM, AgentCapability.SPEND_MONEY, AgentCapability.DEPLOY_CODE, AgentCapability.SEND_EMAIL, AgentCapability.DELETE_FILES],
    maxSpendLimit: 1000000, // $10,000
  },
  CMO_AGENT: {
    id: 'role_cmo',
    name: 'CMO Agent',
    capabilities: [AgentCapability.READ_CRM, AgentCapability.SEND_EMAIL, AgentCapability.SPEND_MONEY],
    maxSpendLimit: 50000, // $500
  },
  SUPPORT_AGENT: {
    id: 'role_support',
    name: 'Support Agent',
    capabilities: [AgentCapability.READ_CRM, AgentCapability.SEND_EMAIL],
    maxSpendLimit: 0,
  }
};
