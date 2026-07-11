import { DomainEvent } from '../DomainEvent';
import { EventRegistry } from '../EventRegistry';
import { EventMetadata } from '../EventMetadata';

export interface DecisionCreatedPayload {
  goalId: string;
  status: string;
  reasoning: string;
}

export class DecisionCreatedEvent implements DomainEvent<DecisionCreatedPayload> {
  public readonly eventType = 'DecisionCreated';
  public readonly eventVersion = 1;
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: DecisionCreatedPayload,
    public readonly metadata: EventMetadata
  ) {}
}

EventRegistry.register('DecisionCreated', 1);
