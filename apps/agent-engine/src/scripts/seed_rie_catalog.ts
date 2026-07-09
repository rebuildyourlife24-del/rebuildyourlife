import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RIE_MODELS = [
  // Creator-OS
  "Faceless Short-Form Automation", "AI Avatar Influencers", "YouTube Long-Form Automation", "OnlyFans Chat & Upsell Automation", "Geautomatiseerde Nieuwsbrieven",
  // Commerce-OS
  "AutoDS / Dropshipping", "Print-On-Demand AI Art", "Digital Product Store", "Marketplace Arbitrage", "E-Com Retour & Support AI",
  // Agency-OS
  "SEO Automation Agency", "AI Translation Agency", "B2B E-Book Lead Magnets", "AI Web Design (Omega Sites)", "PR & Press Release Agency", "Voiceover & Audio Studio", "Copywriting / Ad-Copy Agency",
  // Marketing-OS
  "B2B Cold Email Outreach", "LinkedIn Ghostwriting", "Autonomous Ads Manager", "Local Lead Gen (Google My Business)", "Community Moderation as a Service",
  // Affiliate-OS
  "The Syndicate (Elite Closers)", "High-Ticket Affiliate Funnels", "AI Review Sites (Niche Blogs)", "Pinterest Affiliate Automation",
  // CRM-OS
  "AI Appointment Setting", "B2B Customer Support Chatbots", "Churn Recovery System",
  // Finance-OS
  "Algo-Trading (Crypto/Forex)", "Expired Domain Flipping", "Distressed Property / Tax Lien Finder", "Trademark Squatting / IP Licensing",
  // Education-OS
  "AI Course Generation", "Geautomatiseerde Webinars", "AI Business Coach (SaaS)", "Certificatie & Quiz Funnels",
  // SaaS-OS
  "API Arbitrage", "B2B Analytics Dashboarding", "Uptime & Security Monitoring", "AI Resume/CV Builder",
  // Marketplace-OS
  "Fiverr / Upwork Arbitrage", "Niche Job Board", "Niche Bedrijvengids", "Grant/Subsidy Writing", "Corporate Espionage (Marktonderzoek)", "Event & Ticketing Aggregator", "Matchmaking (B2B)", "P2P Equipment Rental", "De Supreme Overseer Meta-Agency"
];

async function seed() {
  console.log("🌱 Ingesting 50 core models into the Revenue Intelligence Engine (RIE)...");

  for (const modelName of RIE_MODELS) {
    await prisma.revenueIntelligenceGenome.upsert({
      where: { modelName },
      update: {}, // Do nothing if it already exists
      create: {
        modelName,
        status: "PENDING_RESEARCH",
        // Empty JSON structures ready to be populated by the AI Worker
        identityMatrix: {},
        businessCore: {},
        revenueLogic: {},
        marketData: {},
        competitorIntel: {},
        customerJourney: {},
        funnelBlueprint: {},
        trafficSources: {},
        marketingStrats: [],
        salesStrats: [],
        psychology: {},
        aiFeasibility: {},
        requiredAgents: [],
        softwareStack: {},
        automationFlows: {},
        kpiBaselines: {},
        riskMatrix: {},
        exploitableEdges: {},
        exitStrategy: {},
        learningLoop: {}
      }
    });
    console.log(`- Seeded: ${modelName}`);
  }

  console.log(`✅ Successfully seeded ${RIE_MODELS.length} models into RIE.`);
}

seed()
  .catch(e => {
    console.error("FATAL ERROR IN SEED SCRIPT:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
