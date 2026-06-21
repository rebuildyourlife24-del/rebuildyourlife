import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Test1234!', 12);

  // Klant - Starter Tier
  const starter = await prisma.user.upsert({
    where: { email: 'starter@klant.nl' },
    update: {},
    create: {
      email: 'starter@klant.nl',
      passwordHash: passwordHash,
      firstName: 'Klant',
      lastName: 'Starter',
      role: 'USER',
      subscriptionTier: 'STARTER'
    }
  });

  // Klant - Premium Tier
  const premium = await prisma.user.upsert({
    where: { email: 'premium@klant.nl' },
    update: {},
    create: {
      email: 'premium@klant.nl',
      passwordHash: passwordHash,
      firstName: 'Klant',
      lastName: 'Premium',
      role: 'USER',
      subscriptionTier: 'PREMIUM'
    }
  });

  console.log("CLIENTS SEEDED:", {starter: starter.email, premium: premium.email});
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
