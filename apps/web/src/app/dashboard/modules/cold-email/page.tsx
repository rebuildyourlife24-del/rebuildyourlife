"use client";

import React, { useState, useEffect } from "react";
import { createEmailCampaign, getUserCampaigns, addLead, getLeads } from "@/app/actions/cold-email";
import { Mail, Plus, Users, Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ColdEmailPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // New Campaign State
  const [campaignName, setCampaignName] = useState("");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContext, setCampaignContext] = useState("");

  // New Lead State
  const [leadEmail, setLeadEmail] = useState("");
  const [leadFirstName, setLeadFirstName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const camps = await getUserCampaigns();
      const lds = await getLeads();
      setCampaigns(camps);
      setLeads(lds);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || !campaignSubject || !campaignContext) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await createEmailCampaign(campaignName, campaignSubject, campaignContext);
      if (!res.success) {
        setError(res.error || "Fout bij maken campagne.");
      } else {
        await loadData();
        setCampaignName("");
        setCampaignSubject("");
        setCampaignContext("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;

    try {
      const res = await addLead(leadEmail, leadFirstName);
      if (!res.success) {
        alert(res.error);
      } else {
        await loadData();
        setLeadEmail("");
        setLeadFirstName("");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <Link href="/dashboard/modules" className="flex items-center text-zinc-500 hover:text-cyan-400 mb-8 transition-colors uppercase tracking-widest text-xs font-bold">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          Cold Email Outreach
        </h1>
        <p className="text-zinc-400 mt-2 text-lg font-light">
          Beheer je leads, genereer hyper-gepersonaliseerde AI e-mail campagnes en automatiseer je sales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CREATE CAMPAIGN */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700"></div>

          <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-wider relative z-10">
            <Mail className="w-5 h-5 mr-2 text-cyan-400" />
            Nieuwe AI Campagne
          </h2>
          <form onSubmit={handleCreateCampaign} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Interne Naam</label>
              <input 
                type="text" 
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="Bijv. Zomer Promo Webdesign"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">E-mail Onderwerp</label>
              <input 
                type="text" 
                value={campaignSubject}
                onChange={e => setCampaignSubject(e.target.value)}
                placeholder="Snelle vraag over {{companyName}}"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Context voor de AI (Aanbod)</label>
              <textarea 
                value={campaignContext}
                onChange={e => setCampaignContext(e.target.value)}
                rows={4}
                placeholder="We verkopen een webdesign pakket voor €999 inclusief hosting. Benadruk dat we snel kunnen leveren."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none resize-none custom-scrollbar"
                required
              />
            </div>

            {error && <div className="text-red-400 text-xs font-mono border border-red-500/30 bg-red-500/10 p-2 rounded">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-black uppercase tracking-widest py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Genereer E-mail Template"}
            </button>
          </form>
        </div>

        {/* MANAGE LEADS */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700"></div>
          <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-wider relative z-10">
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Leads Toevoegen
          </h2>
          <form onSubmit={handleAddLead} className="space-y-4 mb-8 relative z-10">
            <div className="flex gap-4">
              <input 
                type="text" 
                value={leadFirstName}
                onChange={e => setLeadFirstName(e.target.value)}
                placeholder="Voornaam"
                className="w-1/3 bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all outline-none"
              />
              <input 
                type="email" 
                value={leadEmail}
                onChange={e => setLeadEmail(e.target.value)}
                placeholder="E-mailadres"
                className="flex-1 bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center border border-purple-500/30 uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            >
              <Plus className="w-4 h-4 mr-2" /> Lead Opslaan
            </button>
          </form>

          <h3 className="font-bold text-zinc-500 mb-4 uppercase tracking-wider text-xs relative z-10">Recente Leads ({leads.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {leads.map(lead => (
              <div key={lead.id} className="flex justify-between p-3 bg-zinc-950/50 rounded-lg border border-white/5 text-sm hover:border-purple-500/30 transition-colors">
                <span className="text-white font-medium">{lead.firstName || "Geen naam"}</span>
                <span className="text-zinc-500 font-mono">{lead.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAMPAIGN LIST */}
      <div className="mt-8">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-widest text-white flex items-center gap-2">
          Mijn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Campagnes</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length === 0 && (
            <div className="col-span-full p-8 text-center border border-dashed border-white/20 rounded-2xl text-zinc-500 font-mono text-sm uppercase tracking-wider">
              Nog geen campagnes gegenereerd.
            </div>
          )}
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-white uppercase tracking-wider">{camp.name}</h3>
                  <span className={`px-2 py-1 text-[10px] uppercase font-mono tracking-widest rounded border font-bold ${camp.status === 'DRAFT' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                    {camp.status}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{camp.subject}</p>
                <div className="text-xs text-zinc-500 bg-zinc-950/50 p-3 rounded-lg mb-6 line-clamp-3 overflow-hidden font-mono border border-white/5">
                  {camp.htmlContent.replace(/<[^>]*>?/gm, '')}
                </div>
              </div>
              <button className="relative z-10 w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Send className="w-4 h-4 mr-2" />
                Review & Verzend
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
