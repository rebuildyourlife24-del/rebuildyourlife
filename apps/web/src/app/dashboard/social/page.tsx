'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Campaign {
  id: string;
  title: string;
  platform: 'TIKTOK' | 'META' | 'LINKEDIN';
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  budget: number;
  spent: number;
  revenue: number;
  roas: number;
  impressions: number;
}

export default function SwarmDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'mock-1',
      title: 'VTLB Hack Video',
      platform: 'TIKTOK',
      status: 'ACTIVE',
      budget: 1000,
      spent: 450,
      revenue: 1800,
      roas: 4.0,
      impressions: 125000,
    },
    {
      id: 'mock-2',
      title: 'Billionaire Mindset Ad',
      platform: 'META',
      status: 'PENDING_APPROVAL',
      budget: 2500,
      spent: 0,
      revenue: 0,
      roas: 0,
      impressions: 0,
    }
  ]);

  const approveCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'ACTIVE' } : c));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'TIKTOK': return '🎵';
      case 'META': return '♾️';
      case 'LINKEDIN': return '💼';
      default: return '📱';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PENDING_APPROVAL': return 'bg-[#d4a853]/10 text-[#d4a853] border-[#d4a853]/20';
      case 'PAUSED': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      default: return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">The Swarm Radar</h1>
        <p className="text-zinc-400">Global Broadcasting & Advertising Hub</p>
      </header>

      {/* Network Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#000000] border-[#d4a853]/20 shadow-[0_0_15px_rgba(212,168,83,0.1)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>🎵</span> TikTok Ads API
            </h3>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">CONNECTED</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Ad Account:</span> <span className="text-white">@apex_predator</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Pixel Status:</span> <span className="text-green-500">FIRING</span></div>
          </div>
        </Card>

        <Card className="bg-[#000000] border-[#d4a853]/20 shadow-[0_0_15px_rgba(212,168,83,0.1)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>♾️</span> Meta Graph API
            </h3>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">CONNECTED</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Business ID:</span> <span className="text-white">839218319</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Pixel Status:</span> <span className="text-green-500">FIRING</span></div>
          </div>
        </Card>

        <Card className="bg-[#000000] border-zinc-800 p-6 opacity-50 grayscale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>💼</span> LinkedIn Marketing
            </h3>
            <Badge className="bg-gold/10 text-gold border-gold/20">DISCONNECTED</Badge>
          </div>
          <Button variant="secondary" className="w-full mt-2 border-zinc-700 text-zinc-400">Connect</Button>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <h2 className="text-xl font-medium text-white">Active Deployments</h2>
        <Button className="bg-[#d4a853] text-black hover:bg-[#b0893a]">Launch New Campaign</Button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign, idx) => (
          <motion.div 
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-[#0a0a0a] border-zinc-800/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#d4a853]/50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-xl border border-zinc-800">
                  {getPlatformIcon(campaign.platform)}
                </div>
                <div>
                  <h3 className="font-medium text-white text-lg">{campaign.title}</h3>
                  <div className="flex gap-3 mt-1">
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    <span className="text-zinc-500 text-sm">Budget: €{campaign.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-1 justify-center">
                <div className="text-center">
                  <div className="text-sm text-zinc-500">Spent</div>
                  <div className="text-lg text-white font-mono">€{campaign.spent.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-zinc-500">Revenue</div>
                  <div className="text-lg text-green-400 font-mono">€{campaign.revenue.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#d4a853]">ROAS</div>
                  <div className="text-xl text-[#d4a853] font-bold font-mono">{campaign.roas}x</div>
                </div>
              </div>

              <div className="flex gap-3 justify-end min-w-[140px]">
                {campaign.status === 'PENDING_APPROVAL' ? (
                  <Button 
                    className="bg-[#d4a853] text-black shadow-[0_0_15px_rgba(212,168,83,0.3)]"
                    onClick={() => approveCampaign(campaign.id)}
                  >
                    APPROVE
                  </Button>
                ) : (
                  <Button variant="secondary" className="border-zinc-700 text-zinc-300">
                    Manage
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
