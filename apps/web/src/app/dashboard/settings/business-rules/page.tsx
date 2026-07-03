'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Settings, Shield, Zap, TrendingUp, AlertTriangle, Save } from 'lucide-react';

export default function BusinessRulesPage() {
  const [minRoas, setMinRoas] = useState('2.5');
  const [dailyBudget, setDailyBudget] = useState('100');
  const [autoFulfill, setAutoFulfill] = useState(true);
  const [refundLimit, setRefundLimit] = useState('50');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving to API
    alert('Business Rules geüpdatet. De Revenue Agents zullen deze limieten nu respecteren.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          Business Rules & Automatisering
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Stel de harde limieten in voor je 10 verdienmodellen. Orion en de Revenue Agents mogen deze limieten NOOIT overschrijden zonder goedkeuring.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-2">
        {/* Ads & Marketing Rules */}
        <Card className="bg-black/50 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-950 border border-emerald-900 flex items-center justify-center rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight uppercase">Marketing Limits</h3>
              <p className="text-[10px] text-zinc-500 font-mono">META & TIKTOK GUARDRAILS</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Minimum ROAS Target</label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  step="0.1" 
                  value={minRoas} 
                  onChange={(e) => setMinRoas(e.target.value)} 
                  className="bg-black border-zinc-800 text-white font-mono w-full"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Als campagnes onder deze ROAS zakken, pauzeert de Ads Agent ze automatisch.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Maximum Dagbudget (€)</label>
              <Input 
                type="number" 
                value={dailyBudget} 
                onChange={(e) => setDailyBudget(e.target.value)} 
                className="bg-black border-zinc-800 text-white font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Harde stop op ad-spend per platform per dag.</p>
            </div>
          </div>
        </Card>

        {/* Operations Rules */}
        <Card className="bg-black/50 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-950 border border-amber-900 flex items-center justify-center rounded-xl">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight uppercase">Operations & Fulfillment</h3>
              <p className="text-[10px] text-zinc-500 font-mono">SUPPLY CHAIN AUTOMATION</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-xl bg-black">
              <div>
                <h4 className="text-sm font-bold text-white">Auto-Fulfillment (CJ Dropshipping)</h4>
                <p className="text-xs text-zinc-500">Stuur betaalde orders direct door naar de leverancier.</p>
              </div>
              <button 
                type="button"
                onClick={() => setAutoFulfill(!autoFulfill)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoFulfill ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoFulfill ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Auto-Refund Limiet (€)
              </label>
              <Input 
                type="number" 
                value={refundLimit} 
                onChange={(e) => setRefundLimit(e.target.value)} 
                className="bg-black border-zinc-800 text-white font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">De AI Klantenservice mag klagende klanten tot dit bedrag automatisch terugbetalen via Stripe zonder menselijke goedkeuring.</p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button 
            type="submit" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Deploy Rules to Core
          </Button>
        </div>
      </form>
    </div>
  );
}
