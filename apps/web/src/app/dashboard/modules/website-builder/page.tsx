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
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-slate-950">
      <Link href="/dashboard/modules" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          One-Pager Service (Website Builder)
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Genereer binnen 10 seconden complete, moderne landingspagina's via AI en verhuur ze aan lokale ondernemers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE FORM */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-emerald-400" />
            Nieuwe Website Genereren
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Naam (Klant / Project)</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Kapper De Vries"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">AI Instructie (De Prompt)</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={6}
                placeholder="Maak een strakke, moderne kapper website. Gebruik donkergrijze en gouden kleuren. Voeg secties toe voor: Home, Diensten (knippen, verven), en een 'Maak Afspraak' knop."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none"
                required
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI is aan het bouwen...
                </>
              ) : "Website Genereren"}
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">Dit duurt +/- 10 seconden.</p>
          </form>
        </div>

        {/* LIST OF SITES */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-6">Mijn Live Websites</h2>
          
          {websites.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              Je hebt nog geen websites gemaakt. Vul de prompt links in!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {websites.map(site => (
              <motion.div 
                key={site.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-800/50">
                      <LayoutTemplate className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-bold rounded-full">LIVE</span>
                  </div>
                  
                  <h3 className="text-xl font-bold truncate">{site.name}</h3>
                  <p className="text-sm text-slate-400 truncate mt-1">/api/site/{site.domain}</p>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <a 
                    href={`/api/site/${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/30 text-blue-400 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Bekijk Live
                  </a>
                  <button 
                    onClick={() => handleDelete(site.id)}
                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 p-2 rounded-lg transition-colors border border-red-900/50"
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
