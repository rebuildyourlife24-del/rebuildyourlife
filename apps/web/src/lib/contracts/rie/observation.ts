export interface RieObservation {
  id: string;
  source: string;
  timestamp: Date;
  entityType: string;
  metricType: "ACTIVITY" | "REVENUE";
  observedValue: number;
  confidence: number;
  correlationId?: string;
}
