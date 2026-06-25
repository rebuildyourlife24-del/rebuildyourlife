import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Laad de env uit de API directory of de root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
const connectionString = url.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '');

console.log('[SQL] Connecting to database using string length:', connectionString.length);

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS "Franchise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "customDomain" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT,
    "description" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'MONOCHROME',
    "products" JSONB NOT NULL DEFAULT '[]',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "platformCutTotal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FranchiseOrder" (
    "id" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "platformCut" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PAID',
    "items" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FranchiseOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PlatformRevenue" (
    "id" TEXT NOT NULL,
    "franchiseOrderId" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformRevenue_pkey" PRIMARY KEY ("id")
);

-- Unique indexen
CREATE UNIQUE INDEX IF NOT EXISTS "Franchise_subdomain_key" ON "Franchise"("subdomain");
CREATE UNIQUE INDEX IF NOT EXISTS "Franchise_customDomain_key" ON "Franchise"("customDomain");
CREATE UNIQUE INDEX IF NOT EXISTS "PlatformRevenue_franchiseOrderId_key" ON "PlatformRevenue"("franchiseOrderId");

-- Indexen
CREATE INDEX IF NOT EXISTS "Franchise_userId_idx" ON "Franchise"("userId");
CREATE INDEX IF NOT EXISTS "Franchise_subdomain_idx" ON "Franchise"("subdomain");
CREATE INDEX IF NOT EXISTS "FranchiseOrder_franchiseId_idx" ON "FranchiseOrder"("franchiseId");
CREATE INDEX IF NOT EXISTS "PlatformRevenue_franchiseId_idx" ON "PlatformRevenue"("franchiseId");

-- Foreign Keys
ALTER TABLE "Franchise" DROP CONSTRAINT IF EXISTS "Franchise_userId_fkey";
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FranchiseOrder" DROP CONSTRAINT IF EXISTS "FranchiseOrder_franchiseId_fkey";
ALTER TABLE "FranchiseOrder" ADD CONSTRAINT "FranchiseOrder_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlatformRevenue" DROP CONSTRAINT IF EXISTS "PlatformRevenue_franchiseOrderId_fkey";
ALTER TABLE "PlatformRevenue" ADD CONSTRAINT "PlatformRevenue_franchiseOrderId_fkey" FOREIGN KEY ("franchiseOrderId") REFERENCES "FranchiseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlatformRevenue" DROP CONSTRAINT IF EXISTS "PlatformRevenue_franchiseId_fkey";
ALTER TABLE "PlatformRevenue" ADD CONSTRAINT "PlatformRevenue_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
`;

async function main() {
  const client = await pool.connect();
  try {
    console.log('[SQL] Executing schema SQL...');
    await client.query(sql);
    console.log('[SQL] Schema SQL executed successfully!');
  } catch (err) {
    console.error('[SQL] Error executing SQL:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
