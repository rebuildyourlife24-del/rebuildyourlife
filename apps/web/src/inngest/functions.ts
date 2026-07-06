import { inngest } from "./client";
import { prisma } from "@rebuildyourlife/database";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const avatarRenderJob = inngest.createFunction(
  { id: "avatar-render", retries: 0 },
  { event: "video/avatar.render" },
  async ({ event, step }) => {
    const { jobId, imageUrl, audioUrl, userId } = event.data;

    // 1. Mark as running
    await step.run("mark-running", async () => {
      return prisma.avatarRenderJob.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });
    });

    try {
      // 2. Start Replicate Prediction (SadTalker)
      const prediction = await step.run("start-replicate", async () => {
        return replicate.predictions.create({
          version: process.env.SADTALKER_MODEL_VERSION || "cjwbw/sadtalker",
          input: {
            source_image: imageUrl,
            driven_audio: audioUrl,
          },
        });
      });

      // 3. Poll for completion
      let status = "starting";
      let videoUrl = null;
      let error = null;
      let currentPrediction = prediction;

      // We will poll up to 40 times (10 minutes)
      for (let i = 0; i < 40; i++) {
        await step.sleep(`wait-${i}`, "15s");

        const check = await step.run(`check-status-${i}`, async () => {
          return replicate.predictions.get(prediction.id);
        });

        status = check.status;
        if (status === "succeeded") {
          videoUrl = check.output;
          break;
        } else if (status === "failed" || status === "canceled") {
          error = check.error || "Replicate prediction failed or canceled";
          break;
        }
      }

      if (!videoUrl && !error) {
        error = "Timeout: Video rendering took longer than 10 minutes.";
      }

      // 4. Save result
      if (videoUrl) {
        await step.run("save-success", async () => {
          return prisma.avatarRenderJob.update({
            where: { id: jobId },
            data: { status: "DONE", videoUrl: videoUrl },
          });
        });
        return { success: true, videoUrl };
      } else {
        throw new Error(error ? String(error) : "Unknown error during rendering");
      }
    } catch (err: any) {
      // 5. Handle failure
      await step.run("save-error", async () => {
        return prisma.avatarRenderJob.update({
          where: { id: jobId },
          data: { status: "FAILED", error: err.message },
        });
      });
      throw err;
    }
  }
);

// B-Roll Video Generation Job (minimax/video-01)
export const bRollVideoJob = inngest.createFunction(
  { id: "b-roll-video", retries: 0 },
  { event: "video/broll.render" },
  async ({ event, step }) => {
    const { jobId, prompt, userId } = event.data;

    await step.run("mark-running", async () => {
      // In reality we would use a Prisma model like BRollRenderJob, but for now we mock it or use an existing one
      console.log(`Starting B-Roll Job ${jobId} for prompt: ${prompt}`);
    });

    try {
      const output = await step.run("start-minimax", async () => {
        // minimax/video-01 generates a 6 second video from a text prompt!
        return replicate.run("minimax/video-01", {
          input: { prompt }
        });
      });

      // replicate.run() automatically waits for completion! It's synchronous from our POV.
      const videoUrl = typeof output === 'string' ? output : (output as any)?.url?.();
      
      await step.run("save-success", async () => {
        console.log(`B-Roll completed: ${videoUrl}`);
      });
      return { success: true, videoUrl };

    } catch (err: any) {
      await step.run("save-error", async () => {
        console.error(`B-Roll failed: ${err.message}`);
      });
      throw err;
    }
  }
);

import FirecrawlApp from "@mendable/firecrawl-js";
import { GoogleGenAI } from "@google/genai";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
});

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1 || "",
});

export const seoAuditJob = inngest.createFunction(
  { id: "seo-audit-job", retries: 1 },
  { event: "seo/audit.run" },
  async ({ event, step }) => {
    const { auditId, url } = event.data;

    await step.run("mark-running", async () => {
      return prisma.seoAuditJob.update({
        where: { id: auditId },
        data: { status: "RUNNING" },
      });
    });

    try {
      const scrapedContent = await step.run("scrape-url", async () => {
        const scrapeResult = await firecrawl.scrapeUrl(url, {
          formats: ["markdown", "html"],
        });
        if (!scrapeResult) throw new Error("Scrape failed: No result returned");
        return {
          markdown: scrapeResult.markdown || "Geen content gevonden.",
          metadata: scrapeResult.metadata
        };
      });

      const aiReportText = await step.run("generate-ai-report", async () => {
        const prompt = `
          Je bent een senior SEO expert. Je analyseert de volgende opgeschraapte webpagina-data en levert een gedetailleerd SEO Audit rapport op in JSON formaat.
          
          URL: ${url}
          Titel: ${scrapedContent.metadata?.title || "Onbekend"}
          Omschrijving: ${scrapedContent.metadata?.description || "Onbekend"}
          
          Website Content (Markdown):
          ${scrapedContent.markdown.substring(0, 15000)}
          
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
        return aiResponse.text || "{}";
      });

      let reportData;
      try {
        const cleanText = aiReportText.replace(/```json/gi, "").replace(/```/g, "").trim();
        reportData = JSON.parse(cleanText);
      } catch (e) {
        throw new Error(`AI gaf een ongeldig JSON rapport terug: ${aiReportText}`);
      }

      await step.run("save-success", async () => {
        return prisma.seoAuditJob.update({
          where: { id: auditId },
          data: {
            status: "DONE",
            result: JSON.stringify(reportData)
          },
        });
      });

      return { success: true };

    } catch (err: any) {
      await step.run("save-error", async () => {
        return prisma.seoAuditJob.update({
          where: { id: auditId },
          data: { status: "FAILED", error: err.message },
        });
      });
      throw err;
    }
  }
);
export const productHunterJob = inngest.createFunction(
  { id: "product-hunter-job", retries: 1 },
  { event: "product/hunt.run" },
  async ({ event, step }) => {
    const { jobId, url } = event.data;

    await step.run("mark-running", async () => {
      return prisma.productHunterJob.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });
    });

    try {
      const scrapedContent = await step.run("scrape-url", async () => {
        const scrapeResult = await firecrawl.scrapeUrl(url, {
          formats: ["markdown"],
        });
        if (!scrapeResult) throw new Error("Scrape failed: No result returned");
        return scrapeResult.markdown || "";
      });

      if (!scrapedContent || scrapedContent.length < 50) {
        throw new Error("Geen bruikbare content gevonden op de pagina.");
      }

      const aiReportText = await step.run("generate-ai-product", async () => {
        const prompt = `
          Je bent een expert in e-commerce en dropshipping. 
          Lees de onderstaande markdown-content van een geschraapte website.
          Identificeer het 'winnende' hoofdproduct op de pagina en converteer dit naar een commerciële JSON output.

          Vereisten:
          - title: Een pakkende commerciële titel (max 5 woorden)
          - body_html: Een converterende HTML beschrijving (gebruik <b>, <br>, <ul>). Minimaal 2 zinnen, wervende tekst.
          - price: Een realistische maar winstgevende verkoopprijs (bijv "29.95"). Alleen cijfers en punt.
          - tags: 3 komma-gescheiden tags
          - imageUrl: Zoek in de markdown naar de meest logische afbeeldings-URL (begint vaak met http, eindigt op jpg/png/webp) die het product toont. Als je er geen kan vinden, laat leeg of gebruik een placeholder.

          GEEF ALLEEN RAW JSON TERUG (geen \`\`\`json etc).
          Structuur:
          {
            "title": "...",
            "body_html": "...",
            "price": "...",
            "tags": "...",
            "imageUrl": "..."
          }

          Content:
          ${scrapedContent.substring(0, 15000)}
        `;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        return aiResponse.text || "{}";
      });

      let productData;
      try {
        const cleanText = aiReportText.replace(/```json/gi, "").replace(/```/g, "").trim();
        productData = JSON.parse(cleanText);
      } catch (e) {
        throw new Error(`AI gaf een ongeldig JSON rapport terug: ${aiReportText}`);
      }

      await step.run("save-success", async () => {
        return prisma.productHunterJob.update({
          where: { id: jobId },
          data: {
            status: "DONE",
            result: JSON.stringify(productData)
          },
        });
      });

      return { success: true };

    } catch (err: any) {
      await step.run("save-error", async () => {
        return prisma.productHunterJob.update({
          where: { id: jobId },
          data: { status: "FAILED", error: err.message },
        });
      });
      throw err;
    }
  }
);

export const brandLauncherJob = inngest.createFunction(
  { id: "brand-launcher-job", retries: 1 },
  { event: "brand/launcher.run" },
  async ({ event, step }) => {
    const { jobId, domain, industry } = event.data;

    await step.run("mark-running", async () => {
      return prisma.brandLauncherJob.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });
    });

    try {
      const aiReportText = await step.run("generate-brand-kit", async () => {
        const prompt = `
          Jij bent de ultieme Omnichannel Brand Architect van de wereld.
          Maak een complete "Social Media & Brand Kit" voor een nieuwe onderneming.
          
          Bedrijfsnaam / Domein: ${domain}
          Industrie: ${industry}
          
          Output dit ALTIJD als een RAW JSON object zonder markdown of code blocks.
          Het JSON object MOET exact deze structuur hebben:
          {
            "facebook": { "bio": "...", "coverPrompt": "...", "firstPost": "..." },
            "instagram": { "bio": "...", "profilePrompt": "...", "firstPost": "..." },
            "linkedin": { "bio": "...", "coverPrompt": "...", "firstPost": "..." },
            "x": { "bio": "...", "firstPost": "..." },
            "snapchat": { "bio": "...", "firstPost": "...", "lensPrompt": "..." },
            "strategy": "Een korte pitch van 2 zinnen over de brand voice."
          }
          
          Zorg dat de content ultra-professioneel, wervend en SEO geoptimaliseerd is.
          Gebruik relevante emoji's en hashtags in de posts.
          De prompts moeten in het Engels zijn (voor tools zoals Midjourney of DALL-E).
        `;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-1.5-pro-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        return aiResponse.text || "{}";
      });

      let brandKit;
      try {
        const cleanText = aiReportText.replace(/```json/gi, "").replace(/```/g, "").trim();
        brandKit = JSON.parse(cleanText);
      } catch (e) {
        throw new Error(`AI gaf een ongeldig JSON rapport terug: ${aiReportText}`);
      }

      await step.run("save-success", async () => {
        return prisma.brandLauncherJob.update({
          where: { id: jobId },
          data: {
            status: "DONE",
            result: JSON.stringify(brandKit)
          },
        });
      });

      return { success: true };

    } catch (err: any) {
      await step.run("save-error", async () => {
        return prisma.brandLauncherJob.update({
          where: { id: jobId },
          data: { status: "FAILED", error: err.message },
        });
      });
      throw err;
    }
  }
);

export const publishSocialPostJob = inngest.createFunction(
  { id: "publish-social-post", retries: 1 },
  { event: "social/post.publish" },
  async ({ event, step }) => {
    const { campaignId, userId } = event.data;

    const campaign = await step.run("fetch-campaign", async () => {
      return prisma.socialCampaign.findUnique({
        where: { id: campaignId },
        include: { platform: true }
      });
    });

    if (!campaign || campaign.platform.userId !== userId) {
      throw new Error("Campaign not found or unauthorized.");
    }

    if (campaign.status === "PUBLISHED") {
      return { success: true, message: "Already published." };
    }

    try {
      // Dummy logic for the actual API call
      // In production, use the platform token (campaign.platform.accessToken)
      // to make requests to LinkedIn/Twitter APIs
      await step.run("publish-to-platform", async () => {
        if (!campaign.platform.accessToken) {
          throw new Error(`Geen access token gevonden voor ${campaign.platform.platform}`);
        }
        
        // Simulating API call latency
        return new Promise(resolve => setTimeout(resolve, 2000));
      });

      await step.run("mark-published", async () => {
        return prisma.socialCampaign.update({
          where: { id: campaignId },
          data: { status: "PUBLISHED", publishedAt: new Date() }
        });
      });

      return { success: true };
    } catch (err: any) {
      await step.run("mark-failed", async () => {
        return prisma.socialCampaign.update({
          where: { id: campaignId },
          data: { status: "FAILED" }
        });
      });
      throw err;
    }
  }
);

// Pijler 2: Epistemic Grid & Revenue Validation (Cron Job)
export const dailyRoasValidationJob = inngest.createFunction(
  { id: "daily-roas-validation" },
  { cron: "TZ=Europe/Amsterdam 0 3 * * *" }, // Elke nacht om 03:00
  async ({ step }) => {
    console.log("[INNGEST] Start daily ROAS validation cron job...");

    const hypotheses = await step.run("fetch-hypotheses", async () => {
      return prisma.agentKnowledgeBase.findMany({
        where: { type: "HYPOTHESIS" }
      });
    });

    for (const h of hypotheses) {
      await step.run(`validate-${h.id}`, async () => {
        // Mock Stripe/Mollie data: simulate a 50% chance of success
        const isProfitable = Math.random() > 0.5;
        
        await prisma.agentKnowledgeBase.update({
          where: { id: h.id },
          data: { 
            type: isProfitable ? "VERIFIED" : "FAILURE",
            confidence: isProfitable ? 0.99 : 0.05
          }
        });

        // Schrijf eventueel log naar KnowledgeVerificationLog
        await prisma.knowledgeVerificationLog.create({
          data: {
            knowledgeId: h.id,
            verifierId: h.agentId, // Self-validated by the system
            verifierType: "SYSTEM",
            previousType: "HYPOTHESIS",
            newType: isProfitable ? "VERIFIED" : "FAILURE",
            reasoning: isProfitable ? "Mock Stripe API: ROAS > 2x." : "Mock Stripe API: Net verlies gedetecteerd."
          }
        });
      });
    }

    return { success: true, verified: hypotheses.length };
  }
);
