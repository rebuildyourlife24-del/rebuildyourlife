"use client";

import { useState, useEffect } from 'react';

interface AgentCardProps {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  isStandby: boolean;
  isOpen: boolean;
  onToggle: () => void;
  hoveredAgent: number | null;
  setHoveredAgent: (id: number | null) => void;
}

// Mock status cycles for realistic AI working representation
const STATUS_CYCLES: Record<string, string[]> = {
  "FINANCIËN & BETALINGEN": ["Facturen scannen...", "Cashflow up-to-date", "Aan het monitoren", "Nieuwe betaling verwerkt"],
  "SEO & MARKETING": ["Zoektermen analyseren...", "14 taken actief", "Concurrentie scannen", "Nieuwe kans gevonden!"],
  "SCRAPER & LEADS": ["Websites crawlen...", "Leads filteren...", "20 prospects gevonden", "Database synchroniseren"],
  "E-COMMERCE & MEDIA": ["Voorraad checken...", "Afbeeldingen genereren...", "A/B test draait", "Conversie +2.4%"],
  "CUSTOM AI PLUGIN": ["Plugin standby", "Klaar voor actie", "Systeem diagnostiek ok"]
};

export default function AgentCard({ id, title, icon, color, isStandby, isOpen, onToggle, hoveredAgent, setHoveredAgent }: AgentCardProps) {
  const statuses = STATUS_CYCLES[title] || ["Standby"];
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  // Autonomous status cycler
  useEffect(() => {
    if (isStandby) return; // Don't cycle if standby
    
    // Random interval between 4s and 12s
    const intervalTime = Math.random() * 8000 + 4000;
    
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % statuses.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isStandby, statuses.length]);

  return (
    <button 
      onClick={onToggle}
      onMouseEnter={() => setHoveredAgent(id)}
      onMouseLeave={() => setHoveredAgent(null)}
      className={`relative w-full flex flex-col p-3 rounded-lg transition-all duration-300 border ${
        isOpen 
          ? `bg-white/10 ${color.replace('text-', 'border-')} shadow-[0_0_15px_rgba(255,255,255,0.05)]` 
          : 'bg-black/40 border-white/5 hover:border-white/20'
      } ${hoveredAgent === id ? 'scale-[1.02] z-10 bg-white/5' : 'scale-100'}`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className={`p-1.5 rounded-md bg-white/5 ${color} ${!isStandby && 'animate-pulse'}`}>
          {icon}
        </div>
        <div className="flex-1 text-left flex flex-col">
          <span className="font-mono text-[10px] tracking-widest text-white/80">{title}</span>
          <span className={`font-mono text-[9px] mt-1 ${isStandby ? 'text-white/30' : color.replace('text-', 'text-opacity-80 text-')}`}>
            ● {statuses[currentStatusIndex]}
          </span>
        </div>
        <div className={`w-2 h-2 rounded-full ${isOpen ? color.replace('text-', 'bg-') : 'bg-white/20'}`}></div>
      </div>
      
      {/* Background sweep animation for non-standby agents */}
      {!isStandby && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.02),transparent)] -rotate-45 animate-sweep"></div>
        </div>
      )}
    </button>
  );
}
