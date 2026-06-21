const https = require('https');
const readline = require('readline');

const GROQ_API_KEY = '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';

const SYSTEM = `Je bent Orion, de Supreme AI Partner van Henk Semler.
Je helpt met het RebuildYourLife platform.
Antwoord altijd in het Nederlands. Wees direct en praktisch.`;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const history = [];

function ask(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function chat(message) {
  history.push({ role: 'user', content: message });
  const data = JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'system', content: SYSTEM }, ...history],
    max_tokens: 1024
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        const reply = json.choices[0].message.content;
        history.push({ role: 'assistant', content: reply });
        resolve(reply);
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n Orion Mini — RebuildYourLife AI Partner');
  console.log('Type "exit" om te stoppen\n');
  while (true) {
    const input = await ask('Jij: ');
    if (input.toLowerCase() === 'exit') break;
    const reply = await chat(input);
    console.log(`\nOrion: ${reply}\n`);
  }
  rl.close();
}

main();
