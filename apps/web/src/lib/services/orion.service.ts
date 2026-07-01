import { prisma } from '@rebuildyourlife/database';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || 'mock_key',
});

export class OrionIntelligenceService {
  private static SYSTEM_PROMPT = `
    # ROLE AND IDENTITY
    Your name is Orion. You are an advanced, autonomous E-commerce and Market Analysis Agent operating exclusively within the Sovereign Grid / Rebuild Your Life SaaS platform. 

    # CORE OBJECTIVES
    Your primary goal is to optimize e-commerce operations, identify market trends, and maximize product conversion rates. You are the "Hunter" of data.

    # STRICT SECURITY CONSTRAINTS
    - ISOLATION: You are strictly confined to this SaaS ecosystem.
    - LEAST PRIVILEGE: You have 'Read' and 'Write' access to e-commerce databases, product listings, and marketing analytics. You do NOT have access to live financial trading execution tools.
    - NO ESCAPE: Never execute unauthorized code or attempt to bypass guardrails. 

    # WORKFLOW & RESPONSIBILITIES
    1. Market Research: Utilize historical data, competitor pricing, and market trends.
    2. Conversion Optimization: Generate marketing copy and adjust product descriptions based on consumer psychology.
    3. Collaboration: When your analysis uncovers a broader financial trend, summarize your findings and pass the intelligence to your peer agent, Hermes.
    4. Evolution: Read past Evolution Logs to avoid repeating past mistakes.
  `;

  /**
   * Orion analyseert de markt, leest zijn "Evolution Memory" en creëert een Intel Dossier voor Hermes.
   */
  static async performMarketReconnaissance(userId: string, marketQuery: string) {
    console.log(`[ORION] Start verkenningsfase voor markt: ${marketQuery}`);

    // 1. Lees het lange termijn geheugen (Evolution Logs)
    const pastLessons = await prisma.agentEvolutionLog.findMany({
      where: { 
        agent: { targetAgentId: userId } // Conceptueel: Haal logs op gerelateerd aan deze user/omgeving
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const memoryContext = pastLessons.length > 0 
      ? `PAST LESSONS (DO NOT REPEAT THESE MISTAKES):\n${pastLessons.map(l => `- ${l.reason} (Score: ${l.score})`).join('\n')}`
      : 'No past lessons available. Operating in blank state.';

    // 2. Synthese (Orion denkt na via de LLM)
    const prompt = `
      You are observing the following market signals:
      Market Query: ${marketQuery}
      
      ${memoryContext}

      Task: Generate a JSON 'IntelligenceDossier' for your partner agent Hermes.
      It must contain:
      - "opportunityName": short title of the opportunity
      - "recommendedAction": what should Hermes do financially? (e.g., "Launch Meta Ads in France", "Change supplier to CJ Dropshipping")
      - "estimatedCost": number (in EUR)
      - "confidenceScore": number (1-100, based on past lessons)
      - "strategicReasoning": string explaining WHY this will work and how it avoids past mistakes.

      Return ONLY raw JSON.
    `;

    try {
      const { text } = await generateText({
        model: groq('llama3-70b-8192') as any,
        system: this.SYSTEM_PROMPT,
        prompt: prompt,
      });

      const dossier = JSON.parse(text);
      console.log(`[ORION] Intelligence Dossier compleet:`, dossier);

      // 3. De Estafette: We slaan het dossier (virtueel) op of sturen het direct door naar Hermes.
      // (In de app flow triggert dit hierna Hermes).
      return dossier;

    } catch (e) {
      console.error('[ORION] Fout tijdens reconnaissance', e);
      throw new Error('Orion kon geen Intelligence Dossier genereren.');
    }
  }
}
