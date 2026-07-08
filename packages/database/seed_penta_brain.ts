import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up old test data...');
  await prisma.hermesAgentTask.deleteMany({});
  await prisma.actionProposal.deleteMany({});
  await prisma.funnelEvent.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.campaign.deleteMany({});

  console.log('Seeding Campaigns...');
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Summer Launch 2026',
      sourceType: 'PAID_AD',
      platform: 'meta',
      budgetCents: 50000,
      spendCents: 12500,
    },
  });

  console.log('Seeding Leads, FunnelEvents, HermesTasks & VaultProposals...');
  const stages = ['VISITOR', 'LEAD', 'MQL', 'SQL', 'CUSTOMER'] as const;
  const statuses = ['PENDING', 'RUNNING', 'COMPLETED', 'STUCK', 'AWAITING_APPROVAL'] as const;

  for (let i = 0; i < 15; i++) {
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const lead = await prisma.lead.create({
      data: {
        email: `test_lead_${i}_${uuidv4().substring(0, 6)}@example.com`,
        firstName: `Test${i}`,
        lastName: 'User',
        funnelStage: stage,
        leadScore: Math.floor(Math.random() * 80) + 10,
        campaignId: campaign.id,
      },
    });

    const event = await prisma.funnelEvent.create({
      data: {
        leadId: lead.id,
        eventType: 'lead_created',
        metadata: { ip: '127.0.0.1', browser: 'Chrome' },
      },
    });

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let proposalId: string | null = null;
    let agentKey = 'lead_gen_v1';

    if (status === 'AWAITING_APPROVAL') {
      agentKey = 'copywriter_v1';
      const prop = await prisma.actionProposal.create({
        data: {
          agentId: agentKey,
          agentName: 'Copywriter Agent',
          category: 'BRAND_CONTENT_PUBLISH',
          proposedPayload: { draft: `Check out our new offer, lead ${lead.id}!` },
          riskAmountCents: 0,
          justification: 'A/B test variation required based on low conversion rate.',
          status: 'PENDING',
        },
      });
      proposalId = prop.id;
    } else if (status === 'STUCK') {
      agentKey = 'lead_gen_v1';
    }

    await prisma.hermesAgentTask.create({
      data: {
        triggerEventId: event.id,
        leadId: lead.id,
        agentKey: agentKey,
        payload: { action: 'nurture_sequence_1' },
        status: status,
        vaultProposalId: proposalId,
        lastError: status === 'STUCK' ? 'API Timeout Error' : null,
        attempts: status === 'STUCK' ? 3 : 0,
      },
    });
  }

  console.log('Seed complete! 15 Leads with events, tasks, and proposals generated across clusters.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
