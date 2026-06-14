const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function main() {
  await prisma.$connect();
  console.log("SUCCESS");
}

main().catch(console.error).finally(() => prisma.$disconnect());
