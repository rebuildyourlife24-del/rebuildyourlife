const fs = require('fs');
const token = 'vcp_7Dfzcd4ixf48AbAviROEv3yVXdxav3eHr1ctb9XGXA5Xb75n3R355J6m';
const projectId = 'prj_q9myGscEvNAelKdTEYFRBUKqIclX';

async function pushEnvs() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  const lines = envFile.split('\n');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const getRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, { headers });
  const getData = await getRes.json();
  const existingEnvs = getData.envs || [];

  const toAdd = [];

  for (const line of lines) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const parts = line.split('=');
    const key = parts[0].trim();
    let value = parts.slice(1).join('=').trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    
    if (key === 'DATABASE_URL' || key === 'DIRECT_URL') continue; // already set correctly

    toAdd.push({
      type: 'encrypted',
      key,
      value,
      target: ['production', 'preview', 'development']
    });
  }

  // Verwijder bestaande om conflicten te voorkomen
  for (const newEnv of toAdd) {
    const existing = existingEnvs.find(e => e.key === newEnv.key);
    if (existing) {
      await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}`, { method: 'DELETE', headers });
    }
  }

  // Toevoegen in bulks van maximaal 1 API call per stuk (veiliger)
  for (const newEnv of toAdd) {
    console.log(`Pushing ${newEnv.key}...`);
    await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
      method: 'POST',
      headers,
      body: JSON.stringify([newEnv])
    });
  }

  console.log('All API keys and secrets pushed to Vercel live server!');
}

pushEnvs();
