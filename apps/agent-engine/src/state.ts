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
  
  // FASE 3: Lead Scraper & Outreach velden
  scrapedLeads: Annotation<Array<{ email: string; firstName?: string; lastName?: string }>>({
    reducer: (current, update) => update,
    default: () => [],
  }),
  emailCampaignId: Annotation<string>(),

  testResults: Annotation<{
    success: boolean;
    logs: string;
    errors?: string[];
  }>(),
  prUrl: Annotation<string>(),
  feedback: Annotation<string>(),
  nextAgent: Annotation<"architect" | "developer" | "qa" | "devops" | "lead_scraper" | "cold_email" | "user_approval" | "end">()
});

export type AgentEngineState = typeof AgentStateAnnotation.State;
