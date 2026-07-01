import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = "hsemler50@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error("User not found");
    return;
  }

  console.log(`Seeding data for user ${user.id}...`);

  const existing = await prisma.walletTransaction.count({
    where: { userId: user.id, status: "COMPLETED" }
  });

  if (existing > 0) {
    console.log("Data was al gesynct met de test-netwerken.");
    return;
  }

  const newTransactions = [];
  const now = new Date();

  // Genereer transacties voor de afgelopen 6 weken (42 days)
  for (let i = 0; i < 42; i++) {
    const txDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // Willekeurige Ecom Sale
    newTransactions.push({
      userId: user.id,
      amount: Math.floor(Math.random() * 500) + 50,
      type: "ECOM_SALE",
      executedBy: "Mollie",
      status: "COMPLETED",
      description: "Shopify Bestelling",
      createdAt: txDate
    });

    // Willekeurige SaaS abonnement
    if (i % 3 === 0) {
      newTransactions.push({
        userId: user.id,
        amount: 49.99,
        type: "SAAS_SUBSCRIPTION",
        executedBy: "Stripe",
        status: "COMPLETED",
        description: "RYL SaaS Abbo",
        createdAt: txDate
      });
    }

    // Willekeurige Agency Retainer (minder vaak)
    if (i % 14 === 0) {
      newTransactions.push({
        userId: user.id,
        amount: 1500,
        type: "AGENCY_RETAINER",
        executedBy: "Bank Transfer",
        status: "COMPLETED",
        description: "SMMA Klant",
        createdAt: txDate
      });
    }
  }

  await prisma.walletTransaction.createMany({
    data: newTransactions
  });

  // Create Projects if they don't exist
  const existingProjects = await prisma.project.count({
    where: { userId: user.id }
  });

  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        { userId: user.id, name: "Holding", industry: "Diversified", isHolding: true },
        { userId: user.id, name: "E-Com Alpha", industry: "E-Commerce", domainUrl: "ecom.rebuildyourlife.eu" },
        { userId: user.id, name: "Agency Beta", industry: "Service", domainUrl: "agency.rebuildyourlife.eu" }
      ]
    });
    console.log("Created demo projects.");
  }

  console.log("Database is succesvol voorzien van live-test data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
