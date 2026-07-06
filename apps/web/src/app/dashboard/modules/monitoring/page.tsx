"use client";

import { useState, useEffect } from "react";
import { Globe, Plus, Trash2, RefreshCw, CheckCircle2, XCircle, Clock, Activity } from "lucide-react";
import { getMonitorsAction, createMonitorAction, deleteMonitorAction, checkMonitorAction } from "@/app/actions/monitoring";

export default function MonitoringModule() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    interval: "5"
  });

  const fetchMonitors = async () => {
    const res = await getMonitorsAction();
    if (res.success && res.monitors) {
      setMonitors(res.monitors);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;
    setIsSubmitting(true);
    
    const res = await createMonitorAction({
      name: formData.name,
      url: formData.url,
      interval: parseInt(formData.interval, 10)
    });

    if (res.success) {
      setFormData({ name: "", url: "", interval: "5" });
      setIsModalOpen(false);
      fetchMonitors();
    } else {
      alert("Fout bij toevoegen: " + res.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (monitorId: string) => {
    if (!confirm("Weet je zeker dat je deze monitor wilt verwijderen? Alle logs worden ook verwijderd.")) return;
    
    // Optimistic update
    setMonitors(prev => prev.filter(m => m.id !== monitorId));
    
    const res = await deleteMonitorAction(monitorId);
    if (!res.success) {
      fetchMonitors(); // Revert on failure
      alert("Fout bij verwijderen: " + res.error);
    }
  };

  const handleCheck = async (monitorId: string) => {
    setCheckingId(monitorId);
    const res = await checkMonitorAction(monitorId);
    if (res.success) {
      // Refresh the specific monitor's status locally or just fetch all
      fetchMonitors();
    } else {
      alert("Fout bij het controleren: " + res.error);
    }
    setCheckingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UP":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> ONLINE</span>;
      case "DOWN":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> OFFLINE</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20"><Clock className="w-3.5 h-3.5" /> PENDING</span>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse font-mono uppercase tracking-wider text-sm">Monitors laden...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-8 min-h-screen text-white bg-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] flex items-center gap-3">
            <Globe className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            Uptime Monitoring
          </h1>
          <p className="text-zinc-400 mt-2 text-lg font-light">Krijg inzicht in de bereikbaarheid en prestaties van je websites.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl transition-all font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Monitor
        </button>
      </div>

      {/* Monitors List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monitors.map((monitor) => (
          <div key={monitor.id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-colors relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
            
            <div className="p-5 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white mb-1 truncate">{monitor.name}</h3>
                  <a href={monitor.url} target="_blank" rel="noreferrer" className="text-zinc-500 font-mono text-xs hover:text-cyan-400 hover:underline truncate block max-w-[200px] transition-colors">
                    {monitor.url}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(monitor.id)}
                    className="text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 p-1.5 rounded border border-red-500/20"
                    title="Verwijderen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                {getStatusBadge(monitor.status)}
                
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-mono text-xs">
                    {monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'}) : 'Nooit'}
                  </span>
                  <button
                    onClick={() => handleCheck(monitor.id)}
                    disabled={checkingId === monitor.id}
                    className="p-1.5 bg-zinc-900 border border-white/10 hover:border-cyan-500/30 rounded-lg text-cyan-400 transition-colors disabled:opacity-50"
                    title="Check nu"
                  >
                    <RefreshCw className={`w-4 h-4 ${checkingId === monitor.id ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Logs Preview (Latest 3) */}
              {monitor.logs && monitor.logs.length > 0 && (
                <div className="mt-4 space-y-1.5 bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5 mb-2">
                    <Activity className="w-3 h-3 text-cyan-500" />
                    Recente pings
                  </div>
                  {monitor.logs.slice(0, 3).map((log: any) => (
                    <div key={log.id} className="flex justify-between items-center text-xs font-mono">
                      <span className={log.status === "UP" ? "text-emerald-400" : "text-red-400"}>
                        {log.statusCode || "Error"}
                      </span>
                      <span className="text-zinc-500">
                        {log.responseTime ? `${log.responseTime}ms` : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {monitors.length === 0 && (
          <div className="col-span-full text-center py-16 bg-black/40 border border-dashed border-white/20 rounded-2xl">
            <Globe className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-white font-bold uppercase tracking-wider mb-1">Geen monitors actief</h3>
            <p className="text-zinc-500 font-mono text-sm mb-6">Voeg een website toe om de uptime in de gaten te houden.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              Website Toevoegen
            </button>
          </div>
        )}
      </div>

      {/* New Monitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10 bg-black/40">
              <h2 className="text-lg font-black uppercase tracking-widest text-white">Nieuwe Monitor</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Naam</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                  placeholder="Mijn Webshop"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Website URL</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-mono"
                  placeholder="https://jouwwebsite.nl"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Controle Interval</label>
                <select
                  value={formData.interval}
                  onChange={e => setFormData({...formData, interval: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all appearance-none uppercase font-bold text-xs tracking-wider"
                >
                  <option value="1" className="bg-zinc-950 text-white uppercase">Elke 1 minuut</option>
                  <option value="5" className="bg-zinc-950 text-white uppercase">Elke 5 minuten</option>
                  <option value="15" className="bg-zinc-950 text-white uppercase">Elke 15 minuten</option>
                  <option value="60" className="bg-zinc-950 text-white uppercase">Elke 60 minuten</option>
                </select>
                <p className="text-xs text-zinc-600 font-mono mt-2">Opmerking: Automatische checks draaien via de backend CRON job op dit interval.</p>
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
                  {isSubmitting ? 'Bezig...' : 'Monitor Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
