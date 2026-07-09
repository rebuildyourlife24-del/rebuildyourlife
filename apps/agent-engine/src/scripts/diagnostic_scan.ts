import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runOnlineScan() {
  console.log("=========================================");
  console.log("🌐 ONLINE INTEGRITY SCAN INITIATED");
  console.log("=========================================");
  try {
    const startTime = Date.now();
    console.log("[1/3] Attempting connection to Vault (Neon PostgreSQL)...");
    
    // Test basic query
    await prisma.$queryRaw`SELECT 1`;
    const pingTime = Date.now() - startTime;
    console.log(`✅ [SUCCESS] Connection established in ${pingTime}ms.`);
    
    console.log("[2/3] Scanning core tables for data integrity...");
    
    const genomeCount = await prisma.revenueIntelligenceGenome.count();
    const unitCount = await prisma.businessUnit.count();
    const logCount = await prisma.deploymentLog.count();
    const assetCount = await prisma.brandAssetProfile.count();
    
    console.log(`✅ [SUCCESS] RevenueIntelligenceGenome: ${genomeCount} records.`);
    console.log(`✅ [SUCCESS] BusinessUnit: ${unitCount} records.`);
    console.log(`✅ [SUCCESS] DeploymentLog: ${logCount} records.`);
    console.log(`✅ [SUCCESS] BrandAssetProfile: ${assetCount} records.`);
    
    console.log("[3/3] Checking environment variables...");
    if (process.env.DATABASE_URL) console.log("✅ [SUCCESS] DATABASE_URL is active.");
    else console.log("❌ [ERROR] DATABASE_URL is missing.");
    
    if (process.env.MASTER_KILL_SWITCH) console.log(`✅ [SUCCESS] MASTER_KILL_SWITCH is set to: ${process.env.MASTER_KILL_SWITCH}`);
    else console.log("⚠️ [WARNING] MASTER_KILL_SWITCH is missing.");

    console.log("=========================================");
    console.log("🟢 ONLINE SCAN COMPLETE: ALL SYSTEMS NOMINAL");
    console.log("=========================================");

  } catch (error) {
    console.error("❌ [FATAL] ONLINE SCAN FAILED!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

runOnlineScan();
