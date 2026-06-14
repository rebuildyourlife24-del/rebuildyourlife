import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('[TTS Warning] No OPENAI_API_KEY found, skipping TTS.');
      return NextResponse.json({ audio: null });
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'onyx', // Onyx is the deep, Vin Diesel-like voice
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    return NextResponse.json({ audio: base64Audio });
  } catch (error: any) {
    console.error('[TTS Error]', error);
    // Return graceful fallback instead of breaking the app
    return NextResponse.json({ audio: null });
  }
}
