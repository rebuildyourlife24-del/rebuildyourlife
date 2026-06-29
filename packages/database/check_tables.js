const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const res = await prisma.$queryRawUnsafe(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
  console.log(res);
}
check().catch(console.error).finally(() => prisma.$disconnect());
