import { PrismaClient } from '@prisma/client';
import { EventTopic, EventPayloadMap } from '@repo/shared/src/events/index.js';
import { EventDispatcher } from '@repo/shared/src/events/index.js';

const prisma = new PrismaClient();

export class EventStoreService {
  /**
   * Core of the Event Sourcing Backbone.
   * Appends an event to the immutable EventStore log and immediately dispatches it.
   */
  static async appendAndDispatch<T extends EventTopic>(data: {
    aggregateId: string;
    aggregateType: string;
    eventType: T;
    payload: Omit<EventPayloadMap[T], 'timestamp' | 'correlationId'>;
    correlationId: string;
  }) {
    // 1. Fetch current highest version for this aggregate to ensure optimistic concurrency
    const latestEvent = await prisma.eventStore.findFirst({
      where: { aggregateId: data.aggregateId },
      orderBy: { version: 'desc' }
    });

    const nextVersion = latestEvent ? latestEvent.version + 1 : 1;

    // 2. Append to EventStore (Source of Truth)
    const storedEvent = await prisma.eventStore.create({
      data: {
        aggregateId: data.aggregateId,
        aggregateType: data.aggregateType,
        eventType: data.eventType,
        payload: data.payload as any,
        version: nextVersion,
        correlationId: data.correlationId
      }
    });

    console.log(`[EventStore] Appended ${data.eventType} v${nextVersion} for ${data.aggregateId}`);

    // 3. Dispatch to the ephemeral PubSub Event Bus
    await EventDispatcher.publish(data.eventType, data.payload, data.correlationId);

    return storedEvent;
  }

  /**
   * Replays events for a specific aggregate to rebuild state (CQRS Projector logic).
   */
  static async replayAggregateEvents(aggregateId: string) {
    const events = await prisma.eventStore.findMany({
      where: { aggregateId },
      orderBy: { version: 'asc' }
    });
    console.log(`[EventStore] Replaying ${events.length} events for ${aggregateId}`);
    return events;
  }
}
