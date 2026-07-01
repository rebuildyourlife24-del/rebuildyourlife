import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verwijderen van mock WalletTransactions...');
  const deletedTx = await prisma.walletTransaction.deleteMany({});
  console.log(`Verwijderd: ${deletedTx.count} wallet transacties.`);

  console.log('Verwijderen van mock SyndicatePosts...');
  // Only delete posts made by the system or mock users? Or delete all? The user says "mockup data"
  // Let's delete WalletTransactions first, as that was the main complaint (Holding Omzet).
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
