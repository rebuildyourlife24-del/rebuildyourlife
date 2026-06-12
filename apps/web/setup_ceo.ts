import { PrismaClient } from '@rebuildyourlife/database';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("Miljardair2026!", 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'ceo@rebuildyourlife.com' },
    update: {
      passwordHash: hashedPassword,
      role: 'SUPREME_OVERSEER',
      subscriptionTier: 'ENTERPRISE'
    },
    create: {
      email: 'ceo@rebuildyourlife.com',
      passwordHash: hashedPassword,
      role: 'SUPREME_OVERSEER',
      subscriptionTier: 'ENTERPRISE',
      firstName: 'CEO',
      lastName: 'Orion'
    }
  });

  console.log("Master Account Created/Updated:", user.email);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
