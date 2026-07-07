import { EventEmitter } from 'events';
import { IEventBus, EventPayload } from '../sdk/IEventBus.js';

export class MemoryEventBus implements IEventBus {
  private emitter: EventEmitter;
  private static instance: MemoryEventBus;

  private constructor() {
    this.emitter = new EventEmitter();
    // Prevent memory leak warnings if we have many listeners
    this.emitter.setMaxListeners(100);
  }

  public static getInstance(): MemoryEventBus {
    if (!MemoryEventBus.instance) {
      MemoryEventBus.instance = new MemoryEventBus();
    }
    return MemoryEventBus.instance;
  }

  public async publish(event: EventPayload): Promise<void> {
    const timestampedEvent = {
      ...event,
      timestamp: event.timestamp || new Date(),
    };
    
    // Async emission to not block the publisher
    setImmediate(() => {
      // Publish to specific event type channel
      this.emitter.emit(event.eventType, timestampedEvent);
      // Publish to a global wildcard channel (useful for EventSourcing loggers)
      this.emitter.emit('*', timestampedEvent);
    });
  }

  public subscribe(eventType: string, handler: (event: EventPayload) => Promise<void>): void {
    // We wrap the async handler so EventEmitter doesn't swallow unhandled rejections
    const safeHandler = async (evt: EventPayload) => {
      try {
        await handler(evt);
      } catch (error) {
        console.error(`[EventBus] Error handling event ${eventType}:`, error);
      }
    };
    
    // Store reference to original handler on the wrapper so we can unsubscribe it if needed
    (safeHandler as any).original = handler;
    this.emitter.on(eventType, safeHandler);
  }

  public unsubscribe(eventType: string, handler: (event: EventPayload) => Promise<void>): void {
    const listeners = this.emitter.listeners(eventType);
    for (const listener of listeners) {
      if ((listener as any).original === handler) {
        this.emitter.off(eventType, listener as any);
        break;
      }
    }
  }
}
