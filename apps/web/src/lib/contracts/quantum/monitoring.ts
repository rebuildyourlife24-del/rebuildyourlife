export interface QuantumGuardAlert {
  id: string;
  source: string;
  actionType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  remediation: string;
  payloadSnapshot: any;
  createdAt: Date;
}
