'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJarvis } from './JarvisProvider';
import { Mic, Send, X, Terminal } from 'lucide-react';

export function JarvisOmniWidget() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useJarvis();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        handleInputChange({
          target: { value: transcript },
        } as React.ChangeEvent<HTMLInputElement>);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleInputChange]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-6 w-96 max-h-[600px] bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden"
          >
            <div className="h-12 border-b border-blue-500/20 bg-cyan-950/20 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-blue-400 tracking-widest uppercase">J.A.R.V.I.S. Core</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-blue-500 hover:text-cyan-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm font-mono ${msg.role === 'user' ? 'bg-blue-500/20 border border-blue-500/30 text-cyan-50' : 'bg-black/40 border border-blue-900/50 text-blue-400'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-black/40 border border-blue-900/50 text-blue-400 rounded-lg px-3 py-2 text-sm font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-blue-500/20 bg-black/40">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full border transition-colors ${isListening ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'}`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask J.A.R.V.I.S..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-cyan-50 placeholder:text-blue-800"
                />
                <button type="submit" disabled={!input.trim()} className="p-2 text-blue-400 hover:text-cyan-300 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer outline-none group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 group-hover:border-blue-400 animate-[spin_4s_linear_infinite]"></div>
        <div className="absolute inset-1 rounded-full border border-blue-400/30 animate-[spin_3s_linear_infinite_reverse]"></div>
        <div className="absolute inset-2 rounded-full bg-blue-900/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <motion.div 
            animate={{ scale: isLoading ? [1, 1.2, 1] : 1, opacity: isLoading ? [0.5, 1, 0.5] : 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-8 h-8 bg-blue-400 rounded-full blur-[4px] opacity-80"
          ></motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] mix-blend-overlay"></div>
        </div>
      </motion.button>
    </div>
  );
}

