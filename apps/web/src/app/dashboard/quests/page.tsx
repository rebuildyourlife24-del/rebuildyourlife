import React from 'react';
import { prisma } from '@rebuildyourlife/database';
import { 
  Trophy, 
  Target, 
  BrainCircuit, 
  ChevronRight, 
  Zap, 
  Lock, 
  Unlock,
  Shield,
  Activity
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const AGENT_UNLOCKS = [
  { level: 1, group: "C-Suite", agents: ["CEO", "CMO", "CTO", "CFO", "CRO", "COO", "Hermes"] },
  { level: 2, group: "The Builders", agents: ["Frontend", "Backend", "QA", "DevOps"] },
  { level: 3, group: "The Expanders", agents: ["SEO", "Growth", "Market Intel", "Data Science"] },
  { level: 4, group: "The Protectors", agents: ["Legal", "CS", "CISO"] }
];

const DAILY_MISSIONS = [
  { id: 1, title: "Approve 3 God-Mode Decisions", xp: 150, progress: 1, total: 3, status: "active" },
  { id: 2, title: "Launch 1 Ad Campaign via CMO", xp: 250, progress: 0, total: 1, status: "active" },
  { id: 3, title: "Run Backend Health Check", xp: 50, progress: 1, total: 1, status: "completed" }
];

export default async function QuestsPage() {
  // Fetch real user data from Supabase/Prisma
  // Since we don't have auth context here in this MVP, we fetch the first user (the Operator)
  const user = await prisma.user.findFirst();
  
  const OPERATOR_RANK = {
    level: user?.clearanceLevel || 1,
    name: user?.clearanceLevel && user.clearanceLevel >= 5 ? "Strategist" : "Initiate",
    currentXp: user?.experiencePoints || 0,
    nextLevelXp: (user?.clearanceLevel || 1) * 5000,
  };

  const xpPercentage = Math.min(100, Math.max(0, (OPERATOR_RANK.currentXp / OPERATOR_RANK.nextLevelXp) * 100));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-white min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-green-900/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            QUESTS & UNLOCKS
          </h1>
          <p className="text-gray-400 mt-2 tracking-widest uppercase text-sm">
            Gamification Engine // The Matrix Bridge
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Operator Status & Missions */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* OPERATOR RANK CARD */}
          <section className="bg-black/50 border border-green-900/50 p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              OPERATOR CLEARANCE
            </h2>
            
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-green-500 font-mono">LEVEL {OPERATOR_RANK.level}</p>
                <p className="text-2xl font-bold text-white">{OPERATOR_RANK.name}</p>
              </div>
              <p className="text-xs text-gray-400 font-mono text-right">
                {OPERATOR_RANK.currentXp.toLocaleString()} / {OPERATOR_RANK.nextLevelXp.toLocaleString()} XP
              </p>
            </div>
            
            <div className="w-full bg-green-950/30 h-3 rounded-full overflow-hidden border border-green-900/50">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all duration-1000 ease-out relative"
                style={{ width: `${xpPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Next Unlock: Level {OPERATOR_RANK.level + 1} Architectures
            </p>
          </section>

          {/* DAILY MISSIONS */}
          <section className="bg-black/50 border border-yellow-900/50 p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-500">
              <Target className="w-5 h-5" />
              DAILY SYNDICATE MISSIONS
            </h2>
            
            <div className="space-y-4">
              {DAILY_MISSIONS.map(mission => (
                <div key={mission.id} className={`p-4 border ${mission.status === 'completed' ? 'border-green-900/50 bg-green-950/20 opacity-50' : 'border-yellow-900/30 bg-black/60'} relative group`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className={`text-sm font-bold ${mission.status === 'completed' ? 'line-through text-green-500' : 'text-white'}`}>
                      {mission.title}
                    </p>
                    <span className="text-xs font-mono text-yellow-500 bg-yellow-900/20 px-2 py-0.5 rounded">
                      +{mission.xp} XP
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${mission.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-400">
                      {mission.progress}/{mission.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Agent Unlock Tree & Arsenal */}
        <div className="xl:col-span-2 space-y-8">
          
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-green-900/50 pb-4">
              <BrainCircuit className="w-5 h-5 text-green-500" />
              AI COUNCIL PROGRESSION TREE
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Connecting lines for aesthetics */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/20 via-green-500/5 to-transparent -translate-x-1/2" />
              
              {AGENT_UNLOCKS.map((tier, idx) => {
                const isUnlocked = OPERATOR_RANK.level >= tier.level;
                return (
                  <div key={idx} className={`p-5 border transition-all duration-500 ${isUnlocked ? 'border-green-500/30 bg-green-950/10' : 'border-gray-800 bg-black/40'}`}>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <Unlock className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                        <h3 className={`font-bold ${isUnlocked ? 'text-green-400' : 'text-gray-500'}`}>
                          {tier.group}
                        </h3>
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${isUnlocked ? 'bg-green-900/30 text-green-500' : 'bg-gray-900 text-gray-500'}`}>
                        LVL {tier.level}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {tier.agents.map((agent, aIdx) => (
                        <span 
                          key={aIdx} 
                          className={`text-xs px-3 py-1.5 border ${isUnlocked ? 'border-green-500/30 text-green-300 bg-green-900/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]' : 'border-gray-800 text-gray-600'}`}
                        >
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* UNLOCKABLE ARSENAL */}
          <section className="mt-12">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-green-900/50 pb-4 mb-6">
              <Lock className="w-5 h-5 text-gray-400" />
              THE ARSENAL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Stripe/Mollie Real-Time Split", level: 2, unlocked: OPERATOR_RANK.level >= 2, icon: <Activity className="w-4 h-4" /> },
                { name: "Vercel SDK Sync", level: 3, unlocked: OPERATOR_RANK.level >= 3, icon: <Shield className="w-4 h-4" /> },
                { name: "Agentic Dark-Mode OS", level: 5, unlocked: OPERATOR_RANK.level >= 5, icon: <Zap className="w-4 h-4" /> },
                { name: "LLM Autonomous Deployment", level: 7, unlocked: OPERATOR_RANK.level >= 7, icon: <BrainCircuit className="w-4 h-4" /> },
                { name: "God-Mode Control Panel", level: 10, unlocked: OPERATOR_RANK.level >= 10, icon: <Trophy className="w-4 h-4" /> }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 border ${item.unlocked ? 'border-green-500/50 bg-green-950/20' : 'border-gray-800 bg-black/60 blur-[1px] hover:blur-none transition-all'} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`${item.unlocked ? 'text-green-400' : 'text-gray-600'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-sm ${item.unlocked ? 'text-green-100 font-bold' : 'text-gray-500'}`}>{item.name}</span>
                  </div>
                  {!item.unlocked && (
                     <span className="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-800">LVL {item.level}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
