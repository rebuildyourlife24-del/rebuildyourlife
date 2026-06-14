import { PrismaClient } from "@rebuildyourlife/database";

const prisma = new PrismaClient();

// --- THE DISCOVERY PROTOCOL ---
export async function generateOpportunityReport(userId: string) {
  // Dit stelt een AI Agent voor die net een viral trend heeft gespot (bijv. op TikTok)
  
  const report = await prisma.opportunityReport.create({
    data: {
      userId,
      title: "Viral Trend: Smart Posture Correctors",
      niche: "Health & Fitness Tech",
      summary: "Zittend werk eist zijn tol. Korte, authentieke UGC video's op TikTok van mensen die hun houding fixen, gaan op dit moment viraal met lage CPM's.",
      goodROI: 1200.0, // Conservatief (Good)
      betterROI: 4500.0, // Baseline (Better)
      bestROI: 18500.0, // Viral Scale (Best)
      status: "REVIEW"
    }
  });

  // --- THE CONTENT FORGE ---
  // Genereert autonoom de media en ad copy
  await prisma.opportunityMedia.createMany({
    data: [
      {
        reportId: report.id,
        platform: "TIKTOK",
        mediaType: "VIDEO_UGC",
        mediaUrl: "s3://assets/generated-ugc-posture-1.mp4",
        adCopy: "POV: Je rug doet eindelijk geen pijn meer na 8 uur achter je bureau 😭✨ #kantoorleven #posture",
      },
      {
        reportId: report.id,
        platform: "INSTAGRAM",
        mediaType: "IMAGE_CAROUSEL",
        mediaUrl: "s3://assets/generated-carousel-posture-2.png",
        adCopy: "De makkelijkste hack voor een betere houding. Swipe voor de resultaten na 1 week 👉",
      }
    ]
  });

  return report;
}

// --- THE LIVE TESTING GROUND ---
export async function initiateTesting(reportId: string) {
  // Dit lanceert micro-budget ads om tractie te meten
  const report = await prisma.opportunityReport.update({
    where: { id: reportId },
    data: { status: "TESTING" }
  });
  return report;
}
