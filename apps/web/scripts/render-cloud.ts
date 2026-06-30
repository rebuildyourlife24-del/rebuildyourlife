import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from '@supabase/supabase-js';

const STOCK_VIDEOS = {
  space: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
  nature: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
  abstract: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-27734-large.mp4",
  tech: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-blue-neon-lights-4428-large.mp4"
};

async function main() {
  const scriptText = process.env.SCRIPT_TEXT || "Hallo, dit is een test van de nieuwe video engine.";
  const style = process.env.VIDEO_STYLE as keyof typeof STOCK_VIDEOS || "tech";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials in environment.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const tempDir = path.join(process.cwd(), "temp_render");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const audioPath = path.join(tempDir, "audio.mp3");
  const videoPath = path.join(tempDir, "stock.mp4");
  const outputPath = path.join(tempDir, `final_${Date.now()}.mp4`);

  console.log("[1/4] Generating High-Quality Neural TTS via Edge-TTS (Free)...");
  await new Promise<void>((resolve, reject) => {
    // nl-NL-MaartenNeural or nl-NL-ColetteNeural
    const tts = spawn("edge-tts", ["--voice", "nl-NL-MaartenNeural", "--text", scriptText, "--write-media", audioPath]);
    tts.on("close", (code) => code === 0 ? resolve() : reject(new Error(`edge-tts failed with code ${code}`)));
  });

  console.log("[2/4] Downloading Stock Video...");
  const stockUrl = STOCK_VIDEOS[style] || STOCK_VIDEOS.tech;
  const res = await fetch(stockUrl);
  if (!res.ok) throw new Error("Failed to fetch stock video");
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(videoPath, buffer);

  console.log("[3/4] Rendering video with FFmpeg (applying filters)...");
  // Basic hyper-realistic filters + merging audio
  const filterComplex = "[0:v]noise=alls=8:allf=t+u,vignette=angle=0.12,eq=saturation=1.15:contrast=1.05[v_out];[1:a]equalizer=f=100:g=3:width_type=h:w=100[a_out]";
  
  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i", videoPath,
      "-i", audioPath,
      "-filter_complex", filterComplex,
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
    ffmpeg.stderr.on('data', data => console.log(data.toString()));
    ffmpeg.on("close", (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg failed with code ${code}`)));
  });

  console.log("[4/4] Uploading to Supabase Storage...");
  const finalBuffer = fs.readFileSync(outputPath);
  const filename = `rendered_${Date.now()}.mp4`;
  
  const { error } = await supabase.storage
    .from('videos')
    .upload(filename, finalBuffer, { contentType: 'video/mp4', upsert: true });

  if (error) {
    // Attempt to create bucket if it doesn't exist
    if (error.message.includes('Bucket not found')) {
      await supabase.storage.createBucket('videos', { public: true });
      await supabase.storage.from('videos').upload(filename, finalBuffer, { contentType: 'video/mp4', upsert: true });
    } else {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
  }

  const { data: publicData } = supabase.storage.from('videos').getPublicUrl(filename);
  console.log(`\n\n✅ DONE! Video available at: ${publicData.publicUrl}`);
}

main().catch(console.error);
