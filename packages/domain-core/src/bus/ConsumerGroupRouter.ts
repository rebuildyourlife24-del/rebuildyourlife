import { IEventBus, EventEnvelope, EventHandler, SubscriptionOptions } from '@rylos/contracts';

/**
 * ConsumerGroupRouter
 * 
 * Ensures that within a named Consumer Group, an event is only processed by ONE worker.
 * Across different Consumer Groups (e.g., hermes-worker vs audit-worker), the event is processed by both.
 * This is an in-memory simulation of what Kafka/RabbitMQ consumer groups do.
 */
export class ConsumerGroupRouter {
  private readonly groups = new Map<string, Array<{ pattern: RegExp, handler: EventHandler }>>();

  constructor(private readonly eventBus: IEventBus) {}

  public subscribeGroup(groupName: string, pattern: string, handler: EventHandler): void {
    if (!this.groups.has(groupName)) {
      this.groups.set(groupName, []);
    }
    
    // Convert wildcard to regex (e.g. "goal.*" -> /^goal\..*$/)
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    this.groups.get(groupName)!.push({ pattern: regex, handler });
  }

  public async routeEvent(envelope: EventEnvelope<unknown>): Promise<void> {
    const routingPromises: Promise<void>[] = [];

    // For each consumer group, pick EXACTLY ONE matching handler (Round Robin or Random)
    // In a real distributed system, this happens via partition assignment.
    for (const [groupName, handlers] of this.groups.entries()) {
      const matchingHandlers = handlers.filter(h => h.pattern.test(envelope.type));
      
      if (matchingHandlers.length > 0) {
        // Pick the first one for now (simulating competing consumers within a group)
        const selectedHandler = matchingHandlers[0].handler;
        routingPromises.push(selectedHandler(envelope));
      }
    }

    await Promise.allSettled(routingPromises);
  }
}
