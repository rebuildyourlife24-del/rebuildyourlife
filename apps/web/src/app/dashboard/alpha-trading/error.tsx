'use client';
import { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <ShieldAlert className="w-16 h-16 text-cyan-500 mb-6 mx-auto" />
      <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">SOVEREIGN OVERRIDE: SYSTEM FAILURE</h2>
      <p className="text-zinc-400 mb-8 max-w-md mx-auto">The Swarm encountered an anomaly while fetching sector data. Protocol dictates a manual restart of the module.</p>
      <button
        onClick={() => reset()}
        className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-colors"
      >
        RE-ENGAGE PROTOCOL
      </button>
    </div>
  );
}
