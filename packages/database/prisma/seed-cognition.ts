import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Cognitive Architecture (Objectives & Constraints)...');

  // --- OBJECTIVES ---
  const objectives = [
    { name: 'Revenue Growth', weight: 40, targetValue: null },
    { name: 'Cash Preservation', weight: 30, targetValue: null },
    { name: 'Customer Satisfaction', weight: 15, targetValue: 95 },
    { name: 'Operational Efficiency', weight: 10, targetValue: null },
    { name: 'Innovation', weight: 5, targetValue: null }
  ];

  for (const obj of objectives) {
    await prisma.objective.upsert({
      where: { name: obj.name },
      update: { weight: obj.weight, targetValue: obj.targetValue },
      create: { name: obj.name, weight: obj.weight, targetValue: obj.targetValue, status: 'ACTIVE' }
    });
  }
  console.log(`✅ Upserted ${objectives.length} Objectives.`);

  // --- CONSTRAINTS ---
  const constraints = [
    { name: 'Cash runway > 180 days', metric: 'cash_runway_days', operator: '>', thresholdValue: 180, isHardLimit: true },
    { name: 'Debt ratio < 30%', metric: 'debt_ratio_pct', operator: '<', thresholdValue: 30, isHardLimit: true },
    { name: 'Refund rate < 3%', metric: 'refund_rate_pct', operator: '<', thresholdValue: 3, isHardLimit: true },
    { name: 'CPA < €35', metric: 'cpa_eur', operator: '<', thresholdValue: 35, isHardLimit: false },
    { name: 'Inventory turnover > 8', metric: 'inventory_turnover', operator: '>', thresholdValue: 8, isHardLimit: false }
  ];

  for (const cons of constraints) {
    await prisma.constraint.upsert({
      where: { name: cons.name },
      update: { metric: cons.metric, operator: cons.operator, thresholdValue: cons.thresholdValue, isHardLimit: cons.isHardLimit },
      create: { name: cons.name, metric: cons.metric, operator: cons.operator, thresholdValue: cons.thresholdValue, isHardLimit: cons.isHardLimit, status: 'ACTIVE' }
    });
  }
  console.log(`✅ Upserted ${constraints.length} Constraints.`);

  console.log('Cognitive Seeding Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
