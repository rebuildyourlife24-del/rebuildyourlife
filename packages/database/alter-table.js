const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Executing raw SQL...");
    await prisma.$executeRawUnsafe('ALTER TABLE "SyndicatePost" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;');
    console.log("✅ Column added successfully.");
  } catch (e) {
    console.error("Error executing SQL:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
