import { BrainCircuit } from 'lucide-react';
import LiveWarRoom from '@/components/LiveWarRoom';

export const revalidate = 0; // Disable static caching voor dit dashboard

export default function WarRoomPage() {
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

        <LiveWarRoom />

      </div>
    </div>
  );
}
