import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUserData() {
  console.log('Seeding financial and opportunity data for users...');

  // Get all users in the system
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log('No users found in database. Seed users first!');
    return;
  }

  for (const user of users) {
    console.log(`Processing user: ${user.email} (${user.id})`);

    // 1. Seed TreasuryVaults (Balances)
    const vaultCount = await prisma.treasuryVault.count({ where: { userId: user.id } });
    if (vaultCount === 0) {
      await prisma.treasuryVault.createMany({
        data: [
          {
            userId: user.id,
            vaultType: 'WAR_ROOM_SAFE',
            balance: 285400.00,
            reservedRiskCap: 50000.00,
            status: 'ACTIVE'
          },
          {
            userId: user.id,
            vaultType: 'CRYPTO_RESERVE',
            balance: 142100.00,
            reservedRiskCap: 30000.00,
            status: 'ACTIVE'
          },
          {
            userId: user.id,
            vaultType: 'LIQUIDITY_BUFFER',
            balance: 75000.00,
            reservedRiskCap: 10000.00,
            status: 'ACTIVE'
          }
        ]
      });
      console.log(`  ✓ Seeded 3 vaults for ${user.email}`);
    } else {
      console.log(`  - Vaults already exist for ${user.email}`);
    }

    // 2. Seed Debts
    const debtCount = await prisma.debt.count({ where: { userId: user.id } });
    if (debtCount === 0) {
      await prisma.debt.createMany({
        data: [
          {
            userId: user.id,
            creditorName: 'Aethelgard Corp (Ventures)',
            originalAmount: 150000.00,
            currentBalance: 84000.00,
            interestRate: 4.5,
            minimumPayment: 1500.00,
            monthlyPayment: 2500.00,
            status: 'ACTIVE',
            priority: 1
          },
          {
            userId: user.id,
            creditorName: 'Alpha Credit Line',
            originalAmount: 50000.00,
            currentBalance: 12000.00,
            interestRate: 6.0,
            minimumPayment: 500.00,
            monthlyPayment: 1000.00,
            status: 'ACTIVE',
            priority: 2
          }
        ]
      });
      console.log(`  ✓ Seeded 2 debts for ${user.email}`);
    } else {
      console.log(`  - Debts already exist for ${user.email}`);
    }

    // 3. Seed SystemActivityLogs
    const logCount = await prisma.systemActivityLog.count({ where: { userId: user.id } });
    if (logCount === 0) {
      await prisma.systemActivityLog.createMany({
        data: [
          {
            userId: user.id,
            action: 'Orion neuraal netwerk succesvol gekoppeld aan live node ALPHA-1.',
            category: 'SYSTEM',
            status: 'SUCCESS'
          },
          {
            userId: user.id,
            action: 'Shopify sync voltooid voor rebuildyourlife.myshopify.com. 0 open orders.',
            category: 'SHOPIFY',
            status: 'SUCCESS'
          },
          {
            userId: user.id,
            action: 'GoCardless bankkoppeling gecontroleerd. Saldo gesynchroniseerd.',
            category: 'BANKING',
            status: 'SUCCESS'
          }
        ]
      });
      console.log(`  ✓ Seeded 3 activity logs for ${user.email}`);
    } else {
      console.log(`  - Activity logs already exist for ${user.email}`);
    }
  }

  // 4. Seed Global Opportunities (assignedToId is null, available for everyone)
  const oppCount = await prisma.opportunity.count();
  if (oppCount === 0) {
    await prisma.opportunity.createMany({
      data: [
        {
          title: 'Sovereign Sourcing: ECOM-GRID-ALPHA',
          description: 'Automated dropshipping validation for high-margin physical assets.',
          payout: 8500.00,
          category: 'ECOM',
          status: 'AVAILABLE',
          executionType: 'CLIENT_BROKERED',
          commissionRate: 0.15
        },
        {
          title: 'Neurale Swarm: Copywriting Brokerage',
          description: 'Mass scale copy creation service using Orion-Llama engine.',
          payout: 4200.00,
          category: 'TECH',
          status: 'AVAILABLE',
          executionType: 'AI_DELEGATED',
          commissionRate: 0.10
        },
        {
          title: 'Arbitrage Opportunity: Bybit Spot/Futures',
          description: 'Realtime trading discrepancy detected on SOL/USDT pair.',
          payout: 12500.00,
          category: 'TRADING',
          status: 'AVAILABLE',
          executionType: 'AI_DELEGATED',
          commissionRate: 0.20
        }
      ]
    });
    console.log('✓ Seeded 3 global opportunities');
  } else {
    console.log('- Opportunities already exist');
  }

  console.log('✓ User data seeding complete!');
}

seedUserData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
