export default function CapabilityGenesisDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Capability Genesis (Prompt I)</h1>
          <p className="text-zinc-400">Manage Phase A, B, C deployments of new system capabilities.</p>
        </div>
        <button className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-md font-medium hover:bg-emerald-400 transition-colors">
          + New Capability
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Phase A */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-zinc-500"></span>
            <span>Phase A (Internal Test)</span>
          </h2>
          <div className="mt-4 space-y-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <p className="text-sm text-zinc-400 italic">No capabilities currently in Phase A.</p>
            </div>
          </div>
        </div>

        {/* Phase B */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Phase B (Beta Users)</span>
          </h2>
          <div className="mt-4 space-y-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <p className="text-sm text-zinc-400 italic">No capabilities currently in Phase B.</p>
            </div>
          </div>
        </div>

        {/* Phase C */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Phase C (Deployed)</span>
          </h2>
          <div className="mt-4 space-y-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <p className="text-sm text-zinc-400 italic">No capabilities currently in Phase C.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
