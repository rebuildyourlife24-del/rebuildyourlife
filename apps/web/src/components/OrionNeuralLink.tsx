'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Mic, Send, Command, Zap } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

export function OrionNeuralLink() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const chatProps: any = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      { id: '1', role: 'system', content: 'ORION CORE ONLINE. NEURAL LINK ESTABLISHED. WAITING FOR DIRECTIVE.' }
    ],
    onFinish: (message: any) => {
      // TEXT TO SPEECH System (alleen voor antwoorden van Orion)
      if ('speechSynthesis' in window) {
        // Strip markdown stars for speech
        const cleanText = message.content.replace(/\*/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'nl-NL';
        utterance.pitch = 0.8;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  } as any);

  const { messages, input, handleInputChange, handleSubmit, setInput } = chatProps;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Spraakherkenning wordt niet ondersteund in deze browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[380px] h-[500px] mb-6 bg-black/60 backdrop-blur-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.15)] rounded-2xl flex flex-col overflow-hidden relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-cyan-500/20 hidden blur-[] pointer-events-none"></div>

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-cyan-500/20 bg-black/40 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-md animate-pulse"></div>
                  <img src="/orion-face.png" alt="Orion Face" className="w-full h-full object-cover relative z-10 scale-110" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                    ORION <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">CORE</span>
                  </h3>
                  <p className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest">Neural Sync Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar">
              {messages.map((msg: any, idx: any) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-xl text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-zinc-800 text-white border border-zinc-700 rounded-tr-none' 
                        : 'bg-cyan-950/30 text-cyan-100 border border-cyan-500/30 rounded-tl-none shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]'
                    }`}
                  >
                    {msg.role !== 'user' && (
                      <div className="flex items-center gap-2 mb-1 opacity-60">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] uppercase tracking-widest text-cyan-400">Orion</span>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-cyan-500/20 bg-black/40 relative z-10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <button 
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isListening ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse' : 'bg-zinc-900 text-cyan-400 border-zinc-800 hover:border-cyan-500/50'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Directief invoeren..."
                    className="w-full bg-zinc-900/80 text-white font-mono text-sm px-4 py-3 rounded-xl border border-zinc-800 focus:border-cyan-500/50 outline-none pr-10"
                  />
                  <Command className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                </div>
                <button 
                  type="submit"
                  disabled={!input?.trim()}
                  className="p-3 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-900 hover:bg-cyan-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
          isOpen ? 'bg-cyan-600 shadow-[0_0_30px_rgba(34,211,238,0.6)]' : 'bg-black border border-cyan-500/50 hover:bg-cyan-950 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
        }`}
      >
        {/* Core Glow */}
        {!isOpen && <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>}
        
        {/* Orbital Rings */}
        {!isOpen && (
          <>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-cyan-500/30 rounded-full border-dashed"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-cyan-500/10 rounded-full"
            ></motion.div>
          </>
        )}

        <Brain className={`w-8 h-8 relative z-10 transition-colors ${isOpen ? 'text-black' : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'}`} />
        
        {/* Unread indicator / Status */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-gold rounded-full border-2 border-black"></div>
        )}
      </motion.button>
    </div>
  );
}
