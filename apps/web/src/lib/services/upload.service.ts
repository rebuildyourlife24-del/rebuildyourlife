import fs from "fs";
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadToSupabase(filePath: string, filename: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(filename, fileBuffer, {
      contentType: 'video/mp4',
      upsert: true
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicData } = supabase.storage
    .from('videos')
    .getPublicUrl(filename);

  return publicData.publicUrl;
}

export async function uploadBase64ImageToSupabase(base64Data: string, filename: string, bucket: string = 'syndicate'): Promise<string> {
  const base64DataStr = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const fileBuffer = Buffer.from(base64DataStr, 'base64');
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicData.publicUrl;
}
