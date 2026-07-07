import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SOP Seed for The Syndicate...');

  // Zorg ervoor dat de globale agent bestaat
  let globalAgent = await prisma.agentRegistry.findUnique({
    where: { name: 'COUNCIL_GLOBAL' }
  });

  if (!globalAgent) {
    globalAgent = await prisma.agentRegistry.create({
      data: {
        name: 'COUNCIL_GLOBAL',
        role: 'GLOBAL_KNOWLEDGE_BASE',
        department: 'COUNCIL',
        systemPrompt: 'Global rules repository for the entire council.'
      }
    });
    console.log('✅ Created COUNCIL_GLOBAL agent in registry.');
  }

  const sops = [
    {
      agentId: globalAgent.id,
      domain: "MARKETING",
      type: "VERIFIED",
      claim: "FACEBOOK ADS SCALING POLICY: Als een ad-set een ROAS (Return On Ad Spend) heeft van méér dan 3.0 na 24 uur, verhoog het budget met 20%. Als een ad-set een ROAS heeft van minder dan 1.5 en meer dan €50 heeft gespendeerd, kill de ad direct.",
      evidence: "Syndicate Basisregel - Voorkom cash bleed en schaal winnaars agressief (Machiavelli).",
      source: "SYSTEM_SEED",
      confidence: 1.0
    },
    {
      agentId: globalAgent.id,
      domain: "OPERATIONS",
      type: "VERIFIED",
      claim: "SHOPIFY CONTINUITY POLICY: Als de voorraad van een 'Winning Product' onder de 20 stuks duikt, stuur direct een PENDING actie naar de Admin om in te kopen via de leverancier.",
      evidence: "Syndicate Basisregel - Continuïteit waarborgen (Torvalds).",
      source: "SYSTEM_SEED",
      confidence: 1.0
    },
    {
      agentId: globalAgent.id,
      domain: "SUPPORT",
      type: "VERIFIED",
      claim: "KLANTENSERVICE RESTITUTIE POLICY: Bij klachten over verzendtijden langer dan 14 dagen: Bied direct een kortingscode van 20% aan voor de volgende aankoop in plaats van een directe refund.",
      evidence: "Syndicate Basisregel - Cashflow behouden (Taleb).",
      source: "SYSTEM_SEED",
      confidence: 1.0
    }
  ];

  for (const sop of sops) {
    const existing = await prisma.agentKnowledgeBase.findFirst({
      where: { claim: sop.claim }
    });

    if (!existing) {
      await prisma.agentKnowledgeBase.create({
        data: sop
      });
      console.log(`✅ Injected SOP: [${sop.domain}]`);
    } else {
      console.log(`⚠️ SOP already exists: [${sop.domain}]`);
    }
  }

  console.log('🚀 Knowledge Base seeding complete. The Council is now armed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
