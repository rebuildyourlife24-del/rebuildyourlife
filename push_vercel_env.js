const { execSync } = require('child_process');
const fs = require('fs');

try {
  // We cannot easily pass values without interaction in standard cli without pipe. 
  // Let's use the .env.production file approach and vercel env pull / push
  // Wait, vercel env pull creates a file, but there is no vercel env push.
  // We can write to a temporary file and pipe it in cmd.
  
  const dbUrl = "postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const directUrl = "postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres";
  
  fs.writeFileSync('temp_db.txt', dbUrl);
  fs.writeFileSync('temp_direct.txt', directUrl);
  
  console.log("Adding DATABASE_URL...");
  execSync('npx.cmd vercel env add DATABASE_URL production < temp_db.txt', { stdio: 'inherit' });
  
  console.log("Adding DIRECT_URL...");
  execSync('npx.cmd vercel env add DIRECT_URL production < temp_direct.txt', { stdio: 'inherit' });
  
  console.log("Done!");
} catch (e) {
  console.error("Error:", e.message);
}
