import { prisma } from '@rebuildyourlife/database';
import { MessageSquare, BarChart, Tv, Smartphone } from 'lucide-react';

export default async function SocialPage() {
  const platforms = await prisma.socialPlatformIntegration.findMany({
    include: {
      campaigns: true
    }
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyan-500" />
          Social Media & Ads
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Jouw actieve ad-accounts, campagnes en content (LIVE DATA).</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {platforms.length === 0 ? (
          <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
            <Tv className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Geen Platforms Gekoppeld</h3>
            <p className="text-zinc-500 mt-2">Koppel TikTok of Meta Ads om je campagnes te beheren.</p>
          </div>
        ) : (
          platforms.map(platform => (
            <div key={platform.id} className="border border-white/10 bg-black/40 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center border border-white/10">
                    <Smartphone className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">{platform.platform}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${platform.status === 'CONNECTED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-mono text-zinc-400 uppercase">{platform.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-zinc-500 uppercase">Account ID</p>
                  <p className="text-sm font-bold text-white">{platform.accountId || 'Geen ID'}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <BarChart className="w-4 h-4" /> Campagnes ({platform.campaigns.length})
                </h3>
                
                {platform.campaigns.length === 0 ? (
                  <p className="text-sm text-zinc-600">Geen campagnes actief op dit platform.</p>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {platform.campaigns.map(camp => (
                      <div key={camp.id} className="border border-white/10 p-4 rounded-lg bg-black hover:border-cyan-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-zinc-200">{camp.campaignName}</h4>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase">{camp.campaignType}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-mono ${camp.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                            {camp.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                          <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-mono">Spend</p>
                            <p className="text-sm font-bold text-white">€{camp.totalSpend.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-mono">ROAS</p>
                            <p className={`text-sm font-bold ${camp.roas >= 2 ? 'text-green-400' : camp.roas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                              {camp.roas.toFixed(2)}x
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-mono">Conversies</p>
                            <p className="text-sm font-bold text-white">{camp.conversions}</p>
                          </div>
                        </div>
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
