'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, FileText, Database, Lock, Search, Download } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Paywall } from '@/components/ui/Paywall';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';

// Simuleer recharts (zou in een echte implementatie geïnstalleerd moeten zijn)
export default function EnterpriseOSPage() {
  const { t } = useLanguage();

  return (
    <Paywall requiredTier="ENTERPRISE">
      <div className="min-h-screen bg-[#050505] p-6 text-gold font-mono selection:bg-navyLight selection:text-white">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-gold/30 pb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
              Red Billionaire OS
            </h1>
            <p className="text-gold/60 mt-1 uppercase text-xs tracking-widest">
              Hoofdcommando Centrum // Toegangsniveau: GODMODE
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-red-950/30 border border-gold/50 px-4 py-2 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Systeem Online</span>
            </div>
          </div>
        </div>

        {/* Swarm Avatar 3D Visualizer & Command Interface */}
          <NeuralSwarm theme="red" />

        {/* 3 Kernmodules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Module A: God-View Data Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-[#0a0a0a] border border-gold/20 p-6 rounded-lg relative overflow-hidden group hover:border-gold/50 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navyLight via-red-500 to-navyLight opacity-50" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase flex items-center gap-2">
                  <Database className="w-5 h-5" /> Wereldwijde Kasstroom Radar
                </h2>
                <span className="text-xs bg-gold/10 text-goldLight px-2 py-1 rounded border border-gold/20">LIVE</span>
              </div>
              
              {/* Mock Graph Area */}
              <div className="h-64 w-full bg-gradient-to-b from-navyLight/10 to-transparent border border-gold/10 rounded-lg flex items-end p-4 relative">
                 {/* Decorative Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                 
                 {/* Mock Data Lines */}
                 <div className="w-full flex items-end gap-2 h-full z-10 opacity-70">
                    {[30, 45, 20, 60, 80, 50, 90, 70, 100, 60, 85, 40].map((h, i) => (
                      <div key={i} className="flex-1 bg-gold/20 hover:bg-gold/50 border-t-2 border-gold transition-all cursor-pointer group-hover:border-red-400" style={{ height: `${h}%` }} />
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gold/5 border border-gold/10 rounded">
                  <p className="text-xs text-gold/50 uppercase">Totale Omzet</p>
                  <p className="text-2xl font-bold mt-1">€12.4M</p>
                </div>
                <div className="p-4 bg-gold/5 border border-gold/10 rounded">
                  <p className="text-xs text-gold/50 uppercase">AI Output</p>
                  <p className="text-2xl font-bold mt-1">84.203 OPS</p>
                </div>
                <div className="p-4 bg-gold/5 border border-gold/10 rounded">
                  <p className="text-xs text-gold/50 uppercase">Risico Niveau</p>
                  <p className="text-2xl font-bold mt-1 text-green-500">LAAG</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Module B & C Stack */}
          <div className="space-y-6">
            
            {/* Module B: The Office (Contracts & Legal) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0a0a0a] border border-gold/20 p-6 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.05)]"
            >
              <h2 className="text-xl font-bold uppercase flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5" /> Het Kantoor (Juridische Kluis)
              </h2>
              <div className="space-y-3">
                {['NDA_Alibaba_Supplier.pdf', 'Tax_Audit_Q3_2026.pdf', 'IP_Transfer_Agreement.pdf'].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black border border-gold/10 rounded hover:border-gold/40 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gold/50 group-hover:text-gold" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-colors">
                + NIEUW JURIDISCH DOCUMENT
              </button>
            </motion.div>

            {/* Module C: Intelligence & PDF Reports */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0a0a0a] border border-gold/20 p-6 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.05)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 animate-pulse" />
              <div className="relative z-10">
                <h2 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                  <Search className="w-5 h-5" /> Inlichtingen Motor
                </h2>
                <p className="text-xs text-gold/70 mb-4">Genereer 10-pagina marktonderzoek PDFs via Swarm AI.</p>
                
                <input 
                  type="text" 
                  placeholder="Onderwerp (bijv. Vastgoed Dubai 2027)" 
                  className="w-full bg-black border border-gold/30 rounded p-3 text-sm focus:outline-none focus:border-gold mb-3 text-gold placeholder:text-gold/30"
                />
                
                <button className="w-full py-3 bg-gold text-black font-black uppercase tracking-widest hover:bg-gold shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all">
                  GENEREER DOSSIER [PDF]
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </Paywall>
  );
}
