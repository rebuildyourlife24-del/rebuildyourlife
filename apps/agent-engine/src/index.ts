import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateAnnotation } from "./state";
import { architectNode, developerNode, qaNode, leadScraperNode, coldEmailNode, devopsNode } from "./agents";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Bouw de State Graph
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("architect", architectNode)
  .addNode("developer", developerNode)
  .addNode("qa", qaNode)
  .addNode("lead_scraper", leadScraperNode)
  .addNode("cold_email", coldEmailNode)
  .addNode("devops", devopsNode);

// Verbind de Nodes (Edges)
workflow.addEdge(START, "architect");
workflow.addEdge("architect", "developer");
workflow.addEdge("developer", "qa");

// Conditionele routing na QA
workflow.addConditionalEdges(
  "qa",
  (state) => {
    return state.nextAgent === "developer" ? "developer" : "lead_scraper";
  },
  {
    developer: "developer",
    lead_scraper: "lead_scraper"
  }
);

// Flow na lead-generatie en outreach
workflow.addEdge("lead_scraper", "cold_email");
workflow.addEdge("cold_email", "devops");
workflow.addEdge("devops", END);

export const app = workflow.compile();

// Test-run executie
async function main() {
  console.log("[AGENT ENGINE] Starting Agent Swarm execution...");
  console.log("GROQ API KEY status:", process.env.GROQ_API_KEY ? "CONFIGURED" : "MISSING");
  
  try {
    const result = await app.invoke({
      task: "Verhoog conversie door een dynamic coupon B2B outreach op te zetten",
      messages: [],
      nextAgent: "architect"
    });
    
    console.log("\n--- SWARM EXECUTION COMPLETE ---");
    console.log("PR URL:", result.prUrl);
    console.log("Gescrapte leads aantal:", result.scrapedLeads?.length);
    console.log("EmailCampaign ID:", result.emailCampaignId);
  } catch (error) {
    console.error("[AGENT ENGINE] Crash tijdens executie:", error);
  }
}

if (require.main === module) {
  main();
}
