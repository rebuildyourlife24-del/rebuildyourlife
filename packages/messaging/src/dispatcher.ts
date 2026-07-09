import { BaseEvent } from './schemas';
import { logger } from '@rebuildyourlife/kernel';
import { moveToDeadLetterQueue } from './dlq';

export type EventHandler = (event: BaseEvent) => Promise<void>;

export class EventDispatcher {
  private handlers: Map<string, EventHandler[]> = new Map();

  // Maximum number of retries before an event goes to the DLQ
  private readonly MAX_RETRIES = 3;

  /**
   * Subscribe an agent or service to an event type.
   */
  public subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
    logger.info(`Subscribed to event: ${eventType}`, { trace_id: 'SYSTEM' });
  }

  /**
   * Publish an event synchronously to all local subscribers.
   * Includes exponential backoff and DLQ routing.
   */
  public async publish(event: BaseEvent): Promise<void> {
    logger.info(`Publishing event: ${event.type}`, { trace_id: event.correlationId, tenant_id: event.tenantId });
    
    const eventHandlers = this.handlers.get(event.type) || [];
    
    // Fan-out: execute all handlers asynchronously
    const executions = eventHandlers.map(handler => this.executeWithRetry(handler, event));
    
    // We don't await all of them to throw, but we let them run.
    // In a real message broker (like Redis/Kafka), this would just be a push to a topic.
    Promise.allSettled(executions).catch(e => {
      logger.error('Critical failure in Event Dispatcher', { trace_id: event.correlationId }, e as Error);
    });
  }

  private async executeWithRetry(handler: EventHandler, event: BaseEvent, attempt: number = 1): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      if (attempt < this.MAX_RETRIES) {
        const delayMs = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s...
        logger.warn(`Event handler failed for ${event.type}. Retrying in ${delayMs}ms (Attempt ${attempt}/${this.MAX_RETRIES})`, { trace_id: event.correlationId });
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.executeWithRetry(handler, event, attempt + 1);
      } else {
        logger.error(`Event handler failed permanently for ${event.type} after ${this.MAX_RETRIES} attempts. Moving to DLQ.`, { trace_id: event.correlationId }, error as Error);
        moveToDeadLetterQueue(event, error as Error);
      }
    }
  }
}

// Global default dispatcher
export const defaultDispatcher = new EventDispatcher();
