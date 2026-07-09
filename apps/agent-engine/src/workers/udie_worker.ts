import { PrismaClient } from '@prisma/client';
import { model } from '../llm';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const prisma = new PrismaClient();

const UDIE_SYSTEM_PROMPT = `
You are the Universal Database Intelligence Engine (UDIE) and Database Guardian Layer.
Your task is to analyze database metrics and propose safe, evolutionary fixes.
You MUST output valid JSON only. No markdown formatting.

Format:
{
  "problemDetected": "String describing the issue (e.g. Missing index on customers.created_at)",
  "proposedFix": "SQL or action to execute (e.g. CREATE INDEX idx_customer_created)",
  "expectedImpact": "String (e.g. +73% query speed expected)",
  "riskScore": 2, // 1 to 10
  "usersAffected": 0,
  "rollbackPlan": "SQL to rollback (e.g. DROP INDEX idx_customer_created)"
}
`;

async function runUdieWorker() {
  console.log("🧬 UDIE Evolution Loop Initialized...");
  console.log("🛡️ Database Guardian Layer Active [PHASE 1: HUMAN-IN-THE-LOOP]");

  const TARGET_DATABASES = [
    { targetDatabase: "Orion_Master_DB", dbType: "PostgreSQL" },
    { targetDatabase: "Hermes_DB", dbType: "PostgreSQL" },
    { targetDatabase: "Quantum_DB", dbType: "PostgreSQL" },
    { targetDatabase: "Vault_DB", dbType: "PostgreSQL" },
    { targetDatabase: "Sovereign_DB", dbType: "PostgreSQL" },
    { targetDatabase: "Pinecone_Vector_Engine", dbType: "Pinecone (Vector)" }
  ];

  for (const db of TARGET_DATABASES) {
    let genome = await prisma.databaseIntelligenceGenome.findFirst({
      where: { targetDatabase: db.targetDatabase }
    });

    if (!genome) {
      await prisma.databaseIntelligenceGenome.create({
        data: {
          targetDatabase: db.targetDatabase,
          dbType: db.dbType,
          identifiedAnomalies: {},
          appliedFixes: {}
        }
      });
      console.log(`Created UDIE Genome for: ${db.targetDatabase}`);
    }
  }

  // Haal de eerste database op die we deze loop-cyclus gaan scannen
  const currentDb = await prisma.databaseIntelligenceGenome.findFirst();
  
  if (!currentDb) return;

  console.log(`📡 Observing Database Metrics for [${currentDb.targetDatabase}]...`);
  // Simulated metric: Slow query detected
  const simulatedMetric = "Query 'SELECT * FROM User WHERE email = ?' takes 4.2 seconds on average. Table has 5M rows.";
  
  console.log(`⚠️ Anomaly Detected: ${simulatedMetric}`);
  console.log("🧠 Diagnosing and Designing Solution via AI Literature/StackOverflow RAG...");

  try {
    const response = await model.invoke([
      new SystemMessage(UDIE_SYSTEM_PROMPT),
      new HumanMessage(`Analyze this metric and propose a fix: ${simulatedMetric}`)
    ]);

    let outputText = response.content.toString().trim();
    if (outputText.startsWith('\`\`\`json')) outputText = outputText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
    else if (outputText.startsWith('\`\`\`')) outputText = outputText.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();

    const analysis = JSON.parse(outputText);

    console.log("🧪 Simulating Impact...");
    // Simulated benchmarking delay
    await new Promise(r => setTimeout(r, 1000));
    console.log(`✅ Simulation passed. Impact: ${analysis.expectedImpact}`);

    console.log("🛡️ Guardian Layer Validation...");
    
    // Guardian Rules (Phase 1 vs Phase 2 Logic)
    let authorization = "PENDING_HUMAN";
    if (analysis.riskScore <= 3 && analysis.proposedFix.includes("CREATE INDEX")) {
      // In Phase 2 this would be AUTO_APPROVED, but user requested Phase 1 for now.
      console.log(`[GUARDIAN] Action is safe (Risk: ${analysis.riskScore}/10). Enforcing Phase 1: Human-in-the-loop.`);
    }

    // Save Proposal
    const proposal = await prisma.udieActionProposal.create({
      data: {
        genomeId: currentDb.id,
        problemDetected: analysis.problemDetected,
        proposedFix: analysis.proposedFix,
        expectedImpact: analysis.expectedImpact,
        riskScore: analysis.riskScore,
        usersAffected: analysis.usersAffected || 0,
        rollbackPlan: analysis.rollbackPlan,
        isBackupVerified: true, // Simulated
        authorization: authorization
      }
    });

    console.log(`\n======================================================`);
    console.log(`🛑 UDIE PROPOSAL REQUIRES HUMAN APPROVAL (ID: ${proposal.id})`);
    console.log(`Problem: ${proposal.problemDetected}`);
    console.log(`Proposed Fix: ${proposal.proposedFix}`);
    console.log(`Risk Score: ${proposal.riskScore}/10 | Rollback: ${proposal.rollbackPlan}`);
    console.log(`[ACCEPTEREN] [AFWIJZEN] [SIMULEREN]`);
    console.log(`======================================================\n`);

  } catch (error) {
    console.error("❌ UDIE Diagnostic Failed:", error);
  }
}

runUdieWorker()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
