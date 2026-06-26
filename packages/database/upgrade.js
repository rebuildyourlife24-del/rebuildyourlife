const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      role: 'ADMIN',
      subscriptionTier: 'OMEGA',
    },
  });
  console.log('Upgraded ' + result.count + ' users to ADMIN and OMEGA tier.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
