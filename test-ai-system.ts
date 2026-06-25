import { routeToAgent } from "./apps/api/src/services/ai.service.js";
import { routeAIRequest } from "./apps/api/src/services/ai-router.js";
import * as dotenv from "dotenv";
import * as path from "path";

// Laad de omgevingsvariabelen uit de .env file
dotenv.config();

console.log("=== START INTEGRATIETEST SOVEREIGN AI SYSTEM ===");

// 1. Test Categorisering (routeToAgent)
const testMessages = [
  { text: "Ik heb een schuld van 5000 euro bij de Rabobank en een deurwaarder dreigt met beslaglegging.", expected: "DEBT_ENGINE" },
  { text: "Maak een budgetplan voor deze maand en help me te besparen op mijn vaste lasten.", expected: "FINANCIAL" },
  { text: "Plan een vergadering in voor morgenochtend en voeg de to-do lijst toe aan mijn agenda.", expected: "TASK_EXECUTOR" },
  { text: "Ik voel me gestrest en heb moeite om nuchter te blijven, ik ben bang voor een terugval.", expected: "RECOVERY" },
  { text: "Analyseer de data en geef me een voortgangsrapport met KPI's.", expected: "ANALYTICS" },
  { text: "Ik wil aan mijn mindset werken en een gezonde dagelijkse routine opbouwen.", expected: "LIFE_COACH" },
  { text: "Wat is de langetermijnvisie en de strategie voor RebuildYourLife?", expected: "CEO" }
];

console.log("\n--- TEST 1: CATEGORISERING (routeToAgent) ---");
let categoriseringGeslaagd = true;
for (const test of testMessages) {
  const result = routeToAgent(test.text);
  const status = result === test.expected ? "✅" : "❌";
  console.log(`${status} Bericht: "${test.text.slice(0, 40)}..." -> Gecategoriseerd als: ${result} (Verwacht: ${test.expected})`);
  if (result !== test.expected) categoriseringGeslaagd = false;
}

// 2. Test AI Router (routeAIRequest) met echte providers (Cerebras -> Groq -> Gemini)
console.log("\n--- TEST 2: SOVEREIGN AI ROUTER VERBINDING ---");

async function runRouterTest() {
  const messages = [
    { role: "user" as const, content: "Hallo! Geef een heel kort antwoord (max 10 woorden) om te bevestigen dat je online bent en spreek me aan met 'Henk'." }
  ];

  try {
    console.log("Verzoek verzenden naar Sovereign AI Router...");
    const response = await routeAIRequest(messages, "Je bent Orion, de centrale AI CEO van RebuildYourLife. Spreek altijd Nederlands.");
    console.log("✅ Router Response ontvangen!");
    console.log(`- Gebruikte Provider: ${response.provider}`);
    console.log(`- Model: ${response.model}`);
    console.log(`- Content: "${response.content.trim()}"`);
    return true;
  } catch (error: any) {
    console.error("❌ Router Test Gefaald:", error.message);
    return false;
  }
}

// Run de test
async function main() {
  const routerGeslaagd = await runRouterTest();
  console.log("\n=== TEST RESULTATEN ===");
  console.log(`Categorisering: ${categoriseringGeslaagd ? "GESLAAGD ✅" : "GEFAALD ❌"}`);
  console.log(`AI Router Verbinding: ${routerGeslaagd ? "GESLAAGD ✅" : "GEFAALD ❌"}`);
  process.exit(categoriseringGeslaagd && routerGeslaagd ? 0 : 1);
}

main();
