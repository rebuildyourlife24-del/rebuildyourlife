'use server';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1 || "",
});

export async function generateProductProposalsAction() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Gebruik pro voor diepere marktanalyse
      contents: `
      Je bent de RYL OS Product Hunter Agent, getraind in de Thomas vd Leck methodiek voor dropshipping/e-commerce in 2026.
      
      Jouw taak: Bedenk 3 extreem sterke "Winnende Producten" die we direct kunnen verkopen op een algemene Shopify store.
      
      Voor elk product EIS ik een strakke validatie op deze 5 punten:
      1. Probleemoplossend / Echte Vraag
      2. Goede Winstmarge (Sourcing vs Verkoopprijs)
      3. Impuls-aankoop (Wow-factor)
      4. Balans in Concurrentie (Nieuwe trend)
      5. Logistiek Simpel (Licht/Klein)

      Retourneer de output STRIKT in onderstaand JSON array formaat, ZONDER markdown blokken:
      [
        {
          "id": "1",
          "title": "Product Naam",
          "description": "Korte, pakkende omschrijving van 2 zinnen",
          "suggestedPrice": 49.95,
          "costPrice": 12.50,
          "rationale": {
            "problemSolving": "Uitleg punt 1...",
            "profitMargin": "Uitleg punt 2...",
            "impulse": "Uitleg punt 3...",
            "competition": "Uitleg punt 4...",
            "logistics": "Uitleg punt 5..."
          }
        }
      ]
      `,
    });

    let jsonString = response.text || "[]";
    jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return { success: true, data: JSON.parse(jsonString) };
  } catch (error: any) {
    console.error("Genesis AI Error:", error);
    return { success: false, error: error.message };
  }
}
