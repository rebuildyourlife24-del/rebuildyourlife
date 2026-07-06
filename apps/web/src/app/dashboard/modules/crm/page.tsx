"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, Building2, Mail, DollarSign, Clock, CheckCircle2, XCircle, FileText, Trash2 } from "lucide-react";
import { getLeadsAction, createLeadAction, updateLeadStageAction, deleteLeadAction } from "@/app/actions/leads";

const STAGES = [
  { id: "NEW", name: "Nieuwe Leads", icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { id: "CONTACTED", name: "Gecontacteerd", icon: Mail, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { id: "PROPOSAL", name: "Voorstel", icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { id: "WON", name: "Gewonnen", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { id: "LOST", name: "Verloren", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
];

export default function CRMModule() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    value: "",
    notes: ""
  });

  const fetchLeads = async () => {
    const res = await getLeadsAction();
    if (res.success && res.leads) {
      setLeads(res.leads);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setIsSubmitting(true);
    
    const valueNum = formData.value ? parseFloat(formData.value) : undefined;
    
    const res = await createLeadAction({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      value: valueNum,
      notes: formData.notes
    });

    if (res.success) {
      setFormData({ name: "", email: "", company: "", value: "", notes: "" });
      setIsModalOpen(false);
      fetchLeads();
    } else {
      alert("Fout bij aanmaken lead: " + res.error);
    }
    setIsSubmitting(false);
  };

  const handleStageChange = async (leadId: string, newStage: string) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
    const res = await updateLeadStageAction(leadId, newStage);
    if (!res.success) {
      fetchLeads(); // Revert on failure
      alert("Fout bij verplaatsen: " + res.error);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Weet je zeker dat je deze lead wilt verwijderen?")) return;
    // Optimistic update
    setLeads(prev => prev.filter(l => l.id !== leadId));
    const res = await deleteLeadAction(leadId);
    if (!res.success) {
      fetchLeads(); // Revert on failure
      alert("Fout bij verwijderen: " + res.error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse font-mono uppercase tracking-wider text-sm">Leads laden...</div>;
  }

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">CRM & Lead Beheer</h1>
          <p className="text-zinc-400 mt-2 text-lg font-light">Beheer je pijplijn en deals</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl transition-all font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Lead
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage.id);
          const totalValue = stageLeads.reduce((acc, l) => acc + (l.value || 0), 0);

          return (
            <div key={stage.id} className="min-w-[320px] w-[320px] flex flex-col gap-4 snap-start">
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md border ${stage.bg}`}>
                    <stage.icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider text-white text-sm">{stage.name}</h3>
                  <span className="text-[10px] font-mono font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded border border-white/10">
                    {stageLeads.length}
                  </span>
                </div>
                {totalValue > 0 && (
                  <span className="text-sm font-mono font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                    €{totalValue.toLocaleString('nl-NL')}
                  </span>
                )}
              </div>

              {/* Column Cards */}
              <div className="flex-1 min-h-[500px] bg-black/40 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1/2 rounded-full blur-[80px] pointer-events-none opacity-20 ${stage.bg.split(' ')[0]}`}></div>
                
                <div className="relative z-10 flex flex-col gap-3">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all group backdrop-blur-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-wider text-sm">{lead.name}</h4>
                          {lead.company && (
                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1 font-mono uppercase">
                              <Building2 className="w-3 h-3" />
                              {lead.company}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 p-1.5 rounded border border-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {lead.value > 0 && (
                        <div className="flex items-center gap-1.5 text-cyan-400 text-sm font-bold font-mono mb-3">
                          <DollarSign className="w-4 h-4" />
                          €{lead.value.toLocaleString('nl-NL')}
                        </div>
                      )}

                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-3 truncate font-mono">
                          <Mail className="w-3 h-3 shrink-0" />
                          {lead.email}
                        </div>
                      )}

                      <div className="pt-3 border-t border-white/10 mt-auto">
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs uppercase tracking-wider font-bold text-zinc-400 outline-none focus:border-cyan-500/50 appearance-none hover:bg-zinc-900 transition-colors"
                        >
                          {STAGES.map(s => (
                            <option key={s.id} value={s.id} className="bg-zinc-950 text-white font-mono uppercase">
                              Verplaats naar: {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="text-center text-zinc-600 text-xs uppercase font-mono tracking-widest py-8 border-2 border-dashed border-white/5 rounded-xl">
                      Geen leads
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10 bg-black/40">
              <h2 className="text-lg font-black uppercase tracking-widest text-white">Nieuwe Lead Toevoegen</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Naam (Verplicht)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                  placeholder="bijv. Jan Jansen"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">E-mailadres</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                  placeholder="jan@bedrijf.nl"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                  placeholder="Bedrijf B.V."
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Deal Waarde (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={e => setFormData({...formData, value: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-mono"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Notities</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all h-24 resize-none custom-scrollbar"
                  placeholder="Extra informatie over deze lead..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-bold uppercase tracking-widest text-xs border border-white/10"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                  {isSubmitting ? 'Bezig...' : 'Lead Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
