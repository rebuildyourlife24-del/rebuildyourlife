const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Applying CFO Budget Locks and RLS Policies...");
  
  const sqlCommands = [
    'ALTER TABLE "RevenueSnapshot" ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE "Budget" ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE "Debt" ENABLE ROW LEVEL SECURITY;',
    'DROP POLICY IF EXISTS "User can access own revenue" ON "RevenueSnapshot";',
    'DROP POLICY IF EXISTS "User can access own budget" ON "Budget";',
    'DROP POLICY IF EXISTS "User can access own debt" ON "Debt";',
    'CREATE POLICY "User can access own revenue" ON "RevenueSnapshot" FOR ALL USING (auth.uid()::text = "userId");',
    'CREATE POLICY "User can access own budget" ON "Budget" FOR ALL USING (auth.uid()::text = "userId");',
    'CREATE POLICY "User can access own debt" ON "Debt" FOR ALL USING (auth.uid()::text = "userId");'
  ];
  
  for (const cmd of sqlCommands) {
    try {
      await prisma.$executeRawUnsafe(cmd);
      console.log(`Executed: ${cmd.substring(0, 50)}...`);
    } catch (e) {
      console.error(`Failed: ${cmd.substring(0, 50)}...`, e.message);
    }
  }
  
  console.log("CFO RLS Policies Applied Successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
