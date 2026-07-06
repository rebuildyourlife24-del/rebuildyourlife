import { prisma } from '@rebuildyourlife/database';
import { Activity, BrainCircuit, CheckCircle, Database, PlayCircle, ShieldAlert, Sparkles, TrendingUp, XCircle } from 'lucide-react';

export const revalidate = 0; // Disable static caching voor dit dashboard

export default async function WarRoomPage() {
  const hypotheses = await prisma.agentKnowledgeBase.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  const activeAgents = await prisma.aiAgent.findMany({
    take: 18,
    orderBy: { role: 'asc' }
  });

  const videos = await prisma.marketingVideo.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 selection:bg-green-900 selection:text-green-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between border-b border-green-900/50 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
              <BrainCircuit className="w-10 h-10 text-green-400" />
              SOVEREIGN WAR ROOM
            </h1>
            <p className="text-green-700 mt-2 text-sm uppercase tracking-widest">
              Live Swarm Telemetry & Epistemic Grid
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-950/30 border border-green-800 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm">SYSTEM ONLINE</span>
            </div>
            <button className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-2 transition-colors uppercase tracking-wider text-sm">
              Execute Manual Override
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="border border-green-900/50 bg-black/50 p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database className="w-5 h-5" />
              ACTIVE COUNCIL (18)
            </h2>
            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {activeAgents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 border border-green-900/30 hover:border-green-500/50 transition-colors bg-green-950/10">
                  <div className="flex flex-col">
                    <span className="font-bold text-green-300">{agent.name}</span>
                    <span className="text-xs text-green-700 uppercase">{agent.role}</span>
                  </div>
                  {true ? (
                    <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-green-800" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="border border-green-900/50 bg-black/50 p-6 backdrop-blur-sm relative">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              EPISTEMIC GRID (ROAS)
            </h2>
            <div className="space-y-4">
              {hypotheses.map(hyp => (
                <div key={hyp.id} className={`p-4 border ${hyp.type === 'VERIFIED' ? 'border-green-500 bg-green-900/20' : hyp.type === 'FAILURE' ? 'border-red-900 bg-red-950/20 text-red-500' : 'border-green-900/50 bg-black'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs tracking-widest uppercase opacity-70">{hyp.domain}</span>
                    {hyp.type === 'VERIFIED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {hyp.type === 'FAILURE' && <XCircle className="w-4 h-4 text-red-500" />}
                    {hyp.type === 'HYPOTHESIS' && <Activity className="w-4 h-4 text-green-600 animate-pulse" />}
                  </div>
                  <p className="text-sm font-medium mb-3">{hyp.claim}</p>
                  <div className="flex items-center justify-between border-t border-current pt-3 opacity-80">
                    <span className="text-xs">CONFIDENCE: {(hyp.confidence * 100).toFixed(0)}%</span>
                    <span className="text-xs">{hyp.type}</span>
                  </div>
                </div>
              ))}
              {hypotheses.length === 0 && (
                <div className="text-center p-8 border border-dashed border-green-900/50 text-green-700">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  NO HYPOTHESES ACTIVE
                </div>
              )}
            </div>
          </section>

          <section className="border border-green-900/50 bg-black/50 p-6 backdrop-blur-sm relative">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              CONTENT FACTORY
            </h2>
            <div className="space-y-6">
              {videos.map(video => (
                <div key={video.id} className="border border-green-900/50 overflow-hidden group">
                  <div className="aspect-video bg-green-950/20 relative flex items-center justify-center border-b border-green-900/50">
                    {video.status === 'RENDERED' && video.renderedUrl ? (
                      <video 
                        src={video.renderedUrl} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        controls
                        muted
                        loop
                      />
                    ) : (
                      <div className="flex flex-col items-center text-green-700">
                        <PlayCircle className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs uppercase tracking-widest">{video.status}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-black">
                    <h3 className="text-sm font-bold truncate mb-1">{video.title}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs opacity-60">ID: {video.id.substring(0,8)}...</span>
                      {video.status === 'DRAFT' && (
                        <button className="text-xs bg-green-900/50 hover:bg-green-800 text-green-300 px-3 py-1 uppercase transition-colors">
                          Approve Render
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
