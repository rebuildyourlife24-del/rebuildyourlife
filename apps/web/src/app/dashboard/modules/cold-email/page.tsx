"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Mail, Search, Send, Play, Pause, BarChart, Settings } from "lucide-react";
import { generateColdEmailAction } from "../../../actions/modules";

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

  const [autopilotEnabled, setAutopilotEnabled] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleStartCampaign = () => {
    setStatus("SCRAPING");
    
    startTransition(async () => {
      try {
        const res = await generateColdEmailAction(pitch, niche);
        
        if (res.success && res.sequence) {
          // We mock a lead response for the UI visualization based on the sequence
          const leads = [
            { companyName: "Dental Care Plus", email: "info@dentalcareplus.nl", personalizedPitch: res.sequence[0].body.substring(0, 100) + "..." },
            { companyName: "Tandartspraktijk de Molen", email: "contact@demolen.nl", personalizedPitch: res.sequence[0].body.substring(0, 100) + "..." },
            { companyName: "Mondzorg Centrum", email: "hello@mondzorg.nl", personalizedPitch: res.sequence[0].body.substring(0, 100) + "..." }
          ];
          
          setLiveLeads(leads);
          setStatus("SENDING");
          
          setStats({
            leadsFound: leads.length,
            emailsSent: leads.length,
            opened: 0,
            replied: 0
          });
          
          setTimeout(() => {
            setStatus("COMPLETE");
          }, 1500);
        } else {
          throw new Error("Generatie mislukt");
        }
      } catch (err) {
        console.error(err);
        setStatus("IDLE");
      }
    });
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
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
            status === "IDLE" 
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 text-white" 
              : "bg-slate-800 text-slate-500 cursor-wait"
          }`}
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

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                      <Play className="text-cyan-400 w-4 h-4" /> 
                      GodBrain Autopilot
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Laat de AI daadwerkelijk de gegenereerde e-mails versturen via jouw ingestelde SMTP.</p>
                  </div>
                  <button 
                    onClick={() => setAutopilotEnabled(!autopilotEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autopilotEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autopilotEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
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
              <BarChart className="text-emerald-400" size={20} />
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
