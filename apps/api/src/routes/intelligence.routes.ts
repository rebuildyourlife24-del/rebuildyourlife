import { Router } from 'express';
import { DecisionEngine } from '../core/intelligence/DecisionEngine.js';
import { OpenAIReasoningProvider } from '../core/intelligence/OpenAIReasoningProvider.js';

const router = Router();

// ==========================================
// V6.0 SOVEREIGN ENTERPRISE CONTROL PLANE
// ==========================================

// POST /api/v1/intelligence/think
// Manually triggers the Cognitive Loop
router.post('/think', async (req, res) => {
  try {
    // Inject the OpenAI provider (Dependencies can be swapped here later)
    const provider = new OpenAIReasoningProvider();
    const engine = new DecisionEngine(provider);
    
    const result = await engine.runCognitiveCycle();

    res.status(200).json(result);
  } catch (error: any) {
    console.error('[DecisionEngine API Error]', error);
    res.status(500).json({ error: error.message || 'Internal Enterprise Server Error' });
  }
});

export default router;
