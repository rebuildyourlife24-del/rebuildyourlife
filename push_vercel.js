const { execSync } = require('child_process');
const fs = require('fs');

console.log("Setting environment variables in Vercel...");

try {
  execSync('npx vercel env add DATABASE_URL production < db_url.txt', { stdio: 'inherit' });
} catch (e) {}

try {
  execSync('npx vercel env add DIRECT_URL production < direct_url.txt', { stdio: 'inherit' });
} catch (e) {}

console.log("Triggering production deployment...");
try {
  execSync('npx vercel deploy --prod', { stdio: 'inherit' });
} catch (e) {
  console.log("Deploy failed", e.message);
}

console.log("Done!");
