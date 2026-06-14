const { spawn } = require('child_process');

function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx.cmd', ['vercel', 'env', 'add', key, 'production'], {
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    child.stdin.write(value);
    child.stdin.end();
    
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Failed with code ${code}`));
    });
  });
}

async function main() {
  await addEnv('DATABASE_URL', 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
  await addEnv('DIRECT_URL', 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres');
  await addEnv('JWT_SECRET', 'dev-secret');
  console.log('All environment variables set successfully.');
}

main().catch(console.error);
