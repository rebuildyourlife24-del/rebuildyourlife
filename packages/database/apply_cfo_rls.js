import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Applying CFO Budget Locks and RLS Policies...");
  
  // We apply Row Level Security to the financial tables so that tenants cannot see each other's data
  // auth.uid()::text ensures that only the authenticated Supabase user matching the userId column has access
  const sql = `
    -- Enable Row Level Security for Financial Tables
    ALTER TABLE "RevenueSnapshot" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Budget" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Debt" ENABLE ROW LEVEL SECURITY;

    -- Clean up previous policies to prevent duplicates
    DROP POLICY IF EXISTS "User can access own revenue" ON "RevenueSnapshot";
    DROP POLICY IF EXISTS "User can access own budget" ON "Budget";
    DROP POLICY IF EXISTS "User can access own debt" ON "Debt";

    -- Create strictly isolated tenant policies
    CREATE POLICY "User can access own revenue" ON "RevenueSnapshot" FOR ALL USING (auth.uid()::text = "userId");
    CREATE POLICY "User can access own budget" ON "Budget" FOR ALL USING (auth.uid()::text = "userId");
    CREATE POLICY "User can access own debt" ON "Debt" FOR ALL USING (auth.uid()::text = "userId");
  `;
  
  await prisma.$executeRawUnsafe(sql);
  console.log("✅ CFO RLS Policies Applied Successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
