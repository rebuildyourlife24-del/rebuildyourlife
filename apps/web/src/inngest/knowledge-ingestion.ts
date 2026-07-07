import { inngest } from "./client";
import { prisma } from "@rebuildyourlife/database";

/**
 * Knowledge Ingestion Engine (RAG)
 * Pakt ruwe tekst (SOPs, regels), analyseert deze en slaat ze op als 
 * VERIFIED bedrijfsregels in de AgentKnowledgeBase zodat de Council ze kan gebruiken.
 */
export const processDocumentJob = inngest.createFunction(
  { id: "process-knowledge-document", name: "Knowledge Ingestion Engine" },
  { event: "knowledge/document.uploaded" },
  async ({ event, step }) => {
    const { documentId, content, domain, agentId, userId } = event.data;
    console.log(`[KNOWLEDGE INGESTION] Processing document for domain: ${domain}`);

    // Stap 1: Structureren van de tekst (Simulatie van AI chunking & extractie)
    const claims = await step.run("extract-claims", async () => {
      // Normaal gesproken roep je hier OpenAI aan: "Extraheer harde bedrijfsregels uit deze SOP"
      // Voor nu splitsen we het simpelweg op basis van witregels/alinea's
      const paragraphs = content.split("\n\n").filter((p: string) => p.trim().length > 10);
      return paragraphs.map((p: string, i: number) => ({
        claim: p.trim(),
        evidence: `Geëxtraheerd uit Document ID: ${documentId}`,
        type: "VERIFIED"
      }));
    });

    // Stap 2: Opslaan in de AgentKnowledgeBase
    const savedKnowledge = await step.run("save-to-knowledge-base", async () => {
      let count = 0;
      for (const extracted of claims) {
        await prisma.agentKnowledgeBase.create({
          data: {
            agentId: agentId || "COUNCIL_GLOBAL", // Koppel aan specifieke agent of globaal
            domain: domain || "GENERAL",
            type: extracted.type,
            claim: extracted.claim,
            evidence: extracted.evidence,
            source: "USER_SOP_UPLOAD",
            confidence: 1.0, // Harde SOPs hebben maximale confidence
          }
        });
        count++;
      }
      return count;
    });

    console.log(`[KNOWLEDGE INGESTION] Successfully ingested ${savedKnowledge} SOP rules into the Knowledge Base.`);

    // Stap 3: Update de bron document status
    await step.run("update-document-status", async () => {
      await prisma.document.update({
        where: { id: documentId },
        data: { type: "INGESTED_SOP" }
      });
    });

    return { success: true, ingestedRules: savedKnowledge };
  }
);
