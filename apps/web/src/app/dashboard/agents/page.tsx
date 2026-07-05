import { Card } from '@/components/ui/Card';
import { Bot, Cpu, Zap, Activity, MessageSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const swarmAgents = [
  {
    id: 'hermes',
    name: 'Hermes',
    role: 'Persoonlijk Assistent & Researcher',
    status: 'ACTIVE',
    tasks: 3,
    description: 'Jouw rechterhand. Kan het hele platform bedienen, content onderzoeken en vragen beantwoorden.',
    color: 'emerald'
  },
  {
    id: 'cmo-agent',
    name: 'Atlas',
    role: 'Chief Marketing Officer',
    status: 'SLEEPING',
    tasks: 0,
    description: 'Schrijft ad copy, analyseert conversies en stuurt cold email campagnes uit.',
    color: 'blue'
  },
  {
    id: 'data-agent',
    name: 'Midas',
    role: 'Financial Analyst',
    status: 'SLEEPING',
    tasks: 0,
    description: 'Bewaaakt je P&L, voorspelt cashflow en signaleert onrendabele adsets.',
    color: 'amber'
  }
];

export default function AgentsPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      
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

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {swarmAgents.map((agent) => (
          <div key={agent.id} className={`glass-cyber rounded-[1.5rem] p-6 flex flex-col border border-white/5 hover:border-${agent.color}-500/30 transition-all group`}>
            
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-${agent.color}-500/10 border border-${agent.color}-500/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Bot className={`w-7 h-7 text-${agent.color}-400`} />
              </div>
              
              <div className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 ${
                agent.status === 'ACTIVE' 
                  ? `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
                  : `bg-zinc-800 text-zinc-400 border border-zinc-700`
              }`}>
                {agent.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                {agent.status}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-black text-white">{agent.name}</h3>
              <p className={`text-xs font-mono text-${agent.color}-400 uppercase tracking-widest mt-1`}>{agent.role}</p>
            </div>
            
            <p className="text-sm text-zinc-400 font-light flex-1 mb-6">
              {agent.description}
            </p>

            <div className="flex gap-3 mt-auto">
              {/* If active, show chat. Else wake up. */}
              {agent.status === 'ACTIVE' ? (
                <Link href={`/dashboard/agents/${agent.id}`} className={`flex-1 py-3 bg-${agent.color}-500/10 hover:bg-${agent.color}-500/20 text-${agent.color}-400 border border-${agent.color}-500/30 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors`}>
                  <MessageSquare className="w-4 h-4" />
                  Chat met {agent.name}
                </Link>
              ) : (
                <Link href={`/dashboard/agents/${agent.id}`} className={`flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors`}>
                  <Zap className="w-4 h-4" />
                  Wake Up
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Add Custom Agent Slot */}
        <div className="glass-cyber rounded-[1.5rem] p-6 flex flex-col items-center justify-center border border-white/10 border-dashed hover:border-white/30 hover:bg-white/5 cursor-pointer transition-all min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <PlusCircle className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Bouw Custom Agent</h3>
          <p className="text-sm text-zinc-500 text-center px-4">
            Ontgrendel de API om een specifieke agent te trainen op jouw unieke bedrijfsdata.
          </p>
          <span className="mt-4 text-[10px] bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-mono uppercase tracking-widest">
            Level 10 Required
          </span>
        </div>
      </div>
      
    </div>
  );
}
