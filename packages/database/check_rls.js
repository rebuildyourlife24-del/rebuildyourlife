const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const res = await prisma.$queryRawUnsafe(`SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('hermes_agents', 'hermes_memory', 'User', 'Session');`);
  console.log(res);
}
check().catch(console.error).finally(() => prisma.$disconnect());
