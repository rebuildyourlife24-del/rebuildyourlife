'use client';

import { motion } from 'framer-motion';
import { Shield, Target, Zap, ChevronRight, Lock, Activity, Command } from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function AuthoritativeLandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-gold/30 selection:text-white font-sans overflow-x-hidden">
      {/* Premium subtle background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0)_60%)]"></div>
        {/* Lichte noise voor textuur (subtiel) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation - Ultra minimal */}
        <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#fceeb5] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Command className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-bold tracking-widest text-sm uppercase">The Sovereign Grid</span>
          </div>
          <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors flex items-center gap-2">
            <Lock className="w-3 h-3" /> Client Portal
          </Link>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 lg:pt-32">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-8 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
              Architectuur voor de 1%
            </motion.div>

            <motion.h1 
              variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-8"
            >
              Wij Verkopen Geen Theorie.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#fceeb5] to-[#d4af37]">
                Wij Verkopen Consistentie.
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
            >
              Motivatie is een zwaktebod voor amateurs. Echt succes vereist een systeem dat weigert te falen. 
              Wij bouwen autonome AI-infrastructuur die <strong className="text-white font-normal">onbreekbare discipline</strong> forceert in jouw bedrijfsvoering.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest text-black bg-[#d4af37] rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span>Systeem Initiëren</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-zinc-400" />
                <span>Capaciteit: Zeer Gelimiteerd</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Premium Bento Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
          >
            {/* Box 1 */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-[#d4af37]/30 transition-colors group relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl group-hover:bg-[#d4af37]/10 transition-colors pointer-events-none"></div>
              <Zap className="w-10 h-10 text-[#d4af37] mb-8" />
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Geen Motivatie, Maar Systeem</h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                Een kille machine werkt altijd door. Onze AI fungeert als je operationele ruggengraat: het pusht je, neemt het over als jij faalt, en weigert concessies te doen.
              </p>
            </motion.div>

            {/* Box 2 */}
            <motion.div variants={fadeUp} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-[#d4af37]/30 transition-colors relative overflow-hidden group shadow-2xl">
               <Target className="w-8 h-8 text-zinc-500 group-hover:text-[#d4af37] transition-colors mb-6" />
               <h3 className="text-xl font-bold text-white mb-4">Macht in Autonomie</h3>
               <p className="text-zinc-400 leading-relaxed">
                 Terwijl de concurrentie handmatig zwoegt, roteert jouw systeem op de achtergrond. Genererend. Analyserend. Sluitend.
               </p>
            </motion.div>

            {/* Box 3 */}
            <motion.div variants={fadeUp} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-[#d4af37]/30 transition-colors relative overflow-hidden group shadow-2xl">
               <Shield className="w-8 h-8 text-zinc-500 group-hover:text-[#d4af37] transition-colors mb-6" />
               <h3 className="text-xl font-bold text-white mb-4">Militaire Precisie</h3>
               <p className="text-zinc-400 leading-relaxed">
                 Data-gedreven besluitvorming zonder emotie. Het systeem berekent kansen en executeert protocollen feilloos en genadeloos.
               </p>
            </motion.div>

            {/* Box 4: Video / Visuals */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-black border border-white/5 rounded-[2rem] p-4 relative overflow-hidden group min-h-[300px] flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
              {/* Fake UI Element to show "System" */}
              <div className="w-full h-full rounded-[1.5rem] border border-white/5 bg-[#0a0a0a] p-8 relative z-0 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
                
                <div className="flex justify-between items-center border-b border-white/5 pb-4 relative z-10">
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Live System Feed // Grid Status</div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-[#d4af37] uppercase font-bold tracking-widest">Active</div>
                    <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></div>
                  </div>
                </div>
                
                <div className="space-y-6 my-10 relative z-10">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase mb-2">
                      <span>Neural Engine Load</span>
                      <span className="text-[#d4af37]">87%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-[#d4af37]" initial={{ width: "0%" }} whileInView={{ width: "87%" }} transition={{ duration: 1.5, delay: 0.5 }}></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase mb-2">
                      <span>Opportunity Scanner</span>
                      <span className="text-zinc-400">Actief</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-zinc-400" initial={{ width: "0%" }} whileInView={{ width: "100%" }} transition={{ duration: 2, delay: 0.7 }}></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase mb-2">
                      <span>Autonome Executie</span>
                      <span className="text-zinc-600">Stand-by</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-zinc-700" initial={{ width: "0%" }} whileInView={{ width: "15%" }} transition={{ duration: 1, delay: 0.9 }}></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
