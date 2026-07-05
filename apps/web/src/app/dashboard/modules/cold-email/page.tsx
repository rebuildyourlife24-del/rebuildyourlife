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
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-slate-950">
      <Link href="/dashboard/modules" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Cold Email Outreach
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Beheer je leads, genereer hyper-gepersonaliseerde AI e-mail campagnes en automatiseer je sales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CREATE CAMPAIGN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-400" />
            Nieuwe AI Campagne
          </h2>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Interne Naam</label>
              <input 
                type="text" 
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="Bijv. Zomer Promo Webdesign"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">E-mail Onderwerp</label>
              <input 
                type="text" 
                value={campaignSubject}
                onChange={e => setCampaignSubject(e.target.value)}
                placeholder="Snelle vraag over {{companyName}}"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Context voor de AI (Aanbod)</label>
              <textarea 
                value={campaignContext}
                onChange={e => setCampaignContext(e.target.value)}
                rows={4}
                placeholder="We verkopen een webdesign pakket voor €999 inclusief hosting. Benadruk dat we snel kunnen leveren."
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Genereer E-mail Template"}
            </button>
          </form>
        </div>

        {/* MANAGE LEADS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-emerald-400" />
            Leads Toevoegen
          </h2>
          <form onSubmit={handleAddLead} className="space-y-4 mb-8">
            <div className="flex gap-4">
              <input 
                type="text" 
                value={leadFirstName}
                onChange={e => setLeadFirstName(e.target.value)}
                placeholder="Voornaam"
                className="w-1/3 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
              />
              <input 
                type="email" 
                value={leadEmail}
                onChange={e => setLeadEmail(e.target.value)}
                placeholder="E-mailadres"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center border border-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Lead Opslaan
            </button>
          </form>

          <h3 className="font-bold text-slate-400 mb-4">Recente Leads ({leads.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {leads.map(lead => (
              <div key={lead.id} className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-sm">
                <span>{lead.firstName || "Geen naam"}</span>
                <span className="text-slate-400">{lead.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAMPAIGN LIST */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Mijn Campagnes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length === 0 && (
            <div className="col-span-full p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              Nog geen campagnes gegenereerd.
            </div>
          )}
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{camp.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${camp.status === 'DRAFT' ? 'bg-amber-900/30 text-amber-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                    {camp.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{camp.subject}</p>
                <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded-lg mb-6 line-clamp-3 overflow-hidden">
                  {camp.htmlContent.replace(/<[^>]*>?/gm, '')}
                </div>
              </div>
              <button className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 font-bold py-2 rounded-lg transition-colors flex items-center justify-center border border-blue-600/30">
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
