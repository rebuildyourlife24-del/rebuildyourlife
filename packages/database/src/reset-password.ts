import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetPassword() {
  const adminEmail = "admin@rebuildyourlife.eu";
  const newPassword = "GodMode2026!";
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "SUPREME_OVERSEER",
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "God",
      lastName: "Mode",
      role: "SUPREME_OVERSEER",
    },
  });

  console.log(`User ${user.email} password reset to: ${newPassword}`);
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
