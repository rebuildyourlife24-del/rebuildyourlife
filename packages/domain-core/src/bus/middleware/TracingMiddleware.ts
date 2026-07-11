import { IEventMiddleware, EventEnvelope, ITracer } from '@rylos/contracts';

export class TracingMiddleware implements IEventMiddleware {
  public readonly name = 'TracingMiddleware';

  constructor(private readonly tracer: ITracer) {}

  public async beforePublish(envelope: EventEnvelope<unknown>): Promise<EventEnvelope<unknown>> {
    try {
      // Create a new span for the publish operation
      const span = this.tracer.startSpan(`publish ${envelope.type}`);
      if (span) {
        span.setAttribute('messaging.system', 'abee-eventbus');
        span.setAttribute('messaging.destination', envelope.type);
        span.setAttribute('event.id', envelope.id);
        span.setAttribute('event.tenant_id', envelope.tenantId);
        
        // Pass the context into the metadata so subscribers can link to it
        // Or if we were using a true context propagator, it would be injected here.
        span.end();
      }
    } catch (error) {
      // Best effort, Non Blocking, Loss tolerant
      console.warn('TracingMiddleware: Failed to start/end publish span', error);
    }
    return envelope;
  }

  public async beforeDispatch(envelope: EventEnvelope<unknown>): Promise<EventEnvelope<unknown>> {
    try {
      const span = this.tracer.startSpan(`process ${envelope.type}`);
      if (span) {
        span.setAttribute('messaging.system', 'abee-eventbus');
        span.setAttribute('messaging.operation', 'process');
        span.setAttribute('event.id', envelope.id);
        
        // We do not end the span here, it is left open during dispatch.
        // In a full implementation, we'd attach it to AsyncLocalStorage for the handler.
        span.end();
      }
    } catch (error) {
      console.warn('TracingMiddleware: Failed to start/end dispatch span', error);
    }
    return envelope;
  }

  public async onError(error: Error, envelope: EventEnvelope<unknown>): Promise<void> {
    try {
      const span = this.tracer.startSpan(`error ${envelope.type}`);
      if (span) {
        span.setStatus('ERROR', error.message);
        span.setAttribute('error.name', error.name);
        span.end();
      }
    } catch (e) {
      console.warn('TracingMiddleware: Failed to record error span', e);
    }
  }
}
