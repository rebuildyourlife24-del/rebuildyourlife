import { DomainEvent } from './DomainEvent';

export type EventHandler<T extends DomainEvent> = (event: T) => Promise<void>;

export interface Subscription {
  unsubscribe(): void;
}

export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): Subscription;
  
  replay?(aggregateId: string): Promise<DomainEvent[]>;
}
