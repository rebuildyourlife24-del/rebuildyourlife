'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield, Activity, Skull, Globe2, TrendingUp, Building2, BrainCircuit, Crosshair, ChevronDown, Mic } from 'lucide-react';
import { getFranchises } from '@/actions/franchise';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';
import { SpaceBackground } from '@/components/ui/SpaceBackground';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export default function WarRoomRedPage() {
  const [revenue, setRevenue] = useState(45900);
  const [simulationActive, setSimulationActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string | null>(null);

  // Load Franchises
  useEffect(() => {
    async function loadFranchises() {
      const data = await getFranchises();
      setFranchises(data);
      if (data.length > 0) {
        setSelectedFranchiseId(data[0].id);
      }
    }
    loadFranchises();
  }, []);

  // High-Ticket Simulation
  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      const ticketSizes = [1499, 2450, 890, 5000, 320];
      const newSale = ticketSizes[Math.floor(Math.random() * ticketSizes.length)];
      setRevenue(prev => prev + newSale);
    }, 2500);
    return () => clearInterval(interval);
  }, [simulationActive]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto min-h-[85vh] flex flex-col font-mono relative"
    >
      <SpaceBackground theme="red" intensity="calm" />

      {/* Header - Agressieve Stijl */}
      <div className="flex justify-between items-center pb-4 mb-8 relative z-20 mt-4">
        {/* Deep Red Edge Lighting */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-transparent blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-6 px-4">
           <div className="w-12 h-12 bg-red-950/40 backdrop-blur-md border-t border-red-500/40 border-l border-red-500/20 shadow-[inset_0_0_20px_rgba(220,38,38,0.3),0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center rounded-xl">
             <Skull className="w-7 h-7 text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse" />
           </div>
           <div>
             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-red-400 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
               THE WAR ROOM
             </h1>
             <p className="text-red-500 uppercase tracking-[0.3em] text-[10px] font-bold mt-1 flex items-center gap-2">
               System Mode: GODBRAIN EMPIRE
             </p>
           </div>
        </div>
        <div className="text-right flex items-center gap-4 px-4">
          <Badge variant="outline" className="rounded-none border-red-500 text-red-500 bg-red-950/40 backdrop-blur-xl tracking-widest font-black px-6 py-2 shadow-[inset_0_0_15px_rgba(220,38,38,0.4),0_0_20px_rgba(220,38,38,0.6)]">
            ! DEFCON 1 !
          </Badge>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-4 pb-8">
        
        {/* LEFT COLUMN: THE MARKET & SYNDICATE */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-red-950/20 backdrop-blur-3xl border-t border-red-500/50 border-l border-red-500/20 border-b border-black border-r border-black p-6 flex flex-col relative overflow-hidden shadow-[inset_0_0_80px_rgba(220,38,38,0.15),0_20px_40px_rgba(0,0,0,0.9)] rounded-none group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <h3 className="text-red-500 uppercase tracking-widest text-[10px] font-black mb-6 flex items-center gap-2 border-b border-red-900 pb-3">
                <TrendingUp className="w-4 h-4" /> QUANTUM TREASURY VAULT
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="text-center bg-black/60 p-6 border border-red-900/50 rounded-xl relative overflow-hidden group-hover:border-red-500/50 transition-colors shadow-[0_0_30px_rgba(220,38,38,0.1)]">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(220,38,38,0.05)_3px,rgba(220,38,38,0.05)_3px)] pointer-events-none"></div>
                  <div className="text-[10px] text-red-500/70 font-bold uppercase mb-2 tracking-widest">Total Liquid Capital</div>
                  {/* Gloeiende LED Cijfers */}
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-red-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    € 142.850<span className="text-xl text-red-500/80">,00</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-red-900/30 pb-2">
                  <div>
                    <div className="text-[10px] text-red-500/70 font-bold uppercase mb-1">Opportunity Engine Payouts</div>
                    <div className="text-xl font-bold text-red-100 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">€ 4.250,00</div>
                  </div>
                  <div className="text-red-500 text-[10px] font-bold bg-red-950 px-2 py-1 border border-red-900 rounded shadow-[inset_0_0_10px_rgba(220,38,38,0.2)]">Pending: € 850</div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div>
                    <div className="text-[10px] text-red-500/70 font-bold uppercase mb-1">Active AI Burn Rate</div>
                    <div className="text-lg font-bold text-red-300">€ 845,00</div>
                  </div>
                  <div className="text-red-500 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Optimal
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border-t border-red-500/50 border-l border-red-500/20 border-b border-black border-r border-black p-6 flex flex-col relative overflow-hidden shadow-[inset_0_0_60px_rgba(220,38,38,0.1),0_20px_40px_rgba(0,0,0,0.8)] rounded-none group" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-red-500 uppercase tracking-[0.2em] text-[10px] font-black mb-6 flex items-center gap-2 border-b border-red-900/50 pb-3">
                <Shield className="w-4 h-4" /> SYNDICATE OPS
              </h3>
              <div className="space-y-4 font-mono text-xs border-l border-red-900/50 pl-4">
                <div className="text-red-300"><span className="font-bold text-white">[IP]</span> Claim ingediend (USA).</div>
                <div className="text-red-300"><span className="font-bold text-white">[TAX]</span> Routed €24K -&gt; Dubai.</div>
                <div className="text-red-300"><span className="font-bold text-white">[DATA]</span> Churn Report SOLD.</div>
                <div className="text-red-500 font-bold bg-red-950/50 inline-block px-2 py-1 mt-2 border border-red-800/50">
                  [SEC] DDoS BLOCKED.
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* CENTER COLUMN: ORION SWARM */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[600px]">
          {/* Target Crosshairs Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-600/10 rounded-full pointer-events-none"></div>
          
          <div className="absolute w-full h-px bg-red-600/30 top-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute h-full w-px bg-red-600/30 left-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 rounded-full border-2 border-red-600/30 border-dashed pointer-events-none z-20"
             />
             <div className="absolute inset-8 z-10 rounded-full overflow-hidden border-2 border-red-500/40 shadow-[0_0_100px_rgba(220,38,38,0.3),inset_0_0_50px_rgba(220,38,38,0.2)] bg-black/40 backdrop-blur-xl">
                <NeuralSwarm theme="red" />
             </div>
             
             {/* HUD Overlays */}
             <div className="absolute top-0 right-0 text-red-500 font-mono text-[8px] opacity-50">TARGET ACQUIRED</div>
             <div className="absolute bottom-0 left-0 text-red-500 font-mono text-[8px] opacity-50">SYS.ON</div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREDICTIONS & PHYSICAL ASSETS */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border-t border-red-500/50 border-l border-red-500/20 border-b border-black border-r border-black p-0 flex flex-col relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_0_60px_rgba(220,38,38,0.1)] rounded-none group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
              
              <h3 className="text-white uppercase tracking-widest text-[10px] font-black m-6 mb-4 flex items-center gap-2 border-b border-red-600 pb-3">
                <Crosshair className="w-4 h-4 text-red-500 animate-pulse" /> THE TARGET SCANNER
              </h3>
              
              {/* Matrix Waterfall List */}
              <div className="relative h-[200px] overflow-hidden bg-black/80 border-y border-red-900/50 mx-4 mb-6 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]">
                {/* Moving scanline */}
                <motion.div 
                  className="absolute w-full h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] z-20 opacity-80"
                  animate={{ y: [0, 200, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="space-y-0.5 relative z-10 px-2 py-2">
                  <div className="flex justify-between items-center bg-red-950/80 border border-red-500 px-3 py-2">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">[LOCKED] Flevoland Sector 4A</span>
                    <span className="text-red-500 text-[9px] font-black animate-pulse">ROI: +14%</span>
                  </div>
                  <div className="flex justify-between items-center opacity-60 px-3 py-1.5">
                    <span className="text-white text-[9px] font-mono uppercase tracking-wider">MKB Lead: KPN Dossier</span>
                    <span className="text-zinc-500 text-[8px] font-black">SCANNING...</span>
                  </div>
                  <div className="flex justify-between items-center opacity-40 px-3 py-1.5">
                    <span className="text-white text-[9px] font-mono uppercase tracking-wider">E-Com Acquisition #119</span>
                    <span className="text-zinc-500 text-[8px] font-black">SCANNING...</span>
                  </div>
                  <div className="flex justify-between items-center opacity-20 px-3 py-1.5">
                    <span className="text-white text-[9px] font-mono uppercase tracking-wider">Freelance API Project</span>
                    <span className="text-zinc-500 text-[8px] font-black">SCANNING...</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border-t border-red-500/50 border-l border-red-500/20 border-b border-black border-r border-black p-6 flex flex-col relative overflow-hidden shadow-[inset_0_0_60px_rgba(220,38,38,0.1),0_20px_40px_rgba(0,0,0,0.8)] rounded-none group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-red-500 uppercase tracking-widest text-[10px] font-black mb-6 flex items-center gap-2 border-b border-red-900 pb-3">
                <Building2 className="w-4 h-4" /> CAT: PHYSICAL ASSETS
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-3 border border-red-900/30">
                  <div>
                    <div className="text-white font-bold text-sm">Dubai Real Estate Fund</div>
                    <div className="text-red-500/70 text-[10px]">Syndicate Pool Alpha</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 font-black">€ 2.5M</div>
                    <div className="text-[10px] text-emerald-500/50">+15% YTD</div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-3 border border-red-900/30">
                  <div>
                    <div className="text-white font-bold text-sm">E-Com Holding BV</div>
                    <div className="text-red-500/70 text-[10px]">3 Active Brands</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 font-black">€ 850K</div>
                    <div className="text-[10px] text-emerald-500/50">Stable</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
