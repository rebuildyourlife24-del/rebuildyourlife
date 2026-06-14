import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
});

async function main() {
  const email = 'hsemler50@gmail.com';
  const passwordHash = await bcrypt.hash('Imperialdreams2055', 10);

  // Verwijder alle andere gebruikers
  await prisma.user.deleteMany({
    where: {
      email: {
        not: email,
      },
    },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email,
      passwordHash,
      firstName: 'Henk',
      lastName: 'Semler',
      role: 'ADMIN',
    },
  });

  console.log('Succesfully created/updated admin account:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
