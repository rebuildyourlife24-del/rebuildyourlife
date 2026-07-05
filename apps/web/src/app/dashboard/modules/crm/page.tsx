"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, Building2, Mail, DollarSign, Clock, CheckCircle2, XCircle, FileText, Trash2 } from "lucide-react";
import { getLeadsAction, createLeadAction, updateLeadStageAction, deleteLeadAction } from "@/app/actions/leads";

const STAGES = [
  { id: "NEW", name: "Nieuwe Leads", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "CONTACTED", name: "Gecontacteerd", icon: Mail, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "PROPOSAL", name: "Voorstel", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "WON", name: "Gewonnen", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "LOST", name: "Verloren", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
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
    return <div className="p-8 text-center text-white/50 animate-pulse">Leads laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CRM & Lead Beheer</h1>
          <p className="text-white/60 text-sm mt-1">Beheer je pijplijn en deals</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Lead
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage.id);
          const totalValue = stageLeads.reduce((acc, l) => acc + (l.value || 0), 0);

          return (
            <div key={stage.id} className="min-w-[320px] w-[320px] flex flex-col gap-4 snap-start">
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${stage.bg}`}>
                    <stage.icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                  <h3 className="font-semibold text-white/90">{stage.name}</h3>
                  <span className="text-xs font-medium bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                {totalValue > 0 && (
                  <span className="text-sm font-medium text-white/80">
                    €{totalValue.toLocaleString('nl-NL')}
                  </span>
                )}
              </div>

              {/* Column Cards */}
              <div className="flex-1 min-h-[500px] bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3">
                {stageLeads.map((lead) => (
                  <div key={lead.id} className="bg-[#111111] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white text-sm">{lead.name}</h4>
                        {lead.company && (
                          <div className="flex items-center gap-1.5 text-white/50 text-xs mt-1">
                            <Building2 className="w-3 h-3" />
                            {lead.company}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {lead.value > 0 && (
                      <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium mb-3">
                        <DollarSign className="w-4 h-4" />
                        €{lead.value.toLocaleString('nl-NL')}
                      </div>
                    )}

                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3 truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        {lead.email}
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/5 mt-auto">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleStageChange(lead.id, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/70 outline-none focus:border-blue-500/50 appearance-none"
                      >
                        {STAGES.map(s => (
                          <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                            Verplaats naar: {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                
                {stageLeads.length === 0 && (
                  <div className="text-center text-white/30 text-sm py-8 border-2 border-dashed border-white/5 rounded-lg">
                    Geen leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Nieuwe Lead Toevoegen</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Naam (Verplicht)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="bijv. Jan Jansen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">E-mailadres</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="jan@bedrijf.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Bedrijf B.V."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Deal Waarde (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={e => setFormData({...formData, value: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Notities</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24 resize-none"
                  placeholder="Extra informatie over deze lead..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
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
