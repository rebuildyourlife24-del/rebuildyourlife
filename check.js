async function check() {
  const r = await fetch('https://rebuildyourlife.eu/auth/register');
  const html = await r.text();
  const chunks = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js[^"]*)"/g)];
  for (const match of chunks) {
    const chunkUrl = 'https://rebuildyourlife.eu' + match[1];
    const r2 = await fetch(chunkUrl);
    const js = await r2.text();
    if (js.includes('rebuildyourlife123.onrender.com')) {
      console.log('FOUND RENDER IN:', chunkUrl);
      return;
    } else if (js.includes('http://localhost:4000')) {
      console.log('FOUND LOCALHOST IN:', chunkUrl);
      return;
    }
  }
  console.log('Checked ' + chunks.length + ' chunks, could not find either.');
}
check();
