import { PrismaClient } from '@prisma/client';
import { Logger } from '../../observability/logger.js';

const prisma = new PrismaClient();

export class DeadLetterQueueService {
  /**
   * Logs an event that failed to process by a consumer.
   */
  static async logFailure(data: {
    eventId?: string;
    eventType: string;
    payload: any;
    errorReason: string;
    correlationId: string;
  }) {
    Logger.error(`[DLQ] Event ${data.eventType} failed and routed to DLQ. Reason: ${data.errorReason}`);

    return prisma.deadLetterEvent.create({
      data: {
        originalEventId: data.eventId,
        eventType: data.eventType,
        payload: data.payload,
        errorReason: data.errorReason,
        correlationId: data.correlationId,
        status: 'FAILED'
      }
    });
  }

  /**
   * Retrieves all failed events that need human intervention or automated retry.
   */
  static async getPendingRetries() {
    return prisma.deadLetterEvent.findMany({
      where: { status: 'FAILED' },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Marks an event as resolved after manual fix or successful automated replay.
   */
  static async resolveEvent(dlqId: string) {
    return prisma.deadLetterEvent.update({
      where: { id: dlqId },
      data: { status: 'RESOLVED', updatedAt: new Date() }
    });
  }
}
