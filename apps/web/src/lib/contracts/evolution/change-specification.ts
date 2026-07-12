export interface EvolutionChangeSpecification {
  id: string;
  organizationId?: string;
  proposalId: string;
  description: string;
  riskTier: "LOW" | "MEDIUM" | "HIGH";
  expectedImpact: string;
  validationCriteria: string[];
  createdAt: Date;
}
