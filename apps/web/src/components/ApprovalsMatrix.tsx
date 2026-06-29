'use client';

import { useState } from 'react';
import { approveAgentAction, rejectAgentAction } from '@/actions/agentApprovals';
import { Check, X, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

type ActionProps = {
  id: string;
  agentType: string;
  title: string;
  description: string;
  estimatedCost: number;
  estimatedRevenue: number;
  riskLevel: string;
  reasoningApprove?: string | null;
  reasoningDeny?: string | null;
};

export function ApprovalsMatrix({ initialActions, walletBalance }: { initialActions: ActionProps[], walletBalance: number }) {
  const [actions, setActions] = useState(initialActions);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string, cost: number) => {
    if (walletBalance < cost) {
      alert("Je Operating Wallet heeft onvoldoende tegoed voor deze actie. Stort eerst budget.");
      return;
    }
    
    setLoadingId(id);
    try {
      await approveAgentAction(id);
      setActions(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Er is een fout opgetreden');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    try {
      await rejectAgentAction(id);
      setActions(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Er is een fout opgetreden');
    } finally {
      setLoadingId(null);
    }
  };

  if (actions.length === 0) {
    return (
      <div className="p-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Inbox Zero</h3>
        <p className="text-zinc-500 mt-2">Alle voorstellen zijn verwerkt.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto relative z-10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50 uppercase text-[10px] font-black tracking-wider text-zinc-500">
            <th className="p-4 pl-6">Agent</th>
            <th className="p-4">E-Com Voorstel</th>
            <th className="p-4">Kosten (Wallet)</th>
            <th className="p-4">Verwachte Opbrengst</th>
            <th className="p-4">Risico</th>
            <th className="p-4 pr-6 text-right">Autorisatie</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50 font-mono text-sm">
          {actions.map((action) => (
            <tr key={action.id} className="hover:bg-zinc-900/30 transition-colors">
              <td className="p-4 pl-6">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  <span className="font-bold text-cyan-300">{action.agentType}</span>
                </div>
              </td>
              <td className="p-4">
                <p className="font-bold text-white mb-1">{action.title}</p>
                <p className="text-xs text-zinc-500 max-w-sm mb-3">{action.description}</p>
                
                {(action.reasoningApprove || action.reasoningDeny) && (
                  <div className="flex flex-col gap-2 mt-2 max-w-md">
                    {action.reasoningApprove && (
                      <div className="bg-green-500/10 border border-green-500/20 p-2 rounded text-xs text-green-400">
                        <strong className="block mb-0.5">Als je accordeert:</strong>
                        {action.reasoningApprove}
                      </div>
                    )}
                    {action.reasoningDeny && (
                      <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-xs text-red-400">
                        <strong className="block mb-0.5">Als je afwijst:</strong>
                        {action.reasoningDeny}
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td className="p-4">
                <span className="text-red-400 font-bold">- €{action.estimatedCost.toFixed(2)}</span>
              </td>
              <td className="p-4">
                <span className="text-green-400 font-bold">+ €{action.estimatedRevenue.toFixed(2)}</span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className={`w-4 h-4 ${action.riskLevel === 'HIGH' ? 'text-red-500' : action.riskLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className="text-zinc-300 text-xs">{action.riskLevel}</span>
                </div>
              </td>
              <td className="p-4 pr-6 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleReject(action.id)}
                    disabled={loadingId === action.id}
                    className="p-2 bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/50 rounded-lg transition-all disabled:opacity-50"
                    title="Deny"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleApprove(action.id, action.estimatedCost)}
                    disabled={loadingId === action.id || walletBalance < action.estimatedCost}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs"
                    title={walletBalance < action.estimatedCost ? "Onvoldoende budget" : "Approve & Execute"}
                  >
                    <Check className="w-4 h-4" />
                    APPROVE
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
