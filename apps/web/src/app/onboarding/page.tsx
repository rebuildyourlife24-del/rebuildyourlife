'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Command, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const timer = setTimeout(() => {
      setStatus('success');
    }, 2500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl relative z-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-[#d4af37]/10 border border-[#d4af37] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,61,0.2)]">
        {status === 'loading' ? (
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
        ) : status === 'success' ? (
          <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
        ) : (
          <Command className="w-8 h-8 text-zinc-500" />
        )}
      </div>

      {status === 'loading' && (
        <>
          <h1 className="text-2xl font-black uppercase tracking-wider mb-2">Uplink Bevestigen...</h1>
          <p className="text-zinc-400 font-mono text-sm mb-6">
            Sovereign Grid verifieert betalingstransactie. Een moment geduld.
          </p>
          <div className="w-full h-1 bg-white/5 overflow-hidden relative">
            <div className="h-full bg-[#d4af37] w-1/2 absolute top-0 left-0 animate-pulse"></div>
          </div>
        </>
      )}

      {status === 'success' && (
        <div className="animate-in fade-in duration-700">
          <h1 className="text-3xl font-black uppercase tracking-wider mb-4 text-[#d4af37]">Uplink Succesvol</h1>
          <p className="text-zinc-300 mb-8 leading-relaxed">
            Welkom bij Sovereign Grid Elite. Jouw account is geüpgraded en jouw persoonlijke AI Coach (Hermes/Orion) is geactiveerd op je dashboard.
          </p>
          
          <Link 
            href="https://ai-henksemler.nl/dashboard" 
            className="group w-full bg-white text-black font-black uppercase tracking-widest py-4 flex items-center justify-center gap-3 hover:bg-[#d4af37] hover:text-white transition-colors"
          >
            INITIALIZE GRID <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-black uppercase tracking-wider mb-2">Geen Sessie Gevonden</h1>
          <p className="text-zinc-400 font-mono text-sm mb-6">
            Deze link is ongeldig of verlopen. Keer terug naar de terminal.
          </p>
          <Link href="/" className="text-[#d4af37] font-mono text-xs uppercase hover:underline">
            [ Terug naar Root ]
          </Link>
        </>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,60,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <Suspense fallback={<div className="text-white font-mono">Loading uplink...</div>}>
        <OnboardingContent />
      </Suspense>
    </div>
  );
}

