import { PrismaClient } from '@prisma/client';
import { DigitalTwin } from './DigitalTwin';
import { MemoryEventBus } from '../event-bus/MemoryEventBus';
import { EventPayload } from '../sdk/IEventBus';

export class EventReplayer {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Replays all historical events to rebuild the Digital Twin from scratch.
   */
  public async rebuildTwinFromScratch(): Promise<void> {
    console.log('[EventReplayer] Initiating Full Enterprise State Rebuild...');
    
    const twin = DigitalTwin.getInstance();
    twin.resetState();
    
    // We could technically just pump these through the bus, but that might trigger
    // external side effects if other plugins are listening. 
    // Best practice is to feed them directly into the Twin or have a 'REPLAY_MODE' flag.
    const bus = MemoryEventBus.getInstance();

    const historicalEvents = await this.prisma.enterpriseEvent.findMany({
      orderBy: { timestamp: 'asc' }
    });

    console.log(`[EventReplayer] Found ${historicalEvents.length} historical events. Replaying...`);

    for (const record of historicalEvents) {
      const payload: EventPayload = {
        aggregateId: record.aggregateId,
        eventType: record.eventType,
        source: record.source,
        data: record.payload as any,
        timestamp: record.timestamp
      };

      // In V1, we just publish them to the bus so the Twin catches them.
      // We assume side-effect listeners (e.g. email senders) are smart enough 
      // to check timestamps or we use a separate replay channel.
      await bus.publish(payload);
    }

    console.log('[EventReplayer] Twin Rebuild Complete. Current State:', twin.getStateSnapshot());
  }
}
