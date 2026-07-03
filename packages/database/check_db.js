const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Checking User Table for Mollie ===");
  const users = await prisma.user.findMany({
    select: {
      email: true,
      mollieAccessToken: true,
      mollieCustomerId: true,
      stripeCustomerId: true,
    }
  });
  console.log(`Users found: ${users.length}`);
  users.forEach(u => {
    console.log(`- ${u.email} | MollieToken: ${u.mollieAccessToken ? 'YES' : 'NO'} | Stripe: ${u.stripeCustomerId ? 'YES' : 'NO'}`);
  });

  console.log("\n=== Checking Shopify Stores ===");
  const stores = await prisma.shopifyStore.findMany();
  console.log(`Shopify Stores found: ${stores.length}`);
  stores.forEach(s => console.log(`- ${s.shopUrl} (Status: ${s.status})`));

  console.log("\n=== Checking Api Integrations ===");
  try {
    const integrations = await prisma.apiIntegration.findMany();
    console.log(`API Integrations found: ${integrations.length}`);
    integrations.forEach(i => console.log(`- Provider: ${i.provider}`));
  } catch(e) {
    console.log("ApiIntegration table not queried or failed.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
