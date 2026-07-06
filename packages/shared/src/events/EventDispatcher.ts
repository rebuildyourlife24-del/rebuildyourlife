import { EventTopic, EventPayloadMap } from './EventCatalog';
import { CorrelationManager } from './CorrelationId';

/**
 * The EventDispatcher is the central hub for publishing and subscribing to events.
 * In a production environment, this wraps Inngest, Kafka, or Redis Streams.
 * This abstraction ensures Domain Services don't tightly couple to the underlying message broker.
 */
export class EventDispatcher {
  
  /**
   * Publishes an event to the OS Event Bus.
   * 
   * @param topic The standardized EventTopic from the catalog
   * @param payload The strongly typed payload for the specific event
   * @param correlationId Optional correlation ID to maintain trace. If missing, one is generated.
   */
  static async publish<T extends EventTopic>(
    topic: T,
    payload: Omit<EventPayloadMap[T], 'timestamp' | 'correlationId'>,
    correlationId?: string
  ): Promise<void> {
    
    const fullPayload: EventPayloadMap[T] = {
      ...payload,
      timestamp: new Date().toISOString(),
      correlationId: CorrelationManager.validateOrGenerate(correlationId),
    } as any;

    console.log(`[Event Bus] 📡 PUBLISHING: ${topic}`);
    console.log(`[Event Bus] 📦 PAYLOAD:`, JSON.stringify(fullPayload, null, 2));

    // TODO: Actually dispatch this to Inngest or Upstash Redis here
    // Example: await inngest.send({ name: topic, data: fullPayload });
  }

  /**
   * (Placeholder) Subscription listener for microservices to bind to topics.
   */
  static subscribe<T extends EventTopic>(
    topic: T, 
    handler: (payload: EventPayloadMap[T]) => Promise<void>
  ) {
    console.log(`[Event Bus] 🎧 SUBSCRIBED to ${topic}`);
    // TODO: Implement the listener binding (e.g., configuring Inngest functions)
  }
}
