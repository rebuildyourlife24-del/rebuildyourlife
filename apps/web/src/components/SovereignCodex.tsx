'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Zap, Wrench, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface SovereignCodexProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SovereignCodex({ isOpen, onClose }: SovereignCodexProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'orion' | 'hermes' | 'agents'>('intro');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[450px] max-w-[100vw] bg-[#0a0a0c] border-l border-cyan-900/50 shadow-2xl shadow-cyan-900/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan-900/40 bg-black/40">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <h2 className="text-white font-black tracking-widest uppercase text-xl">
                  Sovereign <span className="text-cyan-400">Codex</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-cyan-900/30 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex px-4 pt-4 border-b border-cyan-900/20 overflow-x-auto custom-scrollbar">
              <TabButton active={activeTab === 'intro'} onClick={() => setActiveTab('intro')} icon={<Shield />} label="Trinity" />
              <TabButton active={activeTab === 'orion'} onClick={() => setActiveTab('orion')} icon={<Zap />} label="Orion" />
              <TabButton active={activeTab === 'hermes'} onClick={() => setActiveTab('hermes')} icon={<Wrench />} label="Hermes" />
              <TabButton active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} icon={<Users />} label="Agents" />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {activeTab === 'intro' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Welkom in de War Room</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    De Trinity Workspace is de commandobrug van het RebuildYourLife systeem. Hier ben jij de absolute 'Supreme Overseer'.
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Als je hier een directief typt, gebeuren er drie dingen:
                  </p>
                  <ul className="space-y-3 mt-4">
                    <FeatureListItem title="Jij geeft de visie" desc="Typ je doel in simpele taal." />
                    <FeatureListItem title="Orion bepaalt de strategie" desc="Orion (CEO) analyseert de haalbaarheid en winst." />
                    <FeatureListItem title="Hermes bouwt het systeem" desc="Hermes (Dev) luistert mee en schrijft direct de code." />
                  </ul>
                </motion.div>
              )}

              {activeTab === 'orion' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-5 h-5" /> De Strateeg
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Orion is je virtuele CEO. Hij is geprogrammeerd om kil, berekend en uiterst focus-gericht te zijn op winst en systeem-efficiëntie.
                  </p>
                  <div className="bg-cyan-950/20 border border-cyan-900/30 p-4 rounded-xl mt-4">
                    <h4 className="text-cyan-500 font-bold text-xs uppercase mb-2">Voorbeeld Commando's:</h4>
                    <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                      <li>"Orion, hoe verhogen we de conversie met 10%?"</li>
                      <li>"Orion, analyseer de zwaktes in ons huidige sales script."</li>
                      <li>"Orion, bedenk een strategie voor de nieuwe app lancering."</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hermes' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-5 h-5" /> De Hoofd Leer Motor
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Hermes is de Lead Developer en 'Leer Motor'. Hij leert 24/7 van alle data in het Global Neural Network en stuurt de 50 agents aan.
                  </p>
                  <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl mt-4">
                    <h4 className="text-emerald-500 font-bold text-xs uppercase mb-2">Voorbeeld Commando's:</h4>
                    <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                      <li>"Hermes, bouw een React component voor dit idee."</li>
                      <li>"Hermes, wat heb je de afgelopen 24 uur geleerd?"</li>
                      <li>"Hermes, optimaliseer de prestaties van Agent 12."</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'agents' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-5 h-5" /> Het Leger
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Op de achtergrond werken 50 gespecialiseerde RYL Agents. Jij hoeft deze niet individueel aan te sturen; Hermes doet dit voor jou op basis van Orions strategie.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                      <span className="block text-xs text-zinc-500 font-mono">Sales</span>
                      <span className="block text-white font-bold">12 Agents</span>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                      <span className="block text-xs text-zinc-500 font-mono">Marketing</span>
                      <span className="block text-white font-bold">8 Agents</span>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                      <span className="block text-xs text-zinc-500 font-mono">Code/Dev</span>
                      <span className="block text-white font-bold">15 Agents</span>
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                      <span className="block text-xs text-zinc-500 font-mono">Support</span>
                      <span className="block text-white font-bold">15 Agents</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-mono text-xs uppercase tracking-wider ${
        active 
          ? 'border-cyan-400 text-cyan-400' 
          : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
      }`}
    >
      <div className="w-4 h-4">{icon}</div>
      {label}
    </button>
  );
}

function FeatureListItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="flex gap-3">
      <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0" />
      <div>
        <span className="block text-white font-bold text-sm">{title}</span>
        <span className="block text-zinc-500 text-xs">{desc}</span>
      </div>
    </li>
  );
}
