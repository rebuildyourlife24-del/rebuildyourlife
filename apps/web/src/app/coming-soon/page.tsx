import React from "react";
import Link from "next/link";
import { Construction, ArrowLeft, Rocket } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-xl">
        <div className="w-24 h-24 bg-blue-900/30 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          <Construction className="text-blue-500" size={48} />
        </div>
        
        <h1 className="text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
          Module in Ontwikkeling
        </h1>
        
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          The Syndicate engineers integreren deze functionaliteit momenteel. 
          Dit onderdeel is geselecteerd voor de volgende uitrolfase.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-xl font-bold transition-all">
            <ArrowLeft size={18} /> Terug naar Dashboard
          </Link>
          <button disabled className="flex items-center gap-2 bg-blue-600/50 text-blue-200 border border-blue-500/50 px-6 py-3 rounded-xl font-bold cursor-not-allowed">
            <Rocket size={18} /> Auto-Notify (Binnenkort)
          </button>
        </div>
      </div>
    </div>
  );
}
