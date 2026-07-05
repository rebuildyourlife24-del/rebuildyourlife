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
    
    setLoading(true);
    setError("");

    try {
      const res = await createSeoAudit(url);
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
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-slate-950">
      <Link href="/dashboard/modules" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          SEO Audit Scanner
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Voer een domeinnaam in en onze AI (Firecrawl + Gemini) analyseert de website op SEO en UX verbeteringen.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-12 shadow-xl shadow-blue-900/10">
        <form onSubmit={handleScan} className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="url"
              placeholder="https://jouwklant.nl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !url}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center min-w-[160px] justify-center"
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
      <h2 className="text-2xl font-bold mb-6">Recente Audits</h2>
      
      {audits.length === 0 && !loading && (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          Geen audits gevonden. Voer een URL in om te beginnen.
        </div>
      )}

      <div className="space-y-6">
        {audits.map((audit) => (
          <motion.div 
            key={audit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-blue-400">{audit.targetUrl}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Geschaapt op: {new Date(audit.createdAt).toLocaleString('nl-NL')}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`text-3xl font-black ${audit.score >= 80 ? 'text-emerald-400' : audit.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {audit.score}/100
                </div>
                <div className="text-xs text-slate-500 font-medium tracking-wider">SEO SCORE</div>
              </div>
            </div>

            {audit.status === "COMPLETED" && audit.aiReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-emerald-400 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Wat gaat er goed?
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      {(audit.aiReport as any).pros?.map((pro: string, i: number) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-red-400 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Wat moet er beter?
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      {(audit.aiReport as any).cons?.map((con: string, i: number) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-5">
                  <h4 className="font-bold mb-4">Actieplan (To-Do's)</h4>
                  <div className="space-y-3">
                    {(audit.aiReport as any).actionItems?.map((item: any, i: number) => (
                      <div key={i} className="flex items-start bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className={`text-xs font-bold px-2 py-1 rounded mr-3 shrink-0 ${
                          item.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                          item.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-sm text-slate-300">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {audit.status === "COMPLETED" && audit.aiReport?.summary && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-slate-400 mb-2">AI Samenvatting</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {(audit.aiReport as any).summary}
                </p>
              </div>
            )}

            {audit.status === "PENDING" && (
              <div className="flex items-center text-yellow-400 mt-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Bezig met scrapen en analyseren...
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
