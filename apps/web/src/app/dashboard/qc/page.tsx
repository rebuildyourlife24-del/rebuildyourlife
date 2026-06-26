"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Flame, ShieldAlert, Eye, TrendingUp, Ghost, RefreshCw } from "lucide-react";

export default function QualityControlTerminal() {
  const [queue, setQueue] = useState<any[]>([]);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vervang met echte API call
    fetch('/api/content-forge/generate')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setQueue(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string | number, action: "approve" | "reject") => {
    setDirection(action === "approve" ? "right" : "left");
    
    try {
      await fetch('/api/content-forge/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
    } catch(e) {
      console.error(e);
    }
    
    setTimeout(() => {
      setQueue((prev) => prev.filter((item) => item.id !== id));
      setDirection(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-cyan-500" />
          <h1 className="text-4xl font-black uppercase tracking-widest text-white">
            Q.C. Terminal
          </h1>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Beoordeel gegenereerde AI content voordat het live gaat
        </p>
      </div>

      <div className="relative w-full max-w-md h-[600px] flex items-center justify-center z-10">
        <AnimatePresence>
          {queue.length > 0 ? (
            <motion.div
              key={queue[0].id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: direction === "left" ? -200 : direction === "right" ? 200 : 0,
                rotate: direction === "left" ? -15 : direction === "right" ? 15 : 0
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full h-full bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div 
                className="h-2/3 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${queue[0].thumbnail})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  {queue[0].type}
                </div>
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> {queue[0].potentialRevenue}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-zinc-400">
                    <Ghost className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{queue[0].ghostAccount}</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
                    {queue[0].title}
                  </h2>
                  <p className="text-sm font-medium text-cyan-500">Niche: {queue[0].niche}</p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleAction(queue[0].id, "reject")}
                    className="flex-1 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 py-4 rounded-xl flex items-center justify-center transition-all group"
                  >
                    <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleAction(queue[0].id, "approve")}
                    className="flex-1 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 py-4 rounded-xl flex items-center justify-center transition-all group"
                  >
                    <Check className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center bg-zinc-950/50 border border-white/5 rounded-3xl w-full h-[400px] flex flex-col items-center justify-center p-8 backdrop-blur-md">
              <ShieldAlert className="w-16 h-16 text-zinc-700 mb-6" />
              <h3 className="text-xl font-black uppercase tracking-widest text-zinc-400 mb-2">GEEN WACHTRIJ</h3>
              <p className="text-xs font-bold uppercase text-zinc-600 tracking-widest leading-relaxed">
                Je hebt alle live AI-generaties verwerkt. De Swarm is bezig met nieuwe content.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 relative z-10">
        <Flame className="w-3 h-3 text-red-500" /> Swipe links = Trash | Swipe rechts = Push to Socials
      </div>
    </div>
  );
}
