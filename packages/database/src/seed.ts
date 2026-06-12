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

  // Primaire admin: hendriksemler / imperialdreams2055
  const adminEmail = "hendriksemler@rebuildyourlife.eu";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "imperialdreams2055";
  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "SUPREME_OVERSEER",
      subscriptionTier: "ENTERPRISE",
      isEmailVerified: true,
      onboardingCompleted: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "Hendrik",
      lastName: "Semler",
      role: "SUPREME_OVERSEER",
      subscriptionTier: "ENTERPRISE",
      clearanceLevel: 5,
      isEmailVerified: true,
      onboardingCompleted: true,
    },
  });

  // Legacy admin fallback
  await prisma.user.upsert({
    where: { email: "admin@rebuildyourlife.eu" },
    update: { passwordHash, role: "SUPREME_OVERSEER", subscriptionTier: "ENTERPRISE" },
    create: {
      email: "admin@rebuildyourlife.eu",
      passwordHash,
      firstName: "Henk",
      lastName: "Semler",
      role: "SUPREME_OVERSEER",
      subscriptionTier: "ENTERPRISE",
      clearanceLevel: 5,
      isEmailVerified: true,
      onboardingCompleted: true,
    },
  });

  console.log(`    ✓ Admin user created/updated: ${admin.email} (${admin.id})`);

  // ------------------------------------------------------------------
  // Enterprise Folders (Knowledge Vault)
  // ------------------------------------------------------------------
  console.log("\n  → Upserting Enterprise Folders...");

  const FOLDERS = [
    "CEO", "Strategy", "Operations", "Marketing", "SEO", "Paid_Ads", "Social",
    "Content", "Products", "Suppliers", "Customers", "CRO", "Finance", "Data",
    "Reports", "Experiments", "Automation", "AI_Memory", "Meetings", "Competitors",
    "Risk", "Legal", "HR", "Projects", "SOP", "Archive"
  ];

  for (const folderName of FOLDERS) {
    await prisma.enterpriseFolder.upsert({
      where: { name: folderName },
      update: {},
      create: { name: folderName },
    });
  }
  console.log(`    ✓ Created/Verified ${FOLDERS.length} Enterprise Folders.`);

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
