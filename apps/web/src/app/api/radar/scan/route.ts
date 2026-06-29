import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    const prompt = `Je bent Hermes, de AI Sovereign Wealth Radar van de Godbrain.
Je analyseert het internet op e-commerce trends.
Genereer 1 unieke en hyper-specifieke 'Winning Product' of 'Dienst' kans die momenteel viraal gaat of onderbelicht is.
Geef het terug als een JSON object met EXACT deze structuur:
{
  "title": "Korte pakkende titel",
  "niche": "De markt/niche",
  "summary": "Een overtuigende samenvatting van 3-4 zinnen over waarom dit een kans is en hoe je het verkoopt.",
  "goodROI": 150,
  "betterROI": 300,
  "bestROI": 650
}
Geef ALLEEN JSON terug, geen markdown blokken, geen uitleg eromheen.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(content);

    const report = await db.opportunityReport.create({
      data: {
        userId: user.id,
        title: data.title || "Unknown Signal",
        niche: data.niche || "General",
        summary: data.summary || "No data received.",
        goodROI: Number(data.goodROI) || 100,
        betterROI: Number(data.betterROI) || 200,
        bestROI: Number(data.bestROI) || 500,
        status: "REVIEW"
      }
    });

    return NextResponse.json({ success: true, report });

  } catch (error: any) {
    console.error("Radar Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
