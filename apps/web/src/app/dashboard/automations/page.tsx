'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Network, Send, Zap, MessageSquare } from 'lucide-react';
import { generateSocialPostAction, dispatchToMakeWebhookAction } from '../../actions/social-posting';

export default function AutomationsPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pushStatus, setPushStatus] = useState("");

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setPushStatus("");
    const res = await generateSocialPostAction(topic, platform);
    if (res.success && res.text) {
      setGeneratedText(res.text);
    } else {
      alert("Fout bij genereren: " + res.error);
    }
    setLoading(false);
  };

  const handleDispatch = async () => {
    if (!generatedText) return;
    setPushStatus("Verzenden naar Make.com...");
    const res = await dispatchToMakeWebhookAction({
      text: generatedText,
      platform: platform
    });
    if (res.success) {
      setPushStatus("🚀 Succesvol verzonden naar je Make.com Webhook!");
    } else {
      setPushStatus("❌ Fout: " + res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-8 w-8 text-[#00f0ff]" />
            Social Media Zendstation
          </h1>
          <p className="text-gray-400 mt-1">
            Genereer virale posts en schiet ze direct via de webhook naar al je gekoppelde kanalen.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Generatie Paneel */}
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-[#00f0ff] flex items-center gap-2">
            <Zap className="h-5 w-5" /> 1. Generatie
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Waar gaat de post over?</label>
              <Input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Bijv. Een nieuw winnend dropshipping product..."
                className="bg-black/50 border-[#00f0ff]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Platform Stijl</label>
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black/50 border border-[#00f0ff]/30 text-white h-10 rounded-md px-3"
              >
                <option value="linkedin">LinkedIn (Professioneel)</option>
                <option value="instagram">Instagram (Visueel, Hashtags)</option>
                <option value="twitter">Twitter / X (Kort & Krachtig)</option>
              </select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading || !topic}
              className="w-full bg-[#00f0ff]/10 border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 mt-4"
            >
              {loading ? 'AI is aan het schrijven...' : 'Genereer Post Tekst'}
            </Button>
          </div>
        </Card>

        {/* Dispatch Paneel */}
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-[#00f0ff] flex items-center gap-2">
            <Send className="h-5 w-5" /> 2. Uitzenden
          </h3>
          
          <div className="space-y-4 h-full flex flex-col">
            <label className="block text-sm text-gray-400">Gegenereerde Concept</label>
            <textarea 
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              placeholder="Jouw AI-post verschijnt hier..."
              className="flex-1 min-h-[150px] bg-black/50 border border-[#00f0ff]/30 text-white p-3 rounded-md text-sm"
            />

            {pushStatus && (
              <div className={`p-3 rounded-md text-sm ${pushStatus.includes('Fout') ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'} border`}>
                {pushStatus}
              </div>
            )}

            <Button 
              onClick={handleDispatch} 
              disabled={!generatedText || pushStatus === 'Verzenden naar Make.com...'}
              className="w-full h-14 bg-[#00f0ff] hover:bg-[#00c0cc] text-black font-bold text-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              FIRE PAYLOAD TO MAKE.COM
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
