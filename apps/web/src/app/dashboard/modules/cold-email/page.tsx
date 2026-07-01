"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Search, Send, Play, Pause, BarChart3, Settings } from "lucide-react";

export default function ColdEmailModule() {
  const [niche, setNiche] = useState("Tandartsen in Amsterdam");
  const [pitch, setPitch] = useState("Wij kunnen een AI chatbot bouwen die 24/7 afspraken voor u inplant.");
  const [status, setStatus] = useState<"IDLE" | "SCRAPING" | "SENDING" | "COMPLETE">("IDLE");
  
  const [stats, setStats] = useState({
    leadsFound: 0,
    emailsSent: 0,
    opened: 0,
    replied: 0
  });

  const [liveLeads, setLiveLeads] = useState<any[]>([]);

  const handleStartCampaign = async () => {
    setStatus("SCRAPING");
    try {
      const res = await fetch("/api/cold-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, pitch })
      });
      
      if (!res.ok) throw new Error("API Fout");
      
      const data = await res.json();
      setLiveLeads(data.leads || []);
      setStats({
        leadsFound: data.leads?.length || 0,
        emailsSent: data.leads?.length || 0, // In this real demo, we simulate sending to all found
        opened: 0,
        replied: 0
      });
      setStatus("COMPLETE");
    } catch (err) {
      console.error(err);
      setStatus("IDLE");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen text-white bg-slate-950">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Mail className="text-emerald-500" size={32} />
            <h1 className="text-3xl font-bold">Cold Email Outreach Engine</h1>
          </div>
          <p className="text-slate-400">
            AI schraapt leads voor je op basis van je niche en stuurt hyper-gepersonaliseerde e-mails om calls in te plannen.
          </p>
        </div>
        <button 
          onClick={handleStartCampaign}
          disabled={status !== "IDLE"}
          className={\`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg \${
            status === "IDLE" 
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 text-white" 
              : "bg-slate-800 text-slate-500 cursor-wait"
          }\`}
        >
          {status === "IDLE" ? <Play size={20} /> : <Search size={20} className="animate-spin" />}
          {status === "IDLE" ? "Start Campagne" : "Bezig met Scrapen..."}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Linker kolom: Campagne Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-blue-400" size={20} />
              Campagne Configuratie
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Doelgroep (Niche & Locatie)
                </label>
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Bijv. Advocatenkantoren in Rotterdam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Wat verkoop je? (De Pitch)
                </label>
                <textarea 
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Vertel de AI wat we aan deze leads willen verkopen..."
                />
                <p className="text-xs text-slate-500 mt-2">De AI zal elke e-mail persoonlijk maken op basis van de website van de lead, en deze pitch verwerken.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Send className="text-purple-400" size={20} />
              Live Inbox (Recente Antwoorden)
            </h2>
            <div className="space-y-3">
              {liveLeads.length === 0 && status !== "SCRAPING" && (
                <p className="text-slate-500 text-sm">Nog geen campagne gestart.</p>
              )}
              {liveLeads.map((lead: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between items-start gap-2">
                  <div className="flex justify-between w-full">
                    <h4 className="font-bold text-sm text-emerald-400">{lead.companyName}</h4>
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold">Verzonden</span>
                  </div>
                  <p className="text-slate-500 text-xs font-mono">{lead.email}</p>
                  <p className="text-slate-300 text-xs mt-1 italic">"{lead.personalizedPitch}"</p>
                </div>
              ))}
              {status === "SCRAPING" && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                  <Search size={16} className="animate-spin text-slate-500" />
                  <p className="text-slate-500 text-sm">AI zoekt momenteel naar realtime leads in "{niche}"...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rechter kolom: Analytics */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="text-emerald-400" size={20} />
              Campagne Resultaten
            </h2>
            
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm">Leads Gevonden</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.leadsFound}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm">E-mails Verzonden</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.emailsSent}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm">Geopend</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-3xl font-bold text-blue-400">{stats.opened}</p>
                  <p className="text-sm text-slate-500 mb-1">({stats.emailsSent > 0 ? Math.round((stats.opened/stats.emailsSent)*100) : 0}%)</p>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/50">
                <p className="text-slate-400 text-sm">Antwoorden (Leads)</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-3xl font-bold text-emerald-400">{stats.replied}</p>
                  <p className="text-sm text-slate-500 mb-1">({stats.emailsSent > 0 ? Math.round((stats.replied/stats.emailsSent)*100) : 0}%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
