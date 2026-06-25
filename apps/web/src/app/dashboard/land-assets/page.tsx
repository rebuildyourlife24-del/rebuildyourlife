'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Map, MapPin, Search, FileSignature, AlertTriangle, Building2, Gavel } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export default function ApexLandPage() {
  const [isScanning, setIsScanning] = useState(true);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f2937] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
               <Map className="w-8 h-8 text-amber-500" />
               Apex Land Acquisition
             </h1>
             <Badge variant="warning" className="animate-pulse tracking-widest text-[10px] text-amber-500 border-amber-500">GLOBAL RADAR ACTIVE</Badge>
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-sm font-mono">
             Fysiek Eigendom // Weesgrond Scanner // Distressed Asset Locator
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Radar / Map Display */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#050505] border border-zinc-800 p-0 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
               {/* Simulated Map Background */}
               <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/86/World_map_blank_black.png')] bg-cover bg-center opacity-30 grayscale invert"></div>
               
               {/* Radar Ping Effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-amber-500/20 rounded-full animate-ping opacity-20"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b]"></div>
               
               {/* Scanning Overlay */}
               <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500/50 shadow-[0_0_10px_#f59e0b] animate-scanline opacity-50"></div>

               <div className="relative z-10 p-6 flex justify-between items-start h-full flex-col">
                 <div className="bg-black/60 border border-zinc-800 p-3 rounded-lg backdrop-blur-md">
                   <div className="flex items-center gap-2">
                     <Search className={`w-4 h-4 ${isScanning ? 'text-amber-500 animate-spin' : 'text-zinc-500'}`} />
                     <span className="text-xs font-mono text-amber-500 uppercase">AI Kadaster Scan (EU/US)</span>
                   </div>
                 </div>

                 <div className="w-full mt-auto">
                   <div className="grid grid-cols-3 gap-4">
                     <div className="bg-black/80 border border-amber-500/30 p-4 rounded-lg backdrop-blur-md">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Targets Found</p>
                       <p className="text-2xl font-bold text-amber-500">14</p>
                     </div>
                     <div className="bg-black/80 border border-zinc-800 p-4 rounded-lg backdrop-blur-md">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total Est. Value</p>
                       <p className="text-2xl font-bold text-white">{formatEur(4250000)}</p>
                     </div>
                     <div className="bg-black/80 border border-zinc-800 p-4 rounded-lg backdrop-blur-md">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Legal Claims Sent</p>
                       <p className="text-2xl font-bold text-white">3</p>
                     </div>
                   </div>
                 </div>
               </div>
            </Card>
          </motion.div>

          {/* Active Targets Table */}
          <motion.div variants={itemVariants}>
            <Card className="bg-black border border-zinc-800 p-0 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                 <h3 className="text-white font-bold uppercase tracking-widest text-sm">Target Lock-On</h3>
                 <Badge variant="outline" className="border-amber-500/30 text-amber-500">HIGH PRIORITY</Badge>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500">
                      <th className="p-4 font-normal">Asset</th>
                      <th className="p-4 font-normal">Type</th>
                      <th className="p-4 font-normal text-right">Est. Value</th>
                      <th className="p-4 font-normal text-right">Acquisition Cost</th>
                      <th className="p-4 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono text-white/80">
                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold" /> Perceel 89 (Weesgrond)
                      </td>
                      <td className="p-4"><span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-[10px]">ORPHAN_LAND</span></td>
                      <td className="p-4 text-right">{formatEur(145000)}</td>
                      <td className="p-4 text-right text-emerald-400 font-bold">{formatEur(2500)} (Leges)</td>
                      <td className="p-4"><Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">CLAIM PENDING</Badge></td>
                    </tr>
                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-500" /> Industriebouw Z-2
                      </td>
                      <td className="p-4"><span className="text-goldLight bg-red-400/10 px-2 py-1 rounded text-[10px]">TAX_LIEN</span></td>
                      <td className="p-4 text-right">{formatEur(850000)}</td>
                      <td className="p-4 text-right text-emerald-400 font-bold">{formatEur(34000)}</td>
                      <td className="p-4"><Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] animate-pulse">TARGET LOCKED</Badge></td>
                    </tr>
                    <tr className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-zinc-500" /> Agrarisch Kavel 12
                      </td>
                      <td className="p-4"><span className="text-zinc-400 bg-zinc-400/10 px-2 py-1 rounded text-[10px]">DISTRESSED</span></td>
                      <td className="p-4 text-right">{formatEur(420000)}</td>
                      <td className="p-4 text-right text-zinc-500 font-bold">Scanning...</td>
                      <td className="p-4"><Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]">SCANNING</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Col: Legal & Automation */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#111827] border border-zinc-800 p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Gavel className="w-32 h-32" />
               </div>
               
               <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2 relative z-10">
                 <FileSignature className="w-4 h-4 text-blue-400" />
                 Legal Automations
               </h3>
               
               <div className="space-y-4 relative z-10">
                 <div className="bg-black/50 p-4 rounded-lg border border-blue-500/30">
                    <p className="text-xs text-blue-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                      Notaris Hub <span className="w-2 h-2 rounded-full bg-success"></span>
                    </p>
                    <p className="text-sm text-zinc-400 mb-4">
                      De AI heeft zojuist een verzoek tot verjaring gestuurd voor Perceel 89. Document AES-256 gehasht.
                    </p>
                    <Button variant="outline" className="w-full text-[10px] uppercase border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                      Bekijk Dossier (PDF)
                    </Button>
                 </div>
               </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
             <Card className="bg-black border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] p-6 text-center">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-amber-500 animate-bounce" />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-sm text-white mb-2">
                  Acquisitie Forceer-Protocol
                </h3>
                <p className="text-xs text-zinc-500 mb-6">
                  Gebruik liquide middelen uit de Treasury Vault om direct openstaande Tax-Liens op te kopen en grond toe te eigenen.
                </p>
                <Button className="w-full font-black tracking-widest uppercase bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
                  FORCEER AANKOOP (AUTO)
                </Button>
             </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
