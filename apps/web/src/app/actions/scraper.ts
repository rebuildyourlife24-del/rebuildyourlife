'use server';

export async function firecrawlSearchAction(query: string, limit: number = 3) {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey || apiKey === "") {
    console.warn("[FIRECRAWL] Geen API key gevonden. Simulatie-modus geactiveerd.");
    // Terugvallen op mock data als er geen key is
    return {
      success: true,
      data: [
        { url: "https://example.com/company-1", title: "Test Bedrijf 1", description: "B2B Automatisering" },
        { url: "https://example.com/company-2", title: "Test Bedrijf 2", description: "Software Oplossingen" }
      ]
    };
  }

  try {
    // Firecrawl /v1/search endpoint
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        limit: limit,
        scrapeOptions: { formats: ["markdown"] }
      })
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API fout: ${response.status}`);
    }

    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Firecrawl Error:", error);
    return { success: false, error: error.message };
  }
}

export async function firecrawlScrapeUrlAction(url: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey || apiKey === "") {
    return { success: true, data: { markdown: `Mock inhoud voor ${url} (Geen API Key ingesteld)` } };
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"]
      })
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API fout: ${response.status}`);
    }

    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Firecrawl Scrape Error:", error);
    return { success: false, error: error.message };
  }
}

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function extractAndSaveLeadAction(url: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Stap 1: Scrape de website content via Firecrawl
    const scrapeResult = await firecrawlScrapeUrlAction(url);
    if (!scrapeResult.success || !scrapeResult.data?.markdown) {
      throw new Error("Kan de URL niet scrapen.");
    }

    const markdown = scrapeResult.data.markdown.substring(0, 8000); // Limit context size

    // Stap 2: Extract Name, Email, Company using Gemini
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyseer deze websitetekst en extraheer B2B contactgegevens.
      Tekst: ${markdown}
      Geef de output STRIKT in dit JSON formaat (zonder markdown blokken):
      {"name": "Volledige naam (of leeg als onbekend)", "email": "emailadres", "company": "bedrijfsnaam"}`,
    });

    let jsonString = aiResponse.text || "{}";
    jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
    const extractedData = JSON.parse(jsonString);

    if (!extractedData.email && !extractedData.name) {
      throw new Error("Geen bruikbare contactgegevens gevonden op deze site.");
    }

    // Stap 3: Opslaan in CrmLead Tabel
    const lead = await prisma.crmLead.create({
      data: {
        userId: session.user.id,
        name: extractedData.name || "Onbekend Contact",
        email: extractedData.email || null,
        company: extractedData.company || url,
        stage: "NEW",
        notes: `Automatisch gescraped van: ${url}`,
      },
    });

    revalidatePath("/dashboard/crm");
    revalidatePath("/dashboard/modules/cold-email");
    return { success: true, lead };

  } catch (error: any) {
    console.error("Lead Extraction Error:", error);
    return { success: false, error: error.message };
  }
}
