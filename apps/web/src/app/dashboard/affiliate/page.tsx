import { prisma } from '@rebuildyourlife/database';
import { Network, Link as LinkIcon, DollarSign, Users, ExternalLink, Activity } from 'lucide-react';

export default async function AffiliateDashboardPage() {
  // In production, get user from session. Mocking ID for now or using first user.
  // We'll just fetch all for demonstration if no user is provided, or pick the first active affiliate.
  const affiliate = await prisma.affiliateProfile.findFirst({
    include: {
      user: true,
      clicks: { orderBy: { clickedAt: 'desc' }, take: 10 },
      sales: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Network className="w-8 h-8 text-purple-500" />
          Partner Netwerk
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Verdien {affiliate?.commissionRate || 30}% recurring commissie over elke nieuwe Syndicate of SaaS gebruiker.</p>
      </div>

      {!affiliate ? (
        <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
          <Network className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Word een Partner</h3>
          <p className="text-zinc-500 mt-2 mb-6">Je hebt nog geen affiliate account. Genereer je unieke code en start met bouwen.</p>
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest px-8 py-3 rounded-lg transition-colors">
            Genereer Partner Link
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
              <h3 className="text-xs uppercase font-mono text-zinc-500 mb-2">Totaal Verdiend</h3>
              <p className="text-4xl font-black text-white">€{affiliate.totalEarned.toFixed(2)}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-full">
                <Activity size={12} /> Live Payouts
              </div>
            </div>
            <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
              <h3 className="text-xs uppercase font-mono text-zinc-500 mb-2">Uit te betalen (Pending)</h3>
              <p className="text-4xl font-black text-purple-400">€{affiliate.pendingBalance.toFixed(2)}</p>
              <button disabled={affiliate.pendingBalance < 50} className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs uppercase py-2 rounded transition-colors disabled:opacity-50">
                Aanvragen (Min. €50)
              </button>
            </div>
            <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
              <h3 className="text-xs uppercase font-mono text-zinc-500 mb-2">Jouw Unieke Link</h3>
              <div className="flex items-center gap-2 bg-black border border-white/10 p-3 rounded-lg mt-2">
                <LinkIcon size={14} className="text-zinc-500" />
                <code className="text-sm text-cyan-400 flex-1 truncate">
                  rebuildyourlife.eu/?ref={affiliate.affiliateCode}
                </code>
              </div>
              <button className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white text-xs uppercase py-2 rounded transition-colors">
                Kopieer Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-white/10 bg-black/40 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <DollarSign size={18} className="text-green-500" /> Recente Sales
                </h3>
              </div>
              <div className="p-4">
                {affiliate.sales.length === 0 ? (
                  <p className="text-sm text-zinc-500 p-4 text-center">Nog geen sales geregistreerd.</p>
                ) : (
                  <div className="space-y-3">
                    {affiliate.sales.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-lg">
                        <div>
                          <p className="text-xs uppercase font-mono text-green-400">Sale: €{sale.amount.toFixed(2)}</p>
                          <p className="text-[10px] text-zinc-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">+ €{sale.commission.toFixed(2)}</p>
                          <p className="text-[10px] text-zinc-500 font-mono uppercase">{sale.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border border-white/10 bg-black/40 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Users size={18} className="text-blue-500" /> Recente Clicks
                </h3>
              </div>
              <div className="p-4">
                {affiliate.clicks.length === 0 ? (
                  <p className="text-sm text-zinc-500 p-4 text-center">Nog geen verkeer doorgestuurd.</p>
                ) : (
                  <div className="space-y-3">
                    {affiliate.clicks.map(click => (
                      <div key={click.id} className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-lg">
                        <div>
                          <p className="text-xs font-mono text-zinc-300">{click.ipAddress || 'Unknown IP'}</p>
                          <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{click.userAgent}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 font-mono">{new Date(click.clickedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
