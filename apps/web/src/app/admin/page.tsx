'use client';

import { ShieldAlert, CheckCircle2, Play, AlertTriangle, Target, DollarSign, Activity, Mic } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrionEye } from '@/components/ui/OrionEye';
import { useState, useEffect } from 'react';

const emergencyRequests = [
  { id: 'req_1', user: 'Henk Semler', reason: 'Auto total loss. Reparatie kost 1200.', amount: 1200, status: 'WACHTEN_OP_CEO_GOEDKEURING', aiNote: 'Risico: Onttrekking duwt saldo onder VTLB grens (€1500).' },
];

const opportunities = [
  { id: 'opp_1', niche: 'Gezondheid & Fitness Tech', trend: 'Slimme Houding Correctors', roi: 4500, mediaReady: 8 },
];

export default function CommandCenterPage() {
  const [singularityActive, setSingularityActive] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      // Automatically restart listening if it ends
      setTimeout(() => {
        try {
          recognition.start();
        } catch (e) {}
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase();
      if (command.includes('swarm') || command.includes('initiate swarm') || command.includes('apex')) {
        setSingularityActive(true);
      }
      if (command.includes('deactivate') || command.includes('stop')) {
        setSingularityActive(false);
      }
    };

    try {
      recognition.start();
    } catch (e) {}

    return () => {
      recognition.onend = null; // Prevent restart loop on unmount
      recognition.stop();
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Bar */}
      <div className="bg-black/50 border border-[#d4a853]/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(212,168,83,0.05)]">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">The Apex Ascension</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-[#d4a853] tracking-widest text-sm uppercase">Global AI Command Center</p>
            {listening && (
              <span className="flex items-center gap-1 text-xs text-red-500 animate-pulse">
                <Mic className="w-3 h-3" /> VOICE COMMAND ACTIVE
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="p-3 bg-[#d4a853]/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-[#d4a853]" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase">Empire Revenue</p>
            <p className="text-2xl font-bold text-white">€ 142.500,00</p>
          </div>
        </div>
      </div>

      {/* THE ORION EYE - 3D HOLOGRAPHIC MAP */}
      <div className="w-full">
        <OrionEye apexMode={singularityActive} />
      </div>

      {/* SINGULARITY SWITCH */}
      <Card className="p-6 bg-[#050505] border border-[#d4a853]/30 shadow-[0_0_40px_rgba(212,168,83,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full ${singularityActive ? 'bg-red-500/20 text-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-zinc-800 text-zinc-400'}`}>
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">The Singularity Switch</h2>
            <p className="text-zinc-400 text-sm mt-1">
              {singularityActive ? 'APEX PREDATOR MODE ENGAGED. Maximum AI aggression on all markets.' : 'Standard Operations. AI is running in conservative mode.'}
              <br/>
              <span className="text-xs text-zinc-500">Try saying: "Initiate Swarm" or "Deactivate"</span>
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setSingularityActive(!singularityActive)}
          className={`px-8 py-6 text-lg font-bold uppercase tracking-widest border-none transition-all duration-500 ${
            singularityActive 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)]' 
              : 'bg-[#d4a853] hover:bg-[#b0893a] text-black shadow-[0_0_20px_rgba(212,168,83,0.4)]'
          }`}
        >
          {singularityActive ? 'Deactivate' : 'Engage Apex Mode'}
        </Button>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: DEFENSE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> Defense Grid
            </h2>
            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full border border-red-500/20">
              {emergencyRequests.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {emergencyRequests.map(req => (
              <Card key={req.id} variant="glass" className="p-5 border border-red-500/20 bg-black/40">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{req.user}</h3>
                    <p className="text-red-400 font-bold mt-1">€ {req.amount},-</p>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                
                <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 mb-4">
                  <p className="text-sm text-zinc-300 italic">"{req.reason}"</p>
                </div>
                
                <div className="bg-red-950/30 p-3 rounded-lg border border-red-900/50 mb-6">
                  <p className="text-xs font-bold text-red-400 uppercase mb-1">AI Analysis</p>
                  <p className="text-sm text-zinc-300">{req.aiNote}</p>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-none">Reject</Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT: OFFENSE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#d4a853]/20 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#d4a853]" /> Attack Grid (The Swarm)
            </h2>
            <span className="px-3 py-1 bg-[#d4a853]/10 text-[#d4a853] text-xs font-bold rounded-full border border-[#d4a853]/20">
              {opportunities.length} Ready
            </span>
          </div>

          <div className="space-y-4">
            {opportunities.map(opp => (
              <Card key={opp.id} variant="glass" className="p-5 border border-[#d4a853]/20 bg-black/40">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-[#d4a853] uppercase tracking-wider">{opp.niche}</span>
                    <h3 className="font-bold text-white text-lg mt-1">{opp.trend}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Expected ROI</p>
                    <p className="text-[#d4a853] font-bold">€ {opp.roi},-</p>
                  </div>
                </div>

                <div className="bg-[#d4a853]/10 p-3 rounded-lg border border-[#d4a853]/20 mb-6 flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Content Forge:</span>
                  <span className="text-sm font-bold text-[#d4a853]">{opp.mediaReady} Ads Ready</span>
                </div>

                <Button fullWidth onClick={() => setSingularityActive(true)} className="bg-[#d4a853] hover:bg-[#b0893a] text-black border-none gap-2">
                  <Play className="w-4 h-4" /> Initiate Swarm
                </Button>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
