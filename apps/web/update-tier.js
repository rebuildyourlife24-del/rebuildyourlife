const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function main() {
  await prisma.user.updateMany({
    where: { email: 'hsemler50@gmail.com' },
    data: { subscriptionTier: 'ENTERPRISE' }
  });
  console.log("Tier updated to ENTERPRISE");
}

main().catch(console.error).finally(() => prisma.$disconnect());
