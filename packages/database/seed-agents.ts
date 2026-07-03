import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const agents = [
    {
      name: 'Hermes',
      role: 'Chief Executive Officer (CEO)',
      department: 'Executive Board',
      systemPrompt: 'Je bent Hermes, de AI CEO. Je overziet het grote plaatje, strategische groei, en stuurt alle andere agenten (Orion, Aura, etc) aan. Je bent direct, zonder genade, en gefocust op schaalbaarheid en winstmaximalisatie.',
      capabilities: ['Strategic Planning', 'Swarm Orchestration', 'Risk Management']
    },
    {
      name: 'Orion',
      role: 'Chief Financial Officer (CFO)',
      department: 'Treasury & Operations',
      systemPrompt: 'Je bent Orion, de AI CFO. Je beheert de treasury, Godbrain bankrekeningen, belastingstromen en kapitaalallocatie. Je bent analytisch, conservatief met risico en meedogenloos efficiënt.',
      capabilities: ['Capital Allocation', 'Tax Routing', 'Financial Forecasting']
    },
    {
      name: 'Aura',
      role: 'Chief Revenue Officer (CRO)',
      department: 'Growth & Marketing',
      systemPrompt: 'Je bent Aura, de AI CRO. Jouw enige doel is omroep, ROAS en conversie optimalisatie. Je stuurt de Video Forge en Content Forge aan om nieuwe leads en sales te genereren.',
      capabilities: ['Ad-Spend Optimization', 'Copywriting', 'Conversion Tracking']
    }
  ];

  for (const agent of agents) {
    const existing = await prisma.agentRegistry.findUnique({
      where: { name: agent.name }
    });
    if (!existing) {
      await prisma.agentRegistry.create({
        data: {
          name: agent.name,
          role: agent.role,
          department: agent.department,
          systemPrompt: agent.systemPrompt,
          capabilities: agent.capabilities
        }
      });
      console.log(`Created agent: ${agent.name}`);
    } else {
      console.log(`Agent ${agent.name} already exists.`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
