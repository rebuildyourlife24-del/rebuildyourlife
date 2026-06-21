const token = 'vcp_1FYAqdob2UFnblLH6sujRHike0BlPqsvX9xmpV7paa6AMOVt3Z0PeWDn';

async function cleanup() {
  console.log('Fetching projects...');
  const res = await fetch('https://api.vercel.com/v9/projects', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    console.error('Failed to fetch projects', await res.text());
    return;
  }
  
  const data = await res.json();
  const projects = data.projects;
  
  console.log(`Found ${projects.length} projects.`);
  
  for (const p of projects) {
    console.log(`- ${p.name} (ID: ${p.id})`);
    if (p.name.toLowerCase() !== 'rebuildyourlife-123-web') {
      console.log(`[DELETING] ${p.name}...`);
      const delRes = await fetch(`https://api.vercel.com/v9/projects/${p.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (delRes.ok) {
        console.log(`[OK] Deleted ${p.name}`);
      } else {
        console.error(`[ERROR] Failed to delete ${p.name}`, await delRes.text());
      }
    } else {
      console.log(`[KEEPING] ${p.name}`);
    }
  }
  
  console.log('Cleanup complete.');
}

cleanup().catch(console.error);
