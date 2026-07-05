import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../../../.env') });

import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
  console.log("Checking API key...");
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const res = await model.generateContent("hello");
    console.log("Gemini 1.5 Pro works:", res.response.text());
    
    console.log("Trying embedding-001...");
    const embed1 = genAI.getGenerativeModel({ model: "embedding-001" });
    const r1 = await embed1.embedContent("hello");
    console.log("embed-001 works!", r1.embedding.values.length);
    
  } catch (e) {
    console.error("Error:", e);
  }
}
listModels();
