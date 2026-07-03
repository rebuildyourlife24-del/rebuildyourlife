const token = 'vcp_7Dfzcd4ixf48AbAviROEv3yVXdxav3eHr1ctb9XGXA5Xb75n3R355J6m';
const projectId = 'prj_q9myGscEvNAelKdTEYFRBUKqIclX';

async function updateProject() {
  const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rootDirectory: 'apps/web', // Terug naar Turborepo apps/web
      framework: 'nextjs'
    })
  });
  const data = await res.json();
  console.log('Project Root Dir updated to apps/web');
}
updateProject();
