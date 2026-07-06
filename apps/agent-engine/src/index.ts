import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateAnnotation, AgentEngineState } from "./state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "./llm";
import { 
  architectNode, developerNode, qaNode, predictiveOracleNode, 
  shopifyAutopilotNode, contentCreatorNode, leadScraperNode, 
  coldEmailNode, devopsNode, trinityNode, athenaNode, gaiaNode, 
  qwenNode, prometheusNode, morpheusNode, nexusNode, chronosNode, echoNode 
} from "./agents";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const members = [
  "architect", "predictive_oracle", "gaia", "trinity", "athena", 
  "shopify_autopilot", "content_creator", "qwen", "prometheus", 
  "developer", "morpheus", "qa", "lead_scraper", "nexus", 
  "cold_email", "devops", "chronos", "echo"
];

const systemPrompt = `Je bent Orion, de Supervisor (CEO) van de RebuildYourLife AI-Swarm.
Je beheert een Council van 18 gespecialiseerde experts: ${members.join(", ")}.

Gezien het gespreksverloop en de oorspronkelijke taak, moet jij bepalen welke werknemer als volgende aan de beurt is.

REGELS:
1. Analyseer de taak en de tot nu toe verzamelde informatie in de 'messages'.
2. Als een specifieke expert nodig is, antwoord dan EXACT met de ruwe string naam van die agent en NIETS ANDERS (bijv. "developer").
3. Als de taak VOLLEDIG is afgerond door het team en er hoeft niets meer te gebeuren, antwoord dan met de exacte string "end".
4. Geef geen uitleg, geen markdown, geen backticks. Enkel het woord.`;

async function supervisorNode(state: AgentEngineState) {
  console.log("\n[SUPERVISOR] Orion overweegt de volgende stap...");
  
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(`De taak is: ${state.task}`),
    ...state.messages,
    new HumanMessage("Gegeven het bovenstaande, wie moet de volgende actie uitvoeren? Geef enkel de ruwe string naam van de agent, of 'end'.")
  ];
  
  try {
    const response = await model.invoke(messages);
    let next = response.content.toString().trim().toLowerCase();
    // Verwijder ongewenste leestekens of markdown
    next = next.replace(/[^a-z_]/g, '');
    
    if (next === "end") {
      console.log("[SUPERVISOR] Beslissing: Taak is succesvol VOLTOOID. -> END\n");
      return { nextAgent: "end" };
    }

    if (!members.includes(next)) {
       console.warn(`[SUPERVISOR WAARSCHUWING] Koos ongeldige agent: '${next}'. Fallback naar 'architect'.\n`);
       next = "architect";
    }

    console.log(`[SUPERVISOR] Delegeert taak aan: -> ${next.toUpperCase()}\n`);
    return { nextAgent: next as any };
  } catch (error) {
    console.error("[SUPERVISOR ERROR] Routering mislukt. Fallback naar END.", error);
    return { nextAgent: "end" };
  }
}

// Bouw de State Graph (Hub and Spoke Model)
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("supervisor", supervisorNode)
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

// 1. Start altijd bij de Supervisor
workflow.addEdge(START, "supervisor");

// 2. Iedere worker (agent) rapporteert altijd terug aan de Supervisor
for (const member of members) {
  workflow.addEdge(member, "supervisor");
}

// 3. De Supervisor routeert dynamisch naar een worker, of naar END
workflow.addConditionalEdges(
  "supervisor",
  (state: AgentEngineState) => state.nextAgent,
  {
    architect: "architect",
    predictive_oracle: "predictive_oracle",
    gaia: "gaia",
    trinity: "trinity",
    athena: "athena",
    shopify_autopilot: "shopify_autopilot",
    content_creator: "content_creator",
    qwen: "qwen",
    prometheus: "prometheus",
    developer: "developer",
    morpheus: "morpheus",
    qa: "qa",
    lead_scraper: "lead_scraper",
    nexus: "nexus",
    cold_email: "cold_email",
    devops: "devops",
    chronos: "chronos",
    echo: "echo",
    end: END
  }
);

import { MemorySaver } from "@langchain/langgraph";
const checkpointer = new MemorySaver();

export const app = workflow.compile({ checkpointer });

// Test-run executie
async function main() {
  console.log("==========================================");
  console.log("=    RYL OS: ORION SUPERVISOR ENGINE     =");
  console.log("==========================================\n");
  
  try {
    const result = await app.invoke({
      task: "Analyseer de concurrentie in de SaaS markt en bedenk een architectuur voor onze nieuwe dashboard tool.",
      messages: []
    }, { configurable: { thread_id: "test-run-orion-" + Date.now() }, streamMode: "values" });
    
    console.log("\n==========================================");
    console.log("=         SWARM EXECUTION COMPLETE       =");
    console.log("==========================================");
  } catch (error) {
    console.error("[AGENT ENGINE] Crash tijdens executie:", error);
  }
}

if (require.main === module) {
  main();
}
