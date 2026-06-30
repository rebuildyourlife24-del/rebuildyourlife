import { PrismaClient } from '@prisma/client';
import { OrionIntelligenceService } from './apps/web/src/lib/services/orion.service';
import { HermesExecutionService } from './apps/web/src/lib/services/hermes.service';

const prisma = new PrismaClient();

async function runTest() {
  console.log('--- STARTING ORION-HERMES RELAY TEST ---');
  
  // 1. Haal de admin user op
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found in database. Please register a user first.');
    return;
  }
  console.log(`Using User ID: ${user.id} (${user.email})`);

  // Ensure user has a wallet
  await prisma.userWallet.upsert({
    where: { userId: user.id },
    update: { fiatBalance: 5000 },
    create: { userId: user.id, fiatBalance: 5000 }
  });

  try {
    // 2. ORION (JAGER) SCAN
    const query = "Find a high-converting Dropshipping product trend in the US market for Q4.";
    console.log(`\n[1] Invoking Orion with query: "${query}"...`);
    const dossier = await OrionIntelligenceService.performMarketReconnaissance(user.id, query);
    
    // 3. HERMES (HANDELAAR) EXECUTION
    console.log(`\n[2] Handoff to Hermes...`);
    const result = await HermesExecutionService.evaluateOrionDossierAndPrepare(user.id, dossier);
    
    console.log('\n--- RELAY TEST COMPLETE ---');
    console.log('Result:', result);
    console.log('Check your Control Matrix in the dashboard!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
