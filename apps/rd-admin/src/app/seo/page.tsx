import { prisma } from '@rebuildyourlife/database';
import { runSeoScanAction } from '../actions/seo';

export const dynamic = 'force-dynamic';

export default async function SeoControlDashboard() {
  const pendingProposals = await prisma.seoAgentProposal.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SEO Agent Control (Prompt J)</h1>
          <p className="text-zinc-400">Review and approve SEO Agent proposals for the main site.</p>
        </div>
        <form action={runSeoScanAction}>
          <button type="submit" className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-md font-medium hover:bg-emerald-400 transition-colors">
            Run SEO Scan
          </button>
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Pending Proposals</h2>
        
        {pendingProposals.length === 0 ? (
          <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 text-center">
            <p className="text-zinc-400">No pending SEO proposals.</p>
            <p className="text-sm text-zinc-500 mt-2">The SEO Agent runs periodically to scan for missing meta tags, slow pages, and content gaps. Click 'Run SEO Scan' to force a manual scan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProposals.map((proposal: any) => (
              <div key={proposal.id} className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-emerald-400">{proposal.title}</h3>
                    <p className="text-sm text-zinc-300 mt-1">{proposal.description}</p>
                    <p className="text-xs text-zinc-500 mt-2">Target: {proposal.targetUrl}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-red-500/10 text-red-500 px-3 py-1 rounded border border-red-500/20 hover:bg-red-500/20 text-sm transition-colors">Deny</button>
                    <button className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded border border-emerald-500/20 hover:bg-emerald-500/20 text-sm transition-colors">Approve</button>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800">
                  <p className="text-xs text-zinc-400"><span className="font-semibold text-zinc-300">Evidence:</span> {proposal.evidence}</p>
                  <p className="text-xs text-zinc-400 mt-2"><span className="font-semibold text-zinc-300">Reasoning:</span> {proposal.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
