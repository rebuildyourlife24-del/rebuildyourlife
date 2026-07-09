"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Zap, ChevronDown, MessageSquare } from "lucide-react";

export function OrionVisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [logs, setLogs] = useState<{ id: number; sender: "ceo" | "orion"; text: string; time: string }[]>([
    { id: 1, sender: "orion", text: "GodBrain OS Visor initialized. Waiting for CEO input.", time: new Date().toLocaleTimeString() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Track touch/scroll for 2-finger swipe down
  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isOpen]);

  // Global Hotkey & Trackpad Swipe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.code === "Space") || e.key === "`") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    // 2-finger swipe down on trackpad registers as 'wheel' event with deltaY < 0
    const handleWheel = (e: WheelEvent) => {
      // deltaY < 0 means scrolling up / swiping down
      if (e.deltaY < -20) {
        scrollAccumulator.current += Math.abs(e.deltaY);
        // If they swiped down significantly (threshold)
        if (scrollAccumulator.current > 100 && !isOpen) {
          setIsOpen(true);
          scrollAccumulator.current = 0;
        }
      } else if (e.deltaY > 20) {
        // Swiping up (deltaY > 0) closes the visor
        scrollAccumulator.current += e.deltaY;
        if (scrollAccumulator.current > 100 && isOpen) {
          setIsOpen(false);
          scrollAccumulator.current = 0;
        }
      } else {
        // Reset if movement stops
        setTimeout(() => { scrollAccumulator.current = 0; }, 200);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newLog = {
      id: Date.now(),
      sender: "ceo" as const,
      text: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setLogs((prev) => [...prev, newLog]);
    setInputMessage("");

    // Simulate Orion/Groq Response
    setTimeout(() => {
      setLogs((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "orion",
        text: `Command received: "${newLog.text}". Accessing GodBrain Quantum Matrix.`,
        time: new Date().toLocaleTimeString()
      }]);
    }, 1000);
  };

  return (
    <>
      {/* The Handle / Pull-down Tab */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-32 h-6 bg-black/80 backdrop-blur-md border-b border-l border-r border-gold/30 rounded-b-xl flex items-center justify-center cursor-pointer hover:bg-black transition-colors shadow-[0_0_15px_rgba(212,168,83,0.2)]"
      >
        <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* The Visor Dropdown with Sphere/Space 3D Effect */}
      <div className="fixed top-0 left-0 w-full z-[90] pointer-events-none" style={{ perspective: "1500px" }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ rotateX: -90, opacity: 0, y: -50 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ rotateX: -90, opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{ transformOrigin: "top center" }}
              className="w-full h-[70vh] pointer-events-auto bg-black/80 backdrop-blur-3xl border-b border-gold/50 shadow-[0_30px_100px_rgba(212,168,83,0.15)] flex flex-col rounded-b-[40px] overflow-hidden"
            >
              {/* Space Sphere curvature styling overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-black/80 to-black pointer-events-none" />
              
              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-gold/10 bg-gradient-to-r from-transparent via-gold/5 to-transparent">
                <div className="flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-gold drop-shadow-[0_0_8px_rgba(212,168,83,0.8)]" />
                  <h2 className="text-white font-bold tracking-[0.3em] uppercase text-sm drop-shadow-md">Orion Comms Link</h2>
                  <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400 font-mono shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    <Zap className="w-3 h-3 animate-pulse" />
                    GROQ LPU ONLINE
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Logs Area */}
              <div className="relative flex-1 overflow-y-auto p-8 space-y-6 font-mono text-sm scrollbar-thin scrollbar-thumb-gold/20">
                {logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: log.sender === "ceo" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className={`flex flex-col ${log.sender === "ceo" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-slate-500 mb-1">{log.time}</span>
                    <div className={`max-w-[70%] p-4 rounded-2xl border backdrop-blur-md ${
                      log.sender === "ceo" 
                        ? "bg-gold/10 border-gold/40 text-gold shadow-[0_0_20px_rgba(212,168,83,0.1)] rounded-tr-none" 
                        : "bg-slate-900/80 border-slate-700 text-slate-300 shadow-xl rounded-tl-none"
                    }`}>
                      <span className="font-bold uppercase text-[10px] block mb-2 opacity-50 tracking-wider">
                        {log.sender === "ceo" ? "Mitchel (CEO)" : "Orion"}
                      </span>
                      {log.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="relative p-6 border-t border-gold/10 bg-black/50">
                <div className="max-w-5xl mx-auto relative flex items-center group">
                  <MessageSquare className="absolute left-6 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Communicate with the GodBrain... (2-finger swipe UP to close)"
                    className="w-full bg-black/60 border border-gold/20 text-white pl-14 pr-24 py-4 rounded-2xl focus:outline-none focus:border-gold/60 focus:bg-black/80 transition-all font-mono text-base shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                    autoFocus
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold hover:bg-white text-black px-6 py-2 rounded-xl transition-all text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(212,168,83,0.4)]"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
