import { PrismaClient } from '@prisma/client';
import { IEventBus, EventPayload } from '../sdk/IEventBus';

export class EventStoreListener {
  private prisma: PrismaClient;

  constructor(private bus: IEventBus) {
    this.prisma = new PrismaClient();
  }

  public startListening(): void {
    console.log('[EventStoreListener] Subscribing to wildcard events...');
    // Listen to all events published to the bus
    this.bus.subscribe('*', async (event: EventPayload) => {
      try {
        await this.prisma.enterpriseEvent.create({
          data: {
            aggregateId: event.aggregateId,
            eventType: event.eventType,
            source: event.source,
            payload: event.data as any,
            timestamp: event.timestamp || new Date(),
          },
        });
        console.log(`[EventStoreListener] Persisted event: ${event.eventType} for aggregate ${event.aggregateId}`);
      } catch (error) {
        console.error(`[EventStoreListener] Failed to persist event ${event.eventType}:`, error);
      }
    });
  }
}
