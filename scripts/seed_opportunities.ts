const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error("Geen user gevonden in de database. Kan geen kansen aanmaken.");
    return;
  }

  const ops = [
    {
      userId: user.id,
      title: 'Biomechanische Postuur Corrector (AI-Powered)',
      niche: 'HealthTech / Wellness',
      summary: 'Een slim shirt met geïntegreerde haptische sensoren die trilt wanneer de drager een slechte houding aanneemt. Extreem viraal potentieel op TikTok. Supplier gevonden op Alibaba, integratie via Zendrop.',
      goodROI: 400,
      betterROI: 650,
      bestROI: 1200,
      status: 'VERIFIED'
    },
    {
      userId: user.id,
      title: 'Holo-Display voor Home Offices',
      niche: 'Tech / WFH',
      summary: 'Een compacte projector die een 3D-holografische klok en agenda projecteert op het bureau. Zeer hoge perceived value. Inkoopprijs $14, verkoopprijs $89.',
      goodROI: 300,
      betterROI: 500,
      bestROI: 850,
      status: 'VERIFIED'
    },
    {
      userId: user.id,
      title: 'Neuro-Enhancement Nootropic Gummies',
      niche: 'Biohacking / Supplementen',
      summary: "White-label gummies met Lion's Mane en Ashwagandha. Hoge herhaalaankopen (subscription model). Leverancier in de EU, dus 2-daagse verzending mogelijk.",
      goodROI: 200,
      betterROI: 450,
      bestROI: 900,
      status: 'VERIFIED'
    }
  ];

  for (const op of ops) {
    await prisma.opportunityReport.create({ data: op });
  }

  console.log("🚀 Hermes Scout: 3 nieuwe winnende producten geïnjecteerd in de database.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
