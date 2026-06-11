import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "hsemler50@gmail.com";
  const newPassword = "Imperialdreams2055";
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User with email ${email} not found!`);
    
    // Maybe they want an admin created with this email? Let's create it just in case.
    console.log("Creating user instead...");
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: "Henk",
        lastName: "Semler",
        role: "ADMIN",
        subscriptionTier: "ENTERPRISE",
        clearanceLevel: 10,
        onboardingCompleted: true,
      }
    });
    console.log(`User created and password set to ${newPassword}`);
  } else {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: "ADMIN", // ensure they have admin rights
        clearanceLevel: 10
      },
    });
    console.log(`Password reset for ${email} successfully!`);
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
