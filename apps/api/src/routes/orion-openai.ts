/**
 * routes/orion-openai.ts
 * ─────────────────────────────────────────────────────────────
 * OpenAI Compatible API Endpoint voor Orion
 * Hiermee kan elke AI Client (zoals Desktop Commander, LM Studio clients)
 * direct communiceren met Orion.
 * ─────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import { orionChat } from '../ai/orion.js';

const router = Router();

// OpenAI Compatible Chat Completions Endpoint
router.post('/chat/completions', async (req, res) => {
  try {
    const { messages, model, temperature, stream } = req.body;
    console.log(`[Orion-OpenAI] Request model: ${model}, temp: ${temperature}, stream: ${stream}`);
    
    // Extract last user message
    const lastUserMessage = messages.slice().reverse().find((m: any) => m.role === 'user')?.content || '';
    
    // Gebruik de admin fallback ID voor nu, of haal uit auth token als je die hebt
    const userId = 'admin-fallback-id'; // Kan later gekoppeld worden aan echte db ID
    const sessionId = 'desktop-commander-mcp';

    // Intercepteer verzoeken voor het hermes model
    if (model === 'hermes' || model === 'ollama/hermes3:latest') {
      console.log(`[Orion-OpenAI] Hermes verzoek gedetecteerd. Routeert naar Hermes Bridge...`);
      
      const bridgeSecret = process.env.HERMES_BRIDGE_SECRET || 'RYL-HERMES-BRIDGE-SECRET-2026';
      // We roepen de Hermes Bridge direct aan via fetch
      const bridgeUrl = 'https://gjexrxdyddystmvrgsoe.supabase.co/functions/v1/hermes-bridge';
      
      const bridgeResponse = await fetch(bridgeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bridgeSecret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: lastUserMessage,
          type: 'text',
          engine_target: 'hermes'
        })
      });

      if (!bridgeResponse.ok) {
        const errText = await bridgeResponse.text();
        throw new Error(`Hermes Bridge Fout: ${bridgeResponse.status} - ${errText}`);
      }

      const bridgeData = (await bridgeResponse.json()) as any;
      const reply = bridgeData.reply || `Hermes Bridge succesvol uitgevoerd. Status: ${bridgeData.status}`;

      const responsePayload = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: reply
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };

      return res.json(responsePayload);
    }

    // Roep Orion aan met Groq (gratis tokenloze provider)
    const response = await orionChat(userId, lastUserMessage, sessionId, 'groq' as any);

    // Mocht Desktop Commander een stream verwachten (vaak het geval), 
    // kunnen we dat hier simuleren of in de toekomst implementeren. 
    // Voor nu sturen we een standaard JSON object terug.
    
    const responsePayload = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model || 'orion-core',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response.reply
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    res.json(responsePayload);
  } catch (error: any) {
    console.error('[Orion-OpenAI] Fout:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

// Mock models endpoint (sommige clients vereisen dit)
router.get('/models', (_req, res) => {
  res.json({
    object: 'list',
    data: [
      {
        id: 'orion-core',
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'rebuildyourlife'
      },
      {
        id: 'hermes',
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'rebuildyourlife'
      },
      {
        id: 'ollama/hermes3:latest',
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'rebuildyourlife'
      }
    ]
  });
});

export default router;
