import { z } from 'zod';
import { EventEnvelope, JsonSerializer, TenantIdSchema } from '@rylos/contracts';
import { EventDescriptor } from '../EventDescriptor';

// 1. Define the specific payload schema (Pure DTO)
export const GoalCreatedPayloadSchema = z.object({
  goalId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  targetDate: z.string().datetime().optional()
});

export type GoalCreatedPayload = z.infer<typeof GoalCreatedPayloadSchema>;

// 2. Define the exact event envelope type for this event
export type GoalCreatedEvent = EventEnvelope<GoalCreatedPayload>;

// 3. Define the Event Descriptor for the Registry
export const GoalCreatedDescriptor: EventDescriptor<GoalCreatedPayload> = {
  eventName: 'goal.created',
  aggregate: 'Goal',
  version: 1,
  semanticClassification: 'Business',
  schema: GoalCreatedPayloadSchema,
  serializer: new JsonSerializer(),
  compatibility: 'backward-compatible',
  deprecated: false,
  replaySafe: true,
  snapshotCandidate: true,
  visibility: 'PUBLIC',
  retentionPolicy: 'PERMANENT'
};
