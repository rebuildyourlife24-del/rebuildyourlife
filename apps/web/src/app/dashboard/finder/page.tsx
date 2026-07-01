"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Compass, FileText, CheckCircle, Target, Briefcase, Zap, Loader2 } from "lucide-react";

export default function BusinessModelFinder() {
  const [niche, setNiche] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SEARCHING" | "COMPLETE" | "ERROR">("IDLE");
  const [report, setReport] = useState<any>(null);

  const handleSearch = async () => {
    if (!niche) return;
    setStatus("SEARCHING");
    
    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche })
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
    <div className="p-8 max-w-5xl mx-auto min-h-screen text-white bg-slate-950">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-purple-900/30 rounded-full mb-4">
          <Compass className="text-purple-400" size={40} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Verdienmodel Zoeker</h1>
        <p className="text-slate-400 text-lg">
          Voer een branche of niche in. Onze AI analyseert de markt, identificeert pijnpunten en genereert een onderbouwd rapport over welk verdienmodel hier direct toepasbaar is.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={status === "SEARCHING"}
            placeholder="Bijv. Makelaars in Nederland, of Fitness Coaches..."
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 pl-6 pr-40 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all shadow-xl"
          />
          <button 
            onClick={handleSearch}
            disabled={status === "SEARCHING" || !niche}
            className={\`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold flex items-center gap-2 transition-all \${
              status === "SEARCHING" ? "bg-slate-800 text-slate-400" : "bg-purple-600 hover:bg-purple-500 text-white"
            }\`}
          >
            {status === "SEARCHING" ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {status === "SEARCHING" ? "Zoeken..." : "Analyseer"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {status === "SEARCHING" && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center space-y-6"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
            <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 opacity-50" size={24} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-bold text-slate-200">Internet wordt gescand...</p>
            <p className="text-sm text-slate-500">Analyseren van de branche "{niche}" op pijnpunten en inefficiënties.</p>
          </div>
        </motion.div>
      )}

      {/* Generated Report */}
      {status === "COMPLETE" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle size={24} />
            <p className="font-medium">Onderzoek voltooid! We hebben 1 extreem winstgevend verdienmodel gevonden voor deze branche.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
              <div className="p-4 bg-purple-900/30 rounded-2xl">
                <Target className="text-purple-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Rapport: {niche}</h2>
                <p className="text-slate-400">Gegenereerd op basis van real-time marktdata (2026)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Search className="text-blue-400" size={20} />
                  Markt Pijnpunten
                </h3>
                <ul className="space-y-3">
                  {report?.painPoints?.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="text-blue-400 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Briefcase className="text-emerald-400" size={20} />
                  Voorgesteld Verdienmodel
                </h3>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <p className="font-bold text-xl text-emerald-400 mb-1">{report?.suggestedModelName}</p>
                  <p className="text-slate-300 text-sm mt-3">
                    {report?.suggestedModelDescription}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Zap className="text-yellow-400" size={20} />
                Toepasbaarheid & Actieplan
              </h3>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
                {report?.applicabilityPlan?.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 flex-shrink-0">{idx + 1}</div>
                    <div>
                      <p className="font-bold text-white">{step.title}</p>
                      <p className="text-sm text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Opslaan in Dossier
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
