import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  const email = 'hsemler50@gmail.com';

  const tempPassword = 'Imperialdreams2055';
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  let user = await prisma.user.update({
    where: { email },
    data: {
      passwordHash,
    }
  });
  console.log('Updated user password for:', user.email);
}

checkUser().catch(console.error).finally(() => prisma.$disconnect());
