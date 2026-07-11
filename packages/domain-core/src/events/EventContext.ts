export interface EventContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  correlationId: string;
  causationId?: string;
  
  tenantId?: string;
  agentId?: string;
  identityId?: string;
  
  goalId?: string;
  decisionId?: string;
  actionId?: string;
  memoryId?: string;
  knowledgeId?: string;

  deploymentVersion?: string;
  gitCommit?: string;
  environment?: string;
  region?: string;
}
