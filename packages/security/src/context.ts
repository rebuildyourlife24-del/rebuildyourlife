import { AsyncLocalStorage } from 'async_hooks';
import { TenantID, UserID, AgentID, CorrelationID } from '@rebuildyourlife/kernel';

export interface ExecutionContext {
  tenantId: TenantID;
  correlationId: CorrelationID;
  userId?: UserID;
  agentId?: AgentID;
  [key: string]: any;
}

export const executionContextStorage = new AsyncLocalStorage<ExecutionContext>();

/**
 * Wraps a function execution with a specific context.
 * This guarantees that tenant isolation is maintained down the call stack.
 */
export function withContext<T>(context: ExecutionContext, fn: () => T): T {
  return executionContextStorage.run(context, fn);
}

/**
 * Retrieves the current execution context. Throws if missing (strict isolation).
 */
export function getContext(): ExecutionContext {
  const context = executionContextStorage.getStore();
  if (!context) {
    throw new Error('CRITICAL SECURITY VIOLATION: Execution context is missing. Request aborted to prevent cross-tenant data leakage.');
  }
  return context;
}
