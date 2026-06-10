"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Lightbulb, DollarSign, BarChart2, Globe, ShoppingCart, Code, Cpu } from 'lucide-react';

import DeepSpaceBackground from '@/components/DeepSpaceBackground';
import SciFiHUD from '@/components/SciFiHUD';
import AIBrain from '@/components/AIBrain';
import AgentWindow from '@/components/AgentWindow';
import SettingsMenu from '@/components/SettingsMenu';

const INITIAL_AGENTS = [
  { id: 1, title: "FINANCIËN & BETALINGEN", icon: "DollarSign", status: "MONITOREN", color: "text-green-400", isStandby: false },
  { id: 2, title: "SEO & MARKETING", icon: "BarChart2", status: "STANDBY", color: "text-purple-400", isStandby: true },
  { id: 3, title: "SCRAPER & LEADS", icon: "Globe", status: "AAN HET ZOEKEN", color: "text-blue-400", isStandby: false },
  { id: 4, title: "E-COMMERCE & MEDIA", icon: "ShoppingCart", status: "GENEREREN", color: "text-pink-400", isStandby: false },
  { id: 99, title: "CUSTOM AI PLUGIN", icon: "Code", status: "STANDBY", color: "text-yellow-400", isStandby: true },
];

export default function WarRoom() {
  const [isListening, setIsListening] = useState(false);
  const [orionAdvice, setOrionAdvice] = useState('"Henk, alle systemen zijn online. De hersenstam is actief."');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agents] = useState(INITIAL_AGENTS);

  const getIcon = (name: string) => {
    switch (name) {
      case "DollarSign": return <DollarSign className="w-5 h-5" />;
      case "BarChart2": return <BarChart2 className="w-5 h-5" />;
      case "Globe": return <Globe className="w-5 h-5" />;
      case "ShoppingCart": return <ShoppingCart className="w-5 h-5" />;
      case "Code": return <Code className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };
  
  // Track which agent windows are currently open
  const [openWindows, setOpenWindows] = useState<number[]>([1, 3]);

  const toggleWindow = (id: number) => {
    if (openWindows.includes(id)) {
      setOpenWindows(openWindows.filter(w => w !== id));
    } else {
      setOpenWindows([...openWindows, id]);
    }
  };

  const handleMicClick = async () => {
    if (isListening) return; 
    
    setIsListening(true);
    setOrionAdvice("...");
    setIsProcessing(true);

    setTimeout(async () => {
      setIsListening(false);
      setOrionAdvice("Commando analyseren via Orion Core...");

      try {
        const res = await fetch('/api/orion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: "Geef een korte status update over de systemen." })
        });

        const data = await res.json();
        
        if (data.response) {
          setOrionAdvice(data.response);
        } else {
          setOrionAdvice("Fout bij het verwerken. Controleer de logs.");
        }
      } catch {
        setOrionAdvice("Systeem Fout: Geen verbinding met Orion Core.");
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#02000a] text-white overflow-hidden relative font-sans">
      <DeepSpaceBackground />
      <SciFiHUD />
      <SettingsMenu />

      <main className="pt-24 pb-20 px-4 lg:px-8 h-screen flex flex-col relative z-10 pointer-events-none">
        {/* We use pointer-events-none on the container so the canvas behind can be seen, but re-enable it for interactive elements */}
        
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
          
          {/* Left Side: Agent Windows */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 pointer-events-auto max-h-full overflow-y-auto custom-scrollbar pr-2 relative z-20">
            {openWindows.map(id => {
              const agent = agents.find(a => a.id === id);
              if (!agent) return null;
              return (
                <AgentWindow 
                  key={id}
                  id={agent.id}
                  title={agent.title}
                  icon={getIcon(agent.icon)}
                  color={agent.color}
                  isOpen={true}
                  onClose={() => toggleWindow(id)}
                />
              );
            })}
          </div>

          {/* Center: The AI Brain */}
          <div className="w-full lg:w-2/4 flex flex-col items-center justify-center pointer-events-auto relative z-10">
            <AIBrain activeAgents={agents} />
          </div>

          {/* Right Side: Available Agents Panel */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 pointer-events-auto relative z-20">
            <div className="glass-panel p-4 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
              <h3 className="font-mono text-xs tracking-widest text-cyan-400 mb-4 border-b border-white/10 pb-2">HUIDIGE AGENTEN</h3>
              <div className="space-y-2">
                {agents.map(agent => (
                  <button 
                    key={agent.id}
                    onClick={() => toggleWindow(agent.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors border ${openWindows.includes(agent.id) ? `bg-white/10 ${agent.color.replace('text-', 'border-')}` : 'bg-transparent border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md bg-white/5 ${agent.color}`}>
                        {getIcon(agent.icon)}
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-white/80">{agent.title}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${openWindows.includes(agent.id) ? agent.color.replace('text-', 'bg-') : 'bg-white/20'}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Console: Orion Main Input */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl pointer-events-auto z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel border border-cyan-500/30 rounded-2xl p-2 flex items-center gap-4 bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.1)]"
          >
            <button 
              onClick={handleMicClick} 
              className={`p-4 rounded-xl transition-all ${isListening ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <div className="flex-1 flex flex-col">
              <span className="font-mono text-[10px] text-cyan-400 tracking-widest mb-1 flex items-center gap-2">
                <Lightbulb className="w-3 h-3" /> ORION CORE
              </span>
              <input 
                type="text" 
                placeholder={isListening ? "Aan het luisteren..." : "Stuur een algemeen commando aan Orion..."}
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-white/30"
                disabled={isListening}
              />
            </div>
            
            {/* Minimal visual feedback for Orion Advice */}
            <div className={`hidden md:flex absolute -top-12 left-0 right-0 justify-center transition-opacity ${isProcessing ? 'opacity-100' : 'opacity-0'}`}>
              <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono text-cyan-300 border border-cyan-500/30">
                {orionAdvice}
              </div>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
