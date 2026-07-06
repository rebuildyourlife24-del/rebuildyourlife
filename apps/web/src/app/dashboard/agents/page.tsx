import { Bot, Cpu, Zap, MessageSquare, PlusCircle, Target, Megaphone, Briefcase, FileLineChart, PenTool, Package, DollarSign, CreditCard, ShieldAlert, Truck, Globe, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const coreAgents = [
  {
    id: 'hermes',
    name: 'Hermes',
    role: 'Persoonlijk Assistent & Researcher',
    status: 'ACTIVE',
    description: 'Jouw rechterhand in het Rebuild Your Life OS. Kan het hele platform bedienen, content onderzoeken en taken direct volbrengen.',
    color: 'emerald',
    icon: <Bot className="w-7 h-7 text-emerald-400" />
  },
  {
    id: 'ceo',
    name: 'Orion',
    role: 'Chief Executive Officer',
    status: 'ACTIVE',
    description: 'Overziet je hele business, forceert harde beslissingen en optimaliseert winstgevendheid en lange-termijn roadmaps.',
    color: 'yellow',
    icon: <Briefcase className="w-7 h-7 text-yellow-400" />
  },
  {
    id: 'cfo',
    name: 'Midas',
    role: 'Chief Financial Officer',
    status: 'ACTIVE',
    description: 'Bewaakt je cashflow, budgetten en financiële prognoses. Zorgt dat je nooit failliet gaat.',
    color: 'green',
    icon: <FileLineChart className="w-7 h-7 text-green-400" />
  },
  {
    id: 'cmo',
    name: 'Atlas',
    role: 'Chief Marketing Officer',
    status: 'ACTIVE',
    description: 'Schrijft marketingplannen, analyseert conversies, doelgroepen en merkstrategie.',
    color: 'purple',
    icon: <Target className="w-7 h-7 text-purple-400" />
  },
  {
    id: 'ads',
    name: 'Vulcan',
    role: 'Performance Marketer (Ads)',
    status: 'ACTIVE',
    description: 'Beheert je ROAS, schrijft winnende ad-creatives en schaalt je campagnes op Meta en TikTok.',
    color: 'orange',
    icon: <Megaphone className="w-7 h-7 text-orange-400" />
  },
  {
    id: 'copy',
    name: 'Apollo',
    role: 'Direct Response Copywriter',
    status: 'ACTIVE',
    description: 'Schrijft e-mails, salespages en VSL scripts die hypnotiseren en keihard converteren.',
    color: 'rose',
    icon: <PenTool className="w-7 h-7 text-rose-400" />
  }
];

const ecomAgents = [
  {
    id: 'ecom_catalog',
    name: 'Catalog & Sourcing',
    role: 'E-com Product Catalogus',
    status: 'ACTIVE',
    description: 'Beheert product SKU\'s, sourcing via dropshipping leveranciers en trendanalyses.',
    color: 'cyan',
    icon: <Package className="w-7 h-7 text-cyan-400" />
  },
  {
    id: 'ecom_pricing',
    name: 'Pricing Engine',
    role: 'Prijs & Marge Optimalisatie',
    status: 'ACTIVE',
    description: 'Berekent dynamische winstmarges, verkoopelasticiteit en automatische kortingscampagnes.',
    color: 'amber',
    icon: <DollarSign className="w-7 h-7 text-amber-400" />
  },
  {
    id: 'ecom_checkout',
    name: 'Checkout Optimizer',
    role: 'Checkout & Conversie',
    status: 'ACTIVE',
    description: 'Verwerkt checkout flows, mollie betalingen en vermindert verlaten winkelwagens.',
    color: 'emerald',
    icon: <CreditCard className="w-7 h-7 text-emerald-400" />
  },
  {
    id: 'ecom_customer_service',
    name: 'CS Closer',
    role: 'Klantenservice Closer',
    status: 'ACTIVE',
    description: 'Beantwoordt automatisch klantvragen, verwerkt retouren en bestellingen.',
    color: 'blue',
    icon: <ShieldAlert className="w-7 h-7 text-blue-400" />
  },
  {
    id: 'ecom_supply_chain',
    name: 'Logistics Coordinator',
    role: 'Supply Chain & Logistics',
    status: 'ACTIVE',
    description: 'Monitoort verzendtijden, levertijden en automatische bestellingen bij leveranciers.',
    color: 'indigo',
    icon: <Truck className="w-7 h-7 text-indigo-400" />
  },
  {
    id: 'ecom_seo',
    name: 'Shop SEO Auditor',
    role: 'Search & GEO Optimizer',
    status: 'ACTIVE',
    description: 'Optimaliseert producttitels, metabeschrijvingen en structured data voor zoekmachines.',
    color: 'violet',
    icon: <Globe className="w-7 h-7 text-violet-400" />
  },
  {
    id: 'ecom_merchandising',
    name: 'Merchandising Agent',
    role: 'Upsell & Cross-sell',
    status: 'ACTIVE',
    description: 'Maakt productbundels, up-sells en visuele presentatie-aanbevelingen.',
    color: 'fuchsia',
    icon: <ShoppingBag className="w-7 h-7 text-fuchsia-400" />
  },
  {
    id: 'ecom_operations',
    name: 'Operations Agent',
    role: 'Ops & Uptime Auditor',
    status: 'ACTIVE',
    description: 'Monitoort webshop operaties, server uptime en synchronisatie statistieken.',
    color: 'rose',
    icon: <Eye className="w-7 h-7 text-rose-400" />
  }
];

export default function AgentsPage() {
  return (
    <div className="space-y-12 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-rose-500/20 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/10 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <Cpu className="w-3 h-3 mr-2" />
                The Swarm
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Autonomous <span className="text-rose-400">Agents</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Je digitale personeelsbestand. Delegeer complexe taken, laat ze op de achtergrond werken, en ontvang meldingen wanneer de klus geklaard is.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors border border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <PlusCircle className="w-5 h-5" />
              Nieuwe Taak
            </button>
          </div>
        </div>
      </div>

      {/* Core Swarm Section */}
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
          Core Swarm (C-Suite)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreAgents.map((agent) => (
            <div key={agent.id} className="glass-cyber rounded-[1.5rem] p-6 flex flex-col border border-white/5 hover:border-rose-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {agent.icon}
                </div>
                <div className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {agent.status}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-black text-white">{agent.name}</h3>
                <p className="text-xs font-mono text-rose-400 uppercase tracking-widest mt-1">{agent.role}</p>
              </div>
              
              <p className="text-sm text-zinc-400 font-light flex-1 mb-6">
                {agent.description}
              </p>

              <div className="flex gap-3 mt-auto">
                <Link href={`/dashboard/agents/${agent.id}`} className="flex-1 py-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all">
                  <MessageSquare className="w-4 h-4" />
                  Chat met {agent.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E-Commerce Copilots Section */}
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
          E-Commerce Copilots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecomAgents.map((agent) => (
            <div key={agent.id} className="glass-cyber rounded-[1.5rem] p-6 flex flex-col border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {agent.icon}
                </div>
                <div className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  {agent.status}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-black text-white">{agent.name}</h3>
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mt-1">{agent.role}</p>
              </div>
              
              <p className="text-sm text-zinc-400 font-light flex-1 mb-6">
                {agent.description}
              </p>

              <div className="flex gap-3 mt-auto">
                <Link href={`/dashboard/agents/${agent.id}`} className="flex-1 py-3 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all">
                  <MessageSquare className="w-4 h-4" />
                  Chat met {agent.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
