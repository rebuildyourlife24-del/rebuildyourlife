import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const aiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;

    if (!aiKey) {
      return NextResponse.json({ error: 'Gemini API key missing. Cannot generate newsletter.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `
Schrijf een overtuigende, professionele en converterende e-mail nieuwsbrief gebaseerd op het volgende onderwerp: 
"${topic}"

Gebruik een pakkende subject line. De body moet gestructureerd zijn met een inleiding, kernboodschap, en een duidelijke call to action (CTA).
De tone of voice is "The Syndicate": direct, ambitieus, high-ticket, resultaatgericht. Schrijf in het Nederlands.
Vergeet niet om grofweg HTML formattering te gebruiken zoals <b>, <i>, <br/> zodat het mooi toont, maar gebruik geen markdown blokken of complete body/html tags.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    let content = response.text || "";
    // Clean up markdown blocks if any
    content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Newsletter Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate newsletter' }, { status: 500 });
  }
}
