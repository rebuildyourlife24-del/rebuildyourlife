const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
});

async function main() {
  const email = 'hsemler50@gmail.com';
  const updated = await prisma.user.update({
    where: { email },
    data: {
      role: 'SUPREME_OVERSEER',
    },
  });
  console.log('Successfully updated role to SUPREME_OVERSEER for:', updated.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
