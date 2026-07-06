const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    
    // Find all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true
      }
    });
    
    console.log('\n--- ALL USERS ---');
    console.log(JSON.stringify(users, null, 2));
    
  } catch(e) {
    console.error('Fout:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
