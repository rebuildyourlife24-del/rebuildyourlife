"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';

export type OrionState = 'IDLE' | 'THINKING' | 'EXECUTING' | 'COMPLETED' | 'ALERT';

interface CommandBarProps {
  orionState: OrionState;
  setOrionState: (state: OrionState) => void;
  onCommandComplete: (command: string, response?: string) => void;
}

interface ChatMessage {
  role: 'user' | 'orion';
  content: string;
  agent?: string;
  timestamp: Date;
}

export default function CommandBar({ orionState, setOrionState, onCommandComplete }: CommandBarProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [feedbackText, setFeedbackText] = useState('SYSTEEM ONLINE. WACHTEN OP COMMANDO...');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExecute = async () => {
    if (!input.trim() || orionState !== 'IDLE') return;

    const userCommand = input.trim();
    setInput('');
    setOrionState('THINKING');
    setFeedbackText('ORION VERWERKT...');

    // Voeg user bericht toe aan history
    setChatHistory(prev => [...prev, {
      role: 'user',
      content: userCommand,
      timestamp: new Date()
    }]);

    try {
      // Na 1.5s → EXECUTING
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOrionState('EXECUTING');
      setFeedbackText('DATA VERZAMELD...');

      // Echte AI call naar Orion
      const response = await fetch('/api/orion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userCommand }),
      });

      const data = await response.json();
      const orionResponse = data.response || 'Commando verwerkt.';
      const assignedAgent = data.agent || 'ORION_CORE';

      setFeedbackText('INZICHTEN GEGENEREERD');

      await new Promise(resolve => setTimeout(resolve, 800));

      // Voeg Orion antwoord toe aan history
      setChatHistory(prev => [...prev, {
        role: 'orion',
        content: orionResponse,
        agent: assignedAgent,
        timestamp: new Date()
      }]);

      setOrionState('COMPLETED');
      setFeedbackText('MISSIE VOLTOOID');
      onCommandComplete(userCommand, orionResponse);

      // Terug naar IDLE
      await new Promise(resolve => setTimeout(resolve, 2500));
      setOrionState('IDLE');
      setFeedbackText('SYSTEEM ONLINE. WACHTEN OP COMMANDO...');

    } catch (error) {
      console.error('Orion command error:', error);
      setChatHistory(prev => [...prev, {
        role: 'orion',
        content: 'Er is een verbindingsfout opgetreden. Controleer de API verbinding.',
        agent: 'ORION_CORE',
        timestamp: new Date()
      }]);
      setOrionState('IDLE');
      setFeedbackText('VERBINDINGSFOUT — PROBEER OPNIEUW');
    }
  };

  return (
    <>
      {/* Achtergrond dimming bij focus */}
      <AnimatePresence>
        {isFocused && orionState === 'IDLE' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Chat History Panel */}
      <AnimatePresence>
        {showHistory && chatHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full mb-4 left-0 right-0 max-h-72 overflow-y-auto bg-black/90 border border-cyan-500/20 rounded-xl p-4 space-y-3 backdrop-blur-md z-40"
          >
            {chatHistory.slice(-8).map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'orion' && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-mono text-cyan-400">AI</span>
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs font-mono ${
                  msg.role === 'user'
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/20'
                }`}>
                  {msg.role === 'orion' && msg.agent && (
                    <div className="text-[9px] text-cyan-500/60 tracking-widest mb-1">{msg.agent}</div>
                  )}
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative z-40 transition-all duration-500 ${isFocused ? 'scale-[1.02] -translate-y-2' : ''}`}>

        {/* Progressieve Feedback Balk */}
        <div className={`absolute -top-12 left-0 right-0 flex justify-center transition-all duration-500 ${orionState !== 'IDLE' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <div className="glass-panel px-6 py-2 rounded-full flex flex-col items-center gap-1 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <span className="font-mono text-[10px] tracking-widest text-cyan-300">
              {feedbackText}
            </span>
            {orionState !== 'COMPLETED' && orionState !== 'IDLE' && (
              <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 bottom-0 bg-cyan-400"
                  initial={{ width: "0%" }}
                  animate={{ width: orionState === 'THINKING' ? "30%" : orionState === 'EXECUTING' ? "85%" : "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Input Balk */}
        <div className={`glass-panel p-4 rounded-xl border ${
          isFocused
            ? 'border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.15)] bg-black/80'
            : 'border-white/10 bg-black/40'
        } flex items-center gap-4 transition-all duration-300`}>

          {/* Microfoon knop */}
          <button
            className={`p-3 rounded-lg transition-colors ${
              orionState !== 'IDLE'
                ? 'text-cyan-400 glow-blue animate-pulse'
                : 'text-white/40 hover:text-white bg-white/5'
            }`}
            title="Spraakcommando (binnenkort)"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { setIsFocused(true); setShowHistory(true); }}
            onBlur={() => { setIsFocused(false); setTimeout(() => setShowHistory(false), 200); }}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            disabled={orionState !== 'IDLE'}
            placeholder={orionState === 'IDLE' ? "Geef een commando aan Orion..." : "Bezig met verwerken..."}
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-white/30"
          />

          {/* Chat history toggle */}
          {chatHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg text-white/30 hover:text-cyan-400 transition-colors"
              title="Gesprek history"
            >
              <span className="font-mono text-[9px] tracking-wider">{chatHistory.length}</span>
            </button>
          )}

          {/* Execute knop */}
          {input && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleExecute}
              disabled={orionState !== 'IDLE'}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg font-mono text-xs hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              EXECUTE
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
}
