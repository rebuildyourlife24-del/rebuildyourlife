"use client";

import React, { useState, useEffect } from "react";
import { createChatbot, getUserChatbots, deleteChatbot } from "@/app/actions/chatbot";
import { Bot, Loader2, Plus, Code, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ChatbotAgencyPage() {
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("Je bent een vriendelijke klantenservice medewerker. Je beantwoordt vragen kort en bondig.");
  const [themeColor, setThemeColor] = useState("#00f0ff"); // Default to Neon Cyan

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      const data = await getUserChatbots();
      setChatbots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemPrompt) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await createChatbot(name, systemPrompt, themeColor);
      if (!res.success) {
        setError(res.error || "Er ging iets mis bij het maken van de bot.");
      } else {
        await loadBots();
        setName("");
        setSystemPrompt("Je bent een vriendelijke klantenservice medewerker. Je beantwoordt vragen kort en bondig.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Weet je zeker dat je deze bot wilt verwijderen?")) return;
    await deleteChatbot(id);
    await loadBots();
  };

  const copyToClipboard = (id: string) => {
    // Determine the host dynamically based on current window location
    const host = window.location.origin;
    const script = `<script src="${host}/api/chatbot/widget/${id}"></script>`;
    navigator.clipboard.writeText(script);
    alert("Embed code gekopieerd!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <Link href="/dashboard/modules" className="flex items-center text-zinc-500 hover:text-cyan-400 mb-8 transition-colors uppercase tracking-widest text-xs font-bold">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          AI Chatbot Agency
        </h1>
        <p className="text-zinc-400 mt-2 text-lg font-light">
          Maak custom AI-assistenten, kopieer de script-tag en verkoop dit aan lokale bedrijven als klantenservice-oplossing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE FORM */}
        <div className="lg:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
          
          <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-wider relative z-10">
            <Plus className="w-5 h-5 mr-2 text-cyan-400" />
            Nieuwe Bot Maken
          </h2>
          <form onSubmit={handleCreate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Naam van het bedrijf / Bot</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Bijv. Tandarts Jansen Support"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">System Prompt (Instructies)</label>
              <textarea 
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                rows={5}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none resize-none custom-scrollbar"
                required
              />
              <p className="text-xs text-zinc-500 mt-1 font-mono">Vertel de AI hoe hij zich moet gedragen en welke info hij moet weten.</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Merkkleur (Hex)</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                  className="h-10 w-10 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                  className="flex-1 bg-zinc-900/50 border border-white/10 rounded-xl px-3 text-white focus:border-cyan-500 transition-all outline-none font-mono"
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-xs font-mono border border-red-500/30 bg-red-500/10 p-2 rounded">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-black uppercase tracking-widest py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bot Genereren"}
            </button>
          </form>
        </div>

        {/* LIST OF BOTS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-6 uppercase tracking-wider">Mijn Klanten (Bots)</h2>
          
          {chatbots.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/20 rounded-2xl text-zinc-500 font-mono text-sm">
              Je hebt nog geen chatbots gemaakt. Vul het formulier links in!
            </div>
          )}

          {chatbots.map(bot => (
            <motion.div 
              key={bot.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10"
                  style={{ backgroundColor: bot.themeColor }}
                >
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">{bot.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    Aangemaakt op: {new Date(bot.createdAt).toLocaleDateString()} • <span className="text-cyan-400">{bot._count?.sessions || 0}</span> Chat sessies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => copyToClipboard(bot.id)}
                  className="flex-1 sm:flex-none bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center transition-colors border border-white/10"
                >
                  <Code className="w-4 h-4 mr-2 text-cyan-400" />
                  Kopieer Embed
                </button>
                <button 
                  onClick={() => handleDelete(bot.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-xl transition-colors border border-red-500/20"
                  title="Verwijder bot"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
