'use client';

import { useEffect, useState } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface TelemetryLog {
  id: string;
  sourceType: string;
  actionType: string;
  content: string;
  contextData: any;
  createdAt: string;
}

export default function OversightDashboard() {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [stats, setStats] = useState({ pending_approvals: 0, total_logs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Live poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/agents/oversight');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch oversight logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Toezichtscentrum (God View)
          </h1>
          <p className="text-white/60 mt-1">
            Real-time telemetrie en Human-in-the-Loop autorisatie.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-orange-500/80 uppercase font-semibold">Wachten op goedkeuring</p>
              <p className="text-xl font-bold text-orange-400">{stats.pending_approvals} Acties</p>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-green-500/80 uppercase font-semibold">Systeem Status</p>
              <p className="text-xl font-bold text-green-400">Beveiligd</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-xl">
        <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" /> De 4 Sovereign Guardrails Actief
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-200/70">
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> Regel 1: Maximaal 3 loops per agent (Circuit Breaker).</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> Regel 2: Kritieke acties vereisen handmatige goedkeuring.</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> Regel 3: Alle acties worden gelogd in dit Toezichtscentrum.</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> Regel 4: Het Opus Bouwplan overrulet alle andere instructies.</li>
        </ul>
      </div>

      {/* Live Feed */}
      <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/50" />
          Live Zenuwstelsel (Global Neural Network)
        </div>
        
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-white/40">Systeem aan het initialiseren...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-white/40">Geen netwerk activiteit gevonden.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors rounded-lg flex flex-col md:flex-row gap-4">
                <div className="w-32 flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${log.sourceType === 'HERMES' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {log.sourceType} {log.contextData?.role ? `(${log.contextData.role})` : ''}
                  </span>
                  <div className="text-[10px] text-white/40 mt-2 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-white/30 font-bold mb-1">
                    {log.actionType}
                  </div>
                  <div className="text-sm text-white/80 font-mono whitespace-pre-wrap">
                    {log.content.length > 300 ? log.content.substring(0, 300) + '...' : log.content}
                  </div>
                </div>
                
                <div className="w-48 flex-shrink-0 text-xs text-white/40">
                  {log.contextData?.model_used && (
                    <div className="truncate">Model: {log.contextData.model_used}</div>
                  )}
                  {log.contextData?.provider && (
                    <div className="truncate">API: {log.contextData.provider}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
