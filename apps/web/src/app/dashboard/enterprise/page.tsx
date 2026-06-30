'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, FileText, Database, Lock, Search, Download, Cpu, Box, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Paywall } from '@/components/ui/Paywall';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';

import { getDocuments } from '@/actions/enterprise';
import { addIntelligenceTarget, getIntelligenceTargets } from '@/actions/intelligence';

export default function EnterpriseOSPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [targetType, setTargetType] = useState('COMMERCE');
  const [generating, setGenerating] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    // Fetch live enterprise stats
    fetch('/api/ceo/metrics')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.metrics);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch documents and targets
    getDocuments().then(setDocs);
    getIntelligenceTargets().then(setTargets);
  }, []);

  const handleAddTarget = async () => {
    if (!subject.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await addIntelligenceTarget(subject.trim(), targetType);
      if (res.success) {
        setTargets([res.target, ...targets]);
        setSubject('');
      }
    } catch(e) {
      console.error(e);
    }
    setGenerating(false);
  };

  return (
    <Paywall requiredTier="ENTERPRISE">
      <div className="min-h-[85vh] p-6 text-white font-sans selection:bg-cyan-500/30 selection:text-white relative z-10">
        
        {/* Background glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/10 hidden blur-[] rounded-full pointer-events-none -z-10"></div>

        {/* Header */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)] mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase flex items-center gap-4 text-white">
              IMPERIAL BILLIONAIRE OS <Cpu className="w-8 h-8 text-cyan-400" />
            </h1>
            <p className="text-cyan-400/60 mt-2 uppercase text-xs font-bold tracking-widest">
              Hoofdcommando Centrum // Toegangsniveau: GODMODE
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-cyan-950/20 border border-cyan-500/30 px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Systeem Online</span>
            </div>
          </div>
        </div>

        {/* Swarm Avatar 3D Visualizer & Command Interface */}
        <div className="mb-8">
          <NeuralSwarm theme="blue" />
        </div>

        {/* 3 Kernmodules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Module A: God-View Data Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-black/40 border border-white/5 p-6 md:p-8 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-cyan-500/20 opacity-50" />
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h2 className="text-sm font-black uppercase flex items-center gap-2 tracking-widest">
                  <Database className="w-4 h-4 text-cyan-500" /> Wereldwijde Kasstroom Radar
                </h2>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 font-bold tracking-widest animate-pulse">LIVE DATA</span>
              </div>
              
              {loading ? (
                <div className="h-72 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
              ) : (
                <div className="h-72 w-full bg-zinc-950/50 border border-white/5 rounded-xl flex items-end justify-center p-4 relative overflow-hidden text-zinc-500 uppercase tracking-widest font-bold text-xs">
                   {/* Decorative Grid */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                   
                   {data?.cashflow ? (
                     <div className="w-full flex items-end gap-3 h-full z-10 opacity-80">
                        {data.cashflow.map((h: number, i: number) => (
                          <div key={i} className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 border-t-[3px] border-cyan-500 transition-all cursor-pointer rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                     </div>
                   ) : (
                     <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                       <Activity className="w-6 h-6 text-cyan-500/30" />
                       Wachten op eerste transacties via Live API.
                     </div>
                   )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Totale Omzet</p>
                  <p className="text-2xl font-black text-white">{data?.totalRevenue || "€0,00"}</p>
                </div>
                <div className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">AI Output</p>
                  <p className="text-2xl font-black text-cyan-400">{data?.aiOps || "0"} <span className="text-xs text-zinc-500">OPS</span></p>
                </div>
                <div className="p-5 bg-zinc-950/50 border border-white/5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Risico Niveau</p>
                  <p className="text-2xl font-black text-emerald-400 tracking-widest">{data?.riskLevel || "LAAG"}</p>
                </div>
              </div>

              {/* Low Stock Alerts */}
              {data?.lowStockAlerts && data.lowStockAlerts.length > 0 && (
                <div className="mt-6 p-5 bg-black/40 border border-blue-500/30 rounded-xl">
                  <h3 className="text-xs font-black uppercase text-blue-400 flex items-center gap-2 mb-3 tracking-widest">
                    <ShieldAlert className="w-4 h-4" /> Kritieke Voorraadwaarschuwing (Shopify)
                  </h3>
                  <div className="space-y-2">
                    {data.lowStockAlerts.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs text-zinc-300">
                        <span>{item.title}</span>
                        <span className="text-blue-400 font-bold">{item.inventory} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Module B & C Stack */}
          <div className="space-y-6">
            
            {/* Module B: The Office (Contracts & Legal) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 border border-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-md"
            >
              <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-6 border-b border-white/5 pb-4 tracking-widest">
                <Lock className="w-4 h-4 text-cyan-500" /> Juridische Kluis
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {docs.length > 0 ? docs.map((doc: any, i: number) => (
                  <div key={i} onClick={() => setSelectedDoc(doc)} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-white/5 rounded-xl hover:border-cyan-500/30 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400" />
                      <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{doc.title}</span>
                    </div>
                    <Download className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )) : (
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center py-4 border border-dashed border-white/10 rounded-xl">
                    Geen documenten geüpload
                  </div>
                )}
              </div>
              
              {selectedDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="font-bold text-white uppercase tracking-widest">{selectedDoc.title}</h3>
                      <button onClick={() => setSelectedDoc(null)} className="text-zinc-500 hover:text-white">Sluiten</button>
                    </div>
                    <div className="p-6 overflow-y-auto text-sm text-zinc-300 whitespace-pre-wrap">
                      {selectedDoc.content}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Module C: Intelligence Targets */} 
            <motion.div  
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }} 
              className="bg-black/40 border border-white/5 p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-md group hover:border-white/10 transition-colors" 
            > 
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> 
              <div className="relative z-10"> 
                <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3 tracking-widest text-white border-b border-white/5 pb-4"> 
                  <Search className="w-4 h-4 text-cyan-500" /> Omni-Vector Targets (The Swarm) 
                </h2> 
                <p className="text-[10px] text-zinc-400 mb-4 font-bold uppercase tracking-widest leading-relaxed">
                  Voeg onderzoekspunten toe. De "Alles-Herkenner" en "Uitwerker" AI's zullen deze vannacht scannen.
                </p> 
                 
                <div className="flex gap-2 mb-4">
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500/50 text-white font-medium transition-colors w-1/3"
                  >
                    <option value="COMMERCE">Commerce (Shopify)</option>
                    <option value="TRADE">Trade (Markten)</option>
                    <option value="SOCIAL">Social (Trends)</option>
                    <option value="RYL_DEV">RYL (Onderhoud)</option>
                  </select>
                  <input  
                    type="text"  
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="Onderwerp, niche of URL..."  
                    className="w-2/3 bg-zinc-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500/50 text-white font-medium transition-colors" 
                  /> 
                </div>
                 
                <button  
                  onClick={handleAddTarget} 
                  disabled={generating} 
                  className={`w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-xl transition-all flex items-center justify-center gap-2 text-xs mb-6 ${generating ? 'opacity-50 cursor-not-allowed' : ''}`} 
                > 
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Box className="w-4 h-4" />}  
                  {generating ? 'DEPLOYING TARGET...' : 'ADD TARGET TO SWARM'} 
                </button> 

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {targets.length > 0 ? targets.map((t: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-zinc-950/50 border border-white/5 p-3 rounded-lg">
                      <span className="text-xs text-zinc-300 font-medium truncate w-2/3">{t.target}</span>
                      <span className={`text-[9px] px-2 py-1 rounded-full border tracking-widest font-bold ${t.status === 'ACTIVE' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                        {t.type}
                      </span>
                    </div>
                  )) : (
                    <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest py-4">No active targets</p>
                  )}
                </div>
              </div> 
            </motion.div>

          </div>
        </div>
      </div>
    </Paywall>
  );
}
