'use client';

import { useState } from 'react';
import { Shield, Lock, Send, Target, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ConciergePage() {
  const [requestAmount, setRequestAmount] = useState('');
  const [reason, setReason] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            The AI Concierge <Shield className="w-6 h-6 text-gold-500" />
          </h1>
          <p className="mt-2 text-zinc-400">Jouw 24/7 Private Banker. Beheer spaardoelen of vraag direct noodkapitaal aan.</p>
        </div>
      </div>

      {/* MILITARY GRADE SECURITY BANNER */}
      <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Lock className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-emerald-400 font-bold">AES-256-GCM Military-Grade Encryptie Actief</h3>
          <p className="text-emerald-500/80 text-sm mt-1">
            Alle verzoeken, persoonlijke noodgevallen en financiële data die u in The Concierge deelt, worden lokaal versleuteld voordat ze de database raken. Alleen de AI en de CEO kunnen dit uitlezen. Uw kwetsbare momenten zijn 100% beveiligd.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nood Verzoek Paneel */}
        <div className="bg-black/40 border border-gold/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gold/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-xl font-bold text-white">Emergency Request</h2>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Noodgeval (bijv. wasmachine stuk)? Voer het bedrag in. De AI beslist binnen 5 minuten. Bij gevaar voor uw VTLB, escaleert dit naar de CEO voor goedkeuring.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Benodigd Bedrag (€)</label>
              <input 
                type="number"
                placeholder="400"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Reden (Versleuteld opgeslagen)</label>
              <textarea 
                placeholder="Wasmachine is vandaag doorgebrand."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white mt-1 h-24 resize-none"
              />
            </div>
            <Button fullWidth className="bg-gold hover:bg-[#0a192f] text-white border-none gap-2">
              <Send className="w-4 h-4" /> Vraag Kapitaal Aan (5-Min Release)
            </Button>
          </div>
        </div>

        {/* Spaar Doel Paneel */}
        <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gold-500/10 rounded-lg">
              <Target className="w-5 h-5 text-gold-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Nieuw Spaardoel</h2>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Stel een Luxe-doel in (bijv. Vakantie of Auto). Orion onttrekt automatisch en onzichtbaar micro-bedragen van uw winst, totdat het doel bereikt is.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Doel Naam</label>
              <input 
                type="text"
                placeholder="Vakantie Ibiza"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Doelbedrag (€)</label>
              <input 
                type="number"
                placeholder="2500"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white mt-1"
              />
            </div>
            <Button fullWidth className="bg-gold-500 hover:bg-gold-400 text-black border-none gap-2">
              <Target className="w-4 h-4" /> Start Spaar-Protocol
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

