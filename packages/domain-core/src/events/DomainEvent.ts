import { EventMetadata } from './EventMetadata';

export interface DomainEvent<TPayload = any> {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  
  readonly aggregateId: string;
  
  readonly payload: TPayload;
  
  readonly metadata: EventMetadata;
}
