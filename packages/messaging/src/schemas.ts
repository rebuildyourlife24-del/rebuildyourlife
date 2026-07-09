import { z } from 'zod';
import { CorrelationID, TenantID, AgentID } from '@rebuildyourlife/kernel';

// Standard Envelope for all Events in RYL OS
export const BaseEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string(), // e.g. "Agent.Task.Completed"
  correlationId: z.string(),
  causationId: z.string().optional(),
  timestamp: z.string().datetime(),
  tenantId: z.string(),
  producer: z.string(), // Name of the service/agent that fired the event
  payload: z.record(z.any()), // The actual data
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;

export const AgentTaskCompletedEventSchema = BaseEventSchema.extend({
  type: z.literal('Agent.Task.Completed'),
  payload: z.object({
    taskId: z.string(),
    agentId: z.string(),
    resultStatus: z.enum(['SUCCESS', 'FAILED']),
    resultData: z.record(z.any()).optional(),
  })
});

export type AgentTaskCompletedEvent = z.infer<typeof AgentTaskCompletedEventSchema>;
