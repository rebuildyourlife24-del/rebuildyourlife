import { DomainEvent } from './DomainEvent';

export class EventRegistry {
  private static registeredEvents = new Set<string>();

  static register(eventType: string, version: number) {
    const key = `${eventType}.v${version}`;
    if (this.registeredEvents.has(key)) {
      throw new Error(`Event Schema violation: ${key} is already registered. Versions must be strictly monotonic.`);
    }
    this.registeredEvents.add(key);
  }

  static isRegistered(eventType: string, version: number): boolean {
    return this.registeredEvents.has(`${eventType}.v${version}`);
  }
}
