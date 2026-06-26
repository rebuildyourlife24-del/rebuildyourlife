import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN is niet ingesteld in de Vercel environment variables.' }, { status: 500 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is verplicht.' }, { status: 400 });
    }

    // We gebruiken de Mochi-1 of Minimax open source AI modellen via de cloud
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
  } catch (error: any) {
    console.error('Render Engine Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
