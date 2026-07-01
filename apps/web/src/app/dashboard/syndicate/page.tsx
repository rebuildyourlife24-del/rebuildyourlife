import { redirect } from 'next/navigation';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Users, Globe } from 'lucide-react';
import SyndicateFeed from '@/components/syndicate/SyndicateFeed';
import LeaderboardWidget from '@/components/syndicate/LeaderboardWidget';

const JWT_SECRET = process.env.JWT_SECRET! || "fallback";

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

export default async function SyndicatePage() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) redirect('/auth/login');

    return (
      <div className="max-w-[1400px] mx-auto min-h-[85vh] p-8">
        {/* Header */}
        <div className="mb-12 border-b border-cyan-900/30 pb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent blur-xl pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white tracking-tighter uppercase mb-2">
              The Syndicate
            </h1>
            <p className="text-cyan-500 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
              <Globe className="w-4 h-4" /> Global Mastermind & Operations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            <SyndicateFeed currentUserId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Widget */}
            <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.05)] backdrop-blur-sm">
               <h3 className="text-sm font-black text-cyan-400 tracking-widest uppercase flex items-center gap-2 mb-4 pb-4 border-b border-cyan-900/30">
                 <Users className="w-4 h-4" /> Jouw Profiel
               </h3>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-300 text-lg">
                   {user.firstName?.[0] || 'A'}
                 </div>
                 <div>
                   <div className="font-bold text-white">{user.firstName} {user.lastName}</div>
                   <div className="text-[10px] uppercase font-black text-cyan-500 tracking-widest mt-1">
                     {user.experiencePoints} XP
                   </div>
                 </div>
               </div>
            </div>

            {/* Leaderboard Widget */}
            <LeaderboardWidget />
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-8 text-red-500">
        <h1>Vercel Server Component Error Captured:</h1>
        <pre>{error?.message || String(error)}</pre>
        <pre>{error?.stack}</pre>
      </div>
    );
  }
}
