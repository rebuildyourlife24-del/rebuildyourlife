import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1 || '',
});

export class PatternRecognitionService {
  /**
   * Pakt een array van financiële data (bijv. dagelijkse omzet van de laatste 30 dagen)
   * en voorspelt wiskundig de komende 7 dagen, inclusief anomalie-detectie.
   */
  static async runFinancialMonteCarlo(historicalData: any[]) {
    console.log(`[PATTERN ENGINE] Analyzing ${historicalData.length} data points...`);

    const prompt = `
      Je bent de 'Sovereign Grid Quantum Engine', een hyper-geavanceerd algoritme voor patroonherkenning.
      Hieronder vind je de financiële data (JSON format) van de afgelopen periode.

      DATA:
      ${JSON.stringify(historicalData)}

      TAAK:
      1. Voer een regressie-analyse uit op de data. Is er een opwaartse of neerwaartse trend?
      2. Zoek naar anomalieën (afwijkingen). Welke dag had een onverklaarbare drop of piek?
      3. Voer een gesimuleerde Monte Carlo analyse uit om de verwachte cashflow voor de komende 7 dagen te voorspellen.

      Geef je antwoord terug in EXACT de volgende JSON structuur:
      {
        "trend": "UPWARD" | "DOWNWARD" | "STAGNANT",
        "anomaliesDetected": string[],
        "predictionNext7Days": number,
        "recommendedAction": string
      }
    `;

    try {
      const { text } = await generateText({
        model: groq('llama3-70b-8192') as any,
        prompt: prompt,
      });

      // Zorg ervoor dat we alleen de JSON string parsen
      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('[PATTERN ENGINE] Fout tijdens LLM processing:', e);
      return null;
    }
  }

  /**
   * Pakt een array van concurrentie-data (bijv. aantal live ads per dag)
   * en berekent via patroonherkenning of we moeten opschalen of afschalen.
   */
  static async detectMarketAnomalies(competitorData: any[]) {
    const prompt = `
      Je bent de 'Sovereign Grid Market Oracle'. 
      Analyseer de volgende marktsignalen en het advertentie-volume van de concurrent:

      DATA:
      ${JSON.stringify(competitorData)}

      TAAK:
      Detecteer patronen in het advertentiegedrag van de concurrent. 
      Als ze ineens veel ads pauzeren, is de niche waarschijnlijk dood of de ad-kosten (CPM) te hoog.
      Als ze keihard opschalen, hebben ze een winnend product gevonden.

      Return ONLY raw JSON:
      {
        "competitorStrategy": "SCALING" | "PAUSING" | "TESTING",
        "marketThreatLevel": "LOW" | "MEDIUM" | "HIGH",
        "strategicAdvice": "Wat moet Hermes (CEO) nu direct besluiten?"
      }
    `;

    try {
      const { text } = await generateText({
        model: groq('llama3-70b-8192') as any,
        prompt: prompt,
      });

      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('[PATTERN ENGINE] Fout in market anomaly detectie:', e);
      return null;
    }
  }
}
