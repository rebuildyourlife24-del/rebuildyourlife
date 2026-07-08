"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Zap, ChevronDown, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export function OrionVisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const pathname = usePathname();
  const [logs, setLogs] = useState<{ id: number; sender: "ceo" | "hermes"; text: string; time: string }[]>([
    { id: 1, sender: "hermes", text: "GodBrain OS Visor initialized. Waiting for CEO input.", time: new Date().toLocaleTimeString() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (pathname === '/') return null;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isOpen]);

  // Global Hotkey (Ctrl + Space) or (Backquote `)
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = () => {
    if (!inputMessage?.trim()) return;

    const newLog = {
      id: Date.now(),
      sender: "ceo" as const,
      text: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setLogs((prev) => [...prev, newLog]);
    setInputMessage("");

    // Simulate Hermes/Groq Response
    setTimeout(() => {
      setLogs((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "hermes",
        text: `Command received: "${newLog.text}". I am analyzing the request through the GodBrain matrix.`,
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

      {/* The Visor Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-full h-[60vh] z-[90] bg-black/90 backdrop-blur-xl border-b border-gold/40 shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/10 bg-gradient-to-r from-black via-slate-900 to-black">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-gold" />
                <h2 className="text-white font-bold tracking-widest uppercase text-sm">Hermes Comms Link</h2>
                <div className="flex items-center gap-2 ml-4 px-2 py-1 bg-gold/10 border border-gold/20 rounded text-xs text-gold font-mono">
                  <Zap className="w-3 h-3 animate-pulse" />
                  GROQ ENGINE ONLINE
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logs Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-gold/20">
              {logs.map((log) => (
                <div key={log.id} className={`flex flex-col ${log.sender === "ceo" ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-slate-500 mb-1">{log.time}</span>
                  <div className={`max-w-[80%] p-3 rounded-xl border ${
                    log.sender === "ceo" 
                      ? "bg-gold/10 border-gold/30 text-gold" 
                      : "bg-slate-900 border-slate-700 text-slate-300"
                  }`}>
                    <span className="font-bold uppercase text-[10px] block mb-1 opacity-50">
                      {log.sender === "ceo" ? "Mitchel (CEO)" : "Hermes"}
                    </span>
                    {log.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gold/10 bg-black">
              <div className="max-w-4xl mx-auto relative flex items-center">
                <MessageSquare className="absolute left-4 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Communicate with the GodBrain... (Press Enter to send)"
                  className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-gold/50 transition-colors font-mono"
                  autoFocus
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold/10 hover:bg-gold hover:text-black text-gold px-4 py-1.5 rounded-md transition-colors text-sm font-bold uppercase tracking-wider"
                >
                  Send
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-slate-600 font-mono">Press <kbd className="bg-slate-800 px-1 rounded">`</kbd> or <kbd className="bg-slate-800 px-1 rounded">Ctrl+Space</kbd> to toggle visor</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

