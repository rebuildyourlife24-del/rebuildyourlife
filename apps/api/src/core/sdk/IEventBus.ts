export interface EventPayload {
  aggregateId: string;
  eventType: string;
  source: string;
  data: Record<string, any>;
  timestamp?: Date;
}

export interface IEventBus {
  publish(event: EventPayload): Promise<void>;
  subscribe(eventType: string, handler: (event: EventPayload) => Promise<void>): void;
  unsubscribe(eventType: string, handler: (event: EventPayload) => Promise<void>): void;
}
