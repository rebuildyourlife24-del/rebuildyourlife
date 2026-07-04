"use client";

import { useState, useEffect } from "react";
import { getEmailCampaigns, createEmailCampaign } from "@/app/actions/mailer";
import { Mail, Send, Users, Edit3, PieChart, Plus } from "lucide-react";

export default function NativeMailerPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [subsCount, setSubsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [newCampaignName, setNewCampaignName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getEmailCampaigns();
    if (res.success) {
      setCampaigns(res.campaigns || []);
      setSubsCount(res.subsCount || 0);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newCampaignName.trim() || isCreating) return;
    setIsCreating(true);
    const res = await createEmailCampaign(newCampaignName, "Nieuwe Onderwerpregel");
    if (res.success) {
      setNewCampaignName("");
      loadData();
    }
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 text-white min-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
            <Mail className="w-8 h-8 text-amber-500" />
            RYL Mailer & Broadcasts
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-2 max-w-xl">
            Volledig onafhankelijke e-mail marketing. Stuur nieuwsbrieven direct vanuit Godbrain (via AWS/Resend) en zeg je Klaviyo of Mailchimp abonnement op.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-500" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-500/70">Actieve Subscribers</span>
              <span className="block text-sm font-black">{subsCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h3 className="font-bold uppercase tracking-widest text-sm">Nieuwe E-mail Campagne</h3>
        <div className="flex bg-zinc-900 border border-white/5 rounded-xl overflow-hidden p-1 w-full sm:w-auto">
          <input 
            type="text"
            placeholder="Interne naam..."
            value={newCampaignName}
            onChange={e => setNewCampaignName(e.target.value)}
            className="bg-transparent px-4 py-2 text-sm outline-none w-full sm:w-64"
          />
          <button 
            onClick={handleCreate}
            disabled={isCreating || !newCampaignName.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shrink-0"
          >
            {isCreating ? 'Bezig...' : <><Plus className="w-4 h-4" /> Aanmaken</>}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-t-2 border-amber-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="border border-white/10 bg-black/40 p-12 rounded-2xl text-center">
          <Send className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Geen Campagnes</h3>
          <p className="text-zinc-500 mb-6">Start je eerste onafhankelijke e-mail campagne.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(camp => (
            <div key={camp.id} className="border border-white/10 bg-black/60 rounded-xl p-5 hover:border-amber-500/50 transition-colors flex flex-col md:flex-row items-center justify-between gap-6 group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold">{camp.name}</h3>
                  <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                    camp.status === 'SENT' ? 'bg-green-500/20 text-green-400' : 
                    camp.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' : 
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono">Subj: "{camp.subject}"</p>
              </div>

              <div className="flex items-center gap-8 text-xs font-mono text-zinc-400 w-full md:w-auto justify-between md:justify-start">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-zinc-600 uppercase font-sans font-bold tracking-widest">Sent</span>
                  <span className="text-white">{camp.sentCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-zinc-600 uppercase font-sans font-bold tracking-widest">Opened</span>
                  <span className="text-white">{camp.openCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-zinc-600 uppercase font-sans font-bold tracking-widest">Clicked</span>
                  <span className="text-amber-400">{camp.clickCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg p-2.5 text-zinc-400 hover:text-white transition-colors">
                  <Edit3 className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 md:flex-none bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg p-2.5 text-zinc-400 hover:text-white transition-colors">
                  <PieChart className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 md:flex-none bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/30 rounded-lg py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
