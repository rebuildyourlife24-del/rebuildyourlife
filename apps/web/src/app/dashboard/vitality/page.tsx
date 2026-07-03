import { prisma } from '@rebuildyourlife/database';
import { Heart, Activity, Target, Flame } from 'lucide-react';

export default async function VitalityPage() {
  const lifeAreas = await prisma.lifeArea.findMany({
    include: {
      goals: true
    }
  });

  const recentHealthLogs = await prisma.healthLog.findMany({
    take: 7,
    orderBy: { date: 'desc' }
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Heart className="w-8 h-8 text-cyan-500" />
          Vitaliteit & Doelen
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Je persoonlijke fysieke en mentale metrics (LIVE DATA).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Logs */}
        <div className="lg:col-span-1 border border-white/10 bg-black/40 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" /> Gezondheid Logs
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {recentHealthLogs.length === 0 ? (
              <p className="text-xs text-zinc-500">Geen logs gevonden deze week.</p>
            ) : (
              <div className="space-y-3">
                {recentHealthLogs.map(log => (
                  <div key={log.id} className="p-3 border border-white/5 bg-black rounded-lg">
                    <p className="text-xs font-mono text-cyan-400 mb-2">{log.date.toLocaleDateString()}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-zinc-500">Slaap:</span> {log.sleepScore || '-'}</div>
                      <div><span className="text-zinc-500">Stappen:</span> {log.steps || '-'}</div>
                      <div><span className="text-zinc-500">Gewicht:</span> {log.weightKg ? `${log.weightKg}kg` : '-'}</div>
                      <div><span className="text-zinc-500">Workout:</span> {log.workoutMinutes ? `${log.workoutMinutes}m` : '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Life Areas & Goals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifeAreas.length === 0 ? (
               <div className="col-span-2 border border-white/10 bg-black/40 p-8 rounded-xl text-center">
                 <Target className="w-8 h-8 text-zinc-600 mx-auto mb-4" />
                 <p className="text-zinc-500 text-sm">Geen levensgebieden (Life Areas) gedefinieerd.</p>
               </div>
            ) : (
              lifeAreas.map(area => (
                <div key={area.id} className="border border-white/10 bg-black/40 p-5 rounded-xl hover:border-cyan-500/50 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white uppercase tracking-wider">{area.name}</h3>
                    <div className="w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-500/10">
                      <span className="text-xs font-bold text-cyan-400">{area.score}/10</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h4 className="text-[10px] uppercase font-mono text-zinc-500">Actieve Doelen ({area.goals.length})</h4>
                    {area.goals.length === 0 ? (
                      <p className="text-xs text-zinc-600">Geen doelen gekoppeld.</p>
                    ) : (
                      area.goals.map(goal => (
                        <div key={goal.id} className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
                          <span className="text-xs text-zinc-300 truncate pr-2">{goal.title}</span>
                          <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded ${goal.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {goal.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
