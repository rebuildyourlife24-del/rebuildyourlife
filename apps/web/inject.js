const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  await prisma.shopifyStore.upsert({
    where: {
      userId_shopUrl: {
        userId: TEST_USER_ID,
        shopUrl: "build-your-dream-30fnc3bp.myshopify.com",
      }
    },
    update: {
      accessToken: "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",
      createdAt: new Date() // Force to be the latest
    },
    create: {
      userId: TEST_USER_ID,
      shopUrl: "build-your-dream-30fnc3bp.myshopify.com",
      accessToken: "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",
      createdAt: new Date()
    }
  });
  console.log("INJECTED SUCCESSFULLY");
}
main().catch(console.error).finally(() => prisma.$disconnect());
