import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  // Create test user if not exists
  const user = await prisma.user.upsert({
    where: { id: TEST_USER_ID },
    update: {},
    create: {
      id: TEST_USER_ID,
      email: "godmode@rebuildyourlife.eu",
      passwordHash: "dummy",
      firstName: "God",
      lastName: "Mode"
    }
  });

  // Create Shopify Store
  const store = await prisma.shopifyStore.upsert({
    where: { 
      userId_shopUrl: {
        userId: TEST_USER_ID,
        shopUrl: "rebuildyourlife.myshopify.com" // Best guess placeholder
      }
    },
    update: {
      accessToken: "atkn_c31b33a82d407d8064b40841dd05d824a1aeec41860ec55acc2724601f5dc30a"
    },
    create: {
      userId: TEST_USER_ID,
      shopUrl: "rebuildyourlife.myshopify.com",
      accessToken: "atkn_c31b33a82d407d8064b40841dd05d824a1aeec41860ec55acc2724601f5dc30a"
    }
  });

  console.log("Shopify Store Injected Successfully:", store);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
