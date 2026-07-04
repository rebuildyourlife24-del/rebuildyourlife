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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full hidden blur-[] pointer-events-none" />

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
    <div className="min-h-screen bg-[#020202] text-zinc-300 p-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Mic className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                Sovereign Voice <span className="text-cyan-400">Forge</span>
              </h1>
              <p className="text-sm font-mono text-zinc-500 mt-1">Powered by ElevenLabs - Ultra-realistische AI Stemmen</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              
              <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-cyan-400" /> Parameters
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Voice-over Tekst</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Plak hier je script uit de Viral Factory..."
                    className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none text-white font-mono leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm p-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                      <span className="relative z-10">Stem Genereren...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 relative z-10" fill="currentColor" />
                      <span className="relative z-10">Genereer Audio</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-xs font-mono">{error}</p>
                  {error.includes('ELEVENLABS_API_KEY') && (
                    <p className="text-red-300/70 text-[10px] mt-2 font-mono">
                      Voeg ELEVENLABS_API_KEY toe in je Vercel Environment Variables.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Output */}
          <div className="lg:col-span-2">
            <div className="bg-black border border-white/10 rounded-2xl h-full min-h-[400px] flex flex-col p-6">
              <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" /> Resultaat
              </h2>

              <div className="flex-1 w-full bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 relative">
                {audioUrl ? (
                  <div className="w-full max-w-md space-y-8 flex flex-col items-center">
                    
                    {/* Audio Visualizer Fake */}
                    <div className="flex items-center justify-center gap-1 h-16 w-full">
                      {[...Array(30)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [10, Math.random() * 60 + 10, 10] }}
                          transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                          className="w-1.5 bg-cyan-500 rounded-full"
                        />
                      ))}
                    </div>

                    <audio controls src={audioUrl} className="w-full accent-cyan-500" autoPlay />

                    <a 
                      href={audioUrl} 
                      download="voiceover.mp3"
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download MP3
                    </a>
                  </div>
                ) : isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-cyan-500">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <div className="text-xs font-black uppercase tracking-widest animate-pulse">ElevenLabs aan het spreken...</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-600">
                    <Mic className="w-16 h-16 opacity-20 mb-4" />
                    <div className="text-xs font-black uppercase tracking-widest">Systeem staat standby</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
