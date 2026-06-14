import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'hsemler50@gmail.com' },
    data: { 
      subscriptionTier: 'SUPREME_OVERSEER',
      role: 'SUPER_ADMIN'
    }
  });
  console.log('Henk upgraded to SUPREME_OVERSEER successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
