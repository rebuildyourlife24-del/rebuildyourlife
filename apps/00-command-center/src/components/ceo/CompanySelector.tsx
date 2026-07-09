"use client";

import { ChevronDown, Building2 } from 'lucide-react';
import { useState } from 'react';

const COMPANIES = [
  "RebuildYourLife OS",
  "Nieuwe Dropship Store (WIP)",
  "Marketing Agency BV"
];

export default function CompanySelector({ selected, onChange }: { selected: string, onChange: (c: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all"
      >
        <Building2 className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-white">{selected}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2">
            <div className="text-xs font-mono text-slate-500 mb-2 px-2 pt-1">JOUW IMPERIUM</div>
            {COMPANIES.map(company => (
              <button
                key={company}
                onClick={() => { onChange(company); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selected === company ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {company}
              </button>
            ))}
            
            <div className="border-t border-white/5 mt-2 pt-2">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-amber-400/10 transition-colors flex items-center gap-2 font-mono">
                + ADD NEW VENTURE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
