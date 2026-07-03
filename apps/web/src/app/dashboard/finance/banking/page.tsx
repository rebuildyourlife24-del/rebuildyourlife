import { prisma } from '@rebuildyourlife/database';
import { CreditCard, Landmark, ArrowRightLeft, Shield } from 'lucide-react';

export default async function BankingPage() {
  const connections = await prisma.bankConnection.findMany({
    include: {
      transactions: {
        take: 5,
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-cyan-500" />
          Bank & Transacties
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Beheer je gekoppelde rekeningen (PSD2/Open Banking). (LIVE DATA)</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {connections.length === 0 ? (
          <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
            <Landmark className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Geen Banken Gekoppeld</h3>
            <p className="text-zinc-500 mt-2">Koppel je zakelijke of privé rekening via PSD2 / Plaid.</p>
          </div>
        ) : (
          connections.map(bank => (
            <div key={bank.id} className="border border-white/10 bg-black/40 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center border border-white/10">
                    <Landmark className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{bank.accountName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${bank.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-mono text-zinc-400 uppercase">{bank.provider}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-zinc-500 uppercase flex items-center justify-end gap-1"><Shield className="w-3 h-3 text-green-500" /> PSD2 Sync</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Laatst: {bank.lastSyncAt.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" /> Recente Transacties (Laatste 5)
                </h3>
                
                {bank.transactions.length === 0 ? (
                  <p className="text-sm text-zinc-600">Geen transacties gevonden op deze rekening.</p>
                ) : (
                  <div className="space-y-2">
                    {bank.transactions.map(trx => (
                      <div key={trx.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 bg-black/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${trx.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            <ArrowRightLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{trx.description || 'Transactie'}</p>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase">{trx.category} • {trx.timestamp.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`text-lg font-bold ${trx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                          {trx.amount > 0 ? '+' : ''}{trx.amount.toFixed(2)} {trx.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
