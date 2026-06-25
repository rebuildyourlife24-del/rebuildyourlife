import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AGENT_DEPARTMENTS = [
  'Sales', 'Marketing', 'Development', 'Finance', 'Legal',
  'Operations', 'Content', 'Community', 'Data Analytics', 'Support'
];

async function seedAgents() {
  console.log('Seeding 50 RYL Agents into the AgentRegistry...');

  // Create 50 agents
  for (let i = 1; i <= 50; i++) {
    const department = AGENT_DEPARTMENTS[i % AGENT_DEPARTMENTS.length];
    
    await prisma.agentRegistry.upsert({
      where: { name: `RYL_AGENT_${String(i).padStart(2, '0')}` },
      update: {},
      create: {
        agentNumber: i,
        name: `RYL_AGENT_${String(i).padStart(2, '0')}`,
        role: `Specialist Level ${Math.floor(Math.random() * 3) + 1}`,
        department: department,
        capabilities: ['data_analysis', 'communication'],
        systemPrompt: `You are RYL Agent ${i}, specializing in ${department}. Your objective is to assist Orion in dominating the market.`,
        budgetAllocated: Math.floor(Math.random() * 1000),
      }
    });
  }

  console.log('Successfully seeded 50 agents.');
}

seedAgents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
