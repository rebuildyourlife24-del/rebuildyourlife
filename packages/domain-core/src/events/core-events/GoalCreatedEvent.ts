import { DomainEvent } from '../DomainEvent';
import { EventRegistry } from '../EventRegistry';
import { EventMetadata } from '../EventMetadata';

export interface GoalCreatedPayload {
  description: string;
  agentId: string;
}

export class GoalCreatedEvent implements DomainEvent<GoalCreatedPayload> {
  public readonly eventType = 'GoalCreated';
  public readonly eventVersion = 1;
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: GoalCreatedPayload,
    public readonly metadata: EventMetadata
  ) {}
}

EventRegistry.register('GoalCreated', 1);
