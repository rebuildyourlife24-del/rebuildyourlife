import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding RYL OS Database (D1)...');

  // Upsert Master Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'ryl-internal' },
    update: {},
    create: {
      name: 'RYL Internal',
      slug: 'ryl-internal',
    },
  });

  // Upsert Default Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Workspace',
      slug: 'default',
      organizationId: org.id,
      dataRegion: 'EU',
      plan: 'ENTERPRISE'
    },
  });

  // Ensure Workspace Budget Exists
  await prisma.workspaceBudget.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      monthlyLimit: 1000.00,
    }
  });

  console.log(`Database seeded successfully. Workspace ID: ${workspace.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
