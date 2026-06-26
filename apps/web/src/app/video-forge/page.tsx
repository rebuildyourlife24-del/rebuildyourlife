"use client";

import { useState } from "react";
import { Play, Loader2, Video, DatabaseZap, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoForge() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [modelType, setModelType] = useState<"free" | "premium">("free");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsGenerating(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, modelType }),
      });

      const data = await res.json();
      
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        alert("Render gefaald. Controleer API logs.");
      }
    } catch (error) {
      console.error(error);
      alert("Netwerkfout tijdens renderen.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans flex flex-col items-center justify-start pt-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-4xl text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/50 rounded-full text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6">
          <DatabaseZap className="w-4 h-4" />
          <span>Open-Source Video Render Engine</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Video <span className="text-cyan-400">Forge</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Kies tussen 100% gratis rendering via Hugging Face of activeer de premium 4K Mochi-1 engine voor maximale kwaliteit.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="z-10 w-full max-w-2xl bg-navy border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          {/* Model Switcher */}
          <div className="flex bg-black border border-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setModelType("free")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                modelType === "free" ? "bg-navyLight text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Gratis Engine (1080p)
            </button>
            <button
              type="button"
              onClick={() => setModelType("premium")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${
                modelType === "premium" ? "bg-cyan-900/50 text-cyan-400 border border-cyan-500/30" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Star className="w-3 h-3" /> Premium 4K (Mochi-1)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Prompt (Beschrijf de video)</label>
            <textarea
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none h-32"
              placeholder="Een cinematische tracking shot van een neon-verlichte War Room..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          <button
            type="submit"
            disabled={isGenerating || !prompt}
            className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Render Engine Gestart...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-black" />
                Start 4K Render
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Render Output Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="z-10 w-full max-w-4xl mt-12 flex flex-col items-center mb-24"
      >
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Video className="w-4 h-4" />
          Output Terminal
        </h2>
        
        <div className="w-full aspect-video bg-navy border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden relative">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              autoPlay 
              loop 
              controls 
              className="w-full h-full object-contain"
            />
          ) : isGenerating ? (
            <div className="flex flex-col items-center text-cyan-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="text-xs uppercase tracking-widest font-bold">Inkomend signaal... wachten op GPU allocatie</div>
            </div>
          ) : (
            <div className="text-zinc-700 text-sm font-medium">Video Forge staat standby.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
