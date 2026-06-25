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

  // Primaire admin: hsemler50@gmail.com / Megan123!
  const adminEmail = "hsemler50@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Megan123!";
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

  // Legacy admin fallback (also updated to new credentials)
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
    try {
      await prisma.enterpriseFolder.upsert({
        where: { name: folderName },
        update: {},
        create: { name: folderName },
      });
    } catch (err) {
      console.log(`    ⚠️ EnterpriseFolder upsert failed for ${folderName}: ${(err as any).message}`);
    }
  }
  console.log(`    ✓ Created/Verified ${FOLDERS.length} Enterprise Folders.`);

  // ------------------------------------------------------------------
  // Academy Courses, Modules & Lessons
  // ------------------------------------------------------------------
  console.log("\n  → Seeding Academy Courses, Modules & Lessons...");

  // Schoon bestaande data op
  await prisma.userLessonProgress.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.course.deleteMany({});

  // Maak Course 1 aan (FREE)
  const course1 = await prisma.course.create({
    data: {
      title: 'Module 1: Ontsnappen uit de Matrix',
      description: 'Leer hoe je je mindset herprogrammeert, schulden vernietigt en controle pakt over je financiële toekomst.',
      tierAccess: 'FREE',
      order: 1,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    }
  });

  const m1_1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Fase 1: Mindset & Deconstructie',
      description: 'De basis leggen voor financiële en mentale onafhankelijkheid.',
      order: 1,
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: m1_1.id,
        title: '1.1 De Illusie van Zekerheid',
        content: 'In deze les deconstrueren we het traditionele pad van 9-tot-5 werk en leggen we bloot waarom de moderne economie is ingericht om je gevangen te houden. We kijken naar inflatie, schuldsystemen en de psychologie van de consumentenmatrix.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 340,
        order: 1,
      },
      {
        moduleId: m1_1.id,
        title: '1.2 Schuld als Wapen',
        content: 'Schuld is de moderne ketting. Leer het verschil tussen goede en slechte schuld, hoe banken rente gebruiken als hefboom tegen je, en hoe je een agressief afbetalingsplan opstelt (de Debt Snowball methode) om je kettingen door te snijden.',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        duration: 480,
        order: 2,
      }
    ]
  });

  const m1_2 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Fase 2: Financiële Soevereiniteit',
      description: 'Het bouwen van je eerste cashflow buffers.',
      order: 2,
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: m1_2.id,
        title: '2.1 De Cashflow Blueprint',
        content: 'Hoe je elke euro die binnenkomt structureert volgens het Orion Grid. We bespreken vaste lasten, investeringspercentages en het opzetten van een noodfonds dat je minimaal 6 maanden ademruimte geeft.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 620,
        order: 1,
      }
    ]
  });

  // Maak Course 2 aan (PREMIUM)
  const course2 = await prisma.course.create({
    data: {
      title: 'Module 2: Jouw Eerste Werkopdracht',
      description: 'De ultieme gids om the Opportunity Engine te gebruiken. Hoe je 10x sneller werkt met AI tools.',
      tierAccess: 'PREMIUM',
      order: 2,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    }
  });

  const m2_1 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'Fase 3: De Opportunity Engine',
      description: 'Direct waarde leveren en euro\'s verdienen met AI.',
      order: 1,
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: m2_1.id,
        title: '3.1 AI Copywriting Prompts',
        content: 'In deze les leren we je hoe je hoogwaardige marketingteksten schrijft met LLMs. We geven je kant-en-klare templates voor landingspagina\'s, e-mailcampagnes en social media ads die conversies genereren.',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        duration: 720,
        order: 1,
      },
      {
        moduleId: m2_1.id,
        title: '3.2 Klanten Werven met Cold Outreach',
        content: 'Hoe je de Opportunity Engine gebruikt om leads te genereren, gepersonaliseerde voorstellen te sturen en je eerste betalende B2B-klant binnen te halen zonder budget.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 900,
        order: 2,
      }
    ]
  });

  // Maak Course 3 aan (PREMIUM)
  const course3 = await prisma.course.create({
    data: {
      title: 'Module 3: Sovereign Capital & Swarm Ops',
      description: 'Gevorderde strategieën voor het meebouwen aan assets, schalen van AI agents en offshore structuren.',
      tierAccess: 'PREMIUM',
      order: 3,
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60',
    }
  });

  const m3_1 = await prisma.module.create({
    data: {
      courseId: course3.id,
      title: 'Fase 4: Sovereign Structures',
      description: 'Belastingoptimalisatie, e-Residency en offshore bankieren.',
      order: 1,
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: m3_1.id,
        title: '4.1 Estland e-Residency & LLCs',
        content: 'Een diepe duik in het opzetten van een Estse OÜ entiteit. Hoe je 0% vennootschapsbelasting betaalt over ingehouden winsten en hoe je overal ter wereld digitaal zaken doet.',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        duration: 1050,
        order: 1,
      }
    ]
  });

  console.log(`    ✓ Seeded 3 Courses, 4 Modules, and 6 Lessons.`);

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
