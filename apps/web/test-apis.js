require('dotenv').config({ path: '../../.env' });
// Mock fetch if running in node env without native fetch (Node < 18)
// but Node 18+ has fetch.
const fetch = global.fetch; 

async function testAI() {
  console.log('Testing AI Router with real credentials from .env...');
  
  // We need to simulate the ai-router getProviders logic
  const providers = [];

  const cerebrasKeys = [process.env.CEREBRAS_API_KEY_1].filter(Boolean);
  cerebrasKeys.forEach((key, i) => providers.push({ name: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1', apiKey: key, model: 'llama-3.3-70b', priority: 1 }));

  const groqKeys = [process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY].filter(Boolean);
  groqKeys.forEach((key, i) => providers.push({ name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', apiKey: key, model: 'llama-3.3-70b-versatile', priority: 2 }));

  const geminiKeys = [process.env.GEMINI_API_KEY_1].filter(Boolean);
  geminiKeys.forEach((key, i) => providers.push({ name: 'Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', apiKey: key, model: 'gemini-2.5-flash', priority: 3 }));

  if (process.env.OPENROUTER_API_KEY) {
    providers.push({ name: 'OpenRouter-Hermes', baseUrl: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_API_KEY, model: 'nousresearch/hermes-3-llama-3.1-8b:free', priority: 4 });
  }

  console.log(`Found ${providers.length} configured providers based on .env.`);
  if (providers.length === 0) {
    console.error('NO API KEYS FOUND IN .ENV!');
    return;
  }

  for (const provider of providers) {
    console.log(`\nTesting ${provider.name} (${provider.model})...`);
    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [{ role: 'user', content: 'Say strictly "Hello World"' }],
          max_tokens: 10
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ FAILED: ${response.status} - ${err}`);
      } else {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${data.choices[0].message.content}`);
      }
    } catch(e) {
      console.error(`❌ NETWORK ERROR:`, e.message);
    }
  }
}

testAI();
