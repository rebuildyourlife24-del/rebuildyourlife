import { z } from 'zod';
import { ISerializer, SemanticClassificationSchema, SemanticClassification } from '@rylos/contracts';

export const VisibilitySchema = z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE']);
export type Visibility = z.infer<typeof VisibilitySchema>;

export const RetentionPolicySchema = z.enum(['PERMANENT', 'BUSINESS', 'AUDIT', 'EPHEMERAL']);
export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;

export interface EventDescriptor<TPayload> {
  readonly eventName: string;
  readonly aggregate: string;
  readonly version: number;
  readonly semanticClassification: SemanticClassification;
  readonly schema: z.ZodSchema<TPayload>;
  readonly serializer: ISerializer;
  readonly upgrader?: (oldPayload: unknown) => TPayload;
  readonly downgrader?: (newPayload: TPayload) => unknown;
  readonly compatibility: 'breaking' | 'backward-compatible';
  readonly deprecated: boolean;
  readonly replaySafe: boolean;
  readonly snapshotCandidate: boolean;
  readonly visibility: Visibility;
  readonly retentionPolicy: RetentionPolicy;
}
