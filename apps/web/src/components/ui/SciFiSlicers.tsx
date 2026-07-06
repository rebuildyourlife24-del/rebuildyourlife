"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Globe, Tag, ChevronDown, Check } from 'lucide-react';

interface SlicerOption {
  label: string;
  value: string;
}

interface SlicerProps {
  id: string;
  icon: any;
  title: string;
  options: SlicerOption[];
  onSelect: (value: string[]) => void;
}

export function SciFiSlicers() {
  const handleSlicerChange = (id: string, values: string[]) => {
    console.log(`Slicer [${id}] changed:`, values);
    // In a real app, this would trigger a data refetch or local filtering of the chart data.
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
      <SlicerDropdown 
        id="date" 
        icon={Calendar} 
        title="Periode" 
        options={[
          { label: 'Vandaag', value: 'today' },
          { label: 'Deze week', value: 'this_week' },
          { label: 'Deze maand', value: 'this_month' },
          { label: 'Dit jaar', value: 'this_year' },
          { label: 'All Time', value: 'all_time' }
        ]} 
        onSelect={(vals) => handleSlicerChange('date', vals)} 
      />
      
      <SlicerDropdown 
        id="region" 
        icon={Globe} 
        title="Regio" 
        options={[
          { label: 'Noord-Amerika', value: 'na' },
          { label: 'Europa', value: 'eu' },
          { label: 'Azië', value: 'asia' },
          { label: 'Zuid-Amerika', value: 'sa' }
        ]} 
        onSelect={(vals) => handleSlicerChange('region', vals)} 
      />
      
      <SlicerDropdown 
        id="category" 
        icon={Tag} 
        title="Categorie" 
        options={[
          { label: 'Electronica', value: 'elec' },
          { label: 'Kleding', value: 'apparel' },
          { label: 'Home & Garden', value: 'home' },
          { label: 'Health', value: 'health' }
        ]} 
        onSelect={(vals) => handleSlicerChange('category', vals)} 
      />
    </div>
  );
}

function SlicerDropdown({ id, icon: Icon, title, options, onSelect }: SlicerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (val: string) => {
    const newSel = selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val];
    setSelected(newSel);
    onSelect(newSel);
  };

  return (
    <div className="relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-48 px-4 py-2 bg-black/60 border border-zinc-800 hover:border-cyan-500/50 rounded-md transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-sm font-mono text-zinc-300 group-hover:text-white">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-zinc-950 border border-zinc-800 rounded-md shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          <div className="p-2 space-y-1">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleSelection(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-mono transition-colors ${isSelected ? 'bg-cyan-900/30 text-cyan-400' : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="px-2 pb-2">
              <button 
                onClick={() => { setSelected([]); onSelect([]); setIsOpen(false); }}
                className="w-full text-center text-xs text-zinc-500 hover:text-red-400 font-mono py-1 border-t border-zinc-800/50 mt-1"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
