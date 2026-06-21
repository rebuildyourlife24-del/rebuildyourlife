"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Video, CloudLightning, Activity, Server, Users, ArrowRight } from "lucide-react";

export default function AutonomousFactoryPage() {
  const [activeShift, setActiveShift] = useState<"DAY" | "NIGHT">("DAY");

  // Gesimuleerde Agent data gebaseerd op het nieuwe Prisma Schema
  const agents = [
    {
      id: 1,
      role: "Video Creator (TikTok/Reels)",
      dayAgent: "Agent Alpha-7",
      nightAgent: "Agent Omega-9",
      currentStatus: activeShift === "DAY" ? "RENDERING_ON_RUNPOD" : "SLEEPING",
      gpuStatus: activeShift === "DAY" ? "ACTIVE" : "OFFLINE",
    },
    {
      id: 2,
      role: "Content Researcher",
      dayAgent: "Agent Scout-A",
      nightAgent: "Agent Scout-B",
      currentStatus: "SCRAPING_TRENDS",
      gpuStatus: "OFFLINE",
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Video className="w-10 h-10 text-cyan-400" />
            Autonomous Video Factory
          </h1>
          <p className="text-slate-400 text-lg">
            Cloud-in-Cloud rendering & Agent Ploegendienst (Day/Night Shifts)
          </p>
        </div>
        
        {/* Shift Toggle */}
        <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 flex">
          <button 
            onClick={() => setActiveShift("DAY")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeShift === "DAY" 
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Day Shift
          </button>
          <button 
            onClick={() => setActiveShift("NIGHT")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeShift === "NIGHT" 
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Night Shift
          </button>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-medium">Vercel Core</h3>
              <p className="text-emerald-400 text-sm">0% Load (Safe)</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Je hoofdserver is veilig. Geen rekenkracht wordt hier verbruikt.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-medium">GitHub Actions</h3>
              <p className="text-cyan-400 text-sm">Dirigent Standby</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Activeert tijdelijke werelden voor de agenten en sluit ze weer af.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-400">
              <CloudLightning className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-medium">RunPod GPU Cloud</h3>
              <p className="text-fuchsia-400 text-sm">Render Active</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Hyper-realistische render cluster. Wordt per minuut afgerekend.
          </p>
        </div>
      </div>

      {/* Agents on Factory Floor */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-400" />
          Factory Floor (Ploegendienst)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <motion.div 
              key={agent.id}
              layout
              className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{agent.role}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{agent.dayAgent} (Day)</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{agent.nightAgent} (Night)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-xl p-4 flex justify-between items-center border border-slate-800">
                  <span className="text-slate-400">Active Agent:</span>
                  <span className={`font-medium px-3 py-1 rounded-lg text-sm ${
                    activeShift === "DAY" 
                      ? "bg-amber-500/10 text-amber-400" 
                      : "bg-indigo-500/10 text-indigo-400"
                  }`}>
                    {activeShift === "DAY" ? agent.dayAgent : agent.nightAgent}
                  </span>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 flex justify-between items-center border border-slate-800">
                  <span className="text-slate-400">Task Status:</span>
                  <div className="flex items-center gap-2">
                    {agent.currentStatus === "RENDERING_ON_RUNPOD" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
                      </span>
                    )}
                    <span className="text-slate-200 text-sm">{agent.currentStatus}</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 flex justify-between items-center border border-slate-800">
                  <span className="text-slate-400">Cloud Link (Compute):</span>
                  <span className={`text-sm ${
                    agent.gpuStatus === "ACTIVE" ? "text-fuchsia-400" : "text-slate-500"
                  }`}>
                    {agent.gpuStatus === "ACTIVE" ? "CONNECTED TO RUNPOD" : "DISCONNECTED"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
