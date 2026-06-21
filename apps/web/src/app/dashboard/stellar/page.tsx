'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Rocket, Satellite, Radio, Globe, ShieldCheck, Cpu } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export default function StellarPage() {
  const [activeTab, setActiveTab] = useState<'ORBIT' | 'COMMS' | 'AEROSPACE'>('ORBIT');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-indigo-900/30 pb-6 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-900/10 to-transparent pointer-events-none blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
               <Rocket className="w-8 h-8 text-indigo-400 animate-pulse" />
               Stellar Ascension
             </h1>
             <Badge variant="outline" className="tracking-widest text-[10px] text-indigo-400 border-indigo-400/50 bg-indigo-400/10">LIFT-OFF COMPLETE</Badge>
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-sm font-mono flex items-center gap-2">
             <Globe className="w-4 h-4 text-zinc-600" /> Exo-Atmospheric Operations & Data Vaults
          </p>
        </div>
        
        {/* Stellar Nav */}
        <div className="flex items-center gap-2 bg-black border border-indigo-900/30 p-1.5 rounded-xl relative z-10">
          <button 
            onClick={() => setActiveTab('ORBIT')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'ORBIT' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Orbital Vaults
          </button>
          <button 
            onClick={() => setActiveTab('COMMS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'COMMS' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Black Sky Network
          </button>
          <button 
            onClick={() => setActiveTab('AEROSPACE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'AEROSPACE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Aerospace Assets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Display Area (Dynamic based on Tab) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} key={activeTab}>
            
            {/* ORBITAL VAULTS TAB */}
            {activeTab === 'ORBIT' && (
              <Card className="bg-[#050505] border border-indigo-900/50 p-0 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-indigo-900/30 bg-gradient-to-r from-indigo-900/20 to-transparent flex justify-between items-center">
                   <div>
                     <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                       <Satellite className="w-5 h-5 text-indigo-400" /> Low-Earth Orbit Vaults
                     </h2>
                     <p className="text-xs text-zinc-500 font-mono mt-1">Cold-storage crypto & legal keys stored in space.</p>
                   </div>
                   <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 animate-pulse">2 NODES ACTIVE</Badge>
                </div>
                
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black text-[10px] uppercase tracking-widest text-zinc-500">
                        <th className="p-4 font-normal">Node ID</th>
                        <th className="p-4 font-normal">Orbit</th>
                        <th className="p-4 font-normal">Stored Data</th>
                        <th className="p-4 font-normal text-right">Uplink</th>
                        <th className="p-4 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-mono text-white/80">
                      <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4 font-bold text-white">BLOCKSTREAM-4</td>
                        <td className="p-4"><span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded text-[10px]">GEO</span></td>
                        <td className="p-4 text-xs">Treasury Cold Wallet Seeds (BTC)</td>
                        <td className="p-4 text-right">14.2 Mbps</td>
                        <td className="p-4 text-right text-emerald-400 font-bold">ONLINE</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4 font-bold text-white">ORION-LEO-1</td>
                        <td className="p-4"><span className="text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded text-[10px]">LEO</span></td>
                        <td className="p-4 text-xs">Apex Land Acquisition Deeds</td>
                        <td className="p-4 text-right">85.0 Mbps</td>
                        <td className="p-4 text-right text-emerald-400 font-bold">ONLINE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-black/40 border-t border-zinc-800 flex justify-between items-center">
                   <p className="text-xs text-zinc-500 font-mono">System immune to terrestrial jurisdiction and EMPs.</p>
                   <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest">
                     BEAM NEW DATA
                   </Button>
                </div>
              </Card>
            )}

            {/* BLACK SKY NETWORK TAB */}
            {activeTab === 'COMMS' && (
              <Card className="bg-[#050505] border border-cyan-900/50 p-0 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-cyan-900/30 bg-gradient-to-r from-cyan-900/20 to-transparent flex justify-between items-center">
                   <div>
                     <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                       <Radio className="w-5 h-5 text-cyan-500" /> Black Sky Network
                     </h2>
                     <p className="text-xs text-zinc-500 font-mono mt-1">Decentralized, uncensorable orbital communications.</p>
                   </div>
                   <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">ROUTING SECURE</Badge>
                </div>
                
                <div className="p-6">
                  {/* Radar/Comms UI */}
                  <div className="relative w-full h-[250px] bg-black border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                     
                     {/* Expanding Radar Rings */}
                     <div className="absolute w-24 h-24 border border-cyan-500/20 rounded-full animate-ping"></div>
                     <div className="absolute w-48 h-48 border border-cyan-500/10 rounded-full"></div>
                     <div className="absolute w-72 h-72 border border-cyan-500/5 rounded-full"></div>
                     
                     <div className="text-center relative z-10">
                        <Globe className="w-16 h-16 text-cyan-500 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-white font-black uppercase tracking-widest text-lg">God Mode Uplink</h3>
                        <p className="text-cyan-400 text-xs font-mono mt-2">Routing through STARLINK-892A (Latency: 24ms)</p>
                     </div>
                  </div>

                  <div className="mt-6 bg-cyan-900/10 border border-cyan-500/30 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Terrestrial Firewall Status</p>
                      <p className="text-sm font-mono text-emerald-400 font-bold mt-1 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Bypassed (100% Independence)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* AEROSPACE ASSETS TAB */}
            {activeTab === 'AEROSPACE' && (
              <Card className="bg-[#050505] border border-amber-900/50 p-0 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-amber-900/30 bg-gradient-to-r from-amber-900/20 to-transparent flex justify-between items-center">
                   <div>
                     <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                       <Cpu className="w-5 h-5 text-amber-500" /> Aerospace Intelligence
                     </h2>
                     <p className="text-xs text-zinc-500 font-mono mt-1">Deep-space mining speculation and private spaceflight equity.</p>
                   </div>
                   <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">1 CLAIM TRACKED</Badge>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-amber-500/30 transition-colors">
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Asteroid 16 Psyche (Iron/Nickel)</h4>
                      <p className="text-xs text-zinc-500 font-mono">Type: SPECULATIVE_CLAIM | Risk: EXTREME</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Est. Future Yield</p>
                      <p className="text-emerald-400 font-mono font-bold">€ 1.2B+</p>
                    </div>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs ml-4 uppercase">
                      ALLOCATE FUNDS
                    </Button>
                  </div>

                  <div className="bg-black border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-amber-500/30 transition-colors opacity-50">
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">SpaceX Private Equity (Pre-IPO)</h4>
                      <p className="text-xs text-zinc-500 font-mono">Type: EQUITY | Risk: MODERATE</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Allocation</p>
                      <p className="text-zinc-400 font-mono font-bold">Searching Markets...</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

          </motion.div>
        </div>

        {/* Right Col: Operations Log */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#111827] border border-zinc-800 p-6 relative overflow-hidden min-h-[400px]">
               <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2 relative z-10">
                 <Rocket className="w-4 h-4 text-zinc-400" />
                 Ascension Logs
               </h3>
               
               <div className="space-y-3 relative z-10 font-mono text-xs">
                 <div className="bg-black/50 p-3 rounded border border-zinc-800/50 text-zinc-400">
                    <span className="text-indigo-400">[ORBIT]</span> Syncing Vault #1 with LEO Node. Encrypted AES-256.
                 </div>
                 <div className="bg-black/50 p-3 rounded border border-zinc-800/50 text-emerald-400 font-bold">
                    <span className="text-indigo-400">[ORBIT]</span> Sync Complete. Treasury is now untouchable.
                 </div>
                 <div className="bg-black/50 p-3 rounded border border-zinc-800/50 text-zinc-400">
                    <span className="text-cyan-400">[COMMS]</span> Terrestrial connection dropped. Rerouting via orbital relay...
                 </div>
                 <div className="bg-black/50 p-3 rounded border border-zinc-800/50 text-zinc-400">
                    <span className="text-amber-400">[AERO]</span> Analyzing orbital trajectories for Asteroid 16 Psyche mining expedition.
                 </div>
               </div>

               {/* Scanning Overlay */}
               <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent animate-scanline pointer-events-none"></div>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
