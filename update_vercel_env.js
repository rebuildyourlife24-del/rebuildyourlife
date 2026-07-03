const token = 'vcp_7Dfzcd4ixf48AbAviROEv3yVXdxav3eHr1ctb9XGXA5Xb75n3R355J6m';
const projectId = 'prj_q9myGscEvNAelKdTEYFRBUKqIclX';
const dbUrl = 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const directUrl = 'postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres';

async function updateEnv() {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const getRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, { headers });
  const getData = await getRes.json();
  const envs = getData.envs || [];
  
  const dbUrlEnv = envs.find(e => e.key === 'DATABASE_URL');
  if (dbUrlEnv) {
    await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${dbUrlEnv.id}`, { method: 'DELETE', headers });
  }
  const directUrlEnv = envs.find(e => e.key === 'DIRECT_URL');
  if (directUrlEnv) {
    await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${directUrlEnv.id}`, { method: 'DELETE', headers });
  }

  await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
    method: 'POST',
    headers,
    body: JSON.stringify([
      { type: 'encrypted', key: 'DATABASE_URL', value: dbUrl, target: ['production', 'preview', 'development'] },
      { type: 'encrypted', key: 'DIRECT_URL', value: directUrl, target: ['production', 'preview', 'development'] }
    ])
  });

  console.log('Environment variables updated for rebuildyourlife-123-web successfully.');
}

updateEnv();
