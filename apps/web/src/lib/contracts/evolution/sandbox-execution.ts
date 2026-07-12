export interface SandboxExecution {
  id: string;
  organizationId?: string;
  specificationId: string;
  executorMode: "HYBRID_MOCK" | "REAL";
  executionLayers: any;
  isolationScore: number;
  results: { passed: boolean; reason: string };
  createdAt: Date;
}
