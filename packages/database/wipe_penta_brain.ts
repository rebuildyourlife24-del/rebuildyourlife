import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up old test data to prepare for live launch...');
  await prisma.hermesAgentTask.deleteMany({});
  await prisma.actionProposal.deleteMany({});
  await prisma.funnelEvent.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.campaign.deleteMany({});
  console.log('Wipe complete! The database is now ready for live traffic.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
