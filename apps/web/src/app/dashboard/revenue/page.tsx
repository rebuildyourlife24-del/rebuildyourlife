import React from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Briefcase, Zap, Package } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RevenueDashboard() {
  // Simulated backend fetch for The Syndicate metrics
  const profitMargin = 38.4;
  const totalRevenue = 14250.00;
  const activeSourcing = 2;
  const recentActions = [
    { id: 1, agent: "Midas (CFO)", action: "Budget shifted to TikTok Ads", status: "EXECUTED", amount: "+€450.00" },
    { id: 2, agent: "Catalog (Sourcing)", action: "New Dropship Matrix product added", status: "PENDING_APPROVAL", amount: "Est. €2K/mo" },
    { id: 3, agent: "Pricing Engine", action: "Decreased price by 10% on LED Tech", status: "EXECUTED", amount: "Elasticity Test" }
  ];

  return (
    <div className="space-y-8 p-6 bg-black text-emerald-400 min-h-screen">
      <div className="flex justify-between items-center border-b border-emerald-900 pb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase font-mono text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            CFO Revenue Matrix
          </h1>
          <p className="text-emerald-700 font-mono mt-2 flex items-center">
            <Zap className="w-4 h-4 mr-2" /> Live E-Com Intelligence
          </p>
        </div>
      </div>

      {/* KPI HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-emerald-800 p-6 rounded-lg backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-700 font-mono text-sm uppercase">Total Revenue (24H)</p>
              <h2 className="text-3xl font-bold font-mono text-white mt-2">€{totalRevenue.toFixed(2)}</h2>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500">
            <TrendingUp className="w-4 h-4 mr-1" /> +12.4% vs Yesterday
          </div>
        </div>

        <div className="bg-gray-900/50 border border-emerald-800 p-6 rounded-lg backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-700 font-mono text-sm uppercase">Average Profit Margin</p>
              <h2 className="text-3xl font-bold font-mono text-white mt-2">{profitMargin}%</h2>
            </div>
            <Briefcase className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-500">
            <AlertTriangle className="w-4 h-4 mr-1" /> Optimizating elasticity...
          </div>
        </div>

        <div className="bg-gray-900/50 border border-emerald-800 p-6 rounded-lg backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-700 font-mono text-sm uppercase">Active Sourcing Vectors</p>
              <h2 className="text-3xl font-bold font-mono text-white mt-2">{activeSourcing} Products</h2>
            </div>
            <Package className="w-8 h-8 text-cyan-500" />
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500">
            Scanning AliExpress API...
          </div>
        </div>
      </div>

      {/* Autonomous Decisions Log */}
      <div className="mt-12 border border-emerald-900 rounded-lg bg-black overflow-hidden">
        <div className="bg-emerald-900/20 px-6 py-4 border-b border-emerald-900">
          <h3 className="font-mono text-emerald-400 font-bold uppercase tracking-wider">Live Agent Directives</h3>
        </div>
        <div className="divide-y divide-emerald-900/50">
          {recentActions.map((action) => (
            <div key={action.id} className="p-6 hover:bg-emerald-900/10 transition-colors flex justify-between items-center group">
              <div>
                <p className="font-mono text-emerald-500 font-bold">{action.agent}</p>
                <p className="text-white mt-1">{action.action}</p>
              </div>
              <div className="text-right">
                <p className={`font-mono text-sm ${action.status === 'PENDING_APPROVAL' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  [{action.status}]
                </p>
                <p className="text-emerald-300 font-mono mt-1 text-sm">{action.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-8">
         <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-400 font-mono uppercase text-sm border-b border-emerald-600 pb-1">
           &lt; Return to Control Center
         </Link>
      </div>
    </div>
  );
}
