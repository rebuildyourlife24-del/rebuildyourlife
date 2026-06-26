'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { ShoppingCart, Target, Activity, CheckCircle2, Globe2 } from 'lucide-react';
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

export default function OperationsPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loadingOps, setLoadingOps] = useState(true);

  useEffect(() => {
    async function loadOps() {
      try {
        const res = await fetch('/api/opportunities');
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data);
        }
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoadingOps(false);
      }
    }
    loadOps();
  }, []);

  const handleAcceptOp = async (id: string) => {
    try {
      const res = await fetch(`/api/opportunities/${id}/accept`, {
        method: 'POST',
      });
      if (res.ok) {
        // Remove from list or show as 'Bezig'
        setOpportunities(prev => prev.filter(op => op.id !== id));
        alert('Opdracht succesvol geaccepteerd! Check je notificaties/takenlijst.');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Failed to accept'}`);
      }
    } catch (err) {
      alert('Network error while accepting task.');
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto min-h-[85vh] flex flex-col font-sans relative z-10"
    >
      <SpaceBackground theme="blue" intensity="calm" />

      {/* Header - Liquid Glass */}
      <div className="flex justify-between items-center pb-6 mb-8 relative z-20 mt-4">
        {/* Advanced Glass Edge Lighting for Header */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4 px-4">
           <div className="w-12 h-12 bg-cyan-950/40 backdrop-blur-md border-t border-cyan-300/40 border-l border-cyan-300/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.2),0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center rounded-xl">
             <Activity className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
           </div>
           <div>
             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 tracking-tighter uppercase drop-shadow-lg">
               OPERATIONS & EARNING
             </h1>
             <p className="text-cyan-400 uppercase tracking-[0.3em] text-[10px] font-bold mt-1 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
               System Mode: ACTIVE HUSTLE
             </p>
           </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20 px-4 pb-8">

        {/* LEFT COLUMN: E-COM & HUSTLE */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-cyan-950/10 backdrop-blur-2xl border-t border-cyan-300/30 border-l border-cyan-400/10 border-b border-black/50 border-r border-black/50 p-8 flex flex-col relative overflow-hidden shadow-[inset_0_0_50px_rgba(34,211,238,0.03),0_10px_30px_rgba(0,0,0,0.5)] rounded-3xl group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-cyan-300 uppercase tracking-widest text-[10px] font-black mb-6 flex items-center gap-3 border-b border-cyan-900/50 pb-3">
                <ShoppingCart className="w-5 h-5" /> WEBSHOPS & E-COM
              </h3>
              
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl border border-cyan-900/50">
                  <div className="flex justify-between text-white text-sm font-bold mb-2">
                    <span>Apex Auto Accessoires</span>
                    <span className="text-cyan-400">€2.450</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-cyan-600 uppercase font-bold">
                    <span>Orders: 42</span>
                    <span>Support: AI Handled</span>
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-cyan-900/50">
                  <div className="flex justify-between text-white text-sm font-bold mb-2">
                    <span>Luxe Horloges FR</span>
                    <span className="text-cyan-400">€890</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-cyan-600 uppercase font-bold">
                    <span>Orders: 12</span>
                    <span className="text-yellow-500">Refunds: 1 (Manual)</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-cyan-950/10 backdrop-blur-2xl border-t border-cyan-300/30 border-l border-cyan-400/10 border-b border-black/50 border-r border-black/50 p-0 flex flex-col relative overflow-hidden shadow-[inset_0_0_50px_rgba(34,211,238,0.03),0_10px_30px_rgba(0,0,0,0.5)] rounded-3xl group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-cyan-300 uppercase tracking-widest text-[10px] font-black m-6 mb-2 flex items-center gap-3 border-b border-cyan-900/50 pb-3">
                <Globe2 className="w-5 h-5 text-cyan-400 animate-pulse" /> THE GLOBAL RADAR
              </h3>
              
              <div className="relative flex-1 min-h-[180px] bg-black/50 border-y border-cyan-900/30 overflow-hidden flex items-center justify-center">
                {/* Simulated 3D Globe Radar Map */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]"></div>
                <div className="w-[140px] h-[140px] border-2 border-cyan-500/20 rounded-full relative animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-gradient-to-t from-cyan-400/80 to-transparent origin-bottom animate-[spin_4s_linear_infinite]"></div>
                  {/* Ping 1 */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,113,1)] animate-ping"></div>
                  {/* Ping 2 */}
                  <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
                </div>
                
                <div className="absolute bottom-2 left-4 text-[8px] font-mono text-cyan-500/70 uppercase">
                  <div>[SCANNING] Global Opportunities...</div>
                  <div className="text-emerald-400">PING: High-Ticket Lead (Amsterdam)</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* CENTER COLUMN: ORION (BLUE MODE) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[600px] z-10">
          <div className="absolute inset-4 z-10 rounded-full overflow-hidden shadow-[0_0_150px_rgba(34,211,238,0.15)] bg-black/20 backdrop-blur-md border border-cyan-500/30 mix-blend-screen flex items-center justify-center">
            <NeuralSwarm theme="blue" />
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border-t border-cyan-400/50 border-b border-cyan-900/50 px-8 py-3 rounded-full text-[10px] text-cyan-300 font-black tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.2)] z-30 uppercase flex items-center gap-3">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
            Orion Prime: Logic Sync
          </div>
        </div>

        {/* RIGHT COLUMN: OPPORTUNITY ENGINE */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-cyan-950/10 backdrop-blur-3xl border-t border-cyan-300/40 border-l border-cyan-400/20 border-b border-black/50 border-r border-black/50 p-8 flex flex-col relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_60px_rgba(34,211,238,0.05)] rounded-3xl group">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,211,238,0.02)_50%,transparent_75%)] bg-[length:20px_20px] pointer-events-none mix-blend-screen"></div>
              
              <div className="flex justify-between items-center mb-6 border-b border-cyan-400/50 pb-3">
                <h3 className="text-cyan-300 uppercase tracking-widest text-[10px] font-black flex items-center gap-3">
                  <Target className="w-5 h-5 text-white" /> THE OPPORTUNITY ENGINE
                </h3>
                <span className="text-[9px] text-white bg-cyan-600 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Werkopdrachten</span>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingOps ? (
                  <div className="text-cyan-500 text-center text-xs font-mono py-8 animate-pulse">
                    LOADING SECURE OPPORTUNITIES...
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-cyan-500/50 text-center text-xs font-mono py-8">
                    NO ACTIVE OPPORTUNITIES AVAILABLE.
                  </div>
                ) : (
                  opportunities.map(op => (
                    <div key={op.id} className="bg-cyan-950/80 p-4 rounded-xl border border-cyan-500/30 hover:bg-cyan-900/80 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-white text-sm font-bold uppercase block mb-1">{op.title}</span>
                          <span className="text-[10px] font-mono text-cyan-300 block">{op.description}</span>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="text-white bg-emerald-600/80 px-3 py-1 rounded text-xs font-black tracking-wider block mb-1">
                            €{op.payout}
                          </span>
                          <span className="text-[9px] font-mono text-cyan-400 uppercase">Cat: {op.category}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAcceptOp(op.id)}
                        className="w-full mt-2 py-2 bg-cyan-900/50 border border-cyan-500/50 text-cyan-300 text-[10px] uppercase font-black tracking-widest hover:bg-cyan-800 transition-colors rounded"
                      >
                        ACCEPTEER OPDRACHT
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
