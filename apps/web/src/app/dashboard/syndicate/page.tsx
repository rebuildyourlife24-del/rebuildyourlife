"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ghost, Skull, Mail, Target, Zap, CheckCircle2 } from 'lucide-react';
import { getSyndicateCampaigns, createSyndicateCampaign, addSyndicateTarget, launchSyndicateCampaign } from '@/actions/syndicate';

export default function SyndicatePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Campaign Form
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // New Target Form
  const [targetName, setTargetName] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetDebt, setTargetDebt] = useState('');
  const [addingToCampaign, setAddingToCampaign] = useState<string | null>(null);

  // Launch State
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getSyndicateCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createSyndicateCampaign(newCampaignName, newCampaignDesc);
      setNewCampaignName('');
      setNewCampaignDesc('');
      await loadCampaigns();
    } catch (err) {
      alert("Fout bij aanmaken campagne.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddTarget = async (e: React.FormEvent, campaignId: string) => {
    e.preventDefault();
    setAddingToCampaign(campaignId);
    try {
      await addSyndicateTarget(campaignId, targetEmail, targetName, targetCompany, parseFloat(targetDebt) || 0);
      setTargetName('');
      setTargetEmail('');
      setTargetCompany('');
      setTargetDebt('');
      await loadCampaigns();
    } catch (err) {
      alert("Fout bij toevoegen doelwit.");
    } finally {
      setAddingToCampaign(null);
    }
  };

  const handleLaunch = async (campaignId: string) => {
    if (!confirm("Weet je zeker dat je het aanval-protocol wilt starten? Alle geregistreerde e-mails worden verstuurd.")) return;
    setLaunchingId(campaignId);
    try {
      const result = await launchSyndicateCampaign(campaignId);
      alert(`Protocol Voltooid. ${result.sent} e-mails verzonden via de proxy.`);
      await loadCampaigns();
    } catch (err) {
      alert("Fout bij het lanceren van de campagne.");
    } finally {
      setLaunchingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-6xl mx-auto pb-20 font-mono"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-fuchsia-900 pb-6 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
               <Ghost className="w-8 h-8 text-fuchsia-500 animate-pulse" />
               The Syndicate
             </h1>
             <Badge variant="outline" className="tracking-widest text-[10px] text-fuchsia-500 border-fuchsia-500/50 bg-fuchsia-500/10">PROXY MAIL ENGINE</Badge>
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-sm flex items-center gap-2">
             <Skull className="w-4 h-4 text-zinc-600" /> Juridische druk via spookbedrijven. Geen simulatie. Direct live.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Create Campaign */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black border-2 border-fuchsia-900/50 p-6 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-fuchsia-500" /> Nieuwe Campagne
            </h2>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-widest">Campagne Naam (bijv. Wanbetalers Q2)</label>
                <Input 
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  placeholder="Naam..."
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-widest">Beschrijving (intern)</label>
                <Input 
                  value={newCampaignDesc}
                  onChange={e => setNewCampaignDesc(e.target.value)}
                  placeholder="Notities..."
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase tracking-widest"
              >
                {isCreating ? 'CREATING...' : 'INITIATE CAMPAIGN'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Col: Active Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
             <div className="text-fuchsia-500 animate-pulse uppercase tracking-widest">Laden van database...</div>
          ) : campaigns.length === 0 ? (
             <div className="text-zinc-500 uppercase tracking-widest border border-dashed border-zinc-800 p-8 text-center rounded-xl">Geen actieve campagnes.</div>
          ) : (
            campaigns.map(camp => (
              <Card key={camp.id} className="bg-[#050505] border-l-4 border-l-fuchsia-600 border-y border-r border-zinc-800 p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-widest">{camp.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{camp.description || 'Geen beschrijving'}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={camp.status === 'ACTIVE' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-zinc-800 text-zinc-400'}>
                      {camp.status}
                    </Badge>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Verzonden: {camp.totalSent}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4" /> Doelwitten ({camp.targets.length})
                  </h4>
                  {camp.targets.length === 0 && <p className="text-xs text-zinc-600">Nog geen targets toegevoegd.</p>}
                  
                  {camp.targets.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-400">
                        <thead>
                          <tr className="border-b border-zinc-800 uppercase tracking-widest">
                            <th className="py-2">Naam / Bedrijf</th>
                            <th className="py-2">E-mail</th>
                            <th className="py-2">Schuld</th>
                            <th className="py-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {camp.targets.map((t: any) => (
                            <tr key={t.id} className="border-b border-zinc-800/50">
                              <td className="py-2 text-white font-bold">{t.name} <span className="text-zinc-600 font-normal">({t.company || 'n.v.t.'})</span></td>
                              <td className="py-2 text-fuchsia-400">{t.email}</td>
                              <td className="py-2">€{t.debtAmount?.toFixed(2) || '0.00'}</td>
                              <td className="py-2 text-right flex justify-end">
                                {t.status === 'SENT' ? (
                                  <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-3 h-3"/> SENT</span>
                                ) : (
                                  <span className="text-zinc-500">PENDING</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Add Target Form */}
                <form onSubmit={(e) => handleAddTarget(e, camp.id)} className="flex gap-2 mb-6 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <Input value={targetName} onChange={e=>setTargetName(e.target.value)} placeholder="Naam" required className="h-8 text-xs bg-black"/>
                  <Input value={targetEmail} onChange={e=>setTargetEmail(e.target.value)} type="email" placeholder="E-mail" required className="h-8 text-xs bg-black"/>
                  <Input value={targetCompany} onChange={e=>setTargetCompany(e.target.value)} placeholder="Bedrijf (opt)" className="h-8 text-xs bg-black"/>
                  <Input value={targetDebt} onChange={e=>setTargetDebt(e.target.value)} type="number" placeholder="Schuld €" className="h-8 text-xs bg-black w-24"/>
                  <Button type="submit" disabled={addingToCampaign === camp.id} className="h-8 px-4 text-xs bg-zinc-800 hover:bg-zinc-700 text-white">+</Button>
                </form>

                {/* Launch Button */}
                <Button 
                  onClick={() => handleLaunch(camp.id)}
                  disabled={launchingId === camp.id || camp.targets.filter((t:any) => t.status !== 'SENT').length === 0}
                  className="w-full bg-red-600 hover:bg-red-500 text-black font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  {launchingId === camp.id ? 'EXECUTING PROTOCOL...' : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" /> LAUNCH ATTACK PROTOCOL
                    </span>
                  )}
                </Button>
              </Card>
            ))
          )}
        </div>

      </div>
    </motion.div>
  );
}
