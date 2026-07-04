const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../.env' }); // load the root .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log("Controleren van Supabase Storage Buckets...");
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error("Fout bij ophalen buckets:", error);
    return;
  }
  
  if (!buckets || buckets.length === 0) {
    console.log("Geen opslag-buckets gevonden in Supabase.");
    return;
  }
  
  for (const bucket of buckets) {
    console.log(`\nBucket gevonden: ${bucket.name}`);
    const { data: files, error: fileError } = await supabase.storage.from(bucket.name).list();
    
    if (fileError) {
      console.error(`Kan bestanden in ${bucket.name} niet lezen:`, fileError);
      continue;
    }
    
    if (!files || files.length === 0) {
      console.log(` - Bucket is leeg.`);
    } else {
      files.forEach(f => {
        console.log(` - Bestand: ${f.name} (Grootte: ${f.metadata?.size || 'onbekend'} bytes)`);
      });
    }
  }
}

checkStorage();
