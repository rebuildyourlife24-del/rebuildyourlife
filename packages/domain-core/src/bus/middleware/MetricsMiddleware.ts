import { IEventMiddleware, EventEnvelope, IMetricsCollector } from '@rylos/contracts';

export class MetricsMiddleware implements IEventMiddleware {
  public readonly name = 'MetricsMiddleware';

  constructor(private readonly metrics: IMetricsCollector) {}

  public async beforePublish(envelope: EventEnvelope<unknown>): Promise<EventEnvelope<unknown>> {
    try {
      this.metrics.incrementCounter('event.publish.total', 1, {
        type: envelope.type,
        tenant: envelope.tenantId
      });
    } catch (error) {
      console.warn('MetricsMiddleware: Failed to increment publish counter', error);
    }
    return envelope;
  }

  public async onError(error: Error, envelope: EventEnvelope<unknown>): Promise<void> {
    try {
      this.metrics.incrementCounter('event.publish.failed', 1, {
        type: envelope.type,
        error: error.name
      });
    } catch (e) {
      console.warn('MetricsMiddleware: Failed to increment error counter', e);
    }
  }
}
