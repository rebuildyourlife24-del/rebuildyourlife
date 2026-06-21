const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const stores = await prisma.shopifyStore.findMany();
  console.log(JSON.stringify(stores, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
