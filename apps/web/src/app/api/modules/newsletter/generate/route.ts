import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key missing. Cannot generate newsletter.' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
Schrijf een overtuigende, professionele en converterende e-mail nieuwsbrief gebaseerd op het volgende onderwerp: 
"${topic}"

Gebruik een pakkende subject line. De body moet gestructureerd zijn met een inleiding, kernboodschap, en een duidelijke call to action (CTA).
De tone of voice is "The Syndicate": direct, ambitieus, high-ticket, resultaatgericht. Schrijf in het Nederlands.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message?.content || "";

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Newsletter Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate newsletter' }, { status: 500 });
  }
}
