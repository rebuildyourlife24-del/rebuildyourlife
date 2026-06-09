import { prisma } from "@rebuildyourlife/database";

const DEFAULT_AREAS = [
  { name: "Financiën", description: "Je financiële gezondheid en stabiliteit" },
  { name: "Carrière", description: "Werk, studie en professionele ontwikkeling" },
  { name: "Gezondheid", description: "Fysieke conditie en voeding" },
  { name: "Mentaal", description: "Mentale rust, stressniveau en mindset" },
  { name: "Relaties", description: "Familie, vrienden en partner" },
  { name: "Ontspanning", description: "Vrije tijd, hobby's en plezier" },
  { name: "Woonomgeving", description: "Je huis en directe omgeving" },
  { name: "Persoonlijke Groei", description: "Zelfontwikkeling en zingeving" }
];

export async function getUserLifeAreas(userId: string) {
  let areas = await prisma.lifeArea.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  });

  if (areas.length === 0) {
    // Initialize default areas if they don't exist
    const createData = DEFAULT_AREAS.map(area => ({
      userId,
      name: area.name,
      description: area.description,
      score: 50 // Default middle score
    }));

    await prisma.lifeArea.createMany({ data: createData });

    areas = await prisma.lifeArea.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });
  }

  return areas;
}

export async function updateLifeAreaScore(userId: string, areaId: string, score: number) {
  const updated = await prisma.lifeArea.update({
    where: { id: areaId, userId },
    data: { score }
  });

  if (score < 40) {
    // Check if we already sent a notification recently (simplified for now: just send it)
    const { createNotification } = await import("./notification.service.js");
    await createNotification(
      userId,
      "Tijd voor actie!",
      `Je score voor ${updated.name} staat op ${score}. De Life Coach staat voor je klaar.`,
      "/dashboard/ai-team"
    );
  }

  return updated;
}
