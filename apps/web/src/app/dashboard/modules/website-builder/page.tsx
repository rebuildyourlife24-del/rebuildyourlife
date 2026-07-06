"use client";

import React, { useState, useEffect } from "react";
import { createWebsite, getUserWebsites, deleteWebsite } from "@/app/actions/website";
import { LayoutTemplate, Loader2, Plus, ExternalLink, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WebsiteBuilderPage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const data = await getUserWebsites();
      setWebsites(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prompt) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await createWebsite(name, prompt);
      if (!res.success) {
        setError(res.error || "Fout bij maken website.");
      } else {
        await loadWebsites();
        setName("");
        setPrompt("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Weet je zeker dat je deze website wilt verwijderen?")) return;
    await deleteWebsite(id);
    await loadWebsites();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <Link href="/dashboard/modules" className="flex items-center text-zinc-500 hover:text-cyan-400 mb-8 transition-colors font-mono uppercase tracking-widest text-xs">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          One-Pager Service
        </h1>
        <p className="text-zinc-400 mt-2 text-lg font-light">
          Genereer binnen 10 seconden complete, moderne landingspagina's via AI en verhuur ze aan lokale ondernemers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE FORM */}
        <div className="lg:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-colors"></div>
          
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center relative z-10">
            <Plus className="w-5 h-5 mr-2 text-purple-500" />
            Nieuwe Website Genereren
          </h2>
          <form onSubmit={handleCreate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Naam (Klant / Project)</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Kapper De Vries"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">AI Instructie (De Prompt)</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={6}
                placeholder="Maak een strakke, moderne kapper website. Gebruik donkergrijze en gouden kleuren. Voeg secties toe voor: Home, Diensten (knippen, verven), en een 'Maak Afspraak' knop."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all resize-none custom-scrollbar"
                required
              />
            </div>

            {error && <div className="text-red-400 text-sm font-mono border border-red-500/20 bg-red-500/10 p-2 rounded-lg">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest text-xs py-4 px-4 rounded-xl transition-all flex items-center justify-center mt-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:shadow-none border border-transparent disabled:border-white/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI is aan het bouwen...
                </>
              ) : "Website Genereren"}
            </button>
            <p className="text-xs text-center font-mono text-zinc-600 mt-3">Dit duurt +/- 10 seconden.</p>
          </form>
        </div>

        {/* LIST OF SITES */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6">Mijn Live Websites</h2>
          
          {websites.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 font-mono uppercase tracking-widest text-sm bg-black/40">
              Je hebt nog geen websites gemaakt. Vul de prompt links in!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {websites.map(site => (
              <motion.div 
                key={site.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/30 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-purple-500/20 transition-colors">
                      <LayoutTemplate className="w-6 h-6 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded">LIVE</span>
                  </div>
                  
                  <h3 className="text-xl font-bold uppercase tracking-wider truncate">{site.name}</h3>
                  <p className="text-sm font-mono text-zinc-500 truncate mt-1">/api/site/{site.domain}</p>
                </div>

                <div className="flex items-center gap-2 mt-6 relative z-10">
                  <a 
                    href={`/api/site/${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 py-3 rounded-xl text-xs uppercase tracking-widest font-black flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Bekijk Live
                  </a>
                  <button 
                    onClick={() => handleDelete(site.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-xl transition-colors border border-red-500/20 hover:border-red-500/40"
                    title="Verwijder website"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
