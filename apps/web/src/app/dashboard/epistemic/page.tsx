import React from 'react';
import { db } from '@/lib/db';
import { Brain, TrendingUp, TrendingDown, Target, Zap, Shield, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function EpistemicGridPage() {
  const verifiedCount = await db.agentKnowledgeBase.count({ where: { type: 'VERIFIED' } });
  const failedCount = await db.agentKnowledgeBase.count({ where: { type: 'FAILURE' } });
  
  // Aggregate stats per domain
  const marketingCount = await db.agentKnowledgeBase.count({ where: { type: 'VERIFIED', domain: 'MARKETING' } });
  const opsCount = await db.agentKnowledgeBase.count({ where: { type: 'VERIFIED', domain: 'OPERATIONS' } });
  const supportCount = await db.agentKnowledgeBase.count({ where: { type: 'VERIFIED', domain: 'SUPPORT' } });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#00f0ff]/30 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00f0ff]/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <Brain className="w-3 h-3 mr-2" />
              Epistemic Core
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            The <span className="text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">Syndicate</span> Brain
          </h1>
          <p className="mt-2 text-lg text-zinc-400 max-w-2xl font-light">
            Dit is het autonome brein van je infrastructuur. Hier consolideert de Raad van Kennis alle succesvolle bedrijfsprocessen in het lange-termijn geheugen. Ruwe data wordt door het systeem verborgen voor veiligheid.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20 flex items-center gap-4 hover:border-[#00f0ff]/50 transition-colors">
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Shield className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono font-bold uppercase tracking-widest">Actieve SOPs (Wetten)</p>
            <p className="text-3xl font-bold text-white">{verifiedCount}</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20 flex items-center gap-4 hover:border-[#00f0ff]/50 transition-colors">
          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono font-bold uppercase tracking-widest">Afgeschoten Strategieën</p>
            <p className="text-3xl font-bold text-white">{failedCount}</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20 flex items-center gap-4 hover:border-[#00f0ff]/50 transition-colors">
          <div className="p-4 bg-[#00f0ff]/10 rounded-xl border border-[#00f0ff]/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Zap className="h-6 w-6 text-[#00f0ff]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono font-bold uppercase tracking-widest">Geheugen Consolidatie</p>
            <p className="text-xl font-bold text-[#00f0ff]">Actief (Nachtelijk)</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Knowledge Domains */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-4">
            <Database className="h-5 w-5 text-[#00f0ff]" /> Kennis Domeinen
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-black/40 border border-white/10 rounded-xl">
              <span className="text-zinc-300 font-bold uppercase tracking-wide text-sm">Marketing & Growth</span>
              <span className="text-[#00f0ff] font-mono font-bold">{marketingCount} Regels</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-black/40 border border-white/10 rounded-xl">
              <span className="text-zinc-300 font-bold uppercase tracking-wide text-sm">Operations & Supply</span>
              <span className="text-[#00f0ff] font-mono font-bold">{opsCount} Regels</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-black/40 border border-white/10 rounded-xl">
              <span className="text-zinc-300 font-bold uppercase tracking-wide text-sm">Support & Retention</span>
              <span className="text-[#00f0ff] font-mono font-bold">{supportCount} Regels</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="space-y-4">
           <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-4">
            <Shield className="h-5 w-5 text-zinc-500" /> Systeem Beveiliging
          </h2>
          
          <div className="p-6 bg-black/60 border border-[#d4af37]/20 rounded-[1.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
             <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
               Voor veiligheidsredenen wordt de inhoud van specifieke SOPs en bedrijfsregels niet langer in plain-text op het dashboard weergegeven. 
               <br/><br/>
               De Panopticon Observer verwerkt deze data intern via de RAG (Retrieval-Augmented Generation) engine tijdens het besluitvormingsproces.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
