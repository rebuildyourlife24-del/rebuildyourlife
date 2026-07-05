import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
  {
    title: "Foundation of Freedom (Mindset & Productivity)",
    description: "Voordat je begint met een business model, moet je de juiste identiteit aannemen.",
    tierAccess: "REGULAR",
    order: 1,
    modules: [
      {
        title: "The CEO Mindset",
        description: "Identiteitsshift, overtuigingen herprogrammeren, omgaan met falen.",
        order: 1,
        lessons: [
          { title: "Welkom bij The CEO Mindset", duration: 15, content: "Wat betekent het om een CEO te zijn?" },
          { title: "Identiteitsshift & Overtuigingen", duration: 20, content: "Herprogrammeer je brein voor succes." }
        ]
      },
      {
        title: "Deep Work & Time Management",
        description: "Focus masterclass, dopamine detox, efficiënt werken in 4 uur per dag.",
        order: 2,
        lessons: [
          { title: "Wat is Deep Work?", duration: 10, content: "Introductie tot ultieme focus." },
          { title: "De Dopamine Detox", duration: 25, content: "Reset je brein voor productiviteit." }
        ]
      },
      {
        title: "Goal Setting & Reverse Engineering",
        description: "Doelen stellen, roadmap maken en dagelijkse KPI's bepalen.",
        order: 3,
        lessons: [
          { title: "Doelen Stellen 101", duration: 15, content: "Hoe stel je haalbare doelen?" }
        ]
      },
      {
        title: "Health & Biohacking voor Ondernemers",
        description: "Slaapoptimalisatie, voeding, en fitness voor maximale energie en helderheid.",
        order: 4,
        lessons: [
          { title: "Slaap als je Superkracht", duration: 20, content: "Optimaliseer je slaapcyclus." }
        ]
      }
    ]
  },
  {
    title: "AI Automation Agency (AAA)",
    description: "Inspelen op de grootste trend van dit decennium: bedrijven helpen automatiseren met AI.",
    tierAccess: "REGULAR",
    order: 2,
    modules: [
      {
        title: "Introductie tot de AI Revolutie",
        description: "Wat is een AAA en waarom nu starten?",
        order: 1,
        lessons: [
          { title: "Wat is een AAA?", duration: 15, content: "De basics van AI Automation." }
        ]
      },
      {
        title: "No-Code & Low-Code Mastery",
        description: "Basis en geavanceerde workflows met Make, Zapier en n8n.",
        order: 2,
        lessons: [
          { title: "Zapier en Make Basis", duration: 30, content: "Je eerste zap bouwen." }
        ]
      },
      {
        title: "AI Chatbots & Agents Bouwen",
        description: "Custom GPTs en AI assistenten ontwikkelen voor klantenservice en lead gen.",
        order: 3,
        lessons: [
          { title: "Je eerste Custom GPT", duration: 25, content: "Train je eigen GPT." }
        ]
      },
      {
        title: "Klanten Vinden & Closen",
        description: "Outbound strategieën, de onweerstaanbare offer, sales calls voeren.",
        order: 4,
        lessons: [
          { title: "Outbound Outreach", duration: 20, content: "Koude acquisitie die werkt." }
        ]
      },
      {
        title: "Service Delivery & Opschalen",
        description: "Klantbehoud, maandelijkse retainers en het bouwen van een team.",
        order: 5,
        lessons: [
          { title: "Retainers Verkopen", duration: 15, content: "Gegarandeerd maandelijks inkomen." }
        ]
      }
    ]
  },
  {
    title: "E-commerce & Dropshipping 2.0",
    description: "Een moderne benadering van dropshipping, met focus op brand building en snelle content.",
    tierAccess: "REGULAR",
    order: 3,
    modules: [
      {
        title: "Niche & Product Research",
        description: "Hoe vind je winnende producten via TikTok, AdSpy en leveranciers?",
        order: 1,
        lessons: [
          { title: "Product Research op TikTok", duration: 20, content: "Vind de nieuwste trends." }
        ]
      },
      {
        title: "High-Converting Shopify Store Setup",
        description: "Conversie-optimalisatie, copywriting voor e-com, en design.",
        order: 2,
        lessons: [
          { title: "Shopify Basis Setup", duration: 45, content: "Maak je eerste store." }
        ]
      },
      {
        title: "Organic Viral Marketing",
        description: "Hoe ga je viraal op TikTok en Instagram Reels zonder ad spend?",
        order: 3,
        lessons: [
          { title: "Viraal Gaan op TikTok", duration: 25, content: "Algoritme hacks." }
        ]
      },
      {
        title: "Paid Ads Mastery",
        description: "Testing, scaling, en retargeting strategieën met Meta & TikTok Ads.",
        order: 4,
        lessons: [
          { title: "Meta Ads Introductie", duration: 30, content: "Je eerste campagne." }
        ]
      },
      {
        title: "Transitie naar een E-com Brand",
        description: "Private labeling, logistiek verbeteren, en klantwaarde maximaliseren.",
        order: 5,
        lessons: [
          { title: "Private Labeling 101", duration: 20, content: "Van dropshipping naar echt merk." }
        ]
      }
    ]
  },
  {
    title: "Crypto & DeFi Mastery",
    description: "Vermogen opbouwen en beschermen in Web3.",
    tierAccess: "REGULAR",
    order: 4,
    modules: [
      {
        title: "Blockchain & Crypto Fundamentals",
        description: "Hoe werkt het, wallets (Ledger/Trezor) en veiligheid.",
        order: 1,
        lessons: [
          { title: "Wat is Bitcoin?", duration: 15, content: "De basis van blockchain." }
        ]
      },
      {
        title: "Investeringsstrategieën",
        description: "DCA, cycle theorie, en marktanalyse.",
        order: 2,
        lessons: [
          { title: "DCA en Cycles", duration: 20, content: "Veilig investeren." }
        ]
      },
      {
        title: "Altcoin Research",
        description: "Hoe analyseer je projecten, tokenomics, en on-chain data?",
        order: 3,
        lessons: [
          { title: "Altcoin parels vinden", duration: 25, content: "Fundamentele analyse." }
        ]
      },
      {
        title: "DeFi, Staking & Yield Farming",
        description: "Passief inkomen genereren met je crypto.",
        order: 4,
        lessons: [
          { title: "Wat is DeFi?", duration: 20, content: "Introductie Decentralized Finance." }
        ]
      },
      {
        title: "Risk Management & Portfolio Allocation",
        description: "Winsten nemen, emoties uitschakelen, en kapitaalbescherming.",
        order: 5,
        lessons: [
          { title: "Risico Beheer", duration: 15, content: "Verlies nooit alles." }
        ]
      }
    ]
  },
  {
    title: "High-Income Copywriting",
    description: "De meest essentiële vaardigheid: verkopen met woorden.",
    tierAccess: "REGULAR",
    order: 5,
    modules: [
      {
        title: "Psychologie van Verkoop",
        description: "Waarom mensen kopen, triggers en bezwaren.",
        order: 1,
        lessons: [
          { title: "De Copywriting Mindset", duration: 15, content: "Waarom copy alles is." }
        ]
      },
      {
        title: "Direct Response Copy",
        description: "Structuur van Facebook Ads, email funnels en sales pages.",
        order: 2,
        lessons: [
          { title: "Sales Page Framework", duration: 25, content: "Bouw een pagina die converteert." }
        ]
      },
      {
        title: "AI-Assisted Copywriting",
        description: "ChatGPT en Claude gebruiken als sparringpartner en draft-generator.",
        order: 3,
        lessons: [
          { title: "AI Copy Prompts", duration: 20, content: "Schrijf met AI in 1/10 van de tijd." }
        ]
      },
      {
        title: "Freelance Copywriting Business Opzetten",
        description: "Klanten vinden op X, LinkedIn, en Upwork.",
        order: 4,
        lessons: [
          { title: "Je Eerste Copy Klant", duration: 20, content: "Hoe vind je betalende klanten?" }
        ]
      }
    ]
  }
];

async function main() {
  console.log("Start seeding academy content...");

  for (const c of courses) {
    // Upsert the course by title
    const createdCourse = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        tierAccess: c.tierAccess,
        order: c.order,
        modules: {
          create: c.modules.map(m => ({
            title: m.title,
            description: m.description,
            order: m.order,
            lessons: {
              create: m.lessons.map((l, i) => ({
                title: l.title,
                content: l.content,
                duration: l.duration,
                order: i + 1
              }))
            }
          }))
        }
      }
    });

    console.log(`Created course: ${createdCourse.title}`);
  }

  console.log("Academy seeding completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
