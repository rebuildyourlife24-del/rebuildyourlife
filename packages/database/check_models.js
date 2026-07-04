const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    
    // Check Agent Dossiers
    const dossiers = await prisma.agentDossier.findMany();
    console.log('\n--- AGENT DOSSIERS ---');
    if (dossiers.length === 0) console.log('Geen agent dossiers gevonden.');
    dossiers.forEach(d => console.log(`- ${d.agentType}: ${d.action} -> ${d.status}`));
    
    // Check AI Conversations (might contain agent type configs)
    const convos = await prisma.aIConversation.findMany();
    console.log('\n--- AI CONVERSATIONS (Modellen?) ---');
    if (convos.length === 0) console.log('Geen gesprekken gevonden.');
    convos.forEach(c => console.log(`- Type: ${c.agentType}, Titel: ${c.title}`));
    
    // Search the whole DB for "hermes" or "qwen" or "llama"
    console.log('\n--- ZOEKEN NAAR "hermes", "qwen", "llama" IN SETTINGS/LOGS ---');
    const users = await prisma.user.findMany({ select: { email: true, settings: true }});
    users.forEach(u => {
      if (u.settings && (u.settings.toLowerCase().includes('hermes') || u.settings.toLowerCase().includes('qwen') || u.settings.toLowerCase().includes('llama'))) {
        console.log(`User ${u.email} heeft deze modellen in zijn instellingen staan: ${u.settings}`);
      }
    });
    
  } catch(e) {
    console.error('Fout:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
