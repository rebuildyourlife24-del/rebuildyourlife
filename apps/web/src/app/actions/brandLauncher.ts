'use server';

import { requireAuth } from '@/lib/auth-server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function generateBrandKitAction(domain: string, industry: string = 'Tech & E-commerce') {
  try {
    const user = await requireAuth();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return { success: false, error: 'AI Configuratie ontbreekt (API Key).' };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
      Jij bent de ultieme Omnichannel Brand Architect van de wereld.
      Maak een complete "Social Media & Brand Kit" voor een nieuwe onderneming.
      
      Bedrijfsnaam / Domein: ${domain}
      Industrie: ${industry}
      
      Output dit ALTIJD als een RAW JSON object zonder markdown of code blocks.
      Het JSON object MOET exact deze structuur hebben:
      {
        "facebook": { "bio": "...", "coverPrompt": "...", "firstPost": "..." },
        "instagram": { "bio": "...", "profilePrompt": "...", "firstPost": "..." },
        "linkedin": { "bio": "...", "coverPrompt": "...", "firstPost": "..." },
        "x": { "bio": "...", "firstPost": "..." },
        "snapchat": { "bio": "...", "firstPost": "...", "lensPrompt": "..." },
        "strategy": "Een korte pitch van 2 zinnen over de brand voice."
      }
      
      Zorg dat de content ultra-professioneel, wervend en SEO geoptimaliseerd is.
      Gebruik relevante emoji's en hashtags in de posts.
      De prompts moeten in het Engels zijn (voor tools zoals Midjourney of DALL-E).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up potential markdown blocks if the AI ignores instructions
    if (text.startsWith('\`\`\`json')) text = text.replace('\`\`\`json', '');
    if (text.startsWith('\`\`\`')) text = text.replace('\`\`\`', '');
    if (text.endsWith('\`\`\`')) text = text.replace(/\`\`\`$/, '');
    
    const brandKit = JSON.parse(text);

    return { success: true, brandKit };
  } catch (error: any) {
    console.error('Brand Kit Error:', error);
    return { success: false, error: error.message || 'Fout bij het genereren van de kit.' };
  }
}
