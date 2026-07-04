import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId = "pNInz6obpgDQGcFmaJcg" } = await req.json(); // Default voice (Adam)

    if (!text) {
      return NextResponse.json({ error: 'Text is verplicht voor voice generation.' }, { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'ELEVENLABS_API_KEY ontbreekt in Vercel instellingen.' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs Error:", errorData);
      throw new Error(errorData.detail?.message || 'Fout bij communicatie met ElevenLabs API.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = `data:audio/mpeg;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ audioUrl: base64Audio });
    
  } catch (error: any) {
    console.error('Voice Engine Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
