import { Target, Award, PlayCircle, Trophy, BarChart3 } from "lucide-react";

export default function AcademyProgressPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-indigo-500/30 glass-cyber p-8 md:p-12 group mb-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-indigo-500/10 border border-indigo-500/40 text-indigo-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <Target className="w-3 h-3 mr-2" />
                Academy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Mijn <span className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">Voortgang</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Jouw persoonlijke level en XP binnen het Rebuild Your Life ecosysteem. Voltooi modules, haal certificaten en unlock nieuwe tiers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-32 h-32 text-indigo-500" />
          </div>
          <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Huidig Level</h3>
          <p className="text-5xl font-black text-white mb-2">Level 4</p>
          <div className="w-full bg-zinc-900 rounded-full h-2 mb-2">
            <div className="bg-indigo-500 h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '60%' }}></div>
          </div>
          <p className="text-indigo-400 font-mono text-xs uppercase">1,200 / 2,000 XP tot Level 5</p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PlayCircle className="w-32 h-32 text-indigo-500" />
          </div>
          <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Modules Voltooid</h3>
          <p className="text-5xl font-black text-white mb-2">12</p>
          <p className="text-indigo-400 font-mono text-xs uppercase">Van de 45 Beschikbare Modules</p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-32 h-32 text-indigo-500" />
          </div>
          <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Certificaten</h3>
          <p className="text-5xl font-black text-white mb-2">2</p>
          <p className="text-indigo-400 font-mono text-xs uppercase">Shopify Expert, AI Automation</p>
        </div>
      </div>
    </div>
  );
}
