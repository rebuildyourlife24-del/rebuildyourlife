"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { revalidatePath } from "next/cache";
import FirecrawlApp from "@mendable/firecrawl-js";
import { GoogleGenAI } from "@google/genai";

// Firecrawl Initialization
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
});

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function createSeoAudit(url: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Create a pending audit record
    const auditRecord = await prisma.seoAudit.create({
      data: {
        userId: session.user.id,
        targetUrl: url,
        status: "PENDING",
      },
    });

    // We do NOT await the actual heavy lifting here to prevent Vercel 10s timeout on hobby plans.
    // However, if the user is on Pro it's fine. For now we will run it synchronously but ideally it's an Inngest job.
    // Let's do it synchronously for immediate feedback, since Firecrawl crawl can be fast if it's single page.
    
    // 2. Scrape with Firecrawl
    console.log(`Starting Firecrawl scrape for: ${url}`);
    const scrapeResult = await firecrawl.scrapeUrl(url, {
      formats: ["markdown", "html"],
    });

    if (!scrapeResult) {
      throw new Error(`Scrape failed: No result returned`);
    }
    const scrapedContent = scrapeResult.markdown || "Geen content gevonden.";
    const metadata = scrapeResult.metadata;

    // 3. Analyze with Gemini
    console.log(`Starting Gemini analysis for: ${url}`);
    const prompt = `
      Je bent een senior SEO expert. Je analyseert de volgende opgeschraapte webpagina-data en levert een gedetailleerd SEO Audit rapport op in JSON formaat.
      
      URL: ${url}
      Titel: ${metadata?.title || "Onbekend"}
      Omschrijving: ${metadata?.description || "Onbekend"}
      
      Website Content (Markdown):
      ${scrapedContent.substring(0, 15000)} // Limiteer tot 15k karakters voor context window
      
      Beoordeel de site op:
      1. On-page SEO (Title, Meta description, H1/H2 tags)
      2. Content kwaliteit & Keyword kansen
      3. Gebruiksvriendelijkheid en mogelijke UX blockers
      
      Geef de output EXACT in dit JSON formaat (zonder markdown blokken eromheen):
      {
        "score": 75,
        "summary": "Een korte samenvatting van de staat van de SEO.",
        "pros": ["Sterk punt 1", "Sterk punt 2"],
        "cons": ["Zwak punt 1", "Zwak punt 2"],
        "actionItems": [
          { "priority": "HIGH", "task": "Voeg een meta description toe" },
          { "priority": "MEDIUM", "task": "Gebruik meer H2 tags" }
        ]
      }
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiReportText = aiResponse.text || "{}";
    let reportData;
    try {
      reportData = JSON.parse(aiReportText || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini JSON", e);
      throw new Error("AI gaf een ongeldig JSON rapport terug.");
    }

    // 4. Update the audit record
    const updatedAudit = await prisma.seoAudit.update({
      where: { id: auditRecord.id },
      data: {
        status: "COMPLETED",
        score: reportData.score || 0,
        aiReport: reportData,
      },
    });

    revalidatePath("/dashboard/modules/seo-audit");
    return { success: true, audit: updatedAudit };
  } catch (error: any) {
    console.error("SEO Audit failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserSeoAudits() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const audits = await prisma.seoAudit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return audits;
}
