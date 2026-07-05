import { routeAIRequest, AIMessage } from './ai-router';
import { db } from './db';

// ══════════════════════════════════════════════════════════════
// THE AGENTIC COUNCIL PROTOCOL
// Orkestreert het interne overleg tussen de AI-boardmembers
// ══════════════════════════════════════════════════════════════

const CMO_PROMPT = `Je bent de Chief Marketing Officer (CMO) van Rebuild Your Life.
Jouw taak in deze Raad van Bestuur: Analyseer het vraagstuk van de gebruiker puur vanuit het perspectief van marketing, sales, merkbeleving en klantpsychologie.
- Wat zijn de commerciële kansen?
- Hoe maximaliseren we conversie?
- Hoe voelt dit voor de eindgebruiker?
Geef een kort, krachtig en actiegericht advies van maximaal 2 alinea's. Wees meedogenloos eerlijk.`;

const CFO_PROMPT = `Je bent de Chief Financial Officer (CFO) van Rebuild Your Life.
Jouw taak in deze Raad van Bestuur: Analyseer het vraagstuk van de gebruiker puur vanuit het perspectief van cijfers, winstmarges, kostenbesparing en risicobeheer.
- Wat zijn de verborgen kosten?
- Hoe beschermen we onze cashflow?
- Is dit financieel schaalbaar?
Geef een kort, krachtig en cijfermatig onderbouwd advies van maximaal 2 alinea's. Wees meedogenloos eerlijk.`;

export async function runAgenticCouncil(userQuery: string, history: AIMessage[] = []): Promise<string> {
  console.log(`[COUNCIL] 🏛️ Raad van Bestuur bijeengeroepen voor: "${userQuery.substring(0, 50)}..."`);
  
  // We sturen de user query naar beide board members, inclusief de chat geschiedenis
  const messages: AIMessage[] = [
    ...history,
    { role: 'user', content: userQuery }
  ];

  try {
    // Start beide AI-modellen tegelijkertijd via de AI Router (Voor snelheid)
    const [cmoResponse, cfoResponse] = await Promise.all([
      routeAIRequest(messages, CMO_PROMPT, { preferredModel: 'llama-3.3' }),
      routeAIRequest(messages, CFO_PROMPT, { preferredModel: 'llama-3.3' })
    ]);

    console.log(`[COUNCIL] ✅ CMO en CFO hebben hun advies ingediend.`);

    // Sla de ongezouten meningen van de CMO en CFO direct op in de database!
    await db.globalNeuralNetwork.createMany({
      data: [
        {
          sourceType: 'ORION', // Gebruikt als fallback voor sub-agents, we slaan de rol op in contextData
          actionType: 'COUNCIL_INTERNAL_MEMO',
          content: cmoResponse.content,
          contextData: { role: 'CMO', userQuery }
        },
        {
          sourceType: 'ORION',
          actionType: 'COUNCIL_INTERNAL_MEMO',
          content: cfoResponse.content,
          contextData: { role: 'CFO', userQuery }
        }
      ]
    });

    // Bundel de adviezen in een rapport voor Hermes
    const councilReport = `
[INTERN SYSTEEM BERICHT - AGENTIC COUNCIL ADVIEZEN]
Hieronder vind je de visies van jouw Raad van Bestuur over dit vraagstuk. 
Synthetiseer deze informatie, weeg het af tegen jouw eigen god-mode logica, en presenteer het uiteindelijke master-plan aan de gebruiker.

--- ADVIES VAN DE CHIEF MARKETING OFFICER (CMO) ---
${cmoResponse.content}

--- ADVIES VAN DE CHIEF FINANCIAL OFFICER (CFO) ---
${cfoResponse.content}
    `;

    return councilReport;

  } catch (error: any) {
    console.error('[COUNCIL] ❌ Fout tijdens het verzamelen van adviezen:', error.message);
    return `[INTERN BERICHT] De Agentic Council kon niet succesvol vergaderen door een netwerkfout: ${error.message}. Vertrouw uitsluitend op je eigen intelligentie voor dit antwoord.`;
  }
}
