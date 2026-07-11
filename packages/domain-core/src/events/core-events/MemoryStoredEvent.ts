import { DomainEvent } from '../DomainEvent';
import { EventRegistry } from '../EventRegistry';
import { EventMetadata } from '../EventMetadata';

export interface MemoryStoredPayload {
  sourceId: string;
  content: string;
  embeddingReference?: string;
}

export class MemoryStoredEvent implements DomainEvent<MemoryStoredPayload> {
  public readonly eventType = 'MemoryStored';
  public readonly eventVersion = 1;
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: MemoryStoredPayload,
    public readonly metadata: EventMetadata
  ) {}
}

EventRegistry.register('MemoryStored', 1);
