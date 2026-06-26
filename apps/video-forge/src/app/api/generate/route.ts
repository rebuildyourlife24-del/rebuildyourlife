import { NextResponse } from 'next/server';

// Optioneel: verhoog timeout voor Vercel (Hobby plan is max 60 seconden)
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return NextResponse.json({ error: 'HF_TOKEN (Hugging Face API key) is niet ingesteld in Vercel.' }, { status: 500 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is verplicht.' }, { status: 400 });
    }

    // 100% Gratis Open-Source Text-To-Video model op Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ali-vilab/modelscope-damo-text-to-video-synthesis",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      
      // Als het model nog geladen moet worden in de gratis pool, duurt het even.
      if (response.status === 503) {
         return NextResponse.json({ error: "De gratis GPU's worden momenteel opgewarmd. Probeer het over 1 a 2 minuten nog eens." }, { status: 503 });
      }

      throw new Error(`Hugging Face API Error: ${errorText}`);
    }

    // We ontvangen de video als binair bestand en zetten hem om naar Base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Video = `data:video/mp4;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ videoUrl: base64Video });

  } catch (error: any) {
    console.error('Gratis Render Engine Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
