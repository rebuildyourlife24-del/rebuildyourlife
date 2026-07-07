const { Client } = require('pg');
require('dotenv').config();

async function fixGrants() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database. Fixing grants for service_role and anon...');

    const queries = [
      "GRANT USAGE ON SCHEMA public TO service_role;",
      "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;",
      "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;",
      "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;",
      "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;",
      
      "GRANT USAGE ON SCHEMA public TO anon;",
      "GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;",
      
      "GRANT USAGE ON SCHEMA public TO authenticated;",
      "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;"
    ];

    for (const q of queries) {
      await client.query(q);
      console.log('Executed:', q);
    }
    
    console.log('Grants successfully restored!');
  } catch (err) {
    console.error('Error fixing grants:', err);
  } finally {
    await client.end();
  }
}

fixGrants();
