import { EventContext } from './EventContext';

export interface EventMetadata {
  context: EventContext;
  timestamp: string; // ISO-8601
  source: string; // System or subsystem that emitted the event
}
