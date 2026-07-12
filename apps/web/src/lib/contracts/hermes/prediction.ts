export interface HermesPrediction {
  id: string;
  category: "EVOLVED_PROMPT" | "AUTONOMOUS_EVOLUTION" | string;
  predictionText: string;
  confidenceScore: number;
  suggestedAction: string;
  createdAt: Date;
}
