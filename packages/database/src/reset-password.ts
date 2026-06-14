import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "hsemler50@gmail.com";
  const newPassword = "Megan123!";
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`User ${email} not found — creating now...`);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: "Henk",
        lastName: "Semler",
        role: "ADMIN",
        subscriptionTier: "ENTERPRISE",
        clearanceLevel: 10,
        isEmailVerified: true,
        onboardingCompleted: true,
      }
    });
    console.log(`✅ User created: ${email} / ${newPassword}`);
  } else {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: "ADMIN",
        clearanceLevel: 10,
        isEmailVerified: true,
        onboardingCompleted: true,
      },
    });
    console.log(`✅ Password reset for ${email} successfully!`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
