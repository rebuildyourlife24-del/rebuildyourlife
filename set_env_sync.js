const { execSync } = require('child_process');
const fs = require('fs');

const dbUrl = 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const directUrl = 'postgresql://postgres:Imperialdreams2055@db.gjexrxdyddystmvrgsoe.supabase.co:5432/postgres';

fs.writeFileSync('db.txt', dbUrl);
fs.writeFileSync('direct.txt', directUrl);

console.log('Removing old DATABASE_URL...');
try { execSync('npx vercel env rm DATABASE_URL production -y', { stdio: 'inherit' }); } catch (e) { }

console.log('Adding DATABASE_URL...');
try {
  execSync('npx vercel env add DATABASE_URL production < db.txt', { stdio: 'inherit' });
} catch (e) { console.error(e.message); }

console.log('Removing old DIRECT_URL...');
try { execSync('npx vercel env rm DIRECT_URL production -y', { stdio: 'inherit' }); } catch (e) { }

console.log('Adding DIRECT_URL...');
try {
  execSync('npx vercel env add DIRECT_URL production < direct.txt', { stdio: 'inherit' });
} catch (e) { console.error(e.message); }

console.log('Done!');
