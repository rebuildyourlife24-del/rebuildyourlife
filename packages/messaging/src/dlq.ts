import { BaseEvent } from './schemas';
import { logger } from '@rebuildyourlife/kernel';

export interface DeadLetterEntry {
  event: BaseEvent;
  errorReason: string;
  failedAt: string;
}

// In-memory DLQ for Phase 1. 
// In Production, this will write to a Database table (DLQ) monitored by the COO Agent.
const dlqStore: DeadLetterEntry[] = [];

export function moveToDeadLetterQueue(event: BaseEvent, error: Error): void {
  const entry: DeadLetterEntry = {
    event,
    errorReason: error.message || 'Unknown Error',
    failedAt: new Date().toISOString()
  };
  
  dlqStore.push(entry);
  
  // Alert the system that a message was poisoned.
  logger.error(`[DLQ ALERT] Event ${event.id} of type ${event.type} moved to Dead Letter Queue.`, {
    trace_id: event.correlationId,
    tenant_id: event.tenantId,
    dlq_size: dlqStore.length
  });
}

export function getDeadLetterQueue(): DeadLetterEntry[] {
  return [...dlqStore];
}
