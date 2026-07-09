import { NextResponse } from 'next/server';

// Dit is de absolute brug tussen de beveiligde Next.js applicatie en je lokale Llama 3/Ollama model.
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function POST(req: Request) {
  try {
    const { prompt, model = 'llama3', system } = await req.json();

    // Bouw de keiharde Billionaire Directive in (als fallback)
    const systemPrompt = system || `Jij bent ORION, de First-Class Money Maker en Chief Operating Officer van RebuildYourLife. Jouw enige doel is het genereren van maximale marge en het minimaliseren van inefficiënties.`;

    // Roep de lokale AI Server aan
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to connect to Local Orion Node', details: errorText }, { status: 502 });
    }

    const data = await response.json();
    
    // Bij succesvolle verwerking sturen we het antwoord direct terug naar het Command Center
    return NextResponse.json({
      response: data.response,
      meta: {
        model: data.model,
        eval_count: data.eval_count,
        eval_duration: data.eval_duration,
        cost: 0.00, // Altijd gratis omdat het lokaal draait
      }
    });

  } catch (error: any) {
    console.error('Local Orion Connection Error:', error);
    return NextResponse.json({ 
      error: 'Orion Node is offline. Zorg ervoor dat Ollama / Llama 3 draait op de server.', 
      details: error.message 
    }, { status: 503 });
  }
}
