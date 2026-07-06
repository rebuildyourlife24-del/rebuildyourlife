import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    console.log("=== USERS IN DATABASE ===");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error querying users via direct connection:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
