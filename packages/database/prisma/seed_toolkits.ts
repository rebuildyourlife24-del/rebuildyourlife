import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Start seeding God-Brain Toolkits & Virtual Budgets...');

  // 1. Maak Enterprise Folders aan
  const folders = [
    { name: 'SEO_MASTER_TOOLKIT', description: 'Keyword and optimization strategies' },
    { name: 'ADS_MASTER_TOOLKIT', description: 'RoAS and targeting blueprints' },
    { name: 'CFO_FINANCIAL_SHIELD', description: 'Tax optimization and fee minimization' },
    { name: 'CONTENT_CREATOR_PROMPTS', description: 'Midjourney/Llama 3 hyper-realism prompts' }
  ];

  for (const f of folders) {
    await prisma.enterpriseFolder.upsert({
      where: { name: f.name },
      update: {},
      create: f
    });
  }

  // 2. Maak de Agent Budgets aan
  const agents = ['SEO_AGENT', 'ADS_AGENT', 'DEV_OPS', 'CONTENT_ENGINE', 'SCRAPER'];

  for (const agent of agents) {
    const budget = await prisma.agentBudget.upsert({
      where: { agentType: agent },
      update: {},
      create: {
        agentType: agent,
        totalAllocated: 500, // Start budget
        currentBalance: 500,
        status: 'ACTIVE'
      }
    });

    // Koppel direct een virtuele kaart
    const existingCard = await prisma.virtualCard.findFirst({ where: { budgetId: budget.id }});
    if (!existingCard) {
      await prisma.virtualCard.create({
        data: {
          budgetId: budget.id,
          cardProvider: 'STRIPE_ISSUING',
          last4: Math.floor(1000 + Math.random() * 9000).toString(),
          spendingLimit: 100
        }
      });
    }
  }

  console.log('✅ Budgets & Virtual Cards configured.');
  
  // TODO: Vul EnterpriseDocuments met daadwerkelijke prompt chains en SOPs.

  console.log('✅ God-Brain Seed voltooid!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
