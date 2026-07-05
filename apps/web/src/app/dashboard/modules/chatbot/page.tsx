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
  const [themeColor, setThemeColor] = useState("#3b82f6");

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
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-slate-950">
      <Link href="/dashboard/modules" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          AI Chatbot Agency
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Maak custom AI-assistenten, kopieer de script-tag en verkoop dit aan lokale bedrijven als klantenservice-oplossing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE FORM */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-emerald-400" />
            Nieuwe Bot Maken
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Naam van het bedrijf / Bot</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Bijv. Tandarts Jansen Support"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">System Prompt (Instructies)</label>
              <textarea 
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Vertel de AI hoe hij zich moet gedragen en welke info hij moet weten (prijzen, openingstijden, etc).</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Merkkleur (Hex)</label>
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
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bot Genereren"}
            </button>
          </form>
        </div>

        {/* LIST OF BOTS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-6">Mijn Klanten (Bots)</h2>
          
          {chatbots.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              Je hebt nog geen chatbots gemaakt. Vul het formulier links in!
            </div>
          )}

          {chatbots.map(bot => (
            <motion.div 
              key={bot.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: bot.themeColor }}
                >
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{bot.name}</h3>
                  <p className="text-xs text-slate-400">
                    Aangemaakt op: {new Date(bot.createdAt).toLocaleDateString()} • {bot._count?.sessions || 0} Chat sessies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => copyToClipboard(bot.id)}
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border border-slate-700"
                >
                  <Code className="w-4 h-4 mr-2 text-emerald-400" />
                  Kopieer Embed
                </button>
                <button 
                  onClick={() => handleDelete(bot.id)}
                  className="bg-red-900/20 hover:bg-red-900/40 text-red-400 p-2 rounded-lg transition-colors border border-red-900/50"
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
