import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupTestData() {
  console.log('Cleaning up seeded test data for Hendrik Semler accounts to allow clean live system connection...');

  // Find the Hendrik Semler accounts
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['hsemler50@gmail.com', 'ceo@rebuildyourlife.com', 'admin@rebuildyourlife.eu']
      }
    }
  });

  for (const user of users) {
    console.log(`Cleaning data for user: ${user.email} (${user.id})`);

    // 1. Delete Treasury Vaults
    const vaultDel = await prisma.treasuryVault.deleteMany({ where: { userId: user.id } });
    console.log(`  Deleted ${vaultDel.count} vaults`);

    // 2. Delete Debts
    const debtDel = await prisma.debt.deleteMany({ where: { userId: user.id } });
    console.log(`  Deleted ${debtDel.count} debts`);

    // 3. Delete Activity Logs
    const logDel = await prisma.systemActivityLog.deleteMany({ where: { userId: user.id } });
    console.log(`  Deleted ${logDel.count} activity logs`);
  }

  // 4. Delete Opportunities
  const oppDel = await prisma.opportunity.deleteMany();
  console.log(`Deleted ${oppDel.count} opportunities`);

  console.log('✓ Cleanup complete!');
}

cleanupTestData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
