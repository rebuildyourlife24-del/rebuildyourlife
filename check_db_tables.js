const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  
  console.log('--- DATABASE TABLES & RECORD COUNTS ---');
  for (const table of tables) {
    if (table.table_name.startsWith('_')) continue;
    try {
      // Cast the result to a string to avoid BigInt serialization issues in console.log
      const countResult = await prisma.$queryRawUnsafe(`SELECT CAST(COUNT(*) AS TEXT) as count FROM "${table.table_name}"`);
      console.log(`${table.table_name}: ${countResult[0].count} records`);
    } catch (e) {
      console.error(`Error on table ${table.table_name}:`, e.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
