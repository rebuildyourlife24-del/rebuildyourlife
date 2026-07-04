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

    // Genesis Protocol: Rule 1 Pipeline at a Time
    const pendingActions = await prisma.agentAction.count({
      where: {
        userId: userId,
        status: 'PENDING'
      }
    });

    if (pendingActions > 0) {
      console.warn(`[ORION - GENESIS PROTOCOL] Er loopt al een pijplijn. Orion wacht af. (Actieve acties: ${pendingActions})`);
      return { error: 'Eén pijplijn tegelijk. Sluit de huidige af voordat je een nieuwe start.' };
    }

    // 1. Epistemic Protocol: Lees geverifieerde feiten (VERIFIED) uit de Knowledge Base
    const verifiedKnowledge = await prisma.agentKnowledgeBase.findMany({
      where: { 
        type: 'VERIFIED'
        // targetAgentId niet nodig, we gebruiken het gedeelde epistemic grid
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const memoryContext = verifiedKnowledge.length > 0 
      ? `VERIFIED FACTS (YOU MUST OBEY THESE STRICTLY):\n${verifiedKnowledge.map(k => `- ${k.claim} (Confidence: ${k.confidence})`).join('\n')}`
      : 'No verified facts available. Operating in blank state.';

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

      // 3. Epistemic Protocol: Sla het dossier op als een HYPOTHESE.
      // Het wordt pas een FACT (VERIFIED) als Hermes er winst mee boekt of jij het goedkeurt.
      const defaultAgent = await prisma.agentRegistry.findFirst({ where: { department: "MARKETING" } });
      
      if (defaultAgent) {
        await prisma.agentKnowledgeBase.create({
          data: {
            agentId: defaultAgent.id,
            domain: "MARKETING",
            type: "HYPOTHESIS",
            claim: `Intelligence Dossier: ${dossier.opportunityName} -> ${dossier.recommendedAction}`,
            evidence: dossier.strategicReasoning,
            source: "ORION_RECONNAISSANCE",
            confidence: dossier.confidenceScore / 100
          }
        });
      }
      return dossier;

    } catch (e) {
      console.error('[ORION] Fout tijdens reconnaissance', e);
      throw new Error('Orion kon geen Intelligence Dossier genereren.');
    }
  }
}
