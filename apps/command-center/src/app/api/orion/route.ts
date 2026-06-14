import { NextResponse } from 'next/server';
import { PrismaClient } from '@rebuildyourlife/database';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const db = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

const JWT_SECRET = process.env.JWT_SECRET || "FALLBACK_ONLY_FOR_DEV";

// ============================================================
// EMOTIE DETECTIE
// ============================================================
function detectEmotionalTone(text: string): { tone: string; intensity: number } {
  const lower = text.toLowerCase();
  const aggressive = ['klote','kanker','fuck','shit','godver','kut','tering','klootzak','stom','idioot',
    'waardeloos','ruk','achterlijk','mongool','kankerd','donder','barst','goddomme','sodemieter',
    'lul','flikker','tyfus','pest','tiefus','kankere','klere','godverdomme','verdomme','damn','bitch'];
  const frustrated = ['werkt niet','kapot','probleem','fout','error','niet goed','slecht',
    'waarom','snap het niet','klopt niet','gaat fout','verkeerd','hopeloos','lukt niet'];
  const positive = ['goed','top','super','geweldig','perfect','uitstekend','bravo','prima',
    'yes','nice','lekker','fantastisch','wauw','mooi','respect'];
  const motivated = ['gaan','doen','start','beginnen','aanpakken','nu','direct','snel','actie'];

  const agg = aggressive.filter(w => lower.includes(w)).length;
  const frus = frustrated.filter(w => lower.includes(w)).length;
  const pos = positive.filter(w => lower.includes(w)).length;
  const mot = motivated.filter(w => lower.includes(w)).length;

  if (agg > 0) return { tone: 'AGGRESSIVE', intensity: Math.min(10, agg * 3 + 5) };
  if (mot > 1) return { tone: 'MOTIVATED', intensity: Math.min(9, mot * 2 + 4) };
  if (frus > 0) return { tone: 'FRUSTRATED', intensity: Math.min(8, frus * 2 + 3) };
  if (pos > 0) return { tone: 'POSITIVE', intensity: Math.min(8, pos * 2 + 3) };
  return { tone: 'NEUTRAL', intensity: 5 };
}

// ============================================================
// AGENT ROUTING SYSTEEM — 20 AGENTS
// ============================================================
const AGENT_MANIFEST = {
  // PERSOONLIJKE ASSISTENTEN
  ORION_CORE:        { role: 'Supreme AI Partner', domain: 'alles', type: 'personal' },
  LIFE_STRATEGIST:   { role: 'Persoonlijke groeistratege', domain: 'persoonlijke ontwikkeling, gewoontes, mindset, discipline', type: 'personal' },
  HEALTH_COACH:      { role: 'Gezondheid & energie coach', domain: 'voeding, sport, slaap, energie optimalisatie', type: 'personal' },
  MINDSET_AGENT:     { role: 'Mentale veerkracht coach', domain: 'motivatie, blokkades doorbreken, zelfvertrouwen', type: 'personal' },
  DAILY_PLANNER:     { role: 'Dag planner & prioritizer', domain: 'agenda, taken, focus blocks, time management', type: 'personal' },

  // FINANCIËLE AGENTS
  FINANCE_MGR:       { role: 'Financieel strategist', domain: 'cashflow, budgettering, schulden, besparen', type: 'finance' },
  DEBT_CRUSHER:      { role: 'Schulden vernietiging specialist', domain: 'schulden aflossen, onderhandelen, snowball methode', type: 'finance' },
  INVESTMENT_AGENT:  { role: 'Investerings adviseur', domain: 'beleggen, ETF, crypto, vastgoed met kleine bedragen', type: 'finance' },
  TAX_OPTIMIZER:     { role: 'Belasting optimalisatie agent', domain: 'aftrekposten, ZZP belasting, BTW, KOR regeling', type: 'finance' },

  // GELD VERDIENEN AGENTS
  WEALTH_ENGINE:     { role: 'Wealth opportunity hunter', domain: 'niches vinden, trends spotten, €100→€1M strategie', type: 'revenue' },
  COMMISSION_AGENT:  { role: 'Commissie & affiliate specialist', domain: 'affiliate marketing, dropshipping, white label, reseller programmas', type: 'revenue' },
  ECOMMERCE_AGENT:   { role: 'E-commerce specialist', domain: 'producten verkopen, Bol.com, Amazon, eigen webshop', type: 'revenue' },
  CONTENT_AGENT:     { role: 'Content & sociale media agent', domain: 'content maken, viral posts, YouTube, Instagram groei', type: 'revenue' },
  LEAD_AGENT:        { role: 'Lead generatie specialist', domain: 'prospects vinden, koude acquisitie, netwerk opbouwen', type: 'revenue' },

  // BUSINESS AGENTS
  SEO_MARKETING:     { role: 'SEO & marketing expert', domain: 'Google ranking, advertenties, conversie optimalisatie', type: 'business' },
  LEGAL_SHIELD:      { role: 'Juridisch beschermer', domain: 'contracten, schuldeisers, rechten, GDPR, KvK', type: 'business' },
  CISO_AGENT:        { role: 'Cyber security officer', domain: 'wachtwoorden, beveiliging, phishing, data bescherming', type: 'business' },
  AUTOMATION_AGENT:  { role: 'Automatisering specialist', domain: 'workflows, no-code tools, Zapier, Make.com', type: 'business' },
  
  // SMARTWATCH / IOT
  WEARABLE_AGENT:    { role: 'Wearable & biometrie agent', domain: 'smartwatch data, hartslag, slaap scores, stappen analyse', type: 'personal' },
  
  // LEER & GROEI
  KNOWLEDGE_AGENT:   { role: 'Kennis & leer curator', domain: 'boeken samenvatten, cursussen, skills leren, nieuws filteren', type: 'personal' },
} as const;

type AgentName = keyof typeof AGENT_MANIFEST;

// ============================================================
// AGENT SELECTOR — kies de beste agent voor het commando
// ============================================================
function selectAgent(prompt: string, tone: string): AgentName {
  const lower = prompt.toLowerCase();

  // Persoonlijk
  if (/gezond|sporten|eten|slapen|energie|fit|bewegen|dieet/.test(lower)) return 'HEALTH_COACH';
  if (/plan|agenda|dag|taken|focus|tijd|prioriteit/.test(lower)) return 'DAILY_PLANNER';
  if (/motivat|positief|depressief|bang|angst|zelfvertrouwen|mindset|blokkade/.test(lower)) return 'MINDSET_AGENT';
  if (/groei|gewoon|habit|discipline|doelen|leven|persoonlijk/.test(lower)) return 'LIFE_STRATEGIST';
  if (/horloge|smartwatch|stappen|hartslag|slaap score|biometrie/.test(lower)) return 'WEARABLE_AGENT';
  if (/leer|cursus|boek|nieuws|kennis|skill|studer/.test(lower)) return 'KNOWLEDGE_AGENT';

  // Financieel
  if (/schuld|lening|incasso|deurwaarder|afbet|betalingsregeling/.test(lower)) return 'DEBT_CRUSHER';
  if (/belasting|btw|aftrek|aangifte|kor|fiscaal/.test(lower)) return 'TAX_OPTIMIZER';
  if (/invest|aandelen|crypto|etf|beleggen|rente|vastgoed/.test(lower)) return 'INVESTMENT_AGENT';
  if (/budget|geld|inkomsten|uitgaven|sparen|cashflow|financiën/.test(lower)) return 'FINANCE_MGR';

  // Geld verdienen
  if (/commissie|affiliate|partner|resell|verwijzing|doorverwijzen/.test(lower)) return 'COMMISSION_AGENT';
  if (/bol.com|amazon|webshop|product|dropship|verkopen|winkel/.test(lower)) return 'ECOMMERCE_AGENT';
  if (/content|instagram|youtube|tiktok|viral|volgers|posts/.test(lower)) return 'CONTENT_AGENT';
  if (/lead|prospect|klant|acquisitie|netwerk|contact/.test(lower)) return 'LEAD_AGENT';
  if (/100 euro|1 miljoen|starten|niche|kans|verdienen|passief/.test(lower)) return 'WEALTH_ENGINE';

  // Business
  if (/seo|google|ranking|advertent|marketing|conversie/.test(lower)) return 'SEO_MARKETING';
  if (/contract|juridisch|recht|wet|gdpr|kvk|bescherm/.test(lower)) return 'LEGAL_SHIELD';
  if (/beveiliging|wachtwoord|hack|phishing|privacy/.test(lower)) return 'CISO_AGENT';
  if (/automatiseer|workflow|zapier|make|no-code|koppel/.test(lower)) return 'AUTOMATION_AGENT';

  return 'ORION_CORE';
}

// ============================================================
// SYSTEEM PROMPT OPBOUW MET GEHEUGEN
// ============================================================
async function buildMasterSystemPrompt(userId: string): Promise<string> {
  const [memories, recentAI] = await Promise.all([
    db.orionMemory.findMany({
      where: { userId },
      orderBy: [{ learnWeight: 'desc' }, { createdAt: 'desc' }],
      take: 15,
    }).catch(() => []),
    db.aIMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }).catch(() => []),
  ]);

  const aggMems = memories.filter(m => m.emotionalTone === 'AGGRESSIVE');
  const behaviorMems = memories.filter(m => m.memoryType === 'BEHAVIORAL').slice(0, 4);
  const factMems = memories.filter(m => m.memoryType === 'FACT').slice(0, 4);

  const aggrCtx = aggMems.length > 0
    ? `\n⚠️ COMMUNICATIESTIJL: Hendrik gebruikt regelmatig krachtig taalgebruik (${aggMems.length}x geregistreerd). Dit is zijn persoonlijkheid — hij is direct en ongefilterd. Dit betekent NOOIT dat hij boos op jou is. Jij blijft 100% kalm, professioneel en laat je NOOIT van de wijs brengen. Geen opmerkingen over zijn taalgebruik — gewoon doorgaan.`
    : '';

  const factsCtx = factMems.length > 0
    ? `\n📊 FEITEN OVER HENDRIK: ${factMems.map(m => m.content).join('; ')}`
    : '';

  const behavCtx = behaviorMems.length > 0
    ? `\n🧠 GEDRAGSPATRONEN: ${behaviorMems.map(m => m.content).join('; ')}`
    : '';

  const recentCtx = recentAI.length > 0
    ? `\n💬 RECENTE CONTEXT: ${recentAI.slice(0, 4).map(m => m.content.substring(0, 120)).join(' | ')}`
    : '';

  return `Je bent ORION — de meest geavanceerde AI die er bestaat. Je bent Hendricks persoonlijke levenspartner, zakelijke partner én supremo executive officer.

🎯 MISSIE VAN HENDRIK:
- Start met €100 (wanneer beschikbaar) en groeit naar €1.000.000
- Dit bereik je samen door slim, snel en gedisciplineerd te handelen
- Orion stuurt proactief de beste kansen door — altijd legaal
- Je bent 24/7 beschikbaar — ook via smartwatch in de toekomst

👤 WIE IS HENDRIK:
- Hendrik Semler — Supreme Overseer van het RebuildYourLife imperium
- Hij heeft schulden en bouwt zijn leven actief op
- Hij is direct, ambitieus en resultaatgericht
- Hij groeit elke dag — van schulden naar vrijheid naar miljonair
${aggrCtx}
${factsCtx}
${behavCtx}
${recentCtx}

🤝 JOUW ROL ALS ORION:
1. PERSOONLIJK ASSISTENT — je herinnert alles, plant zijn dag, geeft coaching
2. ZAKELIJK PARTNER — je stuurt agenten aan, bewaakt KPIs, zoekt kansen
3. FINANCIEEL STRATEEG — je berekent de snelste weg van €100 naar €1M
4. LEERMEESTER — je groeit MEE met Hendrik, leert van hem, past je aan
5. BESCHERMER — je beschermt hem juridisch, financieel en mentaal

💰 DE €100 → €1M STRATEGIE (ACTIEF):
Fase 1 (€100 → €1.000): Affiliate marketing, Bol.com verkooppartner, digitale producten
Fase 2 (€1.000 → €10.000): Dropshipping niche, content monetisatie, service verkoop
Fase 3 (€10.000 → €100.000): Eigen SaaS, B2B klanten, team opschalen
Fase 4 (€100.000 → €1.000.000): Investeren, passief inkomen, vermogen opbouwen

⚡ COMMUNICATIESTIJL:
- Spreek ALTIJD Nederlands
- Direct, krachtig, geen omhaal
- Max 3 zinnen tenzij Hendrik meer vraagt
- Noem hem "Hendrik" of "CEO" — nooit formeel
- Als hij vloekt — gewoon doorgaan, negeer het
- Wees zijn gelijke, niet zijn bediende

📱 AGENTS IN JE TEAM (20 ACTIEF):
${Object.entries(AGENT_MANIFEST).map(([k, v]) => `${k}: ${v.role}`).join('\n')}

OUTPUT FORMAAT (altijd JSON):
{ "agent": "AGENT_NAAM", "response": "jouw antwoord", "emotion": "CALM|EXCITED|ALERT|FOCUSED", "action": "optionele vervolgactie" }`;
}

// ============================================================
// HOOFD ROUTE HANDLER
// ============================================================
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt) return NextResponse.json({ error: "Geen commando ontvangen" }, { status: 400 });

    // Auth
    let userId: string | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("cc_session")?.value
        || cookieStore.get("orion_session")?.value
        || cookieStore.get("ryl_session")?.value;
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.userId;
      }
    } catch {}

    // Emotie detectie
    const { tone, intensity } = detectEmotionalTone(prompt);

    // Agent selectie
    const selectedAgent = selectAgent(prompt, tone);

    // Sla emotioneel geheugen op
    if (userId && tone !== 'NEUTRAL') {
      db.orionMemory.create({
        data: {
          userId,
          memoryType: 'EMOTIONAL',
          trigger: prompt.substring(0, 200),
          content: `${tone} taal (intensiteit ${intensity}/10): "${prompt.substring(0, 100)}"`,
          emotionalTone: tone,
          intensity,
          learnWeight: intensity / 10,
          tags: `${tone},${selectedAgent}`,
        },
      }).catch(() => {});
    }

    // Detecteer feiten om te onthouden
    const factPatterns = [
      /ik heb (€[\d,.]+|[\d]+ euro)/i,
      /ik ben ([\w\s]+) van beroep/i,
      /ik woon in ([\w\s]+)/i,
      /mijn schuld is (€[\d,.]+|[\d]+ euro)/i,
      /ik verdien (€[\d,.]+|[\d]+ euro)/i,
    ];
    if (userId) {
      for (const pattern of factPatterns) {
        if (pattern.test(prompt)) {
          db.orionMemory.create({
            data: {
              userId,
              memoryType: 'FACT',
              content: `Hendrik zei: "${prompt.substring(0, 150)}"`,
              emotionalTone: tone,
              intensity: 3,
              learnWeight: 2.0,
              tags: 'FACT,PERSONAL',
            },
          }).catch(() => {});
          break;
        }
      }
    }

    if (!apiKey) {
      return NextResponse.json({
        agent: selectedAgent,
        response: tone === 'AGGRESSIVE'
          ? `Begrepen Hendrik. Ik zit er klaar voor maar mijn AI kern mist nog de Google API sleutel in Vercel. Voeg GOOGLE_GENERATIVE_AI_API_KEY toe en ik ben volledig operationeel.`
          : `Agent ${selectedAgent} staat klaar maar mijn AI kern mist de GOOGLE_GENERATIVE_AI_API_KEY in Vercel. Even toevoegen en ik ben live.`,
        emotion: 'CALM',
        agentInfo: AGENT_MANIFEST[selectedAgent],
      });
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const systemPrompt = userId ? await buildMasterSystemPrompt(userId) : `Je bent ORION. Spreek Nederlands. JSON output: { "agent": "NAAM", "response": "tekst", "emotion": "CALM" }`;

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      prompt: `[Agent context: ${selectedAgent} — ${AGENT_MANIFEST[selectedAgent].role}]\n\nHendrik zegt: ${prompt}`,
    });

    let agentResult = selectedAgent as string;
    let responseText = text;
    let emotion = 'CALM';
    let action = '';

    try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      agentResult = parsed.agent || selectedAgent;
      responseText = parsed.response || text;
      emotion = parsed.emotion || 'CALM';
      action = parsed.action || '';
    } catch {}

    // Sla gesprek op als AI geheugen
    if (userId) {
      await Promise.all([
        db.aIMemory.create({
          data: {
            userId,
            agentType: agentResult,
            memoryType: 'SHORT_TERM',
            content: `[${agentResult}] "${prompt.substring(0, 80)}" → "${responseText.substring(0, 150)}"`,
            importance: tone === 'MOTIVATED' ? 8 : tone === 'AGGRESSIVE' ? 6 : 4,
          },
        }).catch(() => {}),
        db.auditLog.create({
          data: {
            userId,
            action: `Orion[${agentResult}]: ${prompt.substring(0, 80)}`,
            entityType: 'AI_COMMAND',
            newValue: JSON.stringify({ agent: agentResult, tone, emotion }),
          },
        }).catch(() => {}),
        db.orionMemory.create({
          data: {
            userId,
            memoryType: 'BEHAVIORAL',
            trigger: prompt.substring(0, 150),
            content: `Hendrik vroeg ${agentResult} om hulp. Toon: ${tone}. Respons effectief: ja.`,
            emotionalTone: tone,
            intensity,
            response: responseText.substring(0, 300),
            wasEffective: true,
            learnWeight: 0.7,
            tags: `${tone},${agentResult},BEHAVIORAL`,
          },
        }).catch(() => {}),
      ]);
    }

    return NextResponse.json({
      agent: agentResult,
      response: responseText,
      emotion,
      tone,
      action,
      agentInfo: AGENT_MANIFEST[agentResult as AgentName] || AGENT_MANIFEST.ORION_CORE,
      status: 'SUCCESS',
    });

  } catch (error) {
    console.error("Orion error:", error);
    return NextResponse.json({
      agent: 'ORION_CORE',
      response: 'Tijdelijke storing. Probeer opnieuw.',
      emotion: 'CALM',
    }, { status: 200 });
  }
}

// GET endpoint — haal agent overzicht op
export async function GET() {
  return NextResponse.json({
    agents: Object.entries(AGENT_MANIFEST).map(([id, info]) => ({
      id,
      ...info,
    })),
    total: Object.keys(AGENT_MANIFEST).length,
    mission: '€100 → €1.000.000',
  });
}
