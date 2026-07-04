'use server';

export async function generateVoiceAction(text: string) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is niet ingesteld in de .env file');
    }

    const voiceId = 'pNInz6obpgDQGcFmaJcg'; // Adam (Standard Voice)
    
    // ElevenLabs API Call
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs API Error:', errText);
      throw new Error('Kon de voice-over niet genereren via ElevenLabs.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    return {
      success: true,
      audioBase64: `data:audio/mpeg;base64,${base64Audio}`
    };

  } catch (error: any) {
    console.error('Voice Generation Error:', error);
    return {
      success: false,
      error: error.message || 'Onbekende fout'
    };
  }
}
