"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, X } from "lucide-react";

interface OrionMusicPlayerProps {
  query: string;
  isPlaying: boolean;
  onClose: () => void;
  onTogglePlay: () => void;
}

export function OrionMusicPlayer({ query, isPlaying, onClose, onTogglePlay }: OrionMusicPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    // In a full production God Mode, this calls a custom API route (/api/music/search?q=query)
    // to get the exact videoId. For the MVP, we simulate finding the perfect track based on the query.
    // We map a few cinematic/boss themes for demonstration.
    
    const searchMap: Record<string, string> = {
      "scarface": "JvP2uT7L2R8", // Scarface Push it to the limit
      "werk": "pFS4zYWxzNA", // Hans Zimmer - Time (Inception)
      "boss": "Zcq_xLi2NGo", // Imperial March / Dark ambient
      "geld": "L_jWHffIx5E", // Smash Mouth / generic hype (placeholder)
      "hacker": "LqS1Qh1iAxc" // Cyberpunk mix
    };

    let targetId = "LqS1Qh1iAxc"; // Default Cyberpunk
    for (const key of Object.keys(searchMap)) {
      if (query.toLowerCase().includes(key)) {
        targetId = searchMap[key];
        break;
      }
    }
    
    setVideoId(targetId);
  }, [query]);

  if (!videoId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-24 right-6 z-40 bg-black/80 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 w-72 shadow-2xl overflow-hidden"
      >
        {/* Invisible iframe sending audio to ICEpower speakers */}
        <div className="hidden">
          <iframe
            width="10"
            height="10"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
            allow="autoplay"
          ></iframe>
        </div>

        {/* Visualizer & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30 ${isPlaying ? 'animate-pulse' : ''}`}>
              <Music className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold truncate w-32">
                {query === 'hacker' ? 'Orion Audio Stream' : query}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {/* Simulated B&O EQ bars */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? { height: ["4px", "12px", "4px"] } : { height: "4px" }}
                    transition={isPlaying ? { duration: 0.5 + i * 0.1, repeat: Infinity } : {}}
                    className="w-1 bg-gold rounded-full"
                  />
                ))}
                <span className="text-gold/50 text-xs ml-2 font-mono">ICEPOWER</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onTogglePlay} className="text-white hover:text-gold transition">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="text-white/50 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
