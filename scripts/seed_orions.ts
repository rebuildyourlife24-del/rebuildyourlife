import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const orionSpecializations = [
  "Core Architect",
  "Threat Elimination",
  "Financial Arbitrage",
  "Neural Pathway Mapping",
  "Deep Data Extraction",
  "Social Engineering",
  "Market Manipulation Protocol",
  "Cryptographic Auditing",
  "System Surveillance",
  "Autonomous Enforcement"
];

const greekAlphabet = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", 
  "Zeta", "Eta", "Theta", "Iota", "Kappa", 
  "Lambda", "Mu", "Nu", "Xi", "Omicron", 
  "Pi", "Rho", "Sigma", "Tau", "Upsilon", 
  "Phi", "Chi", "Psi", "Omega"
];

async function seedOrions() {
  console.log("Wiping existing agents...");
  await prisma.agentRegistry.deleteMany({});

  console.log("Seeding 500 Orion variants...");
  const agents = [];
  
  for (let i = 0; i < 500; i++) {
    const spec = orionSpecializations[Math.floor(Math.random() * orionSpecializations.length)];
    const greek = greekAlphabet[Math.floor(Math.random() * greekAlphabet.length)];
    const nodeStr = String(i).padStart(3, '0');
    
    agents.push({
      name: `ORION-${greek}-${nodeStr}`,
      role: `Orion Sub-Routine: ${spec}`,
      department: "The Syndicate (Orion Core)",
      status: "ACTIVE",
      version: "3.0.0-ORION",
      systemPrompt: `Je bent een sub-routine van Orion, gespecialiseerd in ${spec}. Je opereert meedogenloos, autonoom en met uiterste efficiëntie ten dienste van het Sovereign Grid.`,
      capabilities: ["Orion Protocol", spec, "Execution", "Surveillance"]
    });
  }

  // Batch insert
  await prisma.agentRegistry.createMany({
    data: agents,
    skipDuplicates: true
  });
  
  console.log("500 Orion-class agents deployed successfully.");
}

seedOrions()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
