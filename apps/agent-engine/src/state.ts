import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export const AgentStateAnnotation = Annotation.Root({
  task: Annotation<string>(),
  messages: Annotation<BaseMessage[]>({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),
  architecturePlan: Annotation<string>(),
  architectKbId: Annotation<string>(),
  generatedCode: Annotation<Record<string, string>>(),
  developerKbId: Annotation<string>(),
  scrapedLeads: Annotation<Array<{ email: string; firstName?: string; lastName?: string }>>({
    reducer: (current, update) => update,
    default: () => [],
  }),
  emailCampaignId: Annotation<string>(),
  webSearchQuery: Annotation<string>(),
  webSearchResults: Annotation<string>(),
  predictionId: Annotation<string>(),

  // FASE 5: Shopify Autopilot velden
  sourcedProductTitle: Annotation<string>(),
  sourcedProductPrice: Annotation<number>(),
  shopifyProductId: Annotation<string>(),

  videoScript: Annotation<string>(),
  marketingVideoId: Annotation<string>(),

  // Fase 8: 18-Member Council Vars
  marginCalculated: Annotation<number>(),
  legalApproved: Annotation<boolean>(),
  trinityKbId: Annotation<string>(),
  athenaKbId: Annotation<string>(),

  // Fase 8 Deel 2: The Final 7
  trendReport: Annotation<string>(),
  adCopy: Annotation<string>(),
  seoTags: Annotation<string>(),
  uxHypothesis: Annotation<string>(),
  influencerList: Annotation<string>(),
  schedulePlan: Annotation<string>(),
  faqMatrix: Annotation<string>(),

  testResults: Annotation<{
    success: boolean;
    logs: string;
    errors?: string[];
  }>(),
  prUrl: Annotation<string>(),
  feedback: Annotation<string>(),
  nextAgent: Annotation<
    "architect" | "predictive_oracle" | "gaia" | "trinity" | "athena" | "shopify_autopilot" | 
    "content_creator" | "qwen" | "prometheus" | "developer" | "morpheus" | "qa" | 
    "lead_scraper" | "nexus" | "cold_email" | "devops" | "chronos" | "echo" | 
    "user_approval" | "end"
  >()
});

export type AgentEngineState = typeof AgentStateAnnotation.State;
