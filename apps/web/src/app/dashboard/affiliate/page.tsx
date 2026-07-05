import { prisma } from '@rebuildyourlife/database';
import { Network, Link as LinkIcon, DollarSign, Users, ExternalLink, Activity } from 'lucide-react';
import { getSessionAction } from '@/app/actions/auth';
import { createAffiliateProfileAction } from '@/app/actions/affiliate';
import { redirect } from 'next/navigation';

export default async function AffiliateDashboardPage() {
  const session = await getSessionAction();
  if (!session?.success || !session?.user?.id) {
    redirect('/login');
  }

  const affiliate = await prisma.affiliateProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      clicks: { orderBy: { clickedAt: 'desc' }, take: 10 },
      sales: { orderBy: { createdAt: 'desc' }, take: 10 },
      tier2Sales: { orderBy: { createdAt: 'desc' }, take: 10 },
      _count: {
        select: { subAffiliates: true, tier2Sales: true }
      }
    }
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-purple-500/30 glass-cyber p-8 md:p-12 group mb-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-purple-500/10 border border-purple-500/40 text-purple-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Network className="w-3 h-3 mr-2" />
                Affiliate Program
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Partner <span className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">Netwerk</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Verdien €500 vaste commissie per Elite Sale. Bouw een team en verdien €100 per sub-sale.
            </p>
          </div>
        </div>
      </div>

      {!affiliate ? (
        <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
          <Network className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Word een Partner</h3>
          <p className="text-zinc-500 mt-2 mb-6">Je hebt nog geen affiliate account. Genereer je unieke code en start met bouwen.</p>
          <form action={async (formData) => {
            "use server";
            await createAffiliateProfileAction(formData);
          }}>
            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest px-8 py-3 rounded-lg transition-colors">
              Genereer Partner Link
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <h3 className="text-xs uppercase font-mono text-zinc-500 mb-2">Jouw Sales Link</h3>
              <div className="flex items-center gap-2 bg-black border border-white/10 p-3 rounded-lg mt-2">
                <LinkIcon size={14} className="text-zinc-500" />
                <code className="text-[10px] text-cyan-400 flex-1 truncate">
                  rebuildyourlife.eu/?ref={affiliate.affiliateCode}
                </code>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Deel deze link voor €500 per Elite Sale.</p>
            </div>
            <div className="border border-purple-500/30 bg-purple-900/10 p-6 rounded-xl">
              <h3 className="text-xs uppercase font-mono text-purple-400 mb-2 flex items-center gap-2"><Network size={14}/> Team Werven</h3>
              <div className="flex items-center gap-2 bg-black border border-white/10 p-3 rounded-lg mt-2">
                <Users size={14} className="text-purple-500" />
                <code className="text-[10px] text-purple-400 flex-1 truncate">
                  rebuildyourlife.eu/join?sponsor={affiliate.affiliateCode}
                </code>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">Krijg €100 passief voor élke sale uit je team.</p>
              <p className="text-xs font-bold text-white mt-1">Huidig Team: {affiliate._count.subAffiliates} verkopers</p>
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
                {affiliate.sales.length === 0 && affiliate.tier2Sales.length === 0 ? (
                  <p className="text-sm text-zinc-500 p-4 text-center">Nog geen sales geregistreerd.</p>
                ) : (
                  <div className="space-y-3">
                    {affiliate.sales.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-lg">
                        <div>
                          <p className="text-xs uppercase font-mono text-green-400">Directe Sale (Tier 1)</p>
                          <p className="text-[10px] text-zinc-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">+ €{sale.commission.toFixed(2)}</p>
                          <p className="text-[10px] text-zinc-500 font-mono uppercase">{sale.status}</p>
                        </div>
                      </div>
                    ))}
                    {affiliate.tier2Sales.map(sale => (
                      <div key={`t2-${sale.id}`} className="flex items-center justify-between p-3 border border-purple-500/20 bg-purple-950/20 rounded-lg">
                        <div>
                          <p className="text-xs uppercase font-mono text-purple-400">Team Sale (Tier 2)</p>
                          <p className="text-[10px] text-zinc-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-purple-300">+ €{sale.tier2Commission.toFixed(2)}</p>
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
