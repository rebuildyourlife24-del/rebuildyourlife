import { IEventMiddleware, EventEnvelope, IAuditLogger } from '@rylos/contracts';
import { randomUUID } from 'crypto';

export class AuditMiddleware implements IEventMiddleware {
  public readonly name = 'AuditMiddleware';

  constructor(private readonly auditLogger: IAuditLogger) {}

  public async afterPublish(envelope: EventEnvelope<unknown>): Promise<void> {
    try {
      await this.auditLogger.log({
        id: `audit_${randomUUID()}`,
        eventType: envelope.type,
        actor: envelope.source,
        tenantId: envelope.tenantId,
        traceId: envelope.traceId,
        timestamp: new Date().toISOString(),
        details: { action: 'PUBLISHED', eventId: envelope.id }
      });
    } catch (error) {
      console.warn('AuditMiddleware: Failed to log audit record', error);
    }
  }

  public async afterDispatch(envelope: EventEnvelope<unknown>): Promise<void> {
    try {
      await this.auditLogger.log({
        id: `audit_${randomUUID()}`,
        eventType: envelope.type,
        actor: 'system', // the subscriber
        tenantId: envelope.tenantId,
        traceId: envelope.traceId,
        timestamp: new Date().toISOString(),
        details: { action: 'DISPATCHED', eventId: envelope.id }
      });
    } catch (error) {
      console.warn('AuditMiddleware: Failed to log audit record', error);
    }
  }
}
