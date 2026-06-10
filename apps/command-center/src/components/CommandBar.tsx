"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

export type OrionState = 'IDLE' | 'THINKING' | 'EXECUTING' | 'COMPLETED' | 'ALERT';

interface CommandBarProps {
  orionState: OrionState;
  setOrionState: (state: OrionState) => void;
  onCommandComplete: (command: string) => void;
}

export default function CommandBar({ orionState, setOrionState, onCommandComplete }: CommandBarProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [feedbackText, setFeedbackText] = useState('SYSTEM ONLINE. WAITING FOR COMMAND...');

  const handleExecute = () => {
    if (!input.trim() || orionState !== 'IDLE') return;

    setOrionState('THINKING');
    setFeedbackText('ORION PROCESSING');
    const executedCommand = input;
    setInput('');

    // Simulate progressive phased loading
    setTimeout(() => {
      setOrionState('EXECUTING');
      setFeedbackText('DATA COLLECTED');
    }, 2000);

    setTimeout(() => {
      setFeedbackText('INSIGHTS GENERATED');
    }, 4000);

    setTimeout(() => {
      setOrionState('COMPLETED');
      setFeedbackText('MISSION COMPLETE');
      onCommandComplete(executedCommand);
    }, 5500);

    setTimeout(() => {
      setOrionState('IDLE');
      setFeedbackText('SYSTEM ONLINE. WAITING FOR COMMAND...');
    }, 8000);
  };

  return (
    <>
      {/* Background Dimming overlay when focused */}
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

      <div className={`relative z-40 transition-all duration-500 ${isFocused ? 'scale-[1.02] -translate-y-2' : ''}`}>
        
        {/* Progressive Feedback Bar */}
        <div className={`absolute -top-12 left-0 right-0 flex justify-center transition-all duration-500 ${orionState !== 'IDLE' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <div className="glass-panel px-6 py-2 rounded-full flex flex-col items-center gap-1 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <span className="font-mono text-[10px] tracking-widest text-cyan-300">
              {feedbackText}
            </span>
            {orionState !== 'COMPLETED' && (
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

        {/* Input Bar */}
        <div className={`glass-panel p-4 rounded-xl border ${isFocused ? 'border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.15)] bg-black/80' : 'border-white/10 bg-black/40'} flex items-center gap-4 transition-all duration-300`}>
          <button className={`p-3 rounded-lg transition-colors ${orionState !== 'IDLE' ? 'text-cyan-400 glow-blue animate-pulse' : 'text-white/40 hover:text-white bg-white/5'}`}>
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            disabled={orionState !== 'IDLE'}
            placeholder={orionState === 'IDLE' ? "Geef een commando aan Orion..." : "Bezig met verwerken..."}
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-white/30"
          />
          {input && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleExecute}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg font-mono text-xs hover:bg-cyan-500/30 transition-colors"
            >
              EXECUTE
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
}
