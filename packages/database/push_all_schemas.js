const { execSync } = require('child_process');

const dbs = [
  { 
    name: "Orion", 
    url: "postgresql://postgres.gjexrxdyddystmvrgsoe:VC3etUMnjxgDU6xx@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    directUrl: "postgresql://postgres.gjexrxdyddystmvrgsoe:VC3etUMnjxgDU6xx@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
  },
  { 
    name: "Hermes", 
    url: "postgresql://postgres:Imperialdreams2055@db.mierxiaxihzvimadsxhk.supabase.co:5432/postgres",
    directUrl: "postgresql://postgres:Imperialdreams2055@db.mierxiaxihzvimadsxhk.supabase.co:5432/postgres"
  },
  { 
    name: "Quantum", 
    url: "postgresql://postgres:spUi4TQma1Q0H0ju@db.ljmoqymvkzyvvrhgbgtu.supabase.co:5432/postgres",
    directUrl: "postgresql://postgres:spUi4TQma1Q0H0ju@db.ljmoqymvkzyvvrhgbgtu.supabase.co:5432/postgres"
  },
  { 
    name: "Vault", 
    url: "postgresql://postgres:e16bnjc7Yum3rh6O@db.xdffrzojcpmmzksfkobo.supabase.co:5432/postgres",
    directUrl: "postgresql://postgres:e16bnjc7Yum3rh6O@db.xdffrzojcpmmzksfkobo.supabase.co:5432/postgres"
  },
  { 
    name: "Sovereign", 
    url: "postgresql://postgres:2epcJUh1FXIiqyjc@db.nwnaefxuapmllsdijwig.supabase.co:5432/postgres",
    directUrl: "postgresql://postgres:2epcJUh1FXIiqyjc@db.nwnaefxuapmllsdijwig.supabase.co:5432/postgres"
  }
];

console.log("=== INITIATING PENTA-BRAIN SCHEMA DEPLOYMENT ===");

for (const db of dbs) {
  console.log(`\n[*] Pushing Master Schema to ${db.name}...`);
  try {
    execSync(`npx.cmd prisma db push --accept-data-loss`, {
      env: { ...process.env, DATABASE_URL: db.url, DIRECT_URL: db.directUrl },
      stdio: 'inherit'
    });
    console.log(`[+] SUCCESS: Schema deployed to ${db.name}!`);
  } catch (e) {
    console.log(`[-] FAILED for ${db.name}.`);
  }
}
console.log("\n=== PENTA-BRAIN DEPLOYMENT FINISHED ===");
