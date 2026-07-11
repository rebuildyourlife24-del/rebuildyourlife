import { DomainEvent } from '../DomainEvent';
import { EventRegistry } from '../EventRegistry';
import { EventMetadata } from '../EventMetadata';

export interface OutcomeRecordedPayload {
  actionId: string;
  success: boolean;
  resultData: any;
}

export class OutcomeRecordedEvent implements DomainEvent<OutcomeRecordedPayload> {
  public readonly eventType = 'OutcomeRecorded';
  public readonly eventVersion = 1;
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly payload: OutcomeRecordedPayload,
    public readonly metadata: EventMetadata
  ) {}
}

EventRegistry.register('OutcomeRecorded', 1);
