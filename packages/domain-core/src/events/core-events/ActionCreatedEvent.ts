import { DomainEvent } from '../DomainEvent';
import { EventRegistry } from '../EventRegistry';
import { EventMetadata } from '../EventMetadata';

export interface ActionCreatedPayload {
  decisionId: string;
  type: string;
  target: string;
}

export class ActionCreatedEvent implements DomainEvent<ActionCreatedPayload> {
  public readonly eventType = 'ActionCreated';
  public readonly eventVersion = 1;
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: ActionCreatedPayload,
    public readonly metadata: EventMetadata
  ) {}
}

EventRegistry.register('ActionCreated', 1);
