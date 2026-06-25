const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  // Use the exact database URL from apps/web/.env.local
  const url = "postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  
  const prisma = new PrismaClient({
    datasourceUrl: url,
  });

  try {
    console.log("Testing connection...");
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Connection successful! Users found:", users.length);
  } catch (err) {
    console.error("Connection failed!");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
