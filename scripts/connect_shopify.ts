const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error("Geen user gevonden in de database. Kan shopify niet koppelen.");
    return;
  }

  const shopUrl = "my-store-2.myshopify.com";
  const accessToken = "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";
  const clientId = "439caa8ef2c2b300243c4e8b290aa6fd";

  const store = await prisma.shopifyStore.upsert({
    where: {
      userId_shopUrl: {
        userId: user.id,
        shopUrl: shopUrl
      }
    },
    update: {
      accessToken,
      status: 'ACTIVE'
    },
    create: {
      userId: user.id,
      shopUrl,
      accessToken,
      status: 'ACTIVE',
      totalRevenue: 0
    }
  });

  console.log("🚀 Shopify Store succesvol gekoppeld aan profiel:", user.email);
  console.log("Token Secured: shpss_***");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
