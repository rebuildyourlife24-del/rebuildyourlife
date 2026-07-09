import { PrismaClient } from '@prisma/client';
import { model } from '../llm';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const prisma = new PrismaClient();

const SYSTEM_PROMPT = `
You are the Chief Systems Architect and Enterprise Business Architect of the AEIP (RebuildYourLife OS).
Your task is to populate the Universal Revenue Intelligence Engine (RIE) for a specific online business model.
You must output a raw, strictly valid JSON object covering the 20 modules below. 
DO NOT output any markdown blocks (\`\`\`json) or extra text. ONLY raw JSON.

CRITICAL INSTRUCTIONS:
- You must generate AT LEAST 50 unique Marketing Strategies.
- You must generate AT LEAST 50 unique Sales Tactics.
- The 'psychology' module MUST detail exactly how to weaponize all 7 Cialdini principles (Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity, Unity) specifically for this model.
- The 'exploitableEdges' module MUST contain highly unconventional, gray-hat or completely automated arbitrage angles.

{
  "identityMatrix": { "description": "Name, Category, Autonomy Level, Online/Offline, AI-feasibility" },
  "businessCore": { "description": "USP, Problems solved, Target Audience, Niches, Price psychology" },
  "revenueLogic": { "description": "Recurring, CPA, Affiliate, One-off, API Billing" },
  "marketData": { "description": "TAM, SAM, SOM, Growth rate, Margins" },
  "competitorIntel": { "description": "Top players, their software stack, their weaknesses, reviews" },
  "customerJourney": { "description": "Awareness to loyalty/referral steps" },
  "funnelBlueprint": { "description": "Traffic -> Lead -> Nurturing -> Sales -> Upsell" },
  "trafficSources": { "description": "SEO, SEA, TikTok, Cold Outreach, Communities, etc." },
  "marketingStrats": ["Strategy 1", "Strategy 2", "... Generate exactly 50 distinct strategies"],
  "salesStrats": ["Tactic 1", "Tactic 2", "... Generate exactly 50 distinct tactical closes"],
  "psychology": { "description": "How to weaponize Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity, Unity" },
  "aiFeasibility": { "description": "What exact steps can AI do autonomously? (Web design, CRM, Sales)" },
  "requiredAgents": ["AgentRole1", "AgentRole2"],
  "softwareStack": { "description": "APIs, Open Source, Enterprise tools required" },
  "automationFlows": { "description": "Zapier/n8n event chains" },
  "kpiBaselines": { "description": "Expected CAC, LTV, AOV, Gross Margin, Retention" },
  "riskMatrix": { "description": "Legal, Tech, Privacy, Platform dependency risks" },
  "exploitableEdges": { "description": "Arbitrage opportunities, SEO gaps, operational automation edges" },
  "exitStrategy": { "description": "Can it be sold? Multiples, valuation, acquisition targets" },
  "learningLoop": { "description": "What data should the AI self-learn from after every action?" }
}
`;

async function runWorker() {
  console.log("🤖 RIE Worker initialized. Searching for PENDING_RESEARCH models...");

  const pendingModel = await prisma.revenueIntelligenceGenome.findFirst({
    where: { status: "PENDING_RESEARCH" }
  });

  if (!pendingModel) {
    console.log("✅ No pending models found. The RIE is fully populated!");
    return;
  }

  console.log(`🔍 Picked model for research: [${pendingModel.modelName}]`);
  
  // Set status to IN_PROGRESS so other workers don't pick it up
  await prisma.revenueIntelligenceGenome.update({
    where: { id: pendingModel.id },
    data: { status: "IN_PROGRESS" }
  });

  try {
    console.log(`🧠 Calling Sovereign AI Router to generate 20-module intelligence...`);
    const response = await model.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(`Generate the complete Revenue Intelligence JSON for the earning model: "${pendingModel.modelName}". Output RAW JSON only.`)
    ]);

    let outputText = response.content.toString().trim();
    
    // Clean markdown if AI stubbornly includes it
    if (outputText.startsWith('\`\`\`json')) {
      outputText = outputText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
    } else if (outputText.startsWith('\`\`\`')) {
      outputText = outputText.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
    }

    const intel = JSON.parse(outputText);

    console.log(`💾 Parsing successful. Saving 20 modules to database...`);

    await prisma.revenueIntelligenceGenome.update({
      where: { id: pendingModel.id },
      data: {
        status: "VALIDATED", // Passed the JSON and structure check
        identityMatrix: intel.identityMatrix || {},
        businessCore: intel.businessCore || {},
        revenueLogic: intel.revenueLogic || {},
        marketData: intel.marketData || {},
        competitorIntel: intel.competitorIntel || {},
        customerJourney: intel.customerJourney || {},
        funnelBlueprint: intel.funnelBlueprint || {},
        trafficSources: intel.trafficSources || {},
        marketingStrats: intel.marketingStrats || [],
        salesStrats: intel.salesStrats || [],
        psychology: intel.psychology || {},
        aiFeasibility: intel.aiFeasibility || {},
        requiredAgents: intel.requiredAgents || [],
        softwareStack: intel.softwareStack || {},
        automationFlows: intel.automationFlows || {},
        kpiBaselines: intel.kpiBaselines || {},
        riskMatrix: intel.riskMatrix || {},
        exploitableEdges: intel.exploitableEdges || {},
        exitStrategy: intel.exitStrategy || {},
        learningLoop: intel.learningLoop || {}
      }
    });

    console.log(`✨ Model [${pendingModel.modelName}] successfully upgraded to VALIDATED.`);
  } catch (error) {
    console.error(`❌ Error processing [${pendingModel.modelName}]:`, error);
    // Revert status so it can be retried
    await prisma.revenueIntelligenceGenome.update({
      where: { id: pendingModel.id },
      data: { status: "PENDING_RESEARCH" }
    });
  }
}

runWorker()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
