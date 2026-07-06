import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateAnnotation } from "./state";
import { architectNode, developerNode, qaNode, predictiveOracleNode, shopifyAutopilotNode, contentCreatorNode, leadScraperNode, coldEmailNode, devopsNode, trinityNode, athenaNode, gaiaNode, qwenNode, prometheusNode, morpheusNode, nexusNode, chronosNode, echoNode } from "./agents";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Bouw de State Graph
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("architect", architectNode)
  .addNode("predictive_oracle", predictiveOracleNode)
  .addNode("gaia", gaiaNode)
  .addNode("trinity", trinityNode)
  .addNode("athena", athenaNode)
  .addNode("shopify_autopilot", shopifyAutopilotNode)
  .addNode("content_creator", contentCreatorNode)
  .addNode("qwen", qwenNode)
  .addNode("prometheus", prometheusNode)
  .addNode("developer", developerNode)
  .addNode("morpheus", morpheusNode)
  .addNode("qa", qaNode)
  .addNode("lead_scraper", leadScraperNode)
  .addNode("nexus", nexusNode)
  .addNode("cold_email", coldEmailNode)
  .addNode("devops", devopsNode)
  .addNode("chronos", chronosNode)
  .addNode("echo", echoNode);

// Verbind de Nodes (Edges)
workflow.addEdge(START, "architect");
workflow.addEdge("architect", "predictive_oracle");
workflow.addEdge("predictive_oracle", "gaia");
workflow.addEdge("gaia", "trinity");
workflow.addEdge("trinity", "athena");
workflow.addEdge("athena", "shopify_autopilot");
workflow.addEdge("shopify_autopilot", "content_creator");
workflow.addEdge("content_creator", "qwen");
workflow.addEdge("qwen", "prometheus");
workflow.addEdge("prometheus", "developer");
workflow.addEdge("developer", "morpheus");
workflow.addEdge("morpheus", "qa");

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
workflow.addEdge("lead_scraper", "nexus");
workflow.addEdge("nexus", "cold_email");
workflow.addEdge("cold_email", "devops");
workflow.addEdge("devops", "chronos");
workflow.addEdge("chronos", "echo");
workflow.addEdge("echo", END);

import { MemorySaver } from "@langchain/langgraph";
const checkpointer = new MemorySaver();

export const app = workflow.compile({ checkpointer });

// Test-run executie
async function main() {
  console.log("[AGENT ENGINE] Starting Agent Swarm execution with predictive engine...");
  console.log("AI Router is geladen via llm.ts");
  
  try {
    const result = await app.invoke({
      task: "Verhoog conversie door een dynamic coupon B2B outreach op te zetten",
      messages: [],
      nextAgent: "architect"
    }, { configurable: { thread_id: "test-run-" + Date.now() } });
    
    console.log("\n--- SWARM EXECUTION COMPLETE ---");
    console.log("PR URL:", result.prUrl);
    console.log("Prediction ID:", result.predictionId);
    console.log("Shopify Product Title:", result.sourcedProductTitle);
    console.log("Shopify Product ID:", result.shopifyProductId);
    console.log("Gescrapte leads aantal:", result.scrapedLeads?.length);
    console.log("EmailCampaign ID:", result.emailCampaignId);
  } catch (error) {
    console.error("[AGENT ENGINE] Crash tijdens executie:", error);
  }
}

if (require.main === module) {
  main();
}
