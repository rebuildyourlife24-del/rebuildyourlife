import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { CloudVideoService } from "./cloud-video.service";

export interface VideoConfig {
  provider: "openai" | "elevenlabs" | "google-free";
  openaiKey?: string;
  openaiVoice?: string;
  elevenlabsKey?: string;
  elevenlabsVoiceId?: string;
  style: "space" | "nature" | "abstract" | "tech";
  script: string;
  hyperrealistic?: boolean;
  grainStrength?: number;
  vignetteStrength?: number;
  chromaticAberration?: boolean;
  lightBloom?: boolean;
  cameraShake?: boolean;
  roomReverb?: boolean;
  ambientHiss?: boolean;
}

export class VideoGeneratorService {
  private static STOCK_VIDEOS = {
    space: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
    nature: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    abstract: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-27734-large.mp4",
    tech: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-blue-neon-lights-4428-large.mp4"
  };

  /**
   * Generates TTS audio via selected provider
   */
  private static async generateAudio(script: string, config: VideoConfig, tempDir: string): Promise<string> {
    const audioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);

    if (config.provider === "elevenlabs") {
      const apiKey = config.elevenlabsKey || process.env.ELEVENLABS_API_KEY;
      if (!apiKey) throw new Error("ElevenLabs API Key is missing.");
      const voiceId = config.elevenlabsVoiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel

      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.35, similarity_boost: 0.85 } // Lagere stabiliteit = meer natuurlijke menselijke imperfecties en emotie in de stem
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`ElevenLabs API failed: ${errText}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(audioPath, buffer);
      return audioPath;
    } else if (config.provider === "openai") {
      const apiKey = config.openaiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OpenAI API Key is missing.");
      const voice = config.openaiVoice || "alloy";

      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "tts-1",
          input: script,
          voice: voice
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI Speech API failed: ${errText}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(audioPath, buffer);
      return audioPath;
    } else {
      // provider === "google-free" -> Google Translate TTS fallback
      // Since Google Translate TTS has a 200 character limit, we chunk by sentences
      const sentences = script.match(/[^.!?]+[.!?]*/g) || [script];
      const chunks: Buffer[] = [];

      for (let i = 0; i < sentences.length; i++) {
        const text = sentences[i]?.trim();
        if (!text) continue;

        // Skip chunks longer than 200 chars or split them further
        const subChunks = text.length > 200 ? text.match(/.{1,180}(?=\s|$)/g) || [text] : [text];
        
        for (const subText of subChunks) {
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(subText)}`;
          const res = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
          });
          if (!res.ok) {
            throw new Error(`Free Google TTS failed for chunk: ${subText}`);
          }
          const buf = Buffer.from(await res.arrayBuffer());
          chunks.push(buf);
        }
      }

      if (chunks.length === 0) throw new Error("No script text to generate speech from.");
      fs.writeFileSync(audioPath, Buffer.concat(chunks));
      return audioPath;
    }
  }

  /**
   * Downloads stock clip if not cached
   */
  private static async getStockClip(style: keyof typeof this.STOCK_VIDEOS, tempDir: string): Promise<string> {
    const videoUrl = this.STOCK_VIDEOS[style] || this.STOCK_VIDEOS.space;
    const filename = `stock_${style}.mp4`;
    const cachedPath = path.join(tempDir, filename);

    if (fs.existsSync(cachedPath)) {
      return cachedPath;
    }

    console.log(`Downloading stock video from: ${videoUrl}`);
    const res = await fetch(videoUrl);
    if (!res.ok) throw new Error(`Could not download stock clip: ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(cachedPath, buffer);
    return cachedPath;
  }

  /**
   * Renders the video using local FFmpeg
   */
  public static async renderVideo(
    config: VideoConfig,
    onLog: (msg: string) => void = () => {}
  ): Promise<{ videoUrl: string; logs: string[] }> {
    const logs: string[] = [];
    const pushLog = (msg: string) => {
      logs.push(msg);
      onLog(msg);
      console.log(`[VideoGenerator]: ${msg}`);
    };

    try {
      pushLog("Stap 1: Signaal sturen naar GitHub Cloud GPU...");
      await CloudVideoService.triggerCloudRender(config);
      pushLog("Cloud render job succesvol gestart op GitHub Actions!");
      pushLog("De video wordt gegenereerd en zal binnenkort in Supabase verschijnen.");
      
      return {
        videoUrl: "PENDING_CLOUD_RENDER", // Or a temporary placeholder URL
        logs
      };
    } catch (err: any) {
      pushLog(`Fout bij starten van cloud render: ${err.message}`);
      throw err;
    }
  }
}
