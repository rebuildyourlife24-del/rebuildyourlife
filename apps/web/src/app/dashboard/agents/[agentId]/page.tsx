import { DynamicAgentClient } from "./DynamicAgentClient";
import { getSessionAction } from "@/app/actions/auth";
import Link from "next/link";
import { Lock } from "lucide-react";

export default async function DynamicAgentPage({ params }: { params: { agentId: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const agentId = resolvedParams.agentId.toUpperCase();
  
  const session = await getSessionAction();
  const user = session.user;

  // Paywall Logic
  const premiumAgents = ["CEO", "CFO", "CMO", "ADS", "DATA"];
  const isPremiumAgent = premiumAgents.includes(agentId);
  const hasAccess = user?.subscriptionTier === "ELITE" || user?.subscriptionTier === "BUSINESS" || user?.role === "SUPER_ADMIN" || user?.email === "hsemler50@gmail.com";

  if (isPremiumAgent && !hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020202] text-zinc-300 font-mono p-6">
        <div className="max-w-md w-full border border-orange-500/20 bg-black/40 backdrop-blur-md p-8 rounded-2xl text-center relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.1)]">
          <div className="absolute inset-0 bg-[size:20px_20px] opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)' }}></div>
          <Lock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Toegang Geweigerd</h1>
          <p className="text-zinc-400 mb-8 text-sm">
            Deze AI Agent is exclusief beschikbaar voor Elite en Business gebruikers. Upgrade je licentie in het portaal om deze C-Suite intelligentie te ontgrendelen.
          </p>
          <Link href="/dashboard/billing" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all">
            Upgrade Licentie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DynamicAgentClient agentIdRaw={resolvedParams.agentId} />
    </div>
  );
}
