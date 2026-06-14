'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlayCircle, Type, ImageIcon, Wand2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContentForgePage() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateContent = async () => {
    if (!niche) return;
    setLoading(true);
    
    // Simulate OpenAI / API Call
    setTimeout(() => {
      setResult({
        script: `[HOOK] \nStop met scrollen als je schulden hebt en 's nachts wakker ligt. (Wijs naar scherm, serieuze blik)\n\n[BODY]\nWeet je waarom banken miljarden winst maken? Omdat zij systemen gebruiken en jij emotie. Ik gebruik The Opportunity Engine. Een AI die niet alleen mijn schuldeisers stil kreeg via automatische VTLB-brieven, maar nu autonoom geld voor me genereert.\n\n[CTA]\nKlik op de link, claim je Operator status, en laat The Concierge je leven overnemen. Geen excuses meer.`,
        voiceoverPrompt: "Voice: 'Adam' (ElevenLabs). Style: Assertive, low-pitch, high-urgency, slightly aggressive. Do NOT sound like an infomercial, sound like a wealthy mentor.",
        midjourneyPrompt: "A cinematic hyper-realistic shot of a glowing gold and black dashboard on a futuristic curved monitor in a dark luxury penthouse, rain on the window, ultra detailed, 8k, unreal engine 5 --ar 16:9 --v 6.0"
      });
      setLoading(false);
    }, 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-gold-500" />
            The Content Forge <span className="text-sm px-2 py-1 bg-gold-500/10 text-gold-500 border border-gold-500/30 rounded uppercase tracking-widest ml-2">V2.0</span>
          </h1>
          <p className="text-zinc-400 mt-2 font-medium">Genereer meedogenloze VSL scripts, voice-overs en visuele prompts op commando.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Control */}
        <div className="lg:col-span-1 space-y-6">
          <Card variant="glass" className="p-6 border-zinc-800">
            <h2 className="text-xl font-bold uppercase mb-4 text-white">Niche Target</h2>
            <div className="space-y-4">
              <Input 
                label="Beschrijf je doelgroep of probleem" 
                placeholder="Bijv. Jonge ondernemers met belastingstress..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
              <Button 
                onClick={generateContent} 
                loading={loading} 
                fullWidth 
                className="bg-gold-500 text-black hover:bg-gold-400 font-bold uppercase tracking-widest mt-4"
              >
                Genereer Massale Acquisitie
              </Button>
            </div>
          </Card>
        </div>

        {/* Output */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-950/50">
              <Wand2 className="w-16 h-16 text-zinc-800 mb-4" />
              <h3 className="text-zinc-500 font-bold uppercase tracking-widest">Wachtend op commando</h3>
              <p className="text-zinc-600 text-sm mt-2 max-w-md">De Content Forge is geladen. Geef een niche op om direct scripts, voice-over parameters en visuele generatoren te activeren.</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-zinc-800 rounded-xl p-8 text-center bg-black">
              <div className="w-12 h-12 border-4 border-zinc-800 border-t-gold-500 rounded-full animate-spin mb-4" />
              <h3 className="text-gold-500 font-bold uppercase tracking-widest animate-pulse">OpenAI & Midjourney API's aanspreken...</h3>
            </div>
          )}

          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Script */}
              <Card variant="glass" className="p-6 border-gold-500/30 bg-black relative">
                <div className="absolute top-4 right-4">
                  <button onClick={() => copyToClipboard(result.script)} className="text-zinc-500 hover:text-white transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Type className="w-6 h-6 text-gold-500" />
                  <h2 className="text-xl font-bold uppercase text-white">Video Sales Letter Script</h2>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed p-4 bg-zinc-900 rounded-lg text-sm border border-zinc-800">
                  {result.script}
                </pre>
              </Card>

              {/* Voice & Image Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="glass" className="p-6 border-zinc-800 bg-black relative">
                  <div className="absolute top-4 right-4">
                    <button onClick={() => copyToClipboard(result.voiceoverPrompt)} className="text-zinc-500 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <PlayCircle className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-bold uppercase text-white">ElevenLabs Voice</h2>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {result.voiceoverPrompt}
                  </p>
                </Card>

                <Card variant="glass" className="p-6 border-zinc-800 bg-black relative">
                  <div className="absolute top-4 right-4">
                    <button onClick={() => copyToClipboard(result.midjourneyPrompt)} className="text-zinc-500 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <ImageIcon className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-bold uppercase text-white">Midjourney V6 Prompt</h2>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {result.midjourneyPrompt}
                  </p>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
