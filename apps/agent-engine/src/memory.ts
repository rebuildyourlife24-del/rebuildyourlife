import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "sovereign-os";
const PINECONE_HOST = process.env.PINECONE_HOST || "sovereign-os-abcde12.svc.gcp-starter.pinecone.io"; 

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!GEMINI_API_KEY) {
    console.warn("[MEMORY] Geen Gemini API key gevonden. Simulatie embedding.");
    return Array.from({ length: 768 }, () => Math.random() - 0.5); 
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/embedding-001",
        content: { parts: [{ text }] }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Embedding Error: ${await response.text()}`);
    }

    const data = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error("[MEMORY] Fout bij genereren van embedding:", error);
    return Array.from({ length: 768 }, () => Math.random() - 0.5);
  }
}

export async function saveToPinecone(namespace: string, id: string, text: string, metadata: any = {}) {
  // 1. ONSITE DATABASE BACKUP (Prisma)
  try {
    const { prisma } = require("@rebuildyourlife/database");
    await prisma.aiSharedMemory.create({
      data: {
        agentId: metadata.agentId || "orion-supervisor",
        projectId: metadata.projectId,
        memoryType: "LTM",
        content: text,
        contextTags: [namespace],
        importance: 0.8
      }
    });
    console.log(`[MEMORY] LTM Opgeslagen in Prisma AiSharedMemory.`);
  } catch (dbError) {
    console.warn(`[MEMORY] Waarschuwing: Prisma AiSharedMemory save faalde.`, dbError);
  }

  // 2. VECTOR DATABASE BACKUP (Pinecone)
  if (!PINECONE_API_KEY) {
    console.log(`[MEMORY] Vector LTM Opgeslagen (gesimuleerd): [${namespace}] ${text.substring(0, 50)}...`);
    return;
  }

  const vector = await generateEmbedding(text);

  try {
    const url = `https://${PINECONE_HOST}/vectors/upsert`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vectors: [{
          id,
          values: vector,
          metadata: { text, ...metadata }
        }],
        namespace
      })
    });

    if (!response.ok) {
      throw new Error(`Pinecone Upsert Error: ${await response.text()}`);
    }

    console.log(`[MEMORY] Les / Herinnering succesvol geüpsert naar LTM (Pinecone) onder namespace '${namespace}'.`);
  } catch (error) {
    console.error("[MEMORY] Fout bij opslaan naar Pinecone:", error);
  }
}

export async function searchInPinecone(namespace: string, query: string, topK: number = 2): Promise<string[]> {
  const results: string[] = [];

  // 1. ZOEKEN IN LOKALE PRISMA DATABASE
  try {
    const { prisma } = require("@rebuildyourlife/database");
    const localMemories = await prisma.aiSharedMemory.findMany({
      where: {
        context: {
          path: ['tags'],
          array_contains: "rebuild-your-life-campaigns"
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 2
    });
    
    if (localMemories.length > 0) {
      results.push(...localMemories.map((m: any) => m.content));
    }
  } catch (dbError) {
    console.warn("[MEMORY] Waarschuwing: Prisma zoekopdracht faalde.", dbError);
  }

  // 2. ZOEKEN IN VECTOR DATABASE
  if (!PINECONE_API_KEY) {
    if (results.length === 0) results.push("Geen historische data gevonden (simulatiemodus).");
    return results;
  }

  const queryVector = await generateEmbedding(query);

  try {
    const url = `https://${PINECONE_HOST}/query`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        namespace,
        vector: queryVector,
        topK,
        includeMetadata: true
      })
    });

    if (!response.ok) {
      throw new Error(`Pinecone Query Error: ${await response.text()}`);
    }

    const data = await response.json();
    if (data.matches && data.matches.length > 0) {
      results.push(...data.matches.map((m: any) => m.metadata.text));
    }
    
    return results.length > 0 ? results : ["Geen significante patronen gevonden in LTM."];
  } catch (error) {
    console.error("[MEMORY] Fout bij zoeken in Pinecone:", error);
    return results.length > 0 ? results : ["[MEMORY_ERROR]"];
  }
}
