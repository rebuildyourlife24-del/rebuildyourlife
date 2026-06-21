'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRequireAuth } from '@/lib/auth';
import { Shield, Sparkles, TrendingUp, CalendarDays, Activity, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function DashboardPage() {
  const { user } = useRequireAuth();
  
  // Huidige fase van de gebruiker (vanuit de database via de auth context)
  const currentPhase = (user as any)?.phase || (user as any)?.clearanceLevel || 1;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 max-w-7xl mx-auto pb-20"
    >
      {/* The Holographic AI Concierge */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-black/80 shadow-[0_0_60px_rgba(212,168,83,0.15)] p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/20 via-black to-black opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full border-2 border-gold flex items-center justify-center bg-black/50 shadow-[0_0_30px_rgba(212,168,83,0.5)]">
              <Sparkles className="w-10 h-10 text-gold animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                Welkom terug, <span className="text-gold">{user?.firstName || 'Eigenaar'}</span>.
              </h1>
              <p className="mt-3 text-lg text-textSecondary max-w-2xl">
                "Het Masterplan is geactiveerd. Je bevindt je momenteel in <strong className="text-white">Fase {currentPhase}</strong>. Voltooi je wekelijkse doelen om de volgende fase van financiële dominantie te ontgrendelen."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Het Masterplan (De 4 Fasen) */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
          <TrendingUp className="text-gold" />
          Het Masterplan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Lijn die de fases verbindt (zichtbaar op grotere schermen) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#1f2937] -translate-y-1/2 z-0">
             <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${(currentPhase / 4) * 100}%` }}></div>
          </div>

          {/* Fase 1 */}
          <Card className={`relative z-10 p-6 border-2 transition-all duration-300 ${currentPhase >= 1 ? 'border-gold bg-[#111827]' : 'border-[#374151] bg-[#0a0e1a]'}`}>
            <div className="flex justify-between items-start mb-4">
               <span className={`text-3xl font-black ${currentPhase >= 1 ? 'text-gold' : 'text-[#374151]'}`}>01</span>
               {currentPhase > 1 ? <CheckCircle2 className="text-success" /> : currentPhase === 1 ? <span className="animate-pulse w-3 h-3 bg-gold rounded-full"></span> : <Lock className="text-[#374151]" />}
            </div>
            <h3 className="font-bold text-white uppercase mb-2">Fundament</h3>
            <p className="text-xs text-textSecondary mb-4">Bank koppelen, schulden in kaart brengen en het VTLB optimaliseren.</p>
            <div className="w-full bg-[#1f2937] h-2 rounded-full overflow-hidden">
               <div className="bg-gold h-full w-[80%]"></div>
            </div>
          </Card>

          {/* Fase 2 */}
          <Card className={`relative z-10 p-6 border-2 transition-all duration-300 ${currentPhase >= 2 ? 'border-gold bg-[#111827]' : 'border-[#374151] bg-[#0a0e1a]'}`}>
             <div className="flex justify-between items-start mb-4">
               <span className={`text-3xl font-black ${currentPhase >= 2 ? 'text-gold' : 'text-[#374151]'}`}>02</span>
               {currentPhase > 2 ? <CheckCircle2 className="text-success" /> : currentPhase === 2 ? <span className="animate-pulse w-3 h-3 bg-gold rounded-full"></span> : <Lock className="text-[#374151]" />}
            </div>
            <h3 className="font-bold text-white uppercase mb-2">Levensbalans</h3>
            <p className="text-xs text-textSecondary mb-4">Vitaliteit verhogen, netwerk opschonen en mentale weerbaarheid trainen.</p>
            {currentPhase < 2 && <Button variant="outline" size="sm" className="w-full mt-2 text-xs" disabled>Binnenkort</Button>}
          </Card>

          {/* Fase 3 */}
          <Card className={`relative z-10 p-6 border-2 transition-all duration-300 ${currentPhase >= 3 ? 'border-gold bg-[#111827]' : 'border-[#374151] bg-[#0a0e1a]'}`}>
             <div className="flex justify-between items-start mb-4">
               <span className={`text-3xl font-black ${currentPhase >= 3 ? 'text-gold' : 'text-[#374151]'}`}>03</span>
               {currentPhase > 3 ? <CheckCircle2 className="text-success" /> : currentPhase === 3 ? <span className="animate-pulse w-3 h-3 bg-gold rounded-full"></span> : <Lock className="text-[#374151]" />}
            </div>
            <h3 className="font-bold text-white uppercase mb-2">Opportunity Engine</h3>
            <p className="text-xs text-textSecondary mb-4">Toewijzing van je eerste AI-gestuurde webshop (Franchise) voor live inkomsten.</p>
            {currentPhase < 3 && <Button variant="outline" size="sm" className="w-full mt-2 text-xs" disabled>Binnenkort</Button>}
          </Card>

          {/* Fase 4 */}
          <Card className={`relative z-10 p-6 border-2 transition-all duration-300 ${currentPhase >= 4 ? 'border-gold bg-[#111827]' : 'border-[#374151] bg-[#0a0e1a]'}`}>
             <div className="flex justify-between items-start mb-4">
               <span className={`text-3xl font-black ${currentPhase >= 4 ? 'text-gold' : 'text-[#374151]'}`}>04</span>
               {currentPhase === 4 ? <span className="animate-pulse w-3 h-3 bg-gold rounded-full"></span> : <Lock className="text-[#374151]" />}
            </div>
            <h3 className="font-bold text-white uppercase mb-2">The Enterprise</h3>
            <p className="text-xs text-textSecondary mb-4">Volledige toegang tot het Enterprise OS, investeren in vastgoed en opschalen.</p>
            {currentPhase < 4 && <Button variant="outline" size="sm" className="w-full mt-2 text-xs" disabled>Binnenkort</Button>}
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Acties & Bank Koppeling */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-[#050505] border border-gold/20 shadow-[0_0_40px_rgba(212,168,83,0.05)]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white uppercase tracking-widest">Actie Vereist</h3>
               <Badge variant="warning" className="animate-pulse">URGENT</Badge>
            </div>
            
            <div className="bg-[#111827] border border-gold/40 rounded-xl p-6">
               <h4 className="text-white font-bold mb-2">Stap 1: Bank Koppelen (PSD2)</h4>
               <p className="text-sm text-textSecondary mb-6">Om de AI je financiën te laten beheren en onnodige incassokosten te blokkeren, moet het systeem inzicht hebben in je cashflow.</p>
               <Button className="w-full bg-gold hover:bg-[#b0893a] text-black font-bold uppercase tracking-widest">
                 Verbind via Mollie / Nordigen
               </Button>
            </div>
          </Card>

          {/* Live Progress Tracker */}
          <Card className="p-8 bg-[#0a0e1a] border border-[#1f2937]">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Voortgang & Voorspelling</h3>
            
            <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-[#1f2937] pb-2">
                 <span className="text-sm text-textSecondary">Huidige Maandelijkse Vaste Lasten</span>
                 <span className="text-xl font-mono text-white">WACHTEN OP BANK</span>
               </div>
               <div className="flex justify-between items-end border-b border-[#1f2937] pb-2">
                 <span className="text-sm text-textSecondary">Voorspelde Winst (Opportunity Engine)</span>
                 <span className="text-xl font-mono text-gold opacity-50">LOCKED (Fase 3)</span>
               </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Coaches / Zijbalk */}
        <motion.div variants={itemVariants} className="space-y-8">
          <Card className="p-6 bg-[#0a0a0a] border border-gold/30">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-gold" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Actieve Systemen</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="font-medium text-white text-sm">Debt Negotiator AI</div>
                <div className="text-xs font-bold text-success uppercase animate-pulse">Scanning</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="font-medium text-white text-sm">Contract Generator</div>
                <div className="text-xs font-bold text-textSecondary uppercase">Standby</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#111] to-black border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-2 uppercase">De Directiekamer</h3>
            <p className="text-textSecondary text-sm mb-6">Heb je vragen over het masterplan? Jouw AI-coaches wachten op je instructies.</p>
            <Link href="/dashboard/ai-team">
              <Button className="w-full bg-[#1f2937] hover:bg-[#374151] text-white font-bold uppercase tracking-widest">
                Spreek met AI
              </Button>
            </Link>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
