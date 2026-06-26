import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const agentRoles = [
  { role: "Quantum Data Miner", dept: "Intelligence" },
  { role: "Market Sentiment Analyst", dept: "Trade" },
  { role: "Algorithmic Arbitrage Bot", dept: "Finance" },
  { role: "Social Engineering Engineer", dept: "Social" },
  { role: "Neural Content Generator", dept: "Factory" },
  { role: "Autonomous Code Refactorer", dept: "RYL_Dev" },
  { role: "Blockchain Security Auditor", dept: "Security" },
  { role: "Deep Web Harvester", dept: "Intelligence" },
  { role: "Conversion Rate Optimizer", dept: "Commerce" },
  { role: "Viral Loop Architect", dept: "Social" },
];

async function seedAgents() {
  console.log("Seeding 500 agents...");
  const agents = [];
  
  for (let i = 0; i < 500; i++) {
    const roleType = agentRoles[Math.floor(Math.random() * agentRoles.length)];
    agents.push({
      name: `Agent-${Math.random().toString(36).substring(7).toUpperCase()}-${i}`,
      role: roleType.role,
      department: roleType.dept,
      status: "ACTIVE",
      version: "2.0.0",
      systemPrompt: `Execute ${roleType.role} tasks with zero hallucination.`,
      capabilities: [roleType.dept, "Analysis", "Execution"]
    });
  }

  // Batch insert
  await prisma.agentRegistry.createMany({
    data: agents,
    skipDuplicates: true
  });
  
  console.log("500 Agents seeded successfully.");
}

seedAgents()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
