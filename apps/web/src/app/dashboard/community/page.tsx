import { getForumCategoriesAction } from '@/app/actions/community';
import { Card } from '@/components/ui/Card';
import { MessageSquare, Users, TrendingUp, Search, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const result = await getForumCategoriesAction();
  const categories = result.success && result.categories ? result.categories : [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Users className="w-3 h-3 mr-2" />
                The Network
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Rebuild Your <span className="text-blue-400">Tribe</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Jouw netwerk is je net-worth. Stel vragen, deel overwinningen, vind business partners en laat je business beoordelen in roasts.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <PlusCircle className="w-5 h-5" />
              Nieuw Topic
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Forum Categories */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-wide">Community Categorieën</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Zoeken in forums..." 
                className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/dashboard/community/${cat.id}`} className="block">
                <div className="glass-cyber p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                    <p className="text-sm text-zinc-400">{cat.description}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-2xl font-black text-white">{cat._count?.topics || 0}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Topics</p>
                  </div>
                </div>
              </Link>
            ))}

            {categories.length === 0 && (
              <div className="py-12 text-center border border-white/10 border-dashed rounded-[2rem] bg-white/5">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Geen categorieën gevonden</h3>
                <p className="text-zinc-500">Er zijn momenteel geen community forums aangemaakt.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="glass-cyber rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white uppercase tracking-wide">Trending Nu</h3>
            </div>
            <ul className="space-y-4">
              <li className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="text-xs text-zinc-500 mb-1">E-Commerce</p>
                <p className="text-sm font-bold text-zinc-300 hover:text-white cursor-pointer transition-colors">Hoe test je winnende producten in Q4 met een laag budget?</p>
              </li>
              <li className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="text-xs text-zinc-500 mb-1">Mindset</p>
                <p className="text-sm font-bold text-zinc-300 hover:text-white cursor-pointer transition-colors">Dopamine Detox Guide: Focus herstellen in 7 dagen</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
