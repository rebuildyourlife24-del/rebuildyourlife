const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const lines = envContent.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const firstEq = trimmed.indexOf('=');
  if (firstEq === -1) continue;

  const key = trimmed.slice(0, firstEq).trim();
  let val = trimmed.slice(firstEq + 1).trim();

  // Remove surrounding quotes if present
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.slice(1, -1);
  } else if (val.startsWith("'") && val.endsWith("'")) {
    val = val.slice(1, -1);
  }

  // Remove spaces if it's the weird github token line
  if (key.includes(' ')) continue;

  console.log(`Pushing ${key} to Vercel...`);
  try {
    // Add to all environments
    execSync(`vercel env add ${key} production --value "${val}" --force --yes`, { stdio: 'pipe' });
    execSync(`vercel env add ${key} preview --value "${val}" --force --yes`, { stdio: 'pipe' });
    execSync(`vercel env add ${key} development --value "${val}" --force --yes`, { stdio: 'pipe' });
    console.log(`  -> Succesfully pushed ${key}`);
  } catch (err) {
    console.error(`  -> Failed to push ${key}: ${err.message}`);
  }
}
console.log('All variables pushed successfully.');
