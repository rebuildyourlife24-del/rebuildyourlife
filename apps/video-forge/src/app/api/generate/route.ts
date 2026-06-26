import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const { prompt, modelType } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is verplicht.' }, { status: 400 });
    }

    if (modelType === 'premium') {
      // PREMIUM: Replicate Mochi-1 (4K, sneller, kost API credits)
      const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
      if (!REPLICATE_API_TOKEN) {
        return NextResponse.json({ error: 'REPLICATE_API_TOKEN is niet ingesteld in Vercel.' }, { status: 500 });
      }

      const replicate = new Replicate({
        auth: REPLICATE_API_TOKEN,
      });

      const output = await replicate.run(
        "lucataco/mochi-1:1944af04d098ffa6936f5bb39a311b585350ec719e2467d3bd7df7e43d1a89c3",
        {
          input: {
            prompt: prompt,
            num_frames: 163,
          }
        }
      );

      let videoUrl = null;
      if (Array.isArray(output) && output.length > 0) {
          videoUrl = output[0];
      } else if (typeof output === 'string') {
          videoUrl = output;
      } else if (output && typeof output === 'object' && 'url' in output) {
          videoUrl = (output as any).url;
      }

      return NextResponse.json({ videoUrl });
    } 
    
    // FREE: Hugging Face ZeroGPU (1080p, in de wachtrij, 100% gratis)
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return NextResponse.json({ error: 'HF_TOKEN (Hugging Face API key) is niet ingesteld in Vercel.' }, { status: 500 });
    }

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
      
      if (response.status === 503) {
         return NextResponse.json({ error: "De gratis GPU's worden momenteel opgewarmd. Probeer het over 1 a 2 minuten nog eens." }, { status: 503 });
      }

      throw new Error(`Hugging Face API Error: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Video = `data:video/mp4;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ videoUrl: base64Video });

  } catch (error: any) {
    console.error('Render Engine Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
