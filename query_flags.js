const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres'
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM "FeatureFlag"');
  console.log(res.rows);
  await client.end();
}

main().catch(console.error);
