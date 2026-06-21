'use client';

import { motion } from 'framer-motion';
import { FileText, Printer, UploadCloud, FileSearch, CheckCircle2, AlertCircle, Building2, TrendingUp, Settings } from 'lucide-react';

export default function AdministrationFlipOver() {
  return (
    // We override the dark theme completely with a massive white paper container
    <motion.div 
      initial={{ y: 100, opacity: 0, rotateX: 20 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="absolute inset-0 z-50 bg-[#F4F4F5] overflow-y-auto text-zinc-900"
      style={{ perspective: '1000px' }}
    >
      {/* Top Banner - Corporate Style */}
      <div className="bg-white border-b border-zinc-200 px-8 py-6 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Administration Hub</h1>
          <p className="text-sm text-zinc-500 font-medium">RebuildYourLife BV &mdash; Secured Environment</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-md font-bold text-sm transition-colors border border-zinc-300">
            <Printer className="w-4 h-4" /> Print Dossier
          </button>
          <button className="flex items-center gap-2 bg-black text-white hover:bg-zinc-800 px-4 py-2 rounded-md font-bold text-sm transition-colors shadow-md">
            <Settings className="w-4 h-4" /> System Settings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
        
        {/* Left Column: Paperwork & Scanner */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
            <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <UploadCloud className="w-5 h-5 text-zinc-400" /> Scan, Print & Drop
            </h2>
            
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-200 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-zinc-900 font-bold mb-1">Drop fysieke administratie hier</h3>
              <p className="text-sm text-zinc-500 max-w-sm">Sleep PDF's, facturen, bonnetjes of contracten in dit vak. The Godbrain scant, indexeert en slaat ze automatisch beveiligd op.</p>
            </div>
          </div>

          {/* Autonomous Economy Logs */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
            <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <FileSearch className="w-5 h-5 text-zinc-400" /> Autonomous Economy Logs (Bovenzijde)
            </h2>
            <p className="text-sm text-zinc-500 mb-4">Real-time transparantielogboek van alle autonome acties, commissies en berekeningen uitgevoerd door The Swarm.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-y border-zinc-200">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Agent</th>
                    <th className="px-4 py-3">Actie / Kans</th>
                    <th className="px-4 py-3">Uitvoering</th>
                    <th className="px-4 py-3 text-right">Resultaat / Commissie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">14:22:05</td>
                    <td className="px-4 py-3 font-bold">WebBuilder AI</td>
                    <td className="px-4 py-3">Website Landingpage (Klant #492)</td>
                    <td className="px-4 py-3"><span className="bg-black text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">AI Autonoom</span></td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">+ € 499,00</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">13:45:12</td>
                    <td className="px-4 py-3 font-bold">Debt Negotiator</td>
                    <td className="px-4 py-3">Schikking KPN Dossier (#88)</td>
                    <td className="px-4 py-3"><span className="bg-zinc-200 text-zinc-700 border border-zinc-300 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Klant-Broker</span></td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">Skim: 10% (€ 45,00)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">11:10:00</td>
                    <td className="px-4 py-3 font-bold">Lead Scraper</td>
                    <td className="px-4 py-3">150 E-mail Leads Verzameld</td>
                    <td className="px-4 py-3"><span className="bg-black text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">AI Autonoom</span></td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-400">€ 0,00 (Kosteloos)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: SEO/CEO Reports & KYC */}
        <div className="space-y-8">
          
          <div className="bg-zinc-900 text-white rounded-lg p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
            <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-zinc-400" /> KYC / Onboarding Data
            </h2>
            <p className="text-xs text-zinc-400 mb-6 border-b border-zinc-800 pb-4">Deze data voedt het volledige Godbrain systeem en alle fysieke rapporten.</p>
            
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Volledige Naam</div>
                <div className="font-bold">Henk Semler</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Bedrijfsnaam</div>
                <div className="font-bold">RebuildYourLife BV</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">KVK Nummer</div>
                <div className="font-mono text-sm text-zinc-300">89210334</div>
              </div>
              <button className="w-full mt-4 bg-white text-black font-bold text-sm py-2 rounded hover:bg-zinc-200 transition-colors">
                Bewerk Onboarding Data
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
            <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <TrendingUp className="w-5 h-5 text-zinc-400" /> SEO / CEO Rapporten
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">CEO Maandrapport (Mei)</div>
                    <div className="text-xs text-zinc-500">Gegenereerd: Gisteren</div>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">Download</button>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">SEO Keyword Analyse</div>
                    <div className="text-xs text-zinc-500">Live API Data</div>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">Bekijk</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
