import { getPendingActions, getWalletBalance, runOmnibusScan } from '@/actions/agentApprovals';
import { ApprovalsMatrix } from '@/components/ApprovalsMatrix';
import { WalletTopUpButton } from '@/components/WalletTopUpButton';
import { Brain, Zap, Wallet, Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function ApprovalsPage() {
  const actions = await getPendingActions();
  const wallet = await getWalletBalance();

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-3">
              <Brain className="w-8 h-8" />
              E-Com Control Matrix
            </h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm">
              Daily Human-in-the-Loop AI Action Approval Protocol
            </p>
          </div>
          
          {/* Wallet Balance Card */}
          <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 flex items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Operating Wallet</p>
                <p className="text-xl font-mono font-bold text-white">€{wallet.fiatBalance.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Payment Button */}
            <WalletTopUpButton />
          </div>
        </div>

        {/* Development Helper: Generate Dummy Action */}
        {actions.length === 0 && (
          <form action={async () => {
            'use server';
            await runOmnibusScan();
          }}>
            <button type="submit" className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 px-4 py-2 rounded-lg text-sm text-zinc-300 font-mono transition-colors">
              <Plus className="w-4 h-4" /> Voer Diepe Netwerkscan Uit (Omnibus)
            </button>
          </form>
        )}

        {/* The Matrix */}
        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
          
          {actions.length === 0 ? (
            <div className="p-16 text-center">
              <Zap className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-300">Geen voorstellen in de queue</h3>
              <p className="text-zinc-500 mt-2 max-w-md mx-auto">De AI heeft momenteel geen acties klaargezet. Zodra Hermes of Orion kansen spot, verschijnen ze hier.</p>
            </div>
          ) : (
            <ApprovalsMatrix initialActions={actions} walletBalance={wallet.fiatBalance} />
          )}
        </div>

      </div>
    </div>
  );
}
