import { IEventBus, IMessageTransport, IEventMiddleware, EventEnvelope } from '@rylos/contracts';

export class EventBus implements IEventBus {
  private middlewares: IEventMiddleware[] = [];

  constructor(private readonly transport: IMessageTransport) {}

  public use(middleware: IEventMiddleware): void {
    this.middlewares.push(middleware);
  }

  public async publish<T>(envelope: EventEnvelope<T>): Promise<void> {
    let currentEnvelope: EventEnvelope<unknown> = envelope;

    try {
      // 1. Run beforePublish pipeline
      for (const mw of this.middlewares) {
        if (mw.beforePublish) {
          currentEnvelope = await mw.beforePublish(currentEnvelope);
        }
      }

      // 2. Transport Publish
      await this.transport.publish(currentEnvelope);

      // 3. Run afterPublish pipeline
      // Run in reverse order for teardown
      for (let i = this.middlewares.length - 1; i >= 0; i--) {
        const mw = this.middlewares[i];
        if (mw.afterPublish) {
          await mw.afterPublish(currentEnvelope);
        }
      }
    } catch (error) {
      await this.handleError(error as Error, currentEnvelope);
      throw error;
    }
  }

  public async publishBatch<T>(envelopes: EventEnvelope<T>[]): Promise<void> {
    // For simplicity, running them through the pipeline sequentially. 
    // In a high-throughput system, batching logic would be pushed down to transport.
    for (const env of envelopes) {
      await this.publish(env);
    }
  }

  public async subscribe(pattern: string, handler: (envelope: EventEnvelope<unknown>) => Promise<void>): Promise<void> {
    // The handler we pass to the transport needs to wrap the beforeDispatch/afterDispatch pipeline
    await this.transport.subscribe(pattern, async (envelope: EventEnvelope<unknown>) => {
      let currentEnvelope = envelope;
      
      try {
        // Run beforeDispatch pipeline
        for (const mw of this.middlewares) {
          if (mw.beforeDispatch) {
            currentEnvelope = await mw.beforeDispatch(currentEnvelope);
          }
        }

        // Execute actual handler
        await handler(currentEnvelope);

        // Run afterDispatch pipeline
        for (let i = this.middlewares.length - 1; i >= 0; i--) {
          const mw = this.middlewares[i];
          if (mw.afterDispatch) {
            await mw.afterDispatch(currentEnvelope);
          }
        }
      } catch (error) {
        await this.handleError(error as Error, currentEnvelope);
      }
    });
  }

  public async unsubscribe(subscriptionId: string): Promise<void> {
    return this.transport.unsubscribe(subscriptionId);
  }

  private async handleError(error: Error, envelope: EventEnvelope<unknown>): Promise<void> {
    for (const mw of this.middlewares) {
      if (mw.onError) {
        await mw.onError(error, envelope);
      }
    }
  }
}
