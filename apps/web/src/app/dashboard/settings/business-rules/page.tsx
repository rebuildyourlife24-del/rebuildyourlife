'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, Shield, Zap, TrendingUp, AlertTriangle, Save, Brain, CheckCircle2 } from 'lucide-react';

export default function BusinessRulesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Marketing Rules
  const [minRoas, setMinRoas] = useState('2.5');
  const [dailyBudget, setDailyBudget] = useState('100');
  
  // Ops Rules
  const [autoFulfill, setAutoFulfill] = useState(true);
  
  // AI Customer Service Rules
  const [aiTone, setAiTone] = useState('EMPATHIC');
  const [escalateToHuman, setEscalateToHuman] = useState(true);

  useEffect(() => {
    fetch('/api/user/settings')
      .then(res => res.json())
      .then(data => {
        if (data.minRoas) setMinRoas(data.minRoas);
        if (data.dailyBudget) setDailyBudget(data.dailyBudget);
        if (data.autoFulfill !== undefined) setAutoFulfill(data.autoFulfill);
        if (data.aiTone) setAiTone(data.aiTone);
        if (data.escalateToHuman !== undefined) setEscalateToHuman(data.escalateToHuman);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minRoas,
          dailyBudget,
          autoFulfill,
          aiTone,
          escalateToHuman
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Fout bij opslaan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white p-10 animate-pulse font-mono">Loading rules from Database...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          Business Rules & Automatisering
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Beheer de harde veiligheidslimieten voor je AI Agents. Deze regels worden direct (LIVE) weggeschreven in de database en gerespecteerd door de Godbrain Core.
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
              <Input 
                type="number" 
                step="0.1" 
                value={minRoas} 
                onChange={(e) => setMinRoas(e.target.value)} 
                className="bg-black border-zinc-800 text-white font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Ads Agent pauzeert campagnes automatisch onder deze ROAS.</p>
            </div>

            <div>
               <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Maximum Dagbudget (€)</label>
               <Input 
                type="number" 
                value={dailyBudget} 
                onChange={(e) => setDailyBudget(e.target.value)} 
                className="bg-black border-zinc-800 text-white font-mono"
               />
               <p className="text-[10px] text-zinc-500 mt-1">Harde cap op ad-spend per platform per dag.</p>
            </div>
          </div>
        </Card>

        {/* AI Customer Service Rules */}
        <Card className="bg-black/50 border border-cyan-500/20 rounded-[2rem] p-6 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyan-950 border border-cyan-900 flex items-center justify-center rounded-xl">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white tracking-tight uppercase">AI Klantenservice</h3>
               <p className="text-[10px] text-cyan-500 font-mono">MAILBOX & TICKET AGENT</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
               <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Tone of Voice</label>
               <select 
                 value={aiTone}
                 onChange={(e) => setAiTone(e.target.value)}
                 className="w-full bg-black border border-zinc-800 text-white font-mono text-sm rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
               >
                 <option value="EMPATHIC">Extreem Empathisch & Verontschuldigend (Zacht)</option>
                 <option value="NEUTRAL">Zakelijk & Feitelijk (Neutraal)</option>
                 <option value="AGGRESSIVE_SALES">Commercieel (Biedt altijd een up-sell code aan)</option>
               </select>
               <p className="text-[10px] text-zinc-500 mt-1">Bepaalt hoe de AI reageert op boze mails in je support inbox.</p>
            </div>

            <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-xl bg-black">
               <div>
                 <h4 className="text-sm font-bold text-white">Escalatie naar Mens</h4>
                 <p className="text-xs text-zinc-500">Geef mail door aan jou als de AI dreigt te falen.</p>
               </div>
               <button 
                 type="button"
                 onClick={() => setEscalateToHuman(!escalateToHuman)}
                 className={`w-12 h-6 rounded-full transition-colors relative ${escalateToHuman ? 'bg-cyan-500' : 'bg-zinc-700'}`}
               >
                 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${escalateToHuman ? 'left-7' : 'left-1'}`} />
               </button>
            </div>
          </div>
        </Card>

        {/* Operations Rules */}
        <Card className="bg-black/50 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-950 border border-amber-900 flex items-center justify-center rounded-xl">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white tracking-tight uppercase">Operations & Inkoop</h3>
               <p className="text-[10px] text-zinc-500 font-mono">SUPPLY CHAIN AUTOMATION</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-xl bg-black">
               <div>
                 <h4 className="text-sm font-bold text-white">Auto-Fulfillment (CJ Dropshipping)</h4>
                 <p className="text-xs text-zinc-500">Stuur orders direct na betaling (Shopify Webhook) door naar leverancier.</p>
               </div>
               <button 
                 type="button"
                 onClick={() => setAutoFulfill(!autoFulfill)}
                 className={`w-12 h-6 rounded-full transition-colors relative ${autoFulfill ? 'bg-amber-500' : 'bg-zinc-700'}`}
               >
                 <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoFulfill ? 'left-7' : 'left-1'}`} />
               </button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className={`font-bold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xl flex items-center gap-2 transition-all ${saved ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Live in Database</>
            ) : (
              <><Save className="w-4 h-4" /> Deploy Rules to Core</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
