import { NextResponse } from 'next/server';

// THE SOVEREIGN AD-ASSET WIZARD (PROMPT TRANSLATOR)
export async function POST(req: Request) {
  try {
    const { product, vibe, assetType } = await req.json();

    if (!product || !vibe || !assetType) {
      return NextResponse.json({ error: 'Product, sfeer en type (video/foto) zijn verplicht.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key ontbreekt in de server configuratie (.env)' }, { status: 500 });
    }

    // Gebruik gemini-1.5-pro
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const systemInstruction = `Je bent een Master Prompt Engineer voor AI Foto en Video generatoren (zoals Replicate, Midjourney, HuggingFace).
De gebruiker geeft je een product, een sfeer en een type (video of foto).
Schrijf een extreem gedetailleerde, Engelstalige prompt die perfect is voor de generator om een extreem hoogwaardige commerciële advertentie te maken.
Geef ALLEEN de rauwe prompt terug, absoluut geen introductie, geen uitleg, en geen markdown quotes.`;
    
    const userPrompt = `Product: ${product}, Sfeer: ${vibe}, Type: ${assetType}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
       console.error("[Ad-Wizard] Gemini API Error:", data.error.message);
       // Fallback naar een standaard prompt als de API faalt (bijv. verkeerd model)
       const fallbackPrompt = assetType === 'video' 
          ? `Ultra-realistic 4k cinematic video of ${product}, highly detailed, ${vibe} atmosphere, professional commercial lighting, slow pan, 60fps, 8k resolution, photorealistic.`
          : `Award-winning photography of ${product}, ${vibe} lighting, sharp focus, 8k resolution, highly detailed, professional studio shot.`;
       
       return NextResponse.json({ masterPrompt: fallbackPrompt, warning: 'Gebruikte fallback wegens API error.' });
    }

    let masterPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!masterPrompt) {
        throw new Error('Geen geldige prompt ontvangen van de AI.');
    }

    // In de toekomst: Hier roepen we intern direct `/api/generate` aan met de masterPrompt.
    // Voor nu sturen we de perfecte prompt terug naar de frontend.
    return NextResponse.json({ masterPrompt });

  } catch (error: any) {
    console.error('[Ad-Wizard] Server Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
