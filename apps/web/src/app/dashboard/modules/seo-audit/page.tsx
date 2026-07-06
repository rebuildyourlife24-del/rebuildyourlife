"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createSeoAudit, getUserSeoAudits } from "@/app/actions/seo-audit";
import { Search, Loader2, CheckCircle, AlertTriangle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SeoAuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audits, setAudits] = useState<any[]>([]);

  useEffect(() => {
    loadAudits();

    const interval = setInterval(() => {
      setAudits((currentAudits) => {
        const hasPending = currentAudits.some(a => a.status === 'PENDING' || a.status === 'RUNNING');
        if (hasPending) {
          loadAudits();
        }
        return currentAudits;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadAudits = async () => {
    try {
      const data = await getUserSeoAudits();
      setAudits(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
      setUrl(finalUrl);
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await createSeoAudit(finalUrl);
      if (!res.success) {
        setError(res.error || "Er ging iets mis tijdens de scan.");
      } else {
        await loadAudits();
        setUrl("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/30 glass-cyber p-8 md:p-12 group mb-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-blue-500/10 border border-blue-500/40 text-blue-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Search className="w-3 h-3 mr-2" />
                SEO & Analytics
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              SEO <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">Audit Scanner</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Voer een domeinnaam in en onze AI (Firecrawl + Gemini) analyseert de website op SEO en UX verbeteringen.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-8 mb-12 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        <form onSubmit={handleScan} className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input 
              type="text"
              placeholder="https://jouwklant.nl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !url}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-xl transition-all flex items-center min-w-[160px] justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Scannen...
              </>
            ) : (
              "Start Audit"
            )}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start">
            <XCircle className="w-5 h-5 mr-2 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Recente Audits</h2>
      
      {audits.length === 0 && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 font-mono uppercase tracking-widest text-sm bg-black/40">
          Geen audits gevonden. Voer een URL in om te beginnen.
        </div>
      )}

      <div className="space-y-6">
        {audits.map((audit) => (
          <motion.div 
            key={audit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{audit.targetUrl}</h3>
                <p className="text-xs font-mono text-zinc-500 mt-1">
                  Geschaapt op: {new Date(audit.createdAt).toLocaleString('nl-NL')}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`text-3xl font-black ${
                  audit.result && JSON.parse(audit.result).score >= 80 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                  audit.result && JSON.parse(audit.result).score >= 50 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 
                  'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}>
                  {audit.result ? JSON.parse(audit.result).score : '?'}/100
                </div>
                <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">SEO SCORE</div>
              </div>
            </div>

            {audit.status === "DONE" && audit.result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 relative z-10">
                <div className="space-y-4">
                  <div className="p-5 bg-zinc-900/50 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <h4 className="font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center text-xs">
                      <CheckCircle className="w-4 h-4 mr-2" /> Wat gaat er goed?
                    </h4>
                    <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1.5 marker:text-emerald-500">
                      {JSON.parse(audit.result).pros?.map((pro: string, i: number) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-5 bg-zinc-900/50 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                    <h4 className="font-black uppercase tracking-widest text-red-400 mb-3 flex items-center text-xs">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Wat moet er beter?
                    </h4>
                    <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1.5 marker:text-red-500">
                      {JSON.parse(audit.result).cons?.map((con: string, i: number) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl border border-white/5 p-6 backdrop-blur-sm">
                  <h4 className="font-black uppercase tracking-widest text-white mb-5 text-sm">Actieplan (To-Do's)</h4>
                  <div className="space-y-3">
                    {JSON.parse(audit.result).actionItems?.map((item: any, i: number) => (
                      <div key={i} className="flex items-start bg-zinc-900/80 p-3.5 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded mr-3 shrink-0 ${
                          item.priority === 'HIGH' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 
                          item.priority === 'MEDIUM' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 
                          'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-sm text-zinc-300">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {audit.status === "DONE" && audit.result && JSON.parse(audit.result).summary && (
              <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">AI Samenvatting</h4>
                <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-white/5 italic">
                  "{JSON.parse(audit.result).summary}"
                </p>
              </div>
            )}

            {(audit.status === "PENDING" || audit.status === "RUNNING") && (
              <div className="flex items-center text-amber-400 mt-4 font-mono text-sm uppercase tracking-widest relative z-10 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                Bezig met scrapen en analyseren (dit duurt ~30 seconden)...
              </div>
            )}
            
            {audit.status === "FAILED" && (
              <div className="flex items-center text-red-500 mt-4 font-mono text-sm uppercase tracking-widest relative z-10 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <XCircle className="w-5 h-5 mr-3" />
                Fout: {audit.error || "De SEO scan is gecrasht of getimed-out."}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
