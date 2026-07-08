'use client';

import { useEffect, useState } from 'react';
import { Shield, Check, X, Loader2, Bot, AlertTriangle, FileText } from 'lucide-react';

interface ActionProposal {
  id: string;
  agentId: string;
  agentName: string;
  category: string;
  proposedPayload: any;
  riskAmountCents: number | null;
  justification: string;
  status: string;
  requestedAt: string;
}

export default function SentinelDashboard() {
  const [items, setItems] = useState<ActionProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/sentinel/pending');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      alert('Kan de Sentinel wachtrij niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/sentinel/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        alert(data.error || 'Fout bij verwerken');
      }
    } catch (err) {
      alert('Fout bij verwerken van de actie.');
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (cents: number | null) => {
    if (cents === null || cents === 0) return '€0.00';
    return `€${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Sentinel Vault
          </h1>
          <p className="text-white/60 mt-1">
            Centrale goedkeuringsautoriteit voor alle riskante of grensverleggende agent-acties.
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 font-semibold">{items.length} Voorstellen wachten op goedkeuring</span>
        </div>
      </div>

      {/* Grid of Actions */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
          Geen pending acties. De agenten hebben momenteel niets ter goedkeuring klaarliggen.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Category Strip */}
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/5 rounded-xl">
                      <Bot className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{item.agentName}</h3>
                      <p className="text-xs text-white/50 font-mono">{item.category}</p>
                    </div>
                  </div>
                  {item.riskAmountCents !== null && item.riskAmountCents > 0 && (
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-amber-400 text-sm font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      Risico: {formatCurrency(item.riskAmountCents)}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Justification
                    </h4>
                    <p className="text-white/80 leading-relaxed text-sm">
                      {item.justification}
                    </p>
                  </div>

                  <div className="bg-black/50 rounded-lg p-4 border border-white/5">
                    <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Proposed Payload (Raw JSON)
                    </h4>
                    <pre className="text-xs text-blue-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-32">
                      {JSON.stringify(item.proposedPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleAction(item.id, 'APPROVE')}
                  disabled={processingId === item.id}
                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {processingId === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  GOEDKEUREN
                </button>
                <button
                  onClick={() => handleAction(item.id, 'REJECT')}
                  disabled={processingId === item.id}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {processingId === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                  AFWIJZEN
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
