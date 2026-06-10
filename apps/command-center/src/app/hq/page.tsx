"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Activity, DollarSign, BarChart2, Globe, ShoppingCart, Cpu, Shield, Power, ListTodo, Lightbulb } from 'lucide-react';

export default function WarRoom() {
  const [isListening, setIsListening] = useState(false);
  const [orionAdvice, setOrionAdvice] = useState('"Henk, all systems are currently nominal. I am awaiting your command."');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMicClick = async () => {
    if (isListening) return; // Prevent double clicks
    
    setIsListening(true);
    setOrionAdvice("...");
    setIsProcessing(true);

    // Simulate the user talking into the mic for 2 seconds
    setTimeout(async () => {
      setIsListening(false);
      setOrionAdvice("Analyzing voice command...");

      try {
        // Send a simulated prompt to Orion's Brain
        const sampleCommands = [
          "We need more leads, activate the scraper",
          "What is my profit margin from Mollie?",
          "Generate a new white label video for Shopify"
        ];
        const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];

        const res = await fetch('/api/orion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: randomCommand })
        });

        const data = await res.json();
        
        if (data.response) {
          setOrionAdvice(data.response);
        } else {
          setOrionAdvice("Error processing command. Check API logs.");
        }
      } catch (error) {
        setOrionAdvice("System Error: Connection to Core failed.");
      } finally {
        setIsProcessing(false);
      }
    }, 2500);
  };
      <div className="stars opacity-50"></div>
      
      {/* Top Nav */}
      <nav className="absolute top-0 w-full h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-sm tracking-[0.2em] text-cyan-400">VAULT: SECURE</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-mono tracking-widest text-white/50">
          <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-400" /> SYSTEM NOMINAL</span>
          <span>CEO: HENK SEMLER</span>
        </div>
      </nav>

      <main className="pt-24 pb-8 px-8 h-screen flex flex-col relative z-10">
        <div className="grid grid-cols-12 gap-8 flex-1">
          
          {/* Left Column: Agents & Tasks */}
          <div className="col-span-3 flex flex-col gap-6">
            <AgentCard 
              title="FINANCE & PAYMENTS" 
              icon={<DollarSign className="w-5 h-5" />} 
              status="MONITORING"
              tasks={['Reconciling Mollie API', 'Calculating profit margin']}
              color="text-green-400" borderColor="border-green-500/30"
            />
            <AgentCard 
              title="SEO & MARKETING" 
              icon={<BarChart2 className="w-5 h-5" />} 
              status="STANDBY"
              tasks={['Awaiting Orion directive']}
              color="text-purple-400" borderColor="border-purple-500/30"
              isStandby={true}
            />
            
            {/* Task List Panel */}
            <div className="mt-auto glass-panel rounded-xl p-5 border border-white/5">
              <h3 className="font-mono text-xs tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4" /> GLOBAL TASK QUEUE
              </h3>
              <div className="space-y-3 font-mono text-xs text-white/60">
                <div className="flex items-center justify-between"><span className="text-white/80">Competitor Research</span> <span className="text-blue-400">IN PROGRESS</span></div>
                <div className="flex items-center justify-between"><span className="text-white/80">Generate Shopify Assets</span> <span className="text-pink-400">QUEUED</span></div>
              </div>
            </div>
          </div>

          {/* Center Column: ORION & Advice */}
          <div className="col-span-6 flex flex-col items-center justify-between relative">
            
            {/* Orion Advice Panel */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full glass-panel border border-cyan-500/20 rounded-xl p-4 flex gap-4 items-start"
            >
              <Lightbulb className={`w-5 h-5 text-cyan-400 shrink-0 mt-1 ${isProcessing ? 'animate-bounce' : 'animate-pulse'}`} />
              <div>
                <h4 className="font-mono text-xs tracking-widest text-cyan-400 mb-1">ORION'S ADVICE</h4>
                <p className={`text-sm text-white/80 leading-relaxed ${isProcessing ? 'animate-pulse text-cyan-200' : ''}`}>
                  {orionAdvice}
                </p>
              </div>
            </motion.div>

            {/* Orion AI Core */}
            <motion.div 
              className="relative w-80 h-80 flex items-center justify-center my-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div className="absolute inset-0 rounded-full border border-cyan-400/20 border-t-cyan-400 glow-blue" animate={{ rotate: 360, scale: isListening ? 1.1 : 1 }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" } }} />
              <motion.div className="absolute inset-4 rounded-full border border-purple-500/20 border-b-purple-500 glow-purple" animate={{ rotate: -360, scale: isListening ? 1.1 : 1 }} transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" } }} />
              <div className="absolute inset-16 rounded-full bg-gradient-to-b from-cyan-900/40 to-purple-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                <Cpu className="w-16 h-16 text-cyan-300" />
              </div>
            </motion.div>

            {/* Mic */}
            <div className="flex flex-col items-center">
              <motion.button onClick={() => setIsListening(!isListening)} className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${isListening ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50'}`} whileTap={{ scale: 0.95 }}>
                <Mic className="w-6 h-6" />
              </motion.button>
              <p className="font-mono text-xs tracking-widest text-cyan-400">{isListening ? 'LISTENING...' : 'TAP TO SPEAK'}</p>
            </div>
          </div>

          {/* Right Column: Agents & Research */}
          <div className="col-span-3 flex flex-col gap-6">
            <AgentCard 
              title="SCRAPER & LEADS" 
              icon={<Globe className="w-5 h-5" />} 
              status="RESEARCHING"
              tasks={['External site deep-scan', 'Extracting competitor pricing']}
              color="text-blue-400" borderColor="border-blue-500/30"
            />
            <AgentCard 
              title="E-COMMERCE & MEDIA" 
              icon={<ShoppingCart className="w-5 h-5" />} 
              status="GENERATING"
              tasks={['Creating ad creatives', 'Syncing Shopify inventory']}
              color="text-pink-400" borderColor="border-pink-500/30"
            />

             {/* Research Panel */}
             <div className="mt-auto glass-panel rounded-xl p-5 border border-white/5">
              <h3 className="font-mono text-xs tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> LIVE RESEARCH FEED
              </h3>
              <div className="space-y-3 font-mono text-[10px] text-white/50">
                <p>SCAN [EXT]: Found 14 new drop-shipping suppliers.</p>
                <p>SCAN [INT]: Detected 3% drop in RebuildYourLife conversion on mobile.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function AgentCard({ title, icon, status, tasks, color, borderColor, isStandby = false }: any) {
  const [standby, setStandby] = useState(isStandby);

  return (
    <div className={`glass-panel rounded-xl p-5 border-l-4 ${standby ? 'border-white/10 opacity-50' : borderColor} relative transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border border-white/5 ${standby ? 'bg-white/5 text-white/30' : `bg-white/10 ${color}`}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest text-white/80">{title}</h3>
            <span className={`text-[10px] tracking-widest ${standby ? 'text-white/30' : color}`}>{standby ? 'STANDBY' : status}</span>
          </div>
        </div>
        {/* Individual Standby Toggle */}
        <button onClick={() => setStandby(!standby)} className={`p-2 rounded-full transition-colors ${standby ? 'bg-white/5 text-white/30 hover:bg-white/10' : 'bg-red-500/20 text-red-400 hover:bg-red-500/40'}`} title={standby ? "Activate Agent" : "Put on Standby"}>
          <Power className="w-4 h-4" />
        </button>
      </div>
      
      {!standby && (
        <div className="space-y-2 mt-4 border-t border-white/5 pt-4">
          <span className="text-[10px] text-white/40 font-mono">CURRENT TASKS:</span>
          {tasks.map((task: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-white/60 font-mono">
              <div className="w-1 h-1 rounded-full bg-white/20 mt-1.5 shrink-0"></div>
              {task}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
