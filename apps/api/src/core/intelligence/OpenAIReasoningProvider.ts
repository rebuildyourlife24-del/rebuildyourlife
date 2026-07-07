import { IReasoningProvider } from '../sdk/IReasoningProvider.js';
import { EnterpriseStateSummary } from '../twin/DigitalTwin.js';
import { ProposedAction } from '../governance/Constitution.js';
import OpenAI from 'openai';

export class OpenAIReasoningProvider implements IReasoningProvider {
  public readonly name = 'OPENAI_GPT4o';
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  public async analyzeAndPropose(state: EnterpriseStateSummary): Promise<ProposedAction | null> {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('[OpenAIReasoningProvider] Missing API Key. Using fallback rules.');
      return this.fallbackReasoning(state);
    }

    try {
      console.log(`[ReasoningProvider] Analyzing state using ${this.name}...`);
      
      const prompt = `
        You are the Enterprise AI Brain (The Syndicate).
        Analyze the current enterprise state and propose ONE action to optimize it.
        Return ONLY valid JSON matching this schema:
        {
          "actionType": "string (e.g. ALLOCATE_AD_BUDGET, TRIGGER_MARKETING_CAMPAIGN)",
          "amount": number (optional),
          "currency": "string (optional)",
          "target": "string (optional)",
          "evidence": { "reasoning": "string" }
        }
        
        Current State:
        Revenue: ${state.currentRevenue}
        Orders: ${state.totalOrders}
        Last Updated: ${state.lastUpdated.toISOString()}
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const resultText = response.choices[0].message.content;
      if (!resultText) return null;

      const parsed: ProposedAction = JSON.parse(resultText);
      return parsed;

    } catch (error) {
      console.error('[OpenAIReasoningProvider] AI Error:', error);
      return this.fallbackReasoning(state);
    }
  }

  private fallbackReasoning(state: EnterpriseStateSummary): ProposedAction {
    console.log('[OpenAIReasoningProvider] Falling back to deterministic reasoning.');
    // Simple rule: if revenue is zero, launch an initial test campaign.
    if (state.currentRevenue === 0) {
      return {
        actionType: 'LAUNCH_TEST_CAMPAIGN',
        amount: 50,
        currency: 'EUR',
        target: 'MetaAds',
        evidence: { reasoning: 'Revenue is 0. Need initial traffic to generate data.' }
      };
    }

    // Default scaling rule
    return {
      actionType: 'SCALE_WINNING_AD',
      amount: 150, // Under the 250 threshold
      currency: 'EUR',
      evidence: { reasoning: `Revenue is ${state.currentRevenue}. Scaling ads proportionally.` }
    };
  }
}
