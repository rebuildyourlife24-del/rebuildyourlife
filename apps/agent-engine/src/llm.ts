import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as path from "path";

// Laad .env van de monorepo root
dotenv.config({ path: path.join(__dirname, "../../../.env") });

// 1. CEREBRAS API KEYS
const cerebrasKeys = [
  process.env.CEREBRAS_API_KEY_1,
  process.env.CEREBRAS_API_KEY_2,
  process.env.CEREBRAS_API_KEY_3,
  process.env.CEREBRAS_API_KEY,
].filter(Boolean) as string[];

// 2. GROQ API KEYS
const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY,
].filter(Boolean) as string[];

// 3. GOOGLE GEMINI API KEYS
const geminiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
].filter(Boolean) as string[];

// 4. OPENAI API KEYS
const openaiKeys = [
  process.env.OPENAI_API_KEY,
].filter(Boolean) as string[];

// 5. OPENROUTER API KEYS
const openrouterKeys = [
  process.env.OPENROUTER_API_KEY,
].filter(Boolean) as string[];

const models: ChatOpenAI[] = [];

// === STAP 1: CEREBRAS (PRIMARY - EXTREEEM SNEL) ===
cerebrasKeys.forEach((key, idx) => {
  models.push(new ChatOpenAI({
    configuration: {
      baseURL: "https://api.cerebras.ai/v1",
      apiKey: key,
    },
    modelName: "llama-3.3-70b",
    temperature: 0.2,
  }));
});

// === STAP 2: GROQ (SECONDARY - SNEL EN BETROUWBAAR) ===
groqKeys.forEach((key, idx) => {
  models.push(new ChatOpenAI({
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: key,
    },
    modelName: "llama-3.3-70b-versatile",
    temperature: 0.2,
  }));
});

// === STAP 3: GOOGLE GEMINI (TERTIARY - GROTE CONTEXT EN SLIM) ===
geminiKeys.forEach((key, idx) => {
  models.push(new ChatOpenAI({
    configuration: {
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      apiKey: key,
    },
    modelName: "gemini-2.5-flash",
    temperature: 0.2,
  }));
});

// === STAP 4: OPENAI (QUATERNARY - GOLD STANDARD) ===
openaiKeys.forEach((key, idx) => {
  models.push(new ChatOpenAI({
    configuration: {
      baseURL: "https://api.openai.com/v1",
      apiKey: key,
    },
    modelName: "gpt-4o-mini",
    temperature: 0.2,
  }));
});

// === STAP 5: OPENROUTER (ULTIMATE FALLBACK - CATCH-ALL) ===
openrouterKeys.forEach((key, idx) => {
  models.push(new ChatOpenAI({
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: key,
    },
    modelName: "meta-llama/llama-3.1-8b-instruct:free",
    temperature: 0.2,
  }));
});

// Mock/fallback als er helemaal niks in de .env staat
if (models.length === 0) {
  console.warn("[AGENT ENGINE] Geen enkele API key gevonden in .env. Mocking modus actief.");
  models.push(new ChatOpenAI({
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: "mock-key",
    },
    modelName: "llama-3.3-70b-versatile",
    temperature: 0.2,
  }));
}

console.log(
  `[AGENT ENGINE] Sovereign AI Router geladen met: ` +
  `${cerebrasKeys.length}x Cerebras, ${groqKeys.length}x Groq, ` +
  `${geminiKeys.length}x Gemini, ${openaiKeys.length}x OpenAI, ${openrouterKeys.length}x OpenRouter.`
);

// Koppel de modellen aan elkaar via LangChain's native .withFallbacks()
export const model = models[0].withFallbacks(models.slice(1));
