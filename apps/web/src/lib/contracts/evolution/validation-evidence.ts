export interface ValidationEvidence {
  id: string;
  organizationId?: string;
  sandboxExecutionId: string;
  evidenceType: "SANDBOX_REPORT" | "MANUAL_REVIEW";
  metrics: Record<string, any>;
  passedChecks: string[];
  releaseCandidate: boolean;
  createdAt: Date;
}
