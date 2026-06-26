'use client';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-64 h-64 opacity-50 relative pointer-events-none">
        <NeuralSwarm theme="cyan" />
      </div>
      <div className="text-cyan-500 font-mono text-sm uppercase tracking-widest animate-pulse">
        SYNCHRONIZING SECURE DATALINK...
      </div>
    </div>
  );
}
