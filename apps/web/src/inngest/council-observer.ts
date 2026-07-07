import { inngest } from "./client";
import { prisma } from "@rebuildyourlife/database";

/**
 * De Panopticon Observer (Raad van Bestuur & Raad van Kennis)
 * Deze Inngest job luistert LIVE mee met alle datastromen op het platform.
 */
export const panopticonObserverJob = inngest.createFunction(
  { id: "panopticon-observer", name: "Council Panopticon Observer (Live Stream)" },
  { event: "system/data.stream" },
  async ({ event, step }) => {
    const { platform, eventType, payload, timestamp } = event.data;

    console.log(`[PANOPTICON] Intercepted live stream from ${platform} (Event: ${eventType})`);

    // 1. Contextualize via Raad van Kennis (RAG)
    const relevantSOPs = await step.run("fetch-relevant-knowledge", async () => {
      // Zoek de dichtstbijzijnde SOPs in de AgentKnowledgeBase
      // In een echte pgvector setup doen we hier een semantic search
      return prisma.agentKnowledgeBase.findFirst({
        where: {
          type: "VERIFIED",
          claim: {
            contains: platform,
            mode: "insensitive"
          }
        },
        orderBy: {
          confidence: 'desc'
        }
      });
    });

    // 2. Select the right Council Triad based on the platform
    let triad: string[] = [];
    let agentActionTitle = "";

    if (platform === "shopify") {
      triad = ["TORVALDS", "MACHIAVELLI", "WATTS"]; // Operations, Aggression, Wisdom
      agentActionTitle = "E-COMMERCE EVENT BEOORDELING";
    } else if (platform === "instagram" || platform === "tiktok" || platform === "snapchat" || platform === "facebook") {
      triad = ["MACHIAVELLI", "KAHNEMAN", "RAMS"]; // Scaling, Psychology, Design
      agentActionTitle = "SOCIAL MEDIA EVENT BEOORDELING";
    } else if (platform === "linkedin") {
      triad = ["AURELIUS", "MUNGER", "SUTSKEVER"]; // Stoic Networking, Logic, Intelligence
      agentActionTitle = "B2B NETWORK EVENT BEOORDELING";
    } else {
      triad = ["SUTSKEVER", "TALEB", "SUN_TZU"]; // Default logic
      agentActionTitle = "SYSTEEM EVENT BEOORDELING";
    }

    // 3. Council Deliberation
    await step.run("council-live-deliberation", async () => {
      console.log(`[COUNCIL TRIAD] Waking up ${triad.join(", ")} to evaluate ${platform} event.`);
      if (relevantSOPs) {
        console.log(`[RAAD VAN KENNIS] Triad is using SOP: ${relevantSOPs.claim}`);
      }
      
      // Simuleer een snelle beoordeling (Hier zou de LLM API call plaatsvinden)
      if (eventType.includes("error") || eventType.includes("failed")) {
        console.log(`[COUNCIL ALARM] Event is negative. Triad is analyzing risk.`);
      } else {
        console.log(`[COUNCIL] Event is nominal. Monitoring continues.`);
      }
    });

    // 4. Action / Feedback Loop
    // Indien nodig kan de Triad besluiten om direct in te grijpen door een AgentAction klaar te zetten.
    if (eventType.includes("error") || eventType.includes("failed") || eventType.includes("spike")) {
      await step.run("trigger-council-action", async () => {
        // Vind een default admin om dit aan toe te wijzen
        const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (adminUser) {
          await prisma.agentAction.create({
            data: {
              userId: adminUser.id,
              agentType: "COUNCIL", // Of een specifieke sub-agent
              title: agentActionTitle,
              description: `Panopticon heeft een ongebruikelijk event (${eventType}) onderschept op ${platform}. De Triad (${triad.join(", ")}) adviseert onmiddellijke inspectie.`,
              status: "PENDING",
              riskLevel: "MEDIUM",
              payload: JSON.stringify(payload)
            }
          });
        }
      });
    }

    return { 
      success: true, 
      platform, 
      triadUsed: triad,
      knowledgeApplied: relevantSOPs ? relevantSOPs.claim : null
    };
  }
);
