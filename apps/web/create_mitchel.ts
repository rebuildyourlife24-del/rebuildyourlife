import { PrismaClient } from '@rebuildyourlife/database';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("WelkomMitchel2026!", 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'mitchel@rebuildyourlife.com' },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
      subscriptionTier: 'ENTERPRISE',
      firstName: 'Mitchel',
      lastName: 'van Engelen'
    },
    create: {
      email: 'mitchel@rebuildyourlife.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      subscriptionTier: 'ENTERPRISE',
      firstName: 'Mitchel',
      lastName: 'van Engelen'
    }
  });

  console.log("Friend Account Created:", user.email);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
