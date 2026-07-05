import Link from 'next/link';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020202] text-zinc-300 font-mono p-6">
      <div className="max-w-md w-full border border-neonCyan/20 bg-black/40 backdrop-blur-md p-8 rounded-2xl text-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[size:20px_20px] opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)' }}></div>
        
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-6 animate-pulse" />
        
        <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">
          404 - MODULE OFFLINE
        </h1>
        
        <p className="text-zinc-400 mb-8 text-sm">
          De AI Agent of interface die je probeert te bereiken is nog in ontwikkeling of offline gehaald. 
          Dit kan gebeuren als de module gereserveerd is voor een hogere licentie of nog gebouwd wordt.
        </p>

        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/50 text-neonCyan px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-neonCyan hover:text-black transition-all"
        >
          <Terminal className="w-4 h-4" />
          Terug naar Control Room
        </Link>
      </div>
    </div>
  );
}
