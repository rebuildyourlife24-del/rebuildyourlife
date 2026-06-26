const fs = require('fs');
const path = require('path');
const dashboardDir = 'apps/web/src/app/dashboard';
const dirs = fs.readdirSync(dashboardDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

const loadingTemplate = `'use client';
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
`;

const errorTemplate = `'use client';
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
`;

let injectedCount = 0;

for (const d of dirs) {
    const dirPath = path.join(dashboardDir, d.name);
    const loadingPath = path.join(dirPath, 'loading.tsx');
    const errorPath = path.join(dirPath, 'error.tsx');

    if (!fs.existsSync(loadingPath)) {
        fs.writeFileSync(loadingPath, loadingTemplate);
        injectedCount++;
    }
    if (!fs.existsSync(errorPath)) {
        fs.writeFileSync(errorPath, errorTemplate);
        injectedCount++;
    }
}
console.log('Injected files:', injectedCount);
