"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Globe, AlertTriangle, CheckCircle, TrendingUp, Loader2 } from "lucide-react";

export default function SeoAuditModule() {
  const [url, setUrl] = useState("https://");
  const [status, setStatus] = useState<"IDLE" | "SCANNING" | "COMPLETE" | "ERROR">("IDLE");
  const [report, setReport] = useState<any>(null);

  const handleScan = async () => {
    if (!url || url === "https://") return;
    setStatus("SCANNING");
    setReport(null);

    try {
      const res = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!res.ok) throw new Error("API Fout");

      const data = await res.json();
      setReport(data);
      setStatus("COMPLETE");
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen text-white bg-slate-950">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold">SEO Audit Agency Tool</h1>
        </div>
        <p className="text-slate-400">
          Genereer in enkele seconden een real-time SEO-rapport voor een potentiële klant. 
          Deel dit rapport om direct je autoriteit te bewijzen en SEO-diensten te verkopen.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Website URL van je lead
        </label>
        <div className="flex gap-4">
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status === "SCANNING"}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
            placeholder="https://www.website-van-de-lead.nl"
          />
          <button 
            onClick={handleScan}
            disabled={status === "SCANNING" || !url || url === "https://"}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center gap-2"
          >
            {status === "SCANNING" ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {status === "SCANNING" ? "Scannen..." : "Genereer Rapport"}
          </button>
        </div>
        {status === "ERROR" && <p className="text-red-400 text-sm mt-3">Er is een fout opgetreden bij het scrapen van de website. Controleer of de URL bereikbaar is.</p>}
      </div>

      {report && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* SEO Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold mb-4 text-slate-300">Algemene SEO Score</h2>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={report.score > 70 ? "text-emerald-500" : report.score > 40 ? "text-yellow-500" : "text-red-500"}
                  strokeDasharray={`${report.score}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-4xl font-bold">{report.score}</div>
            </div>
            <p className="mt-4 text-slate-400 text-sm">{report.scoreSummary}</p>
          </div>

          {/* Details & Actiepunten */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-red-400">
                <AlertTriangle size={20} />
                Kritieke Fouten (Fix Direct)
              </h3>
              <ul className="space-y-3">
                {report.criticalIssues.map((issue: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span className="text-slate-300 text-sm">{issue}</span>
                  </li>
                ))}
                {report.criticalIssues.length === 0 && (
                  <p className="text-slate-500 text-sm">Geen kritieke fouten gevonden.</p>
                )}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-yellow-400">
                <TrendingUp size={20} />
                Optimalisatie Kansen
              </h3>
              <ul className="space-y-3">
                {report.opportunities.map((opp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 bg-yellow-950/20 border border-yellow-900/30 p-3 rounded-lg">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span className="text-slate-300 text-sm">{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Klaar om te verkopen?</h3>
                <p className="text-sm text-slate-400">Stuur dit rapport naar de lead als PDF om je dienst te pitchen.</p>
              </div>
              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition-colors">
                Download PDF Rapport
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
