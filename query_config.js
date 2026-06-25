const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres'
});

async function main() {
  await client.connect();
  let res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\'');
  console.log("Tables:");
  for (let r of res.rows) {
      if (r.table_name.toLowerCase().includes('setting') || r.table_name.toLowerCase().includes('config') || r.table_name.toLowerCase().includes('theme')) {
          console.log("Found:", r.table_name);
          let data = await client.query(`SELECT * FROM "${r.table_name}"`);
          console.log(data.rows);
      }
  }
  await client.end();
}

main().catch(console.error);
