'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Paywall } from '@/components/ui/Paywall';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', balance: 0, debt: 0 },
  { month: 'Feb', balance: 0, debt: 0 },
  { month: 'Mar', balance: 0, debt: 0 },
  { month: 'Apr', balance: 0, debt: 0 },
  { month: 'May', balance: 0, debt: 0 },
  { month: 'Jun', balance: 0, debt: 0 },
  { month: 'Jul', balance: 0, debt: 0 },
  { month: 'Aug', balance: 0, debt: 0 },
  { month: 'Sep', balance: 0, debt: 0 },
  { month: 'Oct', balance: 0, debt: 0 },
  { month: 'Nov', balance: 0, debt: 0 },
  { month: 'Dec', balance: 0, debt: 0 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export default function WarRoomPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-textPrimary uppercase tracking-widest text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
          WAR ROOM
        </h1>
        <p className="mt-2 text-textSecondary font-mono text-sm uppercase tracking-wider">
          Strategic Overview & Trajectory Analysis
        </p>
      </motion.div>

      {/* AI Prognosis Block */}
      <Paywall requiredTier="PREMIUM">
        <motion.div variants={itemVariants}>
          <Card variant="glass" padding="lg" className="border-l-4 border-l-[#00f0ff] bg-navy/50 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10 blur-xl">
               <div className="w-40 h-40 bg-[#00f0ff] rounded-full"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-xs uppercase tracking-[0.25em] text-[#00f0ff] font-bold mb-2">
                System Alert // AI Prognosis
              </h2>
              <p className="text-xl md:text-2xl font-light text-textPrimary leading-relaxed">
                Based on current trajectory, <strong className="font-bold text-white">financial independence</strong> is estimated in <span className="text-[#00f0ff] font-mono font-bold drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">AWAITING LIVE DATA</span>.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Complex Datavisualization */}
        <motion.div variants={itemVariants}>
          <Card variant="default" padding="lg" className="border-t border-white/5 bg-[#0a0e1a]/80 shadow-[inset_0_0_40px_rgba(0,240,255,0.02)]">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-textPrimary tracking-wide">Tactical Trajectory Overlay</h3>
                <p className="text-sm text-textSecondary font-mono mt-1">Life Balance vs. Outstanding Debt</p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]"></span>
                  <span className="text-textSecondary">BALANCE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_5px_#ef4444]"></span>
                  <span className="text-textSecondary">DEBT</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <filter id="glow-balance" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glow-debt" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#8892a4" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="monospace"
                  />
                  
                  {/* Left Y Axis for Balance (0-100) */}
                  <YAxis 
                    yAxisId="left" 
                    stroke="#00f0ff" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="monospace"
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}`}
                  />
                  
                  {/* Right Y Axis for Debt */}
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#ef4444" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="monospace"
                    tickFormatter={(val) => `€${(val/1000).toFixed(1)}k`}
                  />

                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 26, 0.9)', 
                      border: '1px solid rgba(0, 240, 255, 0.2)', 
                      borderRadius: '8px', 
                      color: '#f1f1f1',
                      boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)',
                      fontFamily: 'monospace'
                    }}
                    itemStyle={{ fontSize: '14px' }}
                    labelStyle={{ color: '#8892a4', marginBottom: '8px' }}
                  />

                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="balance" 
                    name="Life Balance Score"
                    stroke="#00f0ff" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0a0e1a', stroke: '#00f0ff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#00f0ff', stroke: '#fff', strokeWidth: 2 }}
                    filter="url(#glow-balance)"
                  />
                  
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="debt" 
                    name="Debt Level"
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0a0e1a', stroke: '#ef4444', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                    filter="url(#glow-debt)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* === OPPORTUNITY ENGINE === */}
        <motion.div variants={itemVariants} className="mt-8">
          <h2 className="text-2xl font-bold text-[#00f0ff] mb-4 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            Opportunity Engine // The Strike Force
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Jip-en-Janneke Matrix */}
            <Card className="border border-[#00f0ff]/30 bg-[#0a0e1a]/80 shadow-[0_0_20px_rgba(0,240,255,0.1)] p-6">
              <h3 className="text-xl font-bold text-white mb-2">Live Opportunity: Viral Titanium Ring</h3>
              <p className="text-textSecondary mb-4">
                <strong>Orion Conclusie:</strong> "Dit product gaat viraal op TikTok onder tech-liefhebbers. De inkoop ligt extreem laag, waardoor de winstmarge ons in staat stelt de markt agressief te domineren zonder risico."
              </p>
              
              <div className="bg-[#111827] rounded-lg border border-[#374151] overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1f2937] text-white">
                    <tr>
                      <th className="p-3">Scenario</th>
                      <th className="p-3">Verwachte Winst (30d)</th>
                      <th className="p-3">Actie Orion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#374151]">
                    <tr className="bg-success/5">
                      <td className="p-3 font-bold text-success">Good (Conservatief)</td>
                      <td className="p-3 text-white">€ 4.500,-</td>
                      <td className="p-3 text-textSecondary">Test loopt, lichte winst.</td>
                    </tr>
                    <tr className="bg-blue-500/5">
                      <td className="p-3 font-bold text-blue-400">Better (Baseline)</td>
                      <td className="p-3 text-white">€ 28.000,-</td>
                      <td className="p-3 text-textSecondary">Opschalen naar alle netwerken.</td>
                    </tr>
                    <tr className="bg-gold/5">
                      <td className="p-3 font-bold text-gold">Best (Viral Domination)</td>
                      <td className="p-3 text-white">€ 150.000+</td>
                      <td className="p-3 text-textSecondary">Volledige supply-chain overname.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* The Content Forge */}
            <Card className="border border-[#00f0ff]/30 bg-[#0a0e1a]/80 shadow-[0_0_20px_rgba(0,240,255,0.1)] p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">The Content Forge</h3>
                <Badge variant="success" className="animate-pulse">MEDIA READY</Badge>
              </div>
              <p className="text-sm text-textSecondary mb-4">
                Hyper-Realistische UGC (Imperfecties & 3+ Hoeken gegenereerd). Geen ads-budget nodig.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-[#111827] border border-[#374151] rounded">
                  <span className="text-white font-mono text-sm">▶ TikTok (POV Unboxing)</span>
                  <span className="text-[#00f0ff] text-xs">Ready</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#111827] border border-[#374151] rounded">
                  <span className="text-white font-mono text-sm">▶ Insta Reels (Straat Review)</span>
                  <span className="text-[#00f0ff] text-xs">Ready</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#111827] border border-[#374151] rounded">
                  <span className="text-white font-mono text-sm">▶ X (Viral Thread)</span>
                  <span className="text-[#00f0ff] text-xs">Ready</span>
                </div>
              </div>

              <Button className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                [ INITIEER LIVE TEST ]
              </Button>
            </Card>

          </div>
        </motion.div>
      </Paywall>
    </motion.div>
  );
}
