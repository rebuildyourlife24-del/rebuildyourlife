"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createFranchise, getFranchises } from "@/actions/franchise";
import { Skull, Activity, Terminal } from "lucide-react";

export default function FranchiseFactory() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFranchises();
  }, []);

  async function fetchFranchises() {
    const data = await getFranchises();
    setFranchises(data);
  }

  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    if (!niche) return;

    setLoading(true);
    setError("");
    setSimulationLogs([]);

    const steps = [
      "> INITIATING GODBRAIN AUTO-BUILDER",
      "> SCANNING MARKET NICHE: " + niche.toUpperCase(),
      "> CALCULATING PROFIT MARGINS...",
      "[OK] PROFIT MARGIN: 74%",
      "> REQUESTING PARTNER API FOR SHOPIFY INSTANCE",
      "[SYS] BYPASSING CAPTCHAS...",
      "> INJECTING NEURAL NETWORK THEME",
      "> SYNCHRONIZING PAYMENT GATEWAYS",
      "> ESTABLISHING DIRECT UPLINK TO WAR ROOM",
      "[SUCCESS] FRANCHISE DEPLOYMENT COMPLETE"
    ];

    // Simulatie loop
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      setSimulationLogs(prev => [...prev, steps[i]]);
    }

    try {
      await createFranchise(niche);
      await fetchFranchises();
      setNiche("");
    } catch (err: any) {
      setError(err.message || "Failed to create franchise");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono">
      {/* Header */}
      <div className="border-b-2 border-red-600 pb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-red-600/10 animate-pulse pointer-events-none"></div>
        <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase flex items-center gap-3 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] relative z-10">
          <Terminal className="w-8 h-8 text-red-500" />
          FRANCHISE FACTORY
        </h1>
        <p className="text-red-500/80 mt-2 text-sm tracking-widest relative z-10">
          AUTOMATISCHE WINKEL GENERATIE (BETA)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Input Form */}
        <div className="space-y-6">
          <div className="border border-red-900 bg-black p-6 relative overflow-hidden shadow-[inset_0_0_30px_rgba(153,27,27,0.2)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent"></div>
            
            <h2 className="text-white text-lg font-bold mb-4 tracking-widest flex items-center gap-2">
              <Skull className="w-5 h-5 text-red-500" /> DEPLOYMENT PROTOCOL
            </h2>

            <form onSubmit={handleDeploy} className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Doelwit Niche
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="bijv. Survival Gear of Luxe Horloges"
                  required
                  disabled={loading}
                  className="w-full bg-red-950/20 border border-red-900 text-white px-4 py-3 focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-900/50"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm border border-red-500 p-2 bg-red-950/50">
                  [ERROR] {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !niche}
                className="w-full bg-red-600 hover:bg-red-500 text-black font-black uppercase tracking-[0.2em] py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)]"
              >
                {loading ? "DEPLOYING..." : "INITIATE DEPLOYMENT"}
              </button>
            </form>
          </div>

          {/* Active Franchises */}
          <div className="border border-red-900 bg-black p-6 shadow-[inset_0_0_30px_rgba(153,27,27,0.2)]">
            <h2 className="text-white text-sm font-bold mb-4 tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" /> ACTIEVE FRANCHISES
            </h2>
            <div className="space-y-3">
              {franchises.length === 0 && (
                <p className="text-red-900/60 text-xs">Geen franchises actief.</p>
              )}
              {franchises.map(f => (
                <div key={f.id} className="border border-red-900/50 p-3 bg-red-950/10 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold text-sm">{f.storeName}</div>
                    <div className="text-red-500/70 text-xs mt-1">{f.domainUrl}</div>
                  </div>
                  <div className="text-[10px] bg-red-900/40 text-red-400 px-2 py-1 border border-red-800">
                    {f.niche.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Terminal Simulation */}
        <div className="border border-red-900 bg-black p-6 relative overflow-hidden h-[500px] flex flex-col shadow-[inset_0_0_30px_rgba(153,27,27,0.2)]">
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(220,38,38,0.1)_3px,rgba(220,38,38,0.1)_3px)] pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-4 border-b border-red-900 pb-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <div className="text-xs font-bold text-red-500 tracking-widest">LIVE TERMINAL FEED</div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm relative z-10 flex flex-col justify-end">
            <AnimatePresence>
              {simulationLogs.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-900/50">
                  &gt; WAITING FOR COMMAND...
                </motion.div>
              )}
              {simulationLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${log.includes('[SUCCESS]') || log.includes('[OK]') ? 'text-green-500' : 'text-red-400'}`}
                >
                  {log}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-red-500 mt-2"
                >
                  _
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
