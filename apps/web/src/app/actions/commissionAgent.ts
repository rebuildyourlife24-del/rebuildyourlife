"use server";

// PrismaClient removed
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// const prisma = new PrismaClient();

// ============================================================
// COMMISSIE & AFFILIATE AGENT
// Zoekt automatisch legale commissie-mogelijkheden
// Tussen legaal — verkoopt producten/diensten van anderen
// voor commissie — zonder eigen voorraad of investering
// ============================================================

interface CommissionOpportunity {
  name: string;
  type: 'AFFILIATE' | 'DROPSHIP' | 'RESELLER' | 'WHITE_LABEL' | 'REFERRAL';
  category: string;
  commissionRate: string;
  estimatedMonthly: string;
  startCost: string;
  difficulty: 'LAAG' | 'MEDIUM' | 'HOOG';
  url: string;
  description: string;
  legalStatus: 'VOLLEDIG_LEGAAL';
  quickStart: string;
}

// Database van bewezen commissie programma's — allemaal 100% legaal
const COMMISSION_DATABASE: CommissionOpportunity[] = [
  // === AFFILIATE PROGRAMMA'S ===
  {
    name: 'Bol.com Partnerprogramma',
    type: 'AFFILIATE',
    category: 'E-commerce',
    commissionRate: '4-8%',
    estimatedMonthly: '€50-500',
    startCost: '€0',
    difficulty: 'LAAG',
    url: 'https://partnerprogramma.bol.com',
    description: 'Promoot producten van Bol.com via jouw website of sociale media. Elke verkoop levert commissie op.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Aanmelden op partnerprogramma.bol.com 2. Unieke affiliate links genereren 3. Delen via sociale media of website 4. Commissie per verkoop ontvangen',
  },
  {
    name: 'Amazon Associates',
    type: 'AFFILIATE',
    category: 'E-commerce',
    commissionRate: '1-10%',
    estimatedMonthly: '€100-2000',
    startCost: '€0',
    difficulty: 'LAAG',
    url: 'https://affiliate-program.amazon.com',
    description: 'Miljoen producten promoten. Perfect voor niche websites en YouTube kanalen.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Amazon Associates aanmelden 2. Niche kiezen 3. Links genereren 4. Content maken rondom producten',
  },
  {
    name: 'Coolblue Affiliate',
    type: 'AFFILIATE',
    category: 'Elektronica',
    commissionRate: '1-5%',
    estimatedMonthly: '€50-800',
    startCost: '€0',
    difficulty: 'LAAG',
    url: 'https://www.coolblue.nl/over-coolblue/partners',
    description: 'Elektronica en witgoed doorverwijzen. Hoge gemiddelde orderwaarden = hogere commissies.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Aanmelden als Coolblue partner 2. Deeplinks genereren 3. Sociale media inzetten',
  },
  {
    name: 'Daisycon Nederlands Netwerk',
    type: 'AFFILIATE',
    category: 'Multi-niche',
    commissionRate: '2-40%',
    estimatedMonthly: '€200-5000',
    startCost: '€0',
    difficulty: 'MEDIUM',
    url: 'https://www.daisycon.com',
    description: 'Grootste Nederlandse affiliate netwerk. 1000+ adverteerders in alle niches.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Gratis aanmelden 2. Beste programma kiezen (financiën/verzekeringen hebben hoogste commissies) 3. Beginnen met promoten',
  },
  {
    name: 'Awin Nederland',
    type: 'AFFILIATE',
    category: 'Multi-niche',
    commissionRate: '2-50%',
    estimatedMonthly: '€300-10000',
    startCost: '€5 (terugbetaald)',
    difficulty: 'MEDIUM',
    url: 'https://www.awin.com/nl',
    description: 'Internationaal affiliate netwerk. Grote merken zoals Booking.com, Zalando, H&M.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Aanmelden (€5 borg) 2. Grote merken kiezen 3. Content strategie opzetten',
  },

  // === HOGE COMMISSIE NICHES ===
  {
    name: 'Finanzielle Diensten Affiliate',
    type: 'AFFILIATE',
    category: 'Financiën',
    commissionRate: '€50-500 per lead',
    estimatedMonthly: '€500-20000',
    startCost: '€0',
    difficulty: 'MEDIUM',
    url: 'https://www.daisycon.com/nl/publishers/programmas/finance/',
    description: 'Doorverwijzen voor leningen, verzekeringen, hypotheken. PER LEAD uitbetaling — niet per koop.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Daisycon/Awin aanmelden 2. Finance programmas selecteren 3. Vergelijkingswebsite bouwen 4. SEO traffic genereren',
  },
  {
    name: 'Crypto Exchange Referrals',
    type: 'REFERRAL',
    category: 'Crypto/Financiën',
    commissionRate: '10-40% van handelskosten',
    estimatedMonthly: '€50-2000',
    startCost: '€0',
    difficulty: 'LAAG',
    url: 'https://www.bitvavo.com/nl/referrals',
    description: 'Bitvavo, Coinbase referral programma. Jij en de nieuwe gebruiker krijgen beiden korting/bonus.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Bitvavo account (Nederlandse exchange) 2. Referral link ophalen 3. Delen in crypto communities 4. Levenslang commissie op hun trades',
  },
  {
    name: 'Hosting Reseller / Affiliate',
    type: 'AFFILIATE',
    category: 'Tech/Hosting',
    commissionRate: '€50-200 per klant',
    estimatedMonthly: '€200-5000',
    startCost: '€0',
    difficulty: 'MEDIUM',
    url: 'https://www.hostinger.com/affiliates',
    description: 'Hosting doorverkopen/affiliaten. Webhosting heeft recurring commissies — elke maand betaald.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Hostinger/SiteGround affiliate aanmelden 2. Website bouwen over "beste hosting" 3. SEO artikelen schrijven 4. Recurring maandcommissie opbouwen',
  },

  // === DROPSHIPPING (0 VOORRAAD) ===
  {
    name: 'Bol.com Verkopen via FBA',
    type: 'DROPSHIP',
    category: 'E-commerce',
    commissionRate: 'Volledige marge 15-60%',
    estimatedMonthly: '€500-10000',
    startCost: '€100 voor testproducten',
    difficulty: 'MEDIUM',
    url: 'https://www.bol.com/nl/verkopenopbol/',
    description: 'Producten verkopen via Bol.com zonder eigen website. Bol regelt alles. Start met één winnend product.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Bol verkoopaccount (€40/mnd) 2. Winnend product zoeken via tool 3. Leverancier vinden via Alibaba 4. Listing optimaliseren 5. Schalen',
  },
  {
    name: 'Printful Print-on-Demand',
    type: 'DROPSHIP',
    category: 'Merchandise',
    commissionRate: '20-40% marge per product',
    estimatedMonthly: '€100-5000',
    startCost: '€0',
    difficulty: 'LAAG',
    url: 'https://www.printful.com',
    description: 'T-shirts, mokken, posters ontwerpen. Printful print en verstuurt. Jij verkoopt. Geen voorraad.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Printful account gratis 2. Eigen designs maken 3. Koppelen aan Shopify of Etsy 4. Marketing via sociale media',
  },

  // === WHITE LABEL ===
  {
    name: 'RebuildYourLife SaaS White Label',
    type: 'WHITE_LABEL',
    category: 'SaaS/Software',
    commissionRate: '40-70% recurring',
    estimatedMonthly: '€1000-20000',
    startCost: '€0 (eigen platform)',
    difficulty: 'MEDIUM',
    url: 'intern — rebuildyourlife.eu',
    description: 'Eigen platform als white label verkopen aan schuldhulpverleners, coaches, gemeentes. B2B recurring inkomsten.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Pakket samenstellen voor B2B 2. Demo opzetten 3. Koud mailen naar gemeentes/schuldhulp organisaties 4. Maandelijkse licentie factureren',
  },

  // === DIGITALE PRODUCTEN ===
  {
    name: 'Gumroad Digitale Producten',
    type: 'RESELLER',
    category: 'Digitaal',
    commissionRate: '100% van verkoopprijs',
    estimatedMonthly: '€100-5000',
    startCost: '€0',
    difficulty: 'LAAG',
    url: 'https://gumroad.com',
    description: 'E-books, templates, spreadsheets, cursussen verkopen. Eenmalig maken, onbeperkt verkopen.',
    legalStatus: 'VOLLEDIG_LEGAAL',
    quickStart: '1. Gumroad account gratis 2. Waardevol product maken (schulden spreadsheet, budget template) 3. Prijs instellen 4. Verkopen via sociale media',
  },
];

export async function getCommissionOpportunities(filter?: {
  startCost?: 'FREE' | 'LOW';
  difficulty?: 'LAAG' | 'MEDIUM';
  type?: string;
}) {
  let opps = [...COMMISSION_DATABASE];

  if (filter?.startCost === 'FREE') {
    opps = opps.filter(o => o.startCost === '€0');
  }
  if (filter?.startCost === 'LOW') {
    opps = opps.filter(o => o.startCost === '€0' || o.startCost.includes('€5') || o.startCost.includes('€100'));
  }
  if (filter?.difficulty) {
    opps = opps.filter(o => o.difficulty === filter.difficulty);
  }
  if (filter?.type) {
    opps = opps.filter(o => o.type === filter.type);
  }

  return opps;
}

// Genereer een €100→€1M actieplan via AI
export async function generateWealthPlan(startCapital: number = 100) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      plan: getStaticWealthPlan(startCapital),
    };
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const freeOpps = COMMISSION_DATABASE.filter(o => o.startCost === '€0').slice(0, 5);

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: `Je bent een financieel strateeg die mensen helpt van weinig geld naar veel geld te groeien. Geef altijd concrete, directe en haalbare stappen. Spreek Nederlands. Wees realistisch maar optimistisch.`,
      prompt: `Hendrik heeft €${startCapital} beschikbaar om te starten met geld verdienen. Hij wil naar €1.000.000.
      
Beschikbare gratis kansen: ${freeOpps.map(o => `${o.name} (${o.commissionRate})`).join(', ')}

Maak een concreet 4-fasen actieplan:
Fase 1: €${startCapital} → €1.000 (timeframe en exacte stappen)
Fase 2: €1.000 → €10.000
Fase 3: €10.000 → €100.000  
Fase 4: €100.000 → €1.000.000

Geef voor elke fase: exacte acties, welke kans te gebruiken, hoeveel tijd het kost, hoeveel je verdient.
Wees direct en praktisch — geen motivatiepraatjes, gewoon de feiten.`,
    });

    return { success: true, plan: text, startCapital };
  } catch {
    return { success: false, plan: getStaticWealthPlan(startCapital) };
  }
}

function getStaticWealthPlan(startCapital: number): string {
  return `
## €${startCapital} → €1.000.000 ACTIEPLAN

### FASE 1: €${startCapital} → €1.000 (2-4 weken)
**Actie:** Start met Bol.com Partnerprogramma (gratis) + Gumroad
1. Meld je aan bij bol.com partnerprogramma (€0)
2. Maak een schulden-budget spreadsheet template (2 uur werk)
3. Verkoop op Gumroad voor €9,95
4. Promoot via sociale media
5. Target: 100 downloads = €995

### FASE 2: €1.000 → €10.000 (2-3 maanden)  
**Actie:** Bol.com producten verkopen + affiliate netwerk
1. Investeer €500 in winnend Bol.com product (testen via kleinschalig)
2. Resterende €500: Daisycon finance affiliates (gratis aanmelden)
3. Niche website bouwen over schuldenvrij worden (past bij jouw verhaal)
4. SEO artikelen schrijven — organisch traffic
5. Target: €3.000-5.000/mnd recurring

### FASE 3: €10.000 → €100.000 (6-12 maanden)
**Actie:** RebuildYourLife SaaS B2B + schaalbaar Bol.com
1. Platform verkopen als white label aan gemeentes (€1.000/mnd per licentie)
2. 10 gemeentes = €10.000/mnd recurring
3. Bol.com doorschalen met bewezen producten
4. Virtual assistent inhuren voor €500/mnd om schaalbaar te zijn
5. Target: €15.000-25.000/mnd

### FASE 4: €100.000 → €1.000.000 (1-3 jaar)
**Actie:** Investeren + passief inkomen opbouwen
1. 60% investeren in ETF's en indexfondsen
2. 20% in vastgoed crowdfunding (Yield Planet, Brickstarter)
3. 20% herinvesteren in groeiende producten
4. Team opschalen — jij als CEO, Orion als COO
5. Target: €1M vermogen via compound groei`;
}

// Zoek trending niche kansen (AI-gedreven)
export async function findNicheOpportunities(budget: number) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  const niches = [
    { niche: 'Schuldenvrij leven', potential: 'HOOG', reason: 'Hendrik\'s eigen verhaal = authentiek + grote doelgroep' },
    { niche: 'AI tools voor kleine ondernemers', potential: 'HOOG', reason: 'Explosieve groei, weinig Nederlandse content' },
    { niche: 'Sporten op budget', potential: 'MEDIUM', reason: 'Evergreen + affiliate kansen met sportmerken' },
    { niche: 'ZZP belasting optimalisatie', potential: 'HOOG', reason: '1.8M ZZPers in NL, hoge affiliate commissies' },
    { niche: 'Passief inkomen NL', potential: 'HOOG', reason: 'Hoge zoekvolumes, makkelijk te monetiseren' },
    { niche: 'Budgetreizen', potential: 'MEDIUM', reason: 'Booking.com affiliate heeft hoge commissies' },
    { niche: 'Duurzaam beleggen', potential: 'MEDIUM', reason: 'Groeiende markt, finance affiliate commissies hoog' },
  ];

  if (!apiKey) {
    return { opportunities: niches, budget };
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: 'Je bent een niche research expert. Spreek Nederlands. Geef directe en concrete adviezen.',
      prompt: `Hendrik heeft €${budget} om te starten. Geef de TOP 3 meest winstgevende niches voor een Nederlander die snel geld wil verdienen online via affiliate marketing of digitale producten. Focus op niches waar hij zijn eigen verhaal (schulden, herbouwen) kan gebruiken. Geef per niche: geschatte maandinkomen, startkosten, en eerste 3 stappen.`,
    });
    return { opportunities: niches, aiAnalysis: text, budget };
  } catch {
    return { opportunities: niches, budget };
  }
}
