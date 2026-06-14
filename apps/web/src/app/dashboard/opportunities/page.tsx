'use client';

import { useState } from 'react';
import { Target, Zap, Play, CheckCircle2, BarChart3, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Recharts for data visualization
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockData = [
  { name: 'Good (Base)', roi: 1200, color: '#3f3f46' },
  { name: 'Better (Exp)', roi: 4500, color: '#f59e0b' },
  { name: 'Best (Viral)', roi: 18500, color: '#10b981' },
];

export default function OpportunitiesPage() {
  const [status, setStatus] = useState('REVIEW'); // REVIEW, TESTING

  const handleInitiate = () => {
    setStatus('TESTING');
    // In a real app, this calls initiateTesting(reportId)
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          The Opportunity Engine <Target className="w-6 h-6 text-emerald-500" />
        </h1>
        <p className="mt-2 text-zinc-400">Orion scant wereldwijde trends, genereert businesscases en bouwt autonome ad-campagnes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: The Report */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/20">
                New Target Detected
              </span>
              <span className="text-zinc-500 text-sm">Vandaag, 14:03</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Viral Trend: Smart Posture Correctors</h2>
            <p className="text-zinc-400 mb-6">
              Zittend werk eist zijn tol. Korte, authentieke UGC video's op TikTok van mensen die hun houding fixen, gaan op dit moment viraal met extreem lage CPM's.
            </p>

            <div className="h-64 mt-8">
              <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> 30-Day Profit Projection Matrix
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                  <Tooltip 
                    cursor={{fill: '#27272a'}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value: any) => [`€${value}`, 'Verwachte Winst']}
                  />
                  <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
                    {mockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Area */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">The Live Testing Ground</h3>
              <p className="text-sm text-zinc-400">Lanceer micro-budget ads om de tractie live te valideren.</p>
            </div>
            {status === 'REVIEW' ? (
              <Button onClick={handleInitiate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8">
                <Play className="w-4 h-4" /> Initiate Testing
              </Button>
            ) : (
              <Button disabled className="bg-zinc-800 text-emerald-400 border border-emerald-500/20 gap-2 px-8">
                <Zap className="w-4 h-4 animate-pulse" /> Testing Initiated...
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Content Forge */}
        <div className="space-y-6">
          <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-gold-500" /> The Content Forge
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              AI-Gegenereerde media staat klaar voor A/B testing. Geen menselijke input benodigd.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase">TikTok UGC Video</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-white italic">"POV: Je rug doet eindelijk geen pijn meer na 8 uur achter je bureau 😭✨"</p>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Insta Carousel</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-white italic">"De makkelijkste hack voor een betere houding. Swipe voor resultaat 👉"</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
