import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "hsemler50@gmail.com";
  const password = "imperialdreams2055";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName: "Hendrik",
      lastName: "Semler",
      role: "ADMIN"
    },
    create: {
      email,
      passwordHash,
      firstName: "Hendrik",
      lastName: "Semler",
      role: "ADMIN"
    }
  });

  console.log("User created:", user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
