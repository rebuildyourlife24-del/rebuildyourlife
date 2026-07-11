import { randomUUID } from 'crypto';
import { IMessageTransport, EventEnvelope, SubscriptionPattern } from '@rylos/contracts';

type Handler = (envelope: EventEnvelope<unknown>) => Promise<void>;

interface Subscription {
  id: string;
  pattern: SubscriptionPattern;
  handler: Handler;
}

export class InMemoryTransport implements IMessageTransport {
  private subscriptions: Map<string, Subscription> = new Map();

  async publish(envelope: EventEnvelope<unknown>): Promise<void> {
    const dispatchPromises: Promise<void>[] = [];

    for (const sub of this.subscriptions.values()) {
      if (sub.pattern.matches(envelope.type)) {
        // Enforce async dispatch to avoid blocking the publisher
        dispatchPromises.push(
          new Promise<void>((resolve) => {
            setImmediate(() => {
              sub.handler(envelope).then(resolve).catch((err) => {
                console.error(`InMemoryTransport unhandled subscriber error for ${envelope.type}`, err);
                resolve(); // Do not crash the transport loop
              });
            });
          })
        );
      }
    }

    await Promise.all(dispatchPromises);
  }

  async publishBatch(envelopes: EventEnvelope<unknown>[]): Promise<void> {
    for (const env of envelopes) {
      await this.publish(env);
    }
  }

  async subscribe(patternStr: string, handler: (envelope: EventEnvelope<unknown>) => Promise<void>): Promise<string> {
    const id = randomUUID();
    const pattern = new SubscriptionPattern(patternStr);
    
    this.subscriptions.set(id, { id, pattern, handler });
    return id;
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    this.subscriptions.delete(subscriptionId);
  }
}
