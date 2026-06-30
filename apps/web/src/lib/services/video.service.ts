import { spawn } from "child_process";
import fs from "fs";
import path from "path";

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

    // Prepare directories
    const publicDir = path.join(process.cwd(), "public");
    const renderedDir = path.join(publicDir, "rendered");
    const tempDir = path.join(publicDir, "temp");

    if (!fs.existsSync(renderedDir)) fs.mkdirSync(renderedDir, { recursive: true });
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const outputFilename = `rendered_${Date.now()}.mp4`;
    const outputPath = path.join(renderedDir, outputFilename);

    let audioPath = "";
    let stockVideoPath = "";

    try {
      pushLog("Stap 1: Stockclip voorbereiden...");
      stockVideoPath = await this.getStockClip(config.style, tempDir);
      pushLog("Stockclip gereed.");

      pushLog("Stap 2: Spraak-synthese genereren...");
      audioPath = await this.generateAudio(config.script, config, tempDir);
      pushLog("Spraak-audio gegenereerd.");

      pushLog("Stap 3: Video-rendering via FFmpeg starten...");

      // Dynamic filter complex for hyperrealism
      const isHyper = config.hyperrealistic !== false;
      const grainStrength = config.grainStrength !== undefined ? config.grainStrength : (isHyper ? 8 : 0);
      const vignetteAngle = config.vignetteStrength !== undefined ? config.vignetteStrength : (isHyper ? 0.12 : 0.0);
      const useCameraShake = config.cameraShake !== false && isHyper;
      const useLightBloom = config.lightBloom !== false && isHyper;
      const useChromaticAberration = config.chromaticAberration !== false && isHyper;
      const useRoomReverb = config.roomReverb !== false && isHyper;
      const useAmbientHiss = config.ambientHiss !== false && isHyper;

      // Video filters setup
      const filterComplexParts: string[] = [];
      let lastVideoNode = "[0:v]";

      if (useCameraShake) {
        filterComplexParts.push(`${lastVideoNode}crop=w=iw-8:h=ih-8:x='4+2*sin(2*t)*cos(0.5*t)':y='4+2*cos(1.2*t)*sin(0.7*t)'[shaken]`);
        lastVideoNode = "[shaken]";
      }

      if (useLightBloom) {
        filterComplexParts.push(`${lastVideoNode}split[orig][glow]`);
        filterComplexParts.push(`[glow]boxblur=15:3[blurred]`);
        filterComplexParts.push(`[orig][blurred]blend=all_mode='screen':all_opacity=0.2[bloomed]`);
        lastVideoNode = "[bloomed]";
      }

      if (useChromaticAberration) {
        filterComplexParts.push(`${lastVideoNode}split=3[y][u][v]`);
        filterComplexParts.push(`[y]extractplanes=y[yp]`);
        filterComplexParts.push(`[u]extractplanes=u,scale=w=1.004*iw:h=1.004*ih,crop=w=iw/1.004:h=ih/1.004[up]`);
        filterComplexParts.push(`[v]extractplanes=v,scale=w=0.996*iw:h=0.996*ih,crop=w=iw/0.996:h=ih/0.996[vp]`);
        filterComplexParts.push(`[yp][up][vp]mergeplanes=0x000102:yuv420p[colored]`);
        lastVideoNode = "[colored]";
      }

      // Final video filters (lens correction, grain, vignette, film flicker, color grading)
      let finalVideoFilters = "";
      if (isHyper) {
        finalVideoFilters += "lenscorrection=k1=0.02:k2=0.01,";
      }
      finalVideoFilters += `noise=alls=${grainStrength}:allf=t+u`;
      if (vignetteAngle > 0) {
        finalVideoFilters += `,vignette=angle=${vignetteAngle}`;
      }
      if (isHyper) {
        finalVideoFilters += `,eq=brightness='0.003*sin(2*3.14159*15*t)':saturation=1.15:contrast=1.05`;
      } else {
        finalVideoFilters += ",eq=saturation=1.12:contrast=1.03";
      }
      
      filterComplexParts.push(`${lastVideoNode}${finalVideoFilters}[v_out]`);

      // Audio filters setup
      // Base voice EQ: boost low-end for proximity warmth and high-end for crisp presence
      let audioChain = "[1:a]equalizer=f=100:g=3:width_type=h:w=100,equalizer=f=3000:g=2:width_type=h:w=500";
      if (useRoomReverb) {
        audioChain += ",aecho=0.8:0.25:25:0.15";
      }
      filterComplexParts.push(`${audioChain}[voice]`);

      if (useAmbientHiss) {
        filterComplexParts.push("anoisesrc=c=pink:r=44100:a=0.002[hiss]");
        filterComplexParts.push("[voice][hiss]amix=inputs=2:duration=shortest:dropout_transition=0[a_out]");
      } else {
        filterComplexParts.push("[voice]anull[a_out]");
      }

      const filterComplexString = filterComplexParts.join(";");

      // Execute FFmpeg
      await new Promise<void>((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", [
          "-y",
          "-i", stockVideoPath,
          "-i", audioPath,
          "-filter_complex", filterComplexString,
          "-map", "[v_out]",
          "-map", "[a_out]",
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-crf", "22",
          "-pix_fmt", "yuv420p",
          "-c:a", "aac",
          "-shortest",
          outputPath
        ]);

        ffmpeg.stdout.on("data", (data) => {
          pushLog(data.toString());
        });

        ffmpeg.stderr.on("data", (data) => {
          pushLog(data.toString());
        });

        ffmpeg.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on("error", (err: any) => {
          if (err.code === "ENOENT") {
            reject(new Error("FFmpeg binary not found on this system path. Please install FFmpeg."));
          } else {
            reject(err);
          }
        });
      });

      pushLog("Stap 4: Rendering succesvol afgerond.");
      return {
        videoUrl: `/rendered/${outputFilename}`,
        logs
      };

    } catch (err: any) {
      pushLog(`Fout opgetreden: ${err.message}`);

      // Fallback: copy stock video directly if audio was created, as a working video draft
      if (fs.existsSync(stockVideoPath) && audioPath) {
        pushLog("FALLBACK: FFmpeg kon niet renderen. Een preview-concept van de stockclip wordt gecreëerd.");
        const fallbackFilename = `draft_${Date.now()}.mp4`;
        const fallbackOutputPath = path.join(renderedDir, fallbackFilename);
        fs.copyFileSync(stockVideoPath, fallbackOutputPath);
        return {
          videoUrl: `/rendered/${fallbackFilename}`,
          logs
        };
      }

      throw err;
    } finally {
      // Clean up temporary audio files
      if (audioPath && fs.existsSync(audioPath)) {
        try {
          fs.unlinkSync(audioPath);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
    }
  }
}
