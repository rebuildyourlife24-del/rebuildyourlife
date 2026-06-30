import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || 'mock_key',
});

export class AiTranslationService {
  /**
   * Vertaalt content on the fly gebaseerd op het gedetecteerde land in de middleware.
   */
  static async translateProductData(title: string, description: string, countryCode: string) {
    if (countryCode === 'NL' || countryCode === 'BE') {
      return { title, description }; // Geen vertaling nodig
    }

    try {
      const languageMap: Record<string, string> = {
        'US': 'American English',
        'GB': 'British English',
        'DE': 'German',
        'FR': 'French',
        'ES': 'Spanish',
        'JP': 'Japanese',
        'IT': 'Italian',
      };

      const targetLanguage = languageMap[countryCode] || 'English';

      const prompt = `
        You are an expert E-commerce copywriter. 
        Translate the following product title and description into highly converting ${targetLanguage}.
        Maintain persuasive tone and optimize for local SEO.

        Title: ${title}
        Description: ${description}

        Return ONLY a JSON object: { "title": "...", "description": "..." }
      `;

      // Dit is de AI hook. Zodra een Japanse bezoeker op de site komt, 
      // vertaalt dit model in milliseconden de content.
      const { text } = await generateText({
        model: groq('llama3-70b-8192'),
        prompt: prompt,
      });

      const parsed = JSON.parse(text);
      return parsed;
      
    } catch (e) {
      console.error('Translation error, falling back to original', e);
      return { title, description };
    }
  }

  /**
   * Converteert valuta dynamisch inclusief een 5% risico marge voor wisselkoersen.
   */
  static convertCurrency(amountInEur: number, targetCurrency: string): number {
    const exchangeRates: Record<string, number> = {
      'EUR': 1,
      'USD': 1.08,
      'GBP': 0.85,
      'JPY': 160.50,
    };

    const rate = exchangeRates[targetCurrency] || 1.08; // Fallback to USD
    const converted = amountInEur * rate;
    
    // Voeg 5% toe voor valutarisico en afronding
    return Math.ceil((converted * 1.05) * 100) / 100;
  }
}
