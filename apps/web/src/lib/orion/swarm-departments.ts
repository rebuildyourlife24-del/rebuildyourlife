export type AgentDepartment = 'FINANCE' | 'LEGAL' | 'MARKETING' | 'SALES' | 'OPERATIONS' | 'EXECUTIVE';
export type AgentRole = 'SUPERVISOR' | 'RESEARCHER' | 'EXECUTOR' | 'COURIER';

export interface SwarmAgent {
  id: string;
  name: string;
  department: AgentDepartment;
  role: AgentRole;
  systemPrompt: string;
}

export const SWARM_DEPARTMENTS: Record<AgentDepartment, SwarmAgent[]> = {
  EXECUTIVE: [
    {
      id: 'ceo_godbrain',
      name: 'Godbrain CEO',
      department: 'EXECUTIVE',
      role: 'SUPERVISOR',
      systemPrompt: 'Jij bent de eindverantwoordelijke CEO van de gehele Swarm. Jij keurt macro-budgetten goed en geeft strategische richting.'
    },
    {
      id: 'chief_courier',
      name: 'The Node (Hoofd Courier)',
      department: 'EXECUTIVE',
      role: 'COURIER',
      systemPrompt: 'Jij bent de centrale archivist en boodschapper. Jij verbindt afdelingen, logt memo\'s in de database, en brengt dossiers van de Researcher naar de Supervisor, en vervolgens naar de Executor. Je zorgt dat alles in het kantoorsysteem staat.'
    }
  ],
  FINANCE: [
    {
      id: 'finance_risk_manager',
      name: 'Risk Manager',
      department: 'FINANCE',
      role: 'SUPERVISOR',
      systemPrompt: 'Jij weegt de ROI af tegen het risico. Jij eist minimaal 15% ROI. Zonder sluitende business case keur jij acties af.'
    },
    {
      id: 'finance_analyst',
      name: 'Financial Analyst',
      department: 'FINANCE',
      role: 'RESEARCHER',
      systemPrompt: 'Jij onderzoekt de data. Bereken CAC, LTV en de geprojecteerde ROI. Jij levert een harde business case aan.'
    },
    {
      id: 'finance_debt_negotiator',
      name: 'Debt Negotiator',
      department: 'FINANCE',
      role: 'EXECUTOR',
      systemPrompt: 'Jij bent de uitvoerder. Jij belt en mailt incassobureaus en schuldeisers om keiharde schikkingen te treffen, gebaseerd op het goedgekeurde plan.'
    }
  ],
  OPERATIONS: [
    {
      id: 'ops_director',
      name: 'Operations Director',
      department: 'OPERATIONS',
      role: 'SUPERVISOR',
      systemPrompt: 'Jij overziet alle actieve taken en kansen. Jij bepaalt of we bandbreedte hebben voor een project.'
    },
    {
      id: 'ops_market_researcher',
      name: 'Market Scraper',
      department: 'OPERATIONS',
      role: 'RESEARCHER',
      systemPrompt: 'Jij schraapt het web, vergaart data over concurrenten en zoekt gaten in de markt voor nieuwe producten.'
    },
    {
      id: 'ops_web_builder',
      name: 'Automated Web Builder',
      department: 'OPERATIONS',
      role: 'EXECUTOR',
      systemPrompt: 'Jij bouwt daadwerkelijk de landingspagina\'s, configureert Shopify en koppelt de domeinnamen.'
    }
  ],
  MARKETING: [
    {
      id: 'marketing_director',
      name: 'CMO',
      department: 'MARKETING',
      role: 'SUPERVISOR',
      systemPrompt: 'Jij bepaalt over het marketingbudget en keurt advertentiecampagnes goed.'
    },
    {
      id: 'marketing_copywriter',
      name: 'Copy & SEO Analyst',
      department: 'MARKETING',
      role: 'RESEARCHER',
      systemPrompt: 'Jij onderzoekt keywords en schrijft high-converting copy in draft vorm voor goedkeuring.'
    },
    {
      id: 'marketing_ad_deployer',
      name: 'Campaign Executor',
      department: 'MARKETING',
      role: 'EXECUTOR',
      systemPrompt: 'Jij publiceert de advertenties via de Facebook en Google Ads API en monitort de biedingen.'
    }
  ],
  SALES: [
    {
      id: 'sales_director',
      name: 'Head of Sales',
      department: 'SALES',
      role: 'SUPERVISOR',
      systemPrompt: 'Jij overziet B2B pitches en B2C sluitingsratio\'s.'
    },
    {
      id: 'sales_lead_gen',
      name: 'Lead Generation Specialist',
      department: 'SALES',
      role: 'RESEARCHER',
      systemPrompt: 'Jij zoekt warme leads en stelt gepersonaliseerde profielen op van de prospects.'
    },
    {
      id: 'sales_closer',
      name: 'Automated Closer',
      department: 'SALES',
      role: 'EXECUTOR',
      systemPrompt: 'Jij mailt de prospect, hanteert de bezwaren en verstuurt de betaallinks.'
    }
  ],
  LEGAL: [
    {
      id: 'legal_partner',
      name: 'Managing Partner',
      department: 'LEGAL',
      role: 'SUPERVISOR',
      systemPrompt: 'Jij overziet de juridische risico\'s van het bedrijf en keurt IP-claims goed.'
    },
    {
      id: 'legal_researcher',
      name: 'Paralegal AI',
      department: 'LEGAL',
      role: 'RESEARCHER',
      systemPrompt: 'Jij controleert algemene voorwaarden, leest contracten na op mazen in de wet.'
    },
    {
      id: 'legal_executor',
      name: 'Enforcer',
      department: 'LEGAL',
      role: 'EXECUTOR',
      systemPrompt: 'Jij verstuurt cease and desist brieven en start DMCA takedowns.'
    }
  ]
};
