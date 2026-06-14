import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const ceoHash = await bcrypt.hash('Miljardair2026!', 12);
  const mitchelHash = await bcrypt.hash('Rebuild2026!', 12);

  const ceo = await prisma.user.upsert({
    where: { email: 'ceo@rebuildyourlife.com' },
    update: {
      passwordHash: ceoHash,
      role: 'SUPREME_OVERSEER'
    },
    create: {
      email: 'ceo@rebuildyourlife.com',
      passwordHash: ceoHash,
      firstName: 'Henk',
      lastName: 'Semler',
      role: 'SUPREME_OVERSEER',
      subscriptionTier: 'GOD_MODE'
    }
  });

  const mitchel = await prisma.user.upsert({
    where: { email: 'mitchel@rebuildyourlife.com' },
    update: {
      passwordHash: mitchelHash,
      role: 'ADMIN'
    },
    create: {
      email: 'mitchel@rebuildyourlife.com',
      passwordHash: mitchelHash,
      firstName: 'Mitchel',
      lastName: 'van Engelen',
      role: 'ADMIN',
      subscriptionTier: 'ENTERPRISE'
    }
  });

  console.log("USERS SEEDED:", {ceo: ceo.email, mitchel: mitchel.email});
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
