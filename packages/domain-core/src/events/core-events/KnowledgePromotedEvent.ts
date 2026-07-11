import { DomainEvent } from '../DomainEvent';
import { EventRegistry } from '../EventRegistry';
import { EventMetadata } from '../EventMetadata';

export interface KnowledgePromotedPayload {
  memoryId: string;
  confidenceScore: number;
}

export class KnowledgePromotedEvent implements DomainEvent<KnowledgePromotedPayload> {
  public readonly eventType = 'KnowledgePromoted';
  public readonly eventVersion = 1;
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: KnowledgePromotedPayload,
    public readonly metadata: EventMetadata
  ) {}
}

EventRegistry.register('KnowledgePromoted', 1);
