"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Activity, DollarSign, BarChart2, Globe, ShoppingCart, Shield, Power, ListTodo, Lightbulb, Plus, Code, Cpu } from 'lucide-react';

const INITIAL_AGENTS = [
  { id: 1, title: "FINANCIËN & BETALINGEN", icon: "DollarSign", status: "MONITOREN", tasks: ['Mollie API synchroniseren', 'Winstmarge berekenen'], color: "text-green-400", borderColor: "border-green-500/30", isStandby: false },
  { id: 2, title: "SEO & MARKETING", icon: "BarChart2", status: "STANDBY", tasks: ['Wachten op commando van Orion'], color: "text-purple-400", borderColor: "border-purple-500/30", isStandby: true },
  { id: 3, title: "SCRAPER & LEADS", icon: "Globe", status: "AAN HET ZOEKEN", tasks: ['Externe websites scannen', 'Concurrentie prijzen uitlezen'], color: "text-blue-400", borderColor: "border-blue-500/30", isStandby: false },
  { id: 4, title: "E-COMMERCE & MEDIA", icon: "ShoppingCart", status: "GENEREREN", tasks: ['Advertentie video maken', 'Shopify voorraad updaten'], color: "text-pink-400", borderColor: "border-pink-500/30", isStandby: false }
];

export default function WarRoom() {
  const [isListening, setIsListening] = useState(false);
  const [orionAdvice, setOrionAdvice] = useState('"Henk, alle systemen zijn online. Ik wacht op je commando."');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // TEXT TO SPEECH FUNCTION
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL'; 
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicClick = async () => {
    if (isListening) return; 
    
    setIsListening(true);
    setOrionAdvice("...");
    setIsProcessing(true);

    setTimeout(async () => {
      setIsListening(false);
      setOrionAdvice("Commando analyseren...");

      try {
        const sampleCommands = [
          "We hebben meer leads nodig, start de scraper",
          "Wat is mijn winstmarge deze maand?",
          "Maak een nieuwe video voor de Shopify store"
        ];
        const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];

        const res = await fetch('https://rebuildyourlife-api.onrender.com/api/v1/warroom/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            password: 'Henk123!', 
            prompt: randomCommand 
          })
        });

        const data = await res.json();
        
        if (data.response) {
          setOrionAdvice(data.response);
          speakText(data.response);
        } else {
          setOrionAdvice("Fout bij het verwerken. Controleer de logs.");
        }
      } catch {
        setOrionAdvice("Systeem Fout: Geen verbinding met Orion Core.");
      } finally {
        setIsProcessing(false);
      }
    }, 2500);
  };

  const addPlugin = () => {
    const newAgent = {
      id: Date.now(),
      title: "CUSTOM AI PLUGIN",
      icon: "Code",
      status: "OPSTARTEN",
      tasks: ['Opzetten van extra hersencapaciteit', 'Database verbinding testen'],
      color: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      isStandby: false
    };
    setAgents([...agents, newAgent]);
  };

  // Pre-calculated animation sequences to satisfy ESLint hooks purity
  const barHeights = [
    [10, 40, 10, 30, 10],
    [10, 60, 20, 50, 10],
    [10, 30, 70, 20, 10],
    [10, 50, 10, 60, 10],
    [10, 80, 40, 50, 10],
    [10, 30, 20, 70, 10],
    [10, 60, 50, 20, 10]
  ];
  const barDurations = [0.4, 0.5, 0.35, 0.45, 0.5, 0.38, 0.42];

  return (
    <div className="min-h-screen bg-[#05050f] text-white overflow-hidden relative font-sans">
      <div className="stars opacity-50"></div>
      
      <nav className="absolute top-0 w-full h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-sm tracking-[0.2em] text-cyan-400">KLUIS: BEVEILIGD</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-mono tracking-widest text-white/50">
          <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-400" /> SYSTEEM STABIEL</span>
          <span>CEO: HENK SEMLER</span>
        </div>
      </nav>

      <main className="pt-24 pb-8 px-8 h-screen flex flex-col relative z-10">
        <div className="grid grid-cols-12 gap-8 flex-1">
          
          <div className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {agents.slice(0, Math.ceil(agents.length / 2)).map(agent => (
              <AgentCard key={agent.id} {...agent} />
            ))}
            
            <div className="mt-auto glass-panel rounded-xl p-5 border border-white/5">
              <h3 className="font-mono text-xs tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4" /> GLOBALE TAKENLIJST
              </h3>
              <div className="space-y-3 font-mono text-xs text-white/60">
                <div className="flex items-center justify-between"><span className="text-white/80">Concurrentie Analyse</span> <span className="text-blue-400">BEZIG</span></div>
                <div className="flex items-center justify-between"><span className="text-white/80">Shopify Producten</span> <span className="text-pink-400">IN DE WACHT</span></div>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex flex-col items-center justify-between relative">
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full glass-panel border border-cyan-500/20 rounded-xl p-4 flex gap-4 items-start"
            >
              <Lightbulb className={`w-5 h-5 text-cyan-400 shrink-0 mt-1 ${isProcessing ? 'animate-bounce' : 'animate-pulse'}`} />
              <div>
                <h4 className="font-mono text-xs tracking-widest text-cyan-400 mb-1">ORION&apos;S ADVIES</h4>
                <p className={`text-sm text-white/80 leading-relaxed ${isProcessing ? 'animate-pulse text-cyan-200' : ''}`}>
                  {orionAdvice}
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="relative w-80 h-80 flex items-center justify-center my-8 perspective-1000"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div className="absolute inset-0 rounded-full border border-cyan-400/20 border-t-cyan-400 glow-blue" animate={{ rotate: 360, scale: isListening ? 1.1 : 1 }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" } }} />
              <motion.div className="absolute inset-4 rounded-full border border-purple-500/20 border-b-purple-500 glow-purple" animate={{ rotate: -360, scale: isListening ? 1.1 : 1 }} transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" } }} />
              
              <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-cyan-900/60 to-purple-900/60 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center shadow-[0_0_80px_rgba(0,240,255,0.3)] overflow-hidden">
                <div className="flex gap-1.5 items-end h-16 mt-4">
                  {barHeights.map((heights, i) => (
                    <motion.div 
                      key={i}
                      className="w-2 bg-cyan-300 rounded-t-full shadow-[0_0_10px_#67e8f9]"
                      animate={{ height: isSpeaking ? heights : 10 }}
                      transition={{ duration: barDurations[i], repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] rounded-full"></div>
              </div>
            </motion.div>

            <div className="flex flex-col items-center">
              <motion.button onClick={handleMicClick} className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${isListening ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50'}`} whileTap={{ scale: 0.95 }}>
                <Mic className="w-6 h-6" />
              </motion.button>
              <p className="font-mono text-xs tracking-widest text-cyan-400">{isListening ? 'AAN HET LUISTEREN...' : 'DRUK OM TE PRATEN'}</p>
            </div>
          </div>

          <div className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {agents.slice(Math.ceil(agents.length / 2)).map(agent => (
              <AgentCard key={agent.id} {...agent} />
            ))}

            <button onClick={addPlugin} className="w-full glass-panel border border-dashed border-white/20 hover:border-cyan-400/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-white/50 hover:text-cyan-400 transition-colors group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-400/10">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs tracking-widest">Nieuwe Agent Installeren</span>
            </button>

             <div className="mt-auto glass-panel rounded-xl p-5 border border-white/5">
              <h3 className="font-mono text-xs tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> LIVE ONDERZOEKSFEED
              </h3>
              <div className="space-y-3 font-mono text-[10px] text-white/50">
                <p>SCAN [EXT]: 14 nieuwe dropshipping leveranciers gevonden.</p>
                <p>SCAN [INT]: 3% daling in conversie gedetecteerd op mobiel.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

interface AgentProps {
  title: string;
  icon: string;
  status: string;
  tasks: string[];
  color: string;
  borderColor: string;
  isStandby?: boolean;
}

function AgentCard({ title, icon, status, tasks, color, borderColor, isStandby = false }: AgentProps) {
  const [standby, setStandby] = useState(isStandby);
  
  const icons: Record<string, React.ReactNode> = {
    DollarSign: <DollarSign className="w-5 h-5" />,
    BarChart2: <BarChart2 className="w-5 h-5" />,
    Globe: <Globe className="w-5 h-5" />,
    ShoppingCart: <ShoppingCart className="w-5 h-5" />,
    Code: <Code className="w-5 h-5" />
  };

  return (
    <div className={`glass-panel rounded-xl p-5 border-l-4 ${standby ? 'border-white/10 opacity-50' : borderColor} relative transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border border-white/5 ${standby ? 'bg-white/5 text-white/30' : `bg-white/10 ${color}`}`}>
            {icons[icon] || <Cpu className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest text-white/80">{title}</h3>
            <span className={`text-[10px] tracking-widest ${standby ? 'text-white/30' : color}`}>{standby ? 'STANDBY' : status}</span>
          </div>
        </div>
        <button onClick={() => setStandby(!standby)} className={`p-2 rounded-full transition-colors ${standby ? 'bg-white/5 text-white/30 hover:bg-white/10' : 'bg-red-500/20 text-red-400 hover:bg-red-500/40'}`} title={standby ? "Activeer Agent" : "Zet op Standby"}>
          <Power className="w-4 h-4" />
        </button>
      </div>
      
      {!standby && (
        <div className="space-y-2 mt-4 border-t border-white/5 pt-4">
          <span className="text-[10px] text-white/40 font-mono">HUIDIGE TAKEN:</span>
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
