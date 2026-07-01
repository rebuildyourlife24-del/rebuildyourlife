import React from "react";
import { MessageSquare, Calendar, ArrowRight, Zap, Trophy, ShieldCheck, LogOut, Settings2, Activity } from "lucide-react";
import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function ClientPortal() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const aiConversationsCount = await prisma.aIConversation?.count({ where: { userId: user.id } }).catch(() => 0);
  const leadsCount = await prisma.businessClient?.count({ where: { userId: user.id } }).catch(() => 0);
  const appointmentsCount = await prisma.task?.count({ where: { userId: user.id, title: { contains: "afspraak", mode: 'insensitive' } } }).catch(() => 0);
  
  const recentActivity = await prisma.auditLog?.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  }).catch(() => []);

  const wallet = await prisma.userWallet?.findUnique({ where: { userId: user.id } }).catch(() => null);
  const fiatBalance = wallet?.fiatBalance || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center font-black text-slate-950 shadow-lg shadow-blue-500/20">
              {user.firstName?.[0] || 'R'}
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Workspace</p>
              <h1 className="text-lg font-bold text-white tracking-tight">{user.firstName} {user.lastName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/klanten/kalender" className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-sm transition-all flex items-center gap-2 text-purple-300 hover:text-purple-200">
              <Calendar size={16} /> Action Center
            </Link>
            <Link href="/klanten/settings" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all flex items-center gap-2 text-slate-300 hover:text-white">
              <Settings2 size={16} /> Instellingen
            </Link>
            <a href="/api/auth/logout" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm transition-all flex items-center gap-2 text-red-400">
              <LogOut size={16} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        {/* Dynamic ROI & Wallet Section (Agentic Interface) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Agentic View */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <Activity size={120} className="text-blue-500" strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  AI SYSTEEM ACTIEF
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Platform Status</h2>
                <p className="text-slate-400 max-w-md leading-relaxed">
                  Jouw AI-team draait momenteel op de achtergrond. De lead-generatie is stabiel en je campagnes presteren volgens verwachting.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">AI Chatbot Gesprekken</p>
                  <p className="text-3xl font-black text-white">{aiConversationsCount}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Gekwalificeerde Leads</p>
                  <p className="text-3xl font-black text-white">{leadsCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Glass Card */}
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] group-hover:bg-emerald-500/30 transition-all" />
            <div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> Veilig Ad-Tegoed
              </p>
              <h3 className="text-5xl font-black text-white tracking-tighter">€{fiatBalance.toFixed(2)}</h3>
              <p className="text-slate-400 text-sm mt-2">Direct inzetbaar voor Meta & TikTok</p>
            </div>
            
            <form action="/api/payments/mollie/create" method="POST" className="mt-8 flex flex-col gap-3 relative z-10">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                <input 
                  type="number" 
                  name="amount" 
                  defaultValue="100" 
                  min="10"
                  className="w-full pl-10 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl font-bold text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                Saldo Opwaarderen <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Upsell / Expansion Area */}
        <div className="bg-blue-900/20 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Trophy size={14} /> Groeimogelijkheid
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Schaal op naar organisch bereik</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Zet vandaag nog onze <strong>AI SEO Agent</strong> aan het werk. Deze analyseert je website, schrijft geoptimaliseerde content en trekt 3x meer gratis bezoekers aan zonder extra ad-spend.
            </p>
          </div>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] whitespace-nowrap flex items-center gap-2">
            Activeer SEO Module <Zap size={18} className="text-blue-400" />
          </button>
        </div>

        {/* Live Feed (Holographic style) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <ShieldCheck className="text-slate-300" size={16} />
            </div>
            Systeem Logboek
          </h3>
          <div className="space-y-1">
            {recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">Systeem draait stabiel. Geen recente events.</p>
            ) : (
              recentActivity.map((log: any) => (
                <div key={log.id} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <div>
                      <p className="font-bold text-sm text-slate-200">{log.action}</p>
                      <p className="text-xs text-slate-500 mt-1">{log.entityType} {log.entityId ? `[${log.entityId.substring(0,8)}]` : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
