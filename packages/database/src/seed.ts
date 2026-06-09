import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

const FEATURE_FLAGS = [
  {
    name: "ai_coworkers",
    isEnabled: true,
    description: "Enable AI coworker agents for users",
  },
  {
    name: "debt_center",
    isEnabled: true,
    description: "Enable the Debt Center module for tracking and managing debts",
  },
  {
    name: "rebuild_programs",
    isEnabled: true,
    description: "Enable personalised Rebuild Programs with milestones",
  },
  {
    name: "mfa_enabled",
    isEnabled: true,
    description: "Enable multi-factor authentication for user accounts",
  },
] as const;

async function seed(): Promise<void> {
  console.log("🌱 Seeding database...\n");

  // ------------------------------------------------------------------
  // Feature Flags
  // ------------------------------------------------------------------
  console.log("  → Upserting feature flags...");

  for (const flag of FEATURE_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: {
        isEnabled: flag.isEnabled,
        description: flag.description,
      },
      create: {
        name: flag.name,
        isEnabled: flag.isEnabled,
        description: flag.description,
      },
    });
    console.log(`    ✓ ${flag.name} = ${flag.isEnabled}`);
  }

  // ------------------------------------------------------------------
  // Admin User
  // ------------------------------------------------------------------
  console.log("\n  → Upserting admin user...");

  const adminEmail = "admin@rebuildyourlife.eu";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Ch@ngeMe!2026";
  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN",
      subscriptionTier: "ENTERPRISE",
      isEmailVerified: true,
      onboardingCompleted: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "Admin",
      lastName: "RebuildYourLife",
      role: "ADMIN",
      subscriptionTier: "ENTERPRISE",
      isEmailVerified: true,
      onboardingCompleted: true,
    },
  });

  console.log(`    ✓ Admin user created/updated: ${admin.email} (${admin.id})`);

  console.log("\n✅ Seed completed successfully.\n");
}

seed()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
