import React from "react";
import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  AlertCircle, 
  ArrowLeft,
  BellRing
} from "lucide-react";
import { getTimelineData } from "../../../actions/calendar";
import { AgentLiveTerminal } from '@/components/ui/AgentLiveTerminal';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export default async function CalendarPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  const { pendingActions, upcomingTasks, unreadNotifications } = await getTimelineData(user.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans pb-20">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/klanten" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
              <ArrowLeft size={18} className="text-slate-300" />
            </Link>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Workspace</p>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarIcon size={18} className="text-blue-400" /> Action Center
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white mb-2">Jouw Tijdlijn</h2>
          <p className="text-slate-400">Automatische goedkeuringen, vaste taken en notificaties op één plek.</p>
        </div>

        {/* NEW: Live Agent Matrix Terminal */}
        <div className="mb-12">
          <AgentLiveTerminal title="Hive Mind - Live Agent Stream" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed: Spontaneous Tasks & Approvals */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-emerald-400" size={20} />
              <h3 className="text-xl font-bold text-white">Actie Vereist (Vandaag)</h3>
            </div>

            {pendingActions?.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h4 className="font-bold text-white mb-1">Alles is weggewerkt!</h4>
                <p className="text-sm text-slate-400">De AI heeft momenteel geen goedkeuringen van je nodig.</p>
              </div>
            ) : (
              pendingActions?.map((action: any) => (
                <div key={action.id} className="bg-gradient-to-br from-slate-900/80 to-black/40 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/50 rounded-3xl p-6 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={100} className="text-emerald-500" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-full border border-emerald-500/20 animate-pulse">
                          AI VOORSTEL
                        </span>
                        <span className="text-xs text-slate-500">{new Date(action.createdAt).toLocaleString()}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{action.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{action.description}</p>
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:justify-center">
                      <form action={async () => {
                        "use server";
                        const { reviewAgentAction } = await import("../../../actions/calendar");
                        await reviewAgentAction(action.id, true);
                      }}>
                        <button type="submit" className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/50 rounded-xl font-bold transition-all flex items-center gap-2 w-full justify-center">
                          <CheckCircle2 size={18} /> Goedkeuren
                        </button>
                      </form>
                      <form action={async () => {
                        "use server";
                        const { reviewAgentAction } = await import("../../../actions/calendar");
                        await reviewAgentAction(action.id, false);
                      }}>
                        <button type="submit" className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-all flex items-center gap-2 w-full justify-center">
                          <XCircle size={18} /> Afkeuren
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Vaste Taken (Fixed Tasks) */}
            <div className="flex items-center gap-2 mb-4 mt-12">
              <Clock className="text-blue-400" size={20} />
              <h3 className="text-xl font-bold text-white">Vaste Planning & Afspraken</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              {upcomingTasks?.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 text-center">Geen vaste afspraken of taken in de agenda.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks?.map((task: any) => (
                    <div key={task.id} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                          {new Date(task.dueDate || new Date()).getDate()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                        {new Date(task.dueDate || new Date()).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Automatic Notifications */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="text-purple-400" size={20} />
              <h3 className="text-xl font-bold text-white">Live Updates</h3>
            </div>

            <div className="bg-gradient-to-b from-purple-900/20 to-black/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 h-fit sticky top-28">
              {unreadNotifications?.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle size={32} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Geen ongelezen notificaties.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unreadNotifications?.map((notif: any) => (
                    <div key={notif.id} className="relative pl-6 pb-4 border-l-2 border-purple-500/30 last:border-l-0 last:pb-0">
                      <div className="absolute w-3 h-3 bg-purple-400 rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                      <p className="text-xs text-purple-300 font-bold mb-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <h5 className="text-sm font-bold text-white">{notif.title}</h5>
                      <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
