const https = require('https');

const urls = [
  'https://ai.ai-henksemler.nl/auth/login',
  'https://www.rebuildyourlife.eu/auth/login',
  'https://rebuildyourlife-bq9yslibh-rebuildyourlife.vercel.app/auth/login'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`[${res.statusCode}] ${url}`);
  }).on('error', (e) => {
    console.error(`[ERROR] ${url} - ${e.message}`);
  });
});
