import { ContentEngine } from './src/lib/agents/ContentEngine';

async function runTest() {
  console.log("==========================================");
  console.log("🚀 INITIATING BILLIONAIRE CONTENT ENGINE");
  console.log("==========================================\n");

  const product = "De 'Unicorn OS' Software";
  const goal = "Conversie optimalisatie voor MKB ondernemers";

  console.log("[1] Genereren van Ultra-Premium Visual Prompt...");
  const visualPrompt = await ContentEngine.generateVisualPrompt(goal);
  console.log("👉 PROMPT:");
  console.log(visualPrompt);
  console.log("\n------------------------------------------\n");

  console.log("[2] Genereren van First-Class TikTok/Reels Script...");
  const script = await ContentEngine.buildCampaignScript(product);
  console.log("👉 SCRIPT:");
  console.log(script);
  console.log("\n==========================================");
  console.log("✅ TEST SUCCESVOL AFGEROND");
}

runTest().catch(console.error);
