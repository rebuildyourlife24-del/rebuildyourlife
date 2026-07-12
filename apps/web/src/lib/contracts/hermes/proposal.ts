export interface HermesEvolutionProposal {
  id: string;
  status: "DETECTED" | "SPECIFICATION_GENERATED" | "SANDBOX_BUILDING" | "SANDBOX_SUCCESS" | "SANDBOX_FAILED" | "APPROVED_FOR_TESTING" | "APPROVED_FOR_RELEASE" | "REJECTED";
  createdAt: Date;
}
