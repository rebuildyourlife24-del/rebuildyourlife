/**
 * Agent 14 (Modified): J.A.R.V.I.S. Voice Engine
 * 100% Free Local Voice Cloning via Coqui XTTSv2 / Bark
 */
export class VoiceCloner {
  // De URL van de Python TTS server die we lokaal zullen draaien
  private static TTS_SERVER_URL = process.env.LOCAL_TTS_URL || 'http://localhost:5002/api/tts';
  
  // Jouw geselecteerde CEO-stem
  private static REFERENCE_VOICE = 'vin_diesel_reference.wav';

  /**
   * Converteert tekst naar spraak met de Vin Diesel voice-clone.
   * @param text De tekst die uitgesproken moet worden
   * @returns URL naar de gegenereerde audio blob
   */
  static async speak(text: string): Promise<string> {
    try {
      console.log(`[VOICE CLONER] Genereren van Vin Diesel audio voor: "${text.slice(0, 20)}..."`);
      
      const response = await fetch(this.TTS_SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          language: 'nl', // Kan ook 'en' zijn voor de originele Vin Diesel vibe
          speaker_wav: this.REFERENCE_VOICE,
          speed: 1.0 // Vin Diesel praat langzaam en diep
        })
      });

      if (!response.ok) {
        throw new Error('Local TTS Server Offline');
      }

      // We krijgen een audio blob terug
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return audioUrl;
    } catch (error) {
      console.error('[VOICE CLONER ERROR]:', error);
      // Fallback: Gebruik browser Web Speech API (Gratis ingebouwd)
      return 'fallback_web_speech';
    }
  }

  /**
   * Laat de browser de gegenereerde audio afspelen (of de fallback gebruiken).
   */
  static play(audioUrl: string, text: string) {
    if (audioUrl === 'fallback_web_speech') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL';
      utterance.pitch = 0.5; // Laag, alsof het Vin Diesel is
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }
}
