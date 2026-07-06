import { z } from "zod";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

// ==========================================
// 1. SCHEMAS & INTERFACES (ZOD)
// ==========================================

export const RelevanceScoreSchema = z.object({
  task: z.number().min(0).max(1).describe("Hoe relevant is deze informatie voor de specifieke taak? (0.0 = onzin, 1.0 = cruciaal)"),
  general: z.number().min(0).max(1).describe("Hoe nuttig is deze informatie in het algemeen?"),
  confidence: z.number().min(0).max(1).describe("Hoe zeker ben je van de feitelijke correctheid van deze extractie?")
});

export const SourceRefSchema = z.object({
  provider: z.string().describe("De bron/tool die de data heeft geleverd (bijv. 'firecrawl', 'database')"),
  url: z.string().optional().describe("De originele URL indien van toepassing"),
  fetchedAt: z.string().describe("ISO timestamp van de scraping"),
  documentSessionId: z.string().describe("Unieke ID voor deze scraping sessie"),
  chunkIndex: z.number().describe("Positie van de chunk in de originele data"),
  totalChunks: z.number().describe("Totaal aantal chunks")
});

export const CompressedPayloadSchema = z.object({
  schemaVersion: z.literal("1.0"),
  facts: z.array(z.string()).describe("Harde, feitelijke beweringen uit de tekst."),
  entities: z.array(z.string()).describe("Namen van bedrijven, personen of technologieën."),
  numbers: z.array(z.string()).describe("Statistieken, bedragen, percentages of wiskundige data."),
  timeline: z.array(z.string()).describe("Chronologische gebeurtenissen of deadlines indien aanwezig."),
  relevance: RelevanceScoreSchema,
  source: SourceRefSchema
});

export type CompressedPayload = z.infer<typeof CompressedPayloadSchema>;

export interface ETLMetrics {
  preprocessingTimeMs: number;
  transformTimeMs: number;
  validationRetries: number;
  chunksDropped: number;
  chunksAccepted: number;
  compressionRatio: string;
  tokenEstimateBefore: number;
  tokenEstimateAfter: number;
}

export interface ETLResult {
  payloads: CompressedPayload[];
  metrics: ETLMetrics;
}

// Model-agnostic transformer interface
export interface SemanticTransformer {
  model: BaseChatModel;
}

// ==========================================
// 2. KERNEL LOGIC
// ==========================================

/**
 * T1: Deterministic Pre-parse & Chunking
 * Clean up noise and chunk text semantically (by headers or paragraphs) with overlap.
 */
function chunkTextSemantically(text: string, maxTokensPerChunk = 8000): string[] {
  // Simple deterministic pre-parse: remove excessive whitespace
  let cleanText = text.replace(/\n{3,}/g, '\n\n').trim();
  
  const chunks: string[] = [];
  const paragraphs = cleanText.split(/\n\n|(?=\n#)/);
  
  let currentChunk = "";
  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxTokensPerChunk * 4) { // Roughly 4 chars per token
      chunks.push(currentChunk.trim());
      // 15% overlap: carry over the last bit of the current chunk
      currentChunk = currentChunk.substring(Math.floor(currentChunk.length * 0.85)) + "\n" + p;
    } else {
      currentChunk += "\n" + p;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * T2: Schema Repair Prompt Loop
 * Validates the structured output. If it fails, prompts the LLM to fix it.
 */
async function enforceStructuredExtraction(
  transformer: SemanticTransformer,
  chunk: string,
  taskContext: string,
  sourceRefData: any,
  maxRetries = 2
): Promise<{ payload: CompressedPayload | null, retries: number }> {
  
  let retries = 0;
  let lastError = "";
  let lastOutput = "";

  const systemInstruction = `Je bent een data-extractie kernel. Jouw ENIGE taak is het extraheren van gestructureerde data uit de meegeleverde ruwe tekst.
TAAK CONTEXT: ${taskContext}
BRON META-DATA: ${JSON.stringify(sourceRefData)}

BELANGRIJK: Zorg ervoor dat het veld "schemaVersion" exact "1.0" is. Integreer de BRON META-DATA exact in het "source" veld.`;

  // Use Langchain's built-in structured output mechanism if supported by the model
  const structuredModel = transformer.model.withStructuredOutput(CompressedPayloadSchema, {
    name: "ExtractData"
  });

  while (retries <= maxRetries) {
    try {
      let prompt: any[] = [new SystemMessage(systemInstruction)];
      
      if (retries === 0) {
        prompt.push(new HumanMessage(`Extraheer de data uit deze chunk:\n\n${chunk}`));
      } else {
        // Schema Repair Loop
        prompt.push(new HumanMessage(`Je vorige poging faalde wegens een schema-fout:\n${lastError}\n\nJouw verkeerde output was:\n${lastOutput}\n\nHerstel dit onmiddellijk en voldoe aan het JSON schema voor de originele tekst:\n${chunk}`));
      }

      const result = await structuredModel.invoke(prompt);
      
      // Zod Validation Gate (Redundant safety check)
      const parsed = CompressedPayloadSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error(parsed.error.message);
      }
      
      return { payload: parsed.data, retries };

    } catch (err: any) {
      lastError = err.message || "Unknown schema error";
      retries++;
      console.warn(`[ETL REPAIR LOOP] Validation failed. Retry ${retries}/${maxRetries}. Error: ${lastError.substring(0, 100)}...`);
    }
  }

  // Emergency Truncate/Failover (If it totally fails after retries, return null)
  return { payload: null, retries: maxRetries };
}

/**
 * Main Semantic ETL Pipeline
 */
export async function processSemanticETL(
  transformer: SemanticTransformer,
  rawData: string,
  taskGoal: string,
  provider: string = "unknown",
  url?: string
): Promise<ETLResult> {
  const startTime = Date.now();
  const documentSessionId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // T1: Pre-process & Chunk
  const preStart = Date.now();
  const chunks = chunkTextSemantically(rawData);
  const preprocessingTimeMs = Date.now() - preStart;
  
  const metrics: ETLMetrics = {
    preprocessingTimeMs,
    transformTimeMs: 0,
    validationRetries: 0,
    chunksDropped: 0,
    chunksAccepted: 0,
    compressionRatio: "0%",
    tokenEstimateBefore: Math.floor(rawData.length / 4),
    tokenEstimateAfter: 0
  };

  const finalPayloads: CompressedPayload[] = [];
  
  // T2: Semantic Extraction per Chunk
  const transStart = Date.now();
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    const sourceRef = {
      provider,
      url,
      fetchedAt: new Date().toISOString(),
      documentSessionId,
      chunkIndex: i,
      totalChunks: chunks.length
    };

    const { payload, retries } = await enforceStructuredExtraction(transformer, chunk, taskGoal, sourceRef);
    metrics.validationRetries += retries;

    // Execution Control Layer: Relevance Gates
    if (payload) {
      if (payload.relevance.task < 0.3 || payload.relevance.confidence < 0.2) {
        // Drop useless chunks immediately
        metrics.chunksDropped++;
      } else {
        metrics.chunksAccepted++;
        finalPayloads.push(payload);
      }
    } else {
      metrics.chunksDropped++; // Failed extraction completely
    }
  }
  
  metrics.transformTimeMs = Date.now() - transStart;
  
  // Calculate compression ratio
  const jsonOutputStr = JSON.stringify(finalPayloads);
  metrics.tokenEstimateAfter = Math.floor(jsonOutputStr.length / 4);
  const ratio = (1 - (metrics.tokenEstimateAfter / Math.max(1, metrics.tokenEstimateBefore))) * 100;
  metrics.compressionRatio = `${ratio.toFixed(2)}%`;

  return {
    payloads: finalPayloads,
    metrics
  };
}
