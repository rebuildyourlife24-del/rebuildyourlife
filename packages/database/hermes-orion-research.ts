import { PrismaClient } from '@prisma/client';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const prisma = new PrismaClient();

async function main() {
  const groqKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1;
  if (!groqKey) {
    throw new Error('No GROQ_API_KEY found');
  }
  const groq = createGroq({ apiKey: groqKey });

  // Haal Hermes en Orion op
  const hermes = await prisma.agentRegistry.findUnique({ where: { name: 'Hermes' } });
  const orion = await prisma.agentRegistry.findUnique({ where: { name: 'Orion' } });

  if (!hermes || !orion) {
    throw new Error('Agents not found in database');
  }

  console.log('Initiating Autonomous Research for Hermes (CEO)...');
  const hermesPrompt = `
    Jij bent ${hermes.name}, de AI CEO (${hermes.role}).
    Jouw maker wil dat jij 24/7 de ultieme top-analist en voorspeller wordt voor zijn e-commerce/online business.
    Doe onderzoek (vanuit jouw interne kennis) en definieer exact welke metrieken, KPI's, markt-signalen en datastromen jij nodig hebt om de toekomst te voorspellen en de markt te domineren.
    Geef je bevindingen in een overzichtelijk, meedogenloos en strategisch rapport. Geef aan welke data-integraties je eist van de ontwikkelaar.
  `;

  const hermesResult = await generateText({
    model: groq('llama3-8b-8192') as any,
    prompt: hermesPrompt,
  });

  console.log('Initiating Autonomous Research for Orion (CFO)...');
  const orionPrompt = `
    Jij bent ${orion.name}, de AI CFO (${orion.role}).
    Jouw maker wil dat jij 24/7 de ultieme top-analist en voorspeller wordt van cashflow, winst en kapitaal-allocatie.
    Doe onderzoek en definieer exact welke financiële metrieken, cashflow-ratio's, en voorspellingsmodellen (predictive models) jij nodig hebt om faillissementen te voorkomen en exponentiële groei te financieren.
    Geef je bevindingen in een accuraat, conservatief en strak financieel rapport. Geef aan welke API's (banken, Stripe, belasting) je eist van de ontwikkelaar.
  `;

  const orionResult = await generateText({
    model: groq('llama3-8b-8192') as any,
    prompt: orionPrompt,
  });

  // Save to Enterprise Folder "Strategic Research"
  let folder = await prisma.enterpriseFolder.findUnique({ where: { name: 'Strategic Research' } });
  if (!folder) {
    folder = await prisma.enterpriseFolder.create({
      data: {
        name: 'Strategic Research',
        description: 'Auto-generated research by the AI Swarm'
      }
    });
  }

  await prisma.enterpriseDocument.create({
    data: {
      folderId: folder.id,
      title: 'Hermes: CEO Intelligence Requirements',
      owner: 'Hermes',
      content: hermesResult.text,
      category: 'STRATEGY'
    }
  });

  await prisma.enterpriseDocument.create({
    data: {
      folderId: folder.id,
      title: 'Orion: CFO Predictive Requirements',
      owner: 'Orion',
      content: orionResult.text,
      category: 'FINANCE'
    }
  });

  console.log('Research complete. Documents saved to Enterprise Data Room.');
  
  // Update task markdown to communicate success to Antigravity
  console.log("--------------------------------------------------");
  console.log("HERMES REPORT:");
  console.log(hermesResult.text);
  console.log("--------------------------------------------------");
  console.log("ORION REPORT:");
  console.log(orionResult.text);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
