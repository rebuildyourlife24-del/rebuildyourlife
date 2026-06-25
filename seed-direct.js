const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
});

async function main() {
  const email = 'hsemler50@gmail.com';
  const passwordHash = await bcrypt.hash('Imperialdreams2055', 10);

  console.log('Deleting other users...');
  // Verwijder alle andere gebruikers
  const deleted = await prisma.user.deleteMany({
    where: {
      email: {
        not: email,
      },
    },
  });
  console.log('Deleted other users count:', deleted.count);

  console.log('Upserting admin user...');
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
      subscriptionTier: 'GOD_MODE',
      clearanceLevel: 10,
    },
    create: {
      email,
      passwordHash,
      firstName: 'Henk',
      lastName: 'Semler',
      role: 'ADMIN',
      subscriptionTier: 'GOD_MODE',
      clearanceLevel: 10,
    },
  });

  console.log('Succesfully created/updated admin account:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
