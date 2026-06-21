"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Flame, ShieldAlert, Eye, TrendingUp, Ghost } from "lucide-react";

// Simulated AI generated content waiting for approval
const MOCK_QUEUE = [
  {
    id: 1,
    niche: "Stoïcisme & Discipline",
    title: "Marcus Aurelius Morning Routine",
    type: "TikTok / Shorts",
    potentialRevenue: "€450/mnd (Est.)",
    ghostAccount: "@stoic_emperor_99",
    thumbnail: "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800&q=80", // Statue
    status: "pending"
  },
  {
    id: 2,
    niche: "Luxury Lifestyle 40+",
    title: "The Quiet Wealth Secret",
    type: "Instagram Reel",
    potentialRevenue: "€1,200/mnd (Est.)",
    ghostAccount: "@oldmoney_archives",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", // Mansion
    status: "pending"
  },
  {
    id: 3,
    niche: "Tech / AI Tools",
    title: "Automate your job in 10 mins",
    type: "YouTube Shorts",
    potentialRevenue: "€800/mnd (Est.)",
    ghostAccount: "@ai_hacker_god",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", // Cyberpunk
    status: "pending"
  }
];

export default function QualityControlTerminal() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleAction = (id: number, action: "approve" | "reject") => {
    setDirection(action === "approve" ? "right" : "left");
    
    setTimeout(() => {
      setQueue((prev) => prev.filter((item) => item.id !== id));
      setDirection(null);
    }, 400); // Wait for animation
  };

  const currentItem = queue[0];

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 blur-[200px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-gold" />
            QC Command <span className="text-gold">Terminal</span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">
            Pending AI Outputs: {queue.length} | Ghost Network Status: <span className="text-green-500">ONLINE</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Ghost className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-mono">Active Ghosts: 12</span>
          </div>
        </div>
      </header>

      {/* Main QC Area (Tinder-style swipe) */}
      <div className="flex flex-col items-center justify-center max-w-md mx-auto relative z-10 mt-10">
        <AnimatePresence>
          {currentItem ? (
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ 
                x: direction === "left" ? -300 : 300, 
                opacity: 0, 
                rotate: direction === "left" ? -20 : 20 
              }}
              transition={{ duration: 0.3 }}
              className="w-full aspect-[9/16] max-h-[600px] bg-slate-900 border border-gold/20 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(212,168,83,0.1)] group"
            >
              {/* Image / Video Thumbnail */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${currentItem.thumbnail})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Data Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 space-y-4">
                <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/50 text-gold text-xs px-2 py-1 rounded-md uppercase font-bold tracking-widest">
                  <Flame className="w-3 h-3" />
                  {currentItem.niche}
                </div>
                
                <h2 className="text-2xl font-bold text-white">{currentItem.title}</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <span className="block text-white/50 text-xs mb-1">Target Account</span>
                    <span className="font-mono text-sm text-blue-400">{currentItem.ghostAccount}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <span className="block text-white/50 text-xs mb-1">Projected ROI</span>
                    <span className="font-mono text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {currentItem.potentialRevenue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover/Swipe Indicators */}
              {direction === "right" && (
                <div className="absolute top-10 left-10 border-4 border-green-500 text-green-500 font-black text-4xl uppercase px-4 py-2 rounded-lg rotate-[-15deg] bg-black/50">
                  DEPLOY
                </div>
              )}
              {direction === "left" && (
                <div className="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-black text-4xl uppercase px-4 py-2 rounded-lg rotate-[15deg] bg-black/50">
                  KILL
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4 py-20"
            >
              <div className="w-20 h-20 bg-slate-900 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-white">Queue Empty</h2>
              <p className="text-slate-400 max-w-xs mx-auto">
                No new AI content pending review. The GodBrain Factory is generating the next batch.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {currentItem && (
          <div className="flex gap-6 mt-8">
            <button 
              onClick={() => handleAction(currentItem.id, "reject")}
              className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:border-red-500 transition-all hover:scale-110 shadow-lg"
            >
              <X className="w-8 h-8" />
            </button>
            <button 
              className="w-12 h-12 mt-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110"
              title="Preview / Details"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleAction(currentItem.id, "approve")}
              className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all hover:scale-110 shadow-[0_0_30px_rgba(212,168,83,0.3)]"
            >
              <Check className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
