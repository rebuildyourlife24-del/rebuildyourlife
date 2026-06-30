'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getSocialPosts, updateSocialPostStatus, createSocialPost, seedSocialPostsIfEmpty } from '@/actions/social';
import { Zap, Target, Activity, ShieldAlert, Plus, CheckCircle2, Play, Pause } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function SwarmDashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('TIKTOK');
  const [newBudget, setNewBudget] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    await seedSocialPostsIfEmpty();
    await loadCampaigns();
    setLoading(false);
  };

  const loadCampaigns = async () => {
    const data = await getSocialPosts();
    setCampaigns(data);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // Optimistic
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      await updateSocialPostStatus(id, newStatus);
      await loadCampaigns();
    } catch (err) {
      console.error(err);
      await loadCampaigns(); // Revert
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle?.trim()) return;
    try {
      await createSocialPost(newTitle, newPlatform, parseInt(newBudget) || 1000);
      setNewTitle('');
      setNewBudget('');
      setIsCreating(false);
      await loadCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'TIKTOK': return '🎵';
      case 'META': return '♾️';
      case 'LINKEDIN': return '💼';
      default: return '🌐';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'PENDING_APPROVAL': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'PAUSED': return 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50';
      default: return 'bg-navy-900 text-cyan-200 border-cyan-800';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans min-h-[85vh] relative z-10 pb-12 select-none">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/10 hidden blur-[] rounded-full pointer-events-none -z-10"></div>

      <header className="bg-black/40 border border-cyan-900/30 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase flex items-center gap-4 mb-2">
            <Activity className="w-8 h-8 text-cyan-500" />
            SWARM RADAR
          </h1>
          <p className="text-cyan-400/60 uppercase tracking-widest text-xs flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4" /> GLOBAL BROADCASTING & ADVERTISING HUB
          </p>
        </div>
      </header>

      {/* Network Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/60 border border-cyan-900/50 shadow-[0_0_15px_rgba(6,182,212,0.1)] p-6 backdrop-blur-md rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2 text-sm">
              <span>🎵</span> TIKTOK API
            </h3>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[9px] px-2 py-0.5 uppercase tracking-widest">CONNECTED</Badge>
          </div>
          <div className="space-y-2 text-xs font-bold uppercase tracking-widest">
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-zinc-500">Ad Account:</span> <span className="text-white">@apex_predator</span></div>
            <div className="flex justify-between pt-1"><span className="text-zinc-500">Pixel Status:</span> <span className="text-cyan-400">FIRING</span></div>
          </div>
        </Card>

        <Card className="bg-black/60 border border-cyan-900/50 shadow-[0_0_15px_rgba(6,182,212,0.1)] p-6 backdrop-blur-md rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2 text-sm">
              <span>♾️</span> META GRAPH
            </h3>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[9px] px-2 py-0.5 uppercase tracking-widest">CONNECTED</Badge>
          </div>
          <div className="space-y-2 text-xs font-bold uppercase tracking-widest">
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-zinc-500">Business ID:</span> <span className="text-white">839218319</span></div>
            <div className="flex justify-between pt-1"><span className="text-zinc-500">Pixel Status:</span> <span className="text-cyan-400">FIRING</span></div>
          </div>
        </Card>

        <Card className="bg-black/40 border border-white/5 p-6 backdrop-blur-md rounded-2xl opacity-70">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2 text-sm">
              <span>💼</span> LINKEDIN
            </h3>
            <Badge className="bg-zinc-900 text-zinc-500 border-zinc-700/50 text-[9px] px-2 py-0.5 uppercase tracking-widest">DISCONNECTED</Badge>
          </div>
          <Button variant="secondary" className="w-full mt-2 border-zinc-800 text-zinc-400 uppercase tracking-widest text-[10px] font-black h-8 bg-black hover:bg-white/5">CONNECT NODE</Button>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-8 pb-4 border-b border-cyan-900/30">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Target className="w-5 h-5 text-cyan-500" /> ACTIVE DEPLOYMENTS
        </h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-cyan-500 text-black hover:bg-cyan-400 font-black uppercase tracking-widest text-xs h-10 px-6 rounded-xl border-none shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
        >
          {isCreating ? 'CANCEL' : <><Plus className="w-4 h-4"/> LAUNCH NEW CAMPAIGN</>}
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-black/40 border border-cyan-500/30 p-6 rounded-2xl mb-6 backdrop-blur-md">
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold block mb-2">Campaign Title</label>
                  <Input 
                    value={newTitle} onChange={e => setNewTitle(e.target.value)} 
                    placeholder="e.g. Protocol Omega Target" required 
                    className="bg-black border border-cyan-900/50 rounded-xl text-white focus:border-cyan-500 h-11"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold block mb-2">Platform</label>
                  <select 
                    value={newPlatform} onChange={e => setNewPlatform(e.target.value)}
                    className="w-full bg-black border border-cyan-900/50 rounded-xl text-white focus:border-cyan-500 h-11 px-3 text-sm font-bold tracking-widest"
                  >
                    <option value="TIKTOK">TIKTOK</option>
                    <option value="META">META</option>
                    <option value="LINKEDIN">LINKEDIN</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold block mb-2">Budget (€)</label>
                  <Input 
                    type="number" value={newBudget} onChange={e => setNewBudget(e.target.value)} 
                    placeholder="1000" required 
                    className="bg-black border border-cyan-900/50 rounded-xl text-white focus:border-cyan-500 h-11"
                  />
                </div>
                <div className="md:col-span-4 flex justify-end mt-2">
                  <Button type="submit" className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-xs h-11 px-8 rounded-xl">
                    INITIALIZE CAMPAIGN
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="text-cyan-500 animate-pulse font-black uppercase tracking-widest py-16 text-center rounded-2xl bg-black/40 border border-cyan-900/30 backdrop-blur-md text-xs">
            CONNECTING TO NEURAL AD NETWORKS...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-zinc-500 font-bold uppercase tracking-widest py-16 text-center rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md text-xs">
            NO ACTIVE CAMPAIGNS IN THE MATRIX.
          </div>
        ) : (
          campaigns.map((campaign, idx) => {
            // Using views for budget and engagement for spent (as per mock translation)
            const budget = campaign.views || 0;
            const spent = campaign.engagement || 0;
            const revenue = spent * 4.2; // Mock ROAS simulation
            const roas = spent > 0 ? (revenue / spent).toFixed(1) : "0.0";

            return (
              <motion.div 
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.1, 0.5) }}
              >
                <Card className="bg-black/40 border border-cyan-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-500/40 transition-colors backdrop-blur-md rounded-2xl">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center text-2xl border border-cyan-900/50 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]">
                      {getPlatformIcon(campaign.platform)}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg uppercase tracking-widest">{campaign.content}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={`${getStatusColor(campaign.status)} text-[9px] px-2.5 py-0.5 uppercase tracking-widest font-bold`}>
                          {campaign.status}
                        </Badge>
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                          Budget: <span className="text-white">€{budget.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 flex-1 justify-center bg-black/50 py-3 px-6 rounded-xl border border-white/5">
                    <div className="text-center">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Spent</div>
                      <div className="text-sm text-white font-black tracking-wider">€{spent.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Omzet</div>
                      <div className="text-sm text-cyan-400 font-black tracking-wider">€{revenue.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">ROAS</div>
                      <div className="text-base text-cyan-500 font-black tracking-wider">{roas}x</div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end min-w-[140px]">
                    {campaign.status === 'PENDING_APPROVAL' && (
                      <Button 
                        className="bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 font-black uppercase tracking-widest text-[10px] h-10 px-5 rounded-xl border-none"
                        onClick={() => handleStatusUpdate(campaign.id, 'ACTIVE')}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5"/> APPROVE
                      </Button>
                    )}
                    {campaign.status === 'ACTIVE' && (
                      <Button 
                        className="bg-zinc-800 text-white hover:bg-zinc-700 font-black uppercase tracking-widest text-[10px] h-10 px-5 rounded-xl border-none"
                        onClick={() => handleStatusUpdate(campaign.id, 'PAUSED')}
                      >
                        <Pause className="w-3 h-3 mr-1.5"/> PAUSE
                      </Button>
                    )}
                    {campaign.status === 'PAUSED' && (
                      <Button 
                        className="bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800/50 border border-cyan-500/30 font-black uppercase tracking-widest text-[10px] h-10 px-5 rounded-xl"
                        onClick={() => handleStatusUpdate(campaign.id, 'ACTIVE')}
                      >
                        <Play className="w-3 h-3 mr-1.5"/> RESUME
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
