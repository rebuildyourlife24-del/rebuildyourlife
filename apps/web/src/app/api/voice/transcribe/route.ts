import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided in request body.' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured on Vercel.' }, { status: 500 });
    }

    // Prepare Groq Whisper API request
    const groqFormData = new FormData();
    groqFormData.append('file', file);
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('language', 'nl'); // Force Dutch for maximum accuracy with Henk's voice commands

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq transcription API failed:', errorText);
      return NextResponse.json({ error: 'Groq audio transcription failed.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text });

  } catch (error: any) {
    console.error('[TRANSCRIBE ROUTE ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
