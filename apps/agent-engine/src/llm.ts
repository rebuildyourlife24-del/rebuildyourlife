import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import * as path from "path";

// Laad .env van de monorepo root
dotenv.config({ path: path.join(__dirname, "../../../.env") });

// 1. GROQ API KEYS (PRIMARY - 8 SLEUTELS!)
const groqKeys = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
  process.env.GROQ_API_KEY_5,
  process.env.GROQ_API_KEY_6,
  process.env.GROQ_API_KEY_7,
  process.env.GROQ_API_KEY_8,
].filter(Boolean) as string[];

// Dedubliceer sleutels voor de zekerheid
const uniqueGroqKeys = [...new Set(groqKeys)];

const groqModels: ChatOpenAI[] = uniqueGroqKeys.map((key, idx) => {
  return new ChatOpenAI({
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: key,
    },
    modelName: "llama-3.3-70b-versatile",
    temperature: 0.2,
    maxRetries: 0 // We doen de retries ZELF in onze Sovereign Router
  });
});

// 2. GEMINI API KEYS (SECONDARY FALLBACK - 8 SLEUTELS)
const geminiKeys = [
  process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
].filter(Boolean) as string[];

const uniqueGeminiKeys = [...new Set(geminiKeys)];

const geminiModels = uniqueGeminiKeys.map((key, idx) => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: key,
    temperature: 0.2,
    maxRetries: 0
  });
});

// 3. CEREBRAS API KEYS (TERTIARY FALLBACK - 4 SLEUTELS)
const cerebrasKeys = [
  process.env.CEREBRAS_API_KEY_1,
  process.env.CEREBRAS_API_KEY_2,
  process.env.CEREBRAS_API_KEY_3,
  process.env.CEREBRAS_API_KEY_4,
].filter(Boolean) as string[];

const uniqueCerebrasKeys = [...new Set(cerebrasKeys)];

const cerebrasModels: ChatOpenAI[] = uniqueCerebrasKeys.map((key) => {
  return new ChatOpenAI({
    configuration: {
      baseURL: "https://api.cerebras.ai/v1",
      apiKey: key,
    },
    // Let op: Llama-3.1-8b is de meest stabiele bij Cerebras momenteel
    modelName: "llama3.1-8b",
    temperature: 0.2,
    maxRetries: 0
  });
});

// 4. OPENROUTER API KEYS (QUATERNARY FALLBACK - 5 SLEUTELS)
const openrouterKeys = [
  process.env.OPENROUTER_API_KEY_1,
  process.env.OPENROUTER_API_KEY_2,
  process.env.OPENROUTER_API_KEY_3,
  process.env.OPENROUTER_API_KEY_4,
  process.env.OPENROUTER_API_KEY_5,
].filter(Boolean) as string[];

const uniqueOpenrouterKeys = [...new Set(openrouterKeys)];

const openrouterModels: ChatOpenAI[] = uniqueOpenrouterKeys.map((key) => {
  return new ChatOpenAI({
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: key,
    },
    modelName: "meta-llama/llama-3.1-8b-instruct:free",
    temperature: 0.2,
    maxRetries: 0
  });
});

console.log(`[AGENT ENGINE] Sovereign AI Router geladen met: ` + 
  `${groqModels.length}x Groq, ${geminiModels.length}x Gemini, ` + 
  `${cerebrasModels.length}x Cerebras, ${openrouterModels.length}x OpenRouter.`);

/**
 * De Sovereign Router: Een ingebouwde "LiteLLM" Load Balancer
 * Deze wrapper doet zich voor als een LangChain model, maar roteert 
 * razendsnel over alle beschikbare API-sleutels om Rate Limits (429) te ontwijken.
 */
export const model = {
  invoke: async (messages: BaseMessage[], options?: any): Promise<any> => {
    if (groqModels.length === 0 && geminiModels.length === 0 && cerebrasModels.length === 0 && openrouterModels.length === 0) {
      throw new Error("Geen API sleutels beschikbaar in .env");
    }

    // Combineer alle modellen en schud ze (Round-Robin / Load Balancing per request)
    const shuffledGroq = [...groqModels].sort(() => Math.random() - 0.5);
    const shuffledGemini = [...geminiModels].sort(() => Math.random() - 0.5);
    const shuffledCerebras = [...cerebrasModels].sort(() => Math.random() - 0.5);
    const shuffledOpenRouter = [...openrouterModels].sort(() => Math.random() - 0.5);
    
    // De prioriteit is: Groq -> Gemini -> Cerebras -> OpenRouter
    const allModels = [...shuffledGroq, ...shuffledGemini, ...shuffledCerebras, ...shuffledOpenRouter];

    let lastError: any = null;

    // Probeer alle sleutels achter elkaar als we 429 of 500 errors krijgen
    for (let i = 0; i < allModels.length; i++) {
      const currentModel = allModels[i];
      try {
        const response = await currentModel.invoke(messages, options);
        return response;
      } catch (error: any) {
        const status = error?.status || error?.response?.status;
        lastError = error;
        
        // Als het een Rate Limit (429) of Server Error (5xx) is, of 404, probeer de volgende sleutel!
        if (status === 429 || status >= 500 || status === 404) {
          console.warn(`[SOVEREIGN ROUTER] API Error (${status}) op pool-sleutel ${i+1}. Failover naar volgende sleutel...`);
          if (status === 429) {
            // Wacht 2 seconden om free-tier limieten te respecteren voordat we de volgende sleutel proberen
            await new Promise(r => setTimeout(r, 2000));
          }
          continue; // Ga naar de volgende loop iteratie
        }
        
        // Bij andere errors (bijv. invalid format), gooi meteen op want de prompt is stuk
        throw error;
      }
    }

    // Als alle geprobeerde sleutels falen
    console.error("[SOVEREIGN ROUTER] FATAL: Alle fallback sleutels hebben gefaald.");
    throw lastError;
  }
};

/**
 * Expose a dedicated heavy-context model for Semantic ETL (Data Conditioning Kernel)
 */
export function getHeavyContextModel() {
  if (geminiModels.length === 0) {
    throw new Error("Geen Gemini sleutels beschikbaar voor Semantic ETL.");
  }
  // Use the first Gemini model. Gemini 1.5 Flash supports 1M tokens.
  return {
    model: geminiModels[0]
  };
}
