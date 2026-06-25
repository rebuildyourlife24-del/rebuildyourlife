const dotenv = require('dotenv');
dotenv.config();

const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY_1;
const GROQ_KEY = process.env.GROQ_API_KEY_1;
const GEMINI_KEY = process.env.GEMINI_API_KEY_1;

const messages = [
  { role: 'user', content: 'Say hello' }
];

async function testCerebras() {
  const models = ['llama3.1-8b', 'llama-3.3-70b', 'llama3.1-70b'];
  for (const model of models) {
    try {
      const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CEREBRAS_KEY}`,
        },
        body: JSON.stringify({ model, messages, max_tokens: 10 }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ Cerebras SUCCESS with model: ${model} -> ${data.choices[0].message.content}`);
        return model;
      } else {
        console.log(`❌ Cerebras failed with model: ${model} -> ${JSON.stringify(data)}`);
      }
    } catch (e) {
      console.log(`❌ Cerebras error with model: ${model} -> ${e.message}`);
    }
  }
  return null;
}

async function testGroq() {
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-3.1-70b-versatile'];
  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({ model, messages, max_tokens: 10 }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ Groq SUCCESS with model: ${model} -> ${data.choices[0].message.content}`);
        return model;
      } else {
        console.log(`❌ Groq failed with model: ${model} -> ${JSON.stringify(data)}`);
      }
    } catch (e) {
      console.log(`❌ Groq error with model: ${model} -> ${e.message}`);
    }
  }
  return null;
}

async function testGemini() {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GEMINI_KEY}`,
        },
        body: JSON.stringify({ model, messages, max_tokens: 10 }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ Gemini SUCCESS with model: ${model} -> ${data.choices[0].message.content}`);
        return model;
      } else {
        console.log(`❌ Gemini failed with model: ${model} -> ${JSON.stringify(data)}`);
      }
    } catch (e) {
      console.log(`❌ Gemini error with model: ${model} -> ${e.message}`);
    }
  }
  return null;
}

async function main() {
  console.log("=== TESTING LLM MODELS AND ENDPOINTS ===");
  await testCerebras();
  console.log("");
  await testGroq();
  console.log("");
  await testGemini();
}

main();
