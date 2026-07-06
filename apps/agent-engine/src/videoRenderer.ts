import ffmpeg = require('fluent-ffmpeg');
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import { prisma } from '@rebuildyourlife/database';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function getStockVideo(topic: string): Promise<string> {
  const videoDir = path.join(__dirname, "../../../apps/web/public/videos");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const safeTopic = topic.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'abstract';
  const videoPath = path.join(videoDir, `broll_${safeTopic}.mp4`);
  
  if (fs.existsSync(videoPath)) return videoPath;

  const apiKey = process.env.PEXELS_API_KEY;
  if (apiKey) {
    try {
      console.log(`[VIDEO RENDERER] Zoeken naar HD Pexels video voor: ${topic}`);
      const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(topic)}&per_page=1&orientation=portrait`, {
        headers: { "Authorization": apiKey }
      });
      const data: any = await res.json();
      
      if (data.videos && data.videos.length > 0) {
        const videoFiles = data.videos[0].video_files;
        const hdFile = videoFiles.find((v: any) => v.quality === 'hd') || videoFiles[0];
        
        if (hdFile && hdFile.link) {
          console.log(`[VIDEO RENDERER] Pexels HD B-Roll wordt gedownload...`);
          const downloadRes = await fetch(hdFile.link);
          if (downloadRes.ok) {
            const buffer = await downloadRes.arrayBuffer();
            fs.writeFileSync(videoPath, Buffer.from(buffer));
            console.log(`[VIDEO RENDERER] Pexels HD B-Roll succesvol opgeslagen: ${videoPath}`);
            return videoPath;
          }
        }
      }
    } catch (err) {
      console.warn("[VIDEO RENDERER] Pexels download mislukt, valt terug op placeholder:", err);
    }
  }

  const fallbackVideoPath = path.join(videoDir, "fallback_broll.mp4");
  if (!fs.existsSync(fallbackVideoPath)) {
    console.log("[VIDEO RENDERER] Geen B-Roll gevonden via Pexels. Een gratis placeholder wordt gedownload...");
    try {
      const res = await fetch("https://www.w3schools.com/html/mov_bbb.mp4");
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(fallbackVideoPath, Buffer.from(buffer));
        console.log("[VIDEO RENDERER] Placeholder B-roll gedownload.");
      }
    } catch (err) {
      console.warn("[VIDEO RENDERER] Kon placeholder niet downloaden:", err);
    }
  }
  
  return fallbackVideoPath;
}

export async function renderTikTokVideo(marketingVideoId: string, audioUrl: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`[VIDEO RENDERER] Start renderproces voor video ID: ${marketingVideoId}`);
      
      const audioFileName = path.basename(audioUrl);
      const audioPath = path.join(__dirname, "../../../apps/web/public/videos", audioFileName);
      
      if (!fs.existsSync(audioPath)) {
        throw new Error(`VoiceOver bestand niet gevonden op ${audioPath}`);
      }

      const bRollPath = await getStockVideo("ecommerce");
      if (!fs.existsSync(bRollPath)) {
         throw new Error("Geen stock-video (B-roll) beschikbaar om mee te renderen.");
      }

      const outputFileName = `tiktok_${Date.now()}.mp4`;
      const outputPath = path.join(__dirname, "../../../apps/web/public/videos", outputFileName);

      ffmpeg(bRollPath)
        .input(audioPath)
        .outputOptions([
          '-c:v copy',
          '-c:a aac',
          '-map 0:v:0',
          '-map 1:a:0',
          '-shortest',
        ])
        .save(outputPath)
        .on('end', async () => {
          console.log(`[VIDEO RENDERER] Render voltooid! Bestand: ${outputFileName}`);
          
          await prisma.marketingVideo.update({
            where: { id: marketingVideoId },
            data: {
              status: "RENDERED",
              renderedUrl: `/videos/${outputFileName}`
            }
          });

          resolve(`/videos/${outputFileName}`);
        })
        .on('error', (err: any) => {
          console.error('[VIDEO RENDERER] FFmpeg Error:', err.message);
          reject(err);
        });

    } catch (err: any) {
      console.error("[VIDEO RENDERER] Fout in render engine:", err);
      reject(err);
    }
  });
}
