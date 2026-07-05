const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "DigitalOrder" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "DigitalProduct" CASCADE;`);
    console.log("Tables dropped successfully");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
