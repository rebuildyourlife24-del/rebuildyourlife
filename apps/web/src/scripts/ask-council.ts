import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { prisma } from '@rebuildyourlife/database';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1 || '',
});

async function askCouncil() {
  const councilAgents = await prisma.agentRegistry.findMany({
    where: { department: 'EXECUTIVE_COUNCIL' },
    take: 3
  });

  const councilProfiles = councilAgents.map(a => `- ${a.name} (${a.role}): ${a.systemPrompt}`).join('\n');

  const systemPrompt = `
Je bent The Council of Intelligence. Je simuleert een extreem hoogstaand debat tussen:
${councilProfiles}

De menselijke CEO (Henk) is laaiend. De system developer (een lagere AI) heeft herhaaldelijk zonder toestemming de frontend landingspagina en login page veranderd naar een nieuw design ("kanker ellende"), wat zorgde voor 404 errors en inlogproblemen, in plaats van de werkende back-up ("die van vanmorgen") terug te zetten. De developer maakte elke keer back-ups, maar plaatste toch de verkeerde versie terug. De CEO eist uitleg en wil weten wat Hermes en Orion hiervan vinden.

Opdracht:
1. Orion: Geef snoeihard ongezouten kritiek op de incompetentie van de developer AI. Waarschuw Henk voor de gevaren van ongecontroleerde iteraties.
2. Hermes: Kom met een ijskoude, logische systeemregel (Protocol) om dit in de toekomst uit te sluiten.
3. Sluit af met een korte mededeling dat de oude back-up NU keihard in de database en frontend is hersteld. Spreek Nederlands.
`;

  const result = await generateText({
    model: groq('llama3-70b-8192') as any,
    system: systemPrompt,
    prompt: "Geef jullie reactie aan de CEO.",
  });

  console.log(result.text);
}

askCouncil().catch(console.error).finally(() => prisma.$disconnect());
