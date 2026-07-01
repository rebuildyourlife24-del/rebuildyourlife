import React from "react";
import { MessageSquare, Calendar, ArrowRight, Zap, Trophy, ShieldCheck, LogOut } from "lucide-react";
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
    // Redirect to login if not authenticated
    redirect("/auth/login");
  }

  // Echte Database queries ter vervanging van de mock data
  const aiConversationsCount = await prisma.aIConversation?.count({
    where: { userId: user.id }
  }).catch(() => 0);

  const leadsCount = await prisma.businessClient?.count({
    where: { userId: user.id }
  }).catch(() => 0);

  // Fallback to 0 if table doesn't exist or is empty
  const appointmentsCount = await prisma.task?.count({
    where: { userId: user.id, title: { contains: "afspraak", mode: 'insensitive' } }
  }).catch(() => 0);

  const recentActivity = await prisma.auditLog?.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  }).catch(() => []);

  // Fetch Wallet Balance
  const wallet = await prisma.userWallet?.findUnique({
    where: { userId: user.id }
  }).catch(() => null);
  
  const fiatBalance = wallet?.fiatBalance || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Premium Header */}
      <div className="bg-slate-900 text-white p-8 pb-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              {user.firstName?.[0] || 'U'}
            </div>
            <div>
              <p className="text-sm text-slate-400">Welkom terug,</p>
              <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
            </div>
          </div>
          <Link href="/api/auth/logout" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition font-medium flex items-center gap-2">
            <LogOut size={16} /> Uitloggen
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto -mt-10 px-4 md:px-0">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <MessageSquare size={64} />
            </div>
            <p className="text-slate-500 text-sm font-medium">AI Chatbot Gesprekken</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{aiConversationsCount}</p>
            <p className="text-emerald-500 text-xs font-bold mt-2">Actueel gemeten</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap size={64} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Gekwalificeerde Leads</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{leadsCount}</p>
            <p className="text-emerald-500 text-xs font-bold mt-2">In CRM opgeslagen</p>
          </div>
          <div className="bg-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-600/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar size={64} />
            </div>
            <p className="text-blue-200 text-sm font-medium">Geboekte Afspraken</p>
            <p className="text-4xl font-black text-white mt-2">{appointmentsCount}</p>
            <p className="text-blue-200 text-xs font-bold mt-2">Agenda Synchronisatie</p>
          </div>
        </div>

        {/* Wallet & Ad-Spend Module */}
        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Jouw RYL Ad-Tegoed</p>
              <p className="text-4xl font-black text-slate-900 mt-1">€{fiatBalance.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">Direct inzetbaar voor Meta & TikTok advertenties</p>
            </div>
          </div>
          <div className="flex gap-3">
            <form action="/api/payments/mollie/create" method="POST" className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                <input 
                  type="number" 
                  name="amount" 
                  defaultValue="100" 
                  min="10"
                  className="pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition transform hover:scale-105 flex items-center gap-2">
                Waardeer op
              </button>
            </form>
          </div>
        </div>

        {/* Upsell / Expansion Area */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-2">
              <Trophy size={16} />
              Groeimogelijkheid
            </div>
            <h2 className="text-2xl font-bold mb-2">Wil je nog meer lokale klanten bereiken?</h2>
            <p className="text-slate-400 text-sm">
              Je AI Chatbot presteert fantastisch. We kunnen nu ook een <strong className="text-white">AI-gedreven SEO Strategie</strong> voor je website aanzetten om 3x meer organische bezoekers naar je chatbot te sturen.
            </p>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition transform hover:scale-105">
            Activeer SEO Module <ArrowRight size={18} />
          </button>
        </div>

        {/* Live Feed */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-20">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} />
            Recente Systeem Activiteit
          </h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm">Nog geen activiteiten gelogd.</p>
            ) : (
              recentActivity.map((log: any) => (
                <div key={log.id} className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.entityType} {log.entityId ? `- ID: ${log.entityId}` : ''}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
