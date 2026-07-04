import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, targetAudience } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const aiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;

    if (!aiKey) {
      return NextResponse.json({ error: 'Gemini API key missing. Cannot generate website.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `
Je bent een expert CRO (Conversion Rate Optimization) webdesigner. 
Ontwerp een high-converting landingspagina (HTML + Tailwind CSS) voor het volgende:
Product/Dienst: ${topic}
Doelgroep: ${targetAudience || 'Algemeen'}

Vereisten:
1. Gebruik uitsluitend HTML5 en Tailwind CSS classes via CDN (<script src="https://cdn.tailwindcss.com"></script>).
2. De pagina moet een Hero sectie, Features sectie, Social Proof/Testimonial sectie en een sterke CTA onderaan hebben.
3. Gebruik "Future Blue" design elementen (Zwart, donkerblauw, en neon/cyan/fuchsia accenten).
4. Output MOET puur en alleen de volledige werkende HTML code zijn. Geen markdown blokken (\`\`\`html), geen introductie, enkel de code.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    let htmlContent = response.text || "";
    
    // Opschonen van eventuele markdown blokken
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```/g, '');

    return NextResponse.json({ success: true, html: htmlContent });
  } catch (error) {
    console.error('Website Builder Error:', error);
    return NextResponse.json({ error: 'Failed to generate website' }, { status: 500 });
  }
}
