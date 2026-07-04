import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { niche, pitch } = await req.json();

    if (!niche || !pitch) {
      return NextResponse.json({ error: 'Niche and pitch are required' }, { status: 400 });
    }

    const aiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;

    if (!aiKey) {
      return NextResponse.json({ error: 'Gemini API key missing. Cannot generate leads.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `
Je bent een AI lead generation en koude acquisitie expert.
De gebruiker wil verkopen aan deze niche: "${niche}".
Zijn/haar pitch is: "${pitch}".

Genereer exact 3 verzonnen maar hyper-realistische B2B leads binnen deze niche.
Schrijf voor elke lead een gepersonaliseerde 'cold email pitch' die inspeelt op hun specifieke (verzonnen) situatie en eindigt met een Call To Action.
Zorg dat de pitch niet langer is dan 3-4 zinnen en extreem overtuigend (no-nonsense, direct, The Syndicate stijl).

Geef het antwoord in EXACt DIT JSON FORMAAT (zonder markdown, geen backticks!):
{
  "leads": [
    {
      "companyName": "Naam van Bedrijf",
      "email": "voornaam@bedrijfsnaam.nl",
      "personalizedPitch": "Beste [Voornaam], ik zag dat jullie kliniek in [Stad] flink groeit. Wij bouwen AI..."
    }
  ]
}
Geef ALLEEN puur JSON terug. Zorg dat de JSON valide is.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    let rawJson = response.text || "{}";
    // Opschonen van eventuele markdown blokken
    rawJson = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Cold Email Error:', error);
    // Fallback data
    return NextResponse.json({ 
      leads: [
        {
          companyName: "TechCorp Nederland",
          email: "directie@techcorp.nl",
          personalizedPitch: "Beste directie, ik zie dat jullie hard groeien maar worstelen met lead opvolging. Wij lossen dit op met AI. Tijd om te schakelen deze week?"
        }
      ]
    });
  }
}
