import { prisma } from '@rebuildyourlife/database';
import { Layers, AlertTriangle, PieChart, TrendingDown } from 'lucide-react';

export default async function DebtsPage() {
  const debts = await prisma.debt.findMany({
    include: {
      payments: true
    },
    orderBy: { priority: 'desc' }
  });

  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-cyan-500" />
          Schulden & Budget
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Overzicht van crediteuren, openstaande saldo's en aflossingen (LIVE DATA).</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono uppercase text-zinc-500">Totale Schuldenlast</h2>
            <p className="text-3xl font-bold text-red-400 mt-1">€{totalDebt.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {debts.length === 0 ? (
          <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
            <PieChart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Geen Schulden Gevonden</h3>
            <p className="text-zinc-500 mt-2">Je bent volledig schuldenvrij volgens de database!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {debts.map(debt => {
              const progress = debt.originalAmount > 0 
                ? ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100 
                : 0;

              return (
                <div key={debt.id} className="border border-white/10 bg-black/40 p-6 rounded-xl hover:border-cyan-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-widest">{debt.creditorName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-mono ${debt.status === 'ACTIVE' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                          {debt.status}
                        </span>
                        {debt.priority > 5 && (
                          <span className="text-[10px] px-2 py-1 rounded-full uppercase font-mono bg-amber-500/10 text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Hoge Prioriteit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Openstaand:</span>
                      <span className="font-bold text-red-400">€{debt.currentBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Oorspronkelijk:</span>
                      <span className="text-zinc-300">€{debt.originalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Maandbedrag:</span>
                      <span className="text-zinc-300">€{debt.monthlyPayment.toFixed(2)} ({debt.interestRate}% rente)</span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-mono text-zinc-500 mb-1">
                        <span>Afgerekend</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-cyan-500 h-full" 
                          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
