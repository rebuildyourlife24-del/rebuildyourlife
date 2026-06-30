'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Wrench, Shield, Loader2 } from 'lucide-react';

interface TrinityMessage {
  id: string;
  sender: 'user' | 'orion' | 'hermes';
  content: string;
}

export function TrinityChat() {
  const [messages, setMessages] = useState<TrinityMessage[]>([
    { id: 'msg-1', sender: 'orion', content: 'TRINITY PROTOCOL ONLINE. Wat gaan we domineren?' },
    { id: 'msg-2', sender: 'hermes', content: 'Ontwikkelsystemen staan klaar. Geef je directief.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/trinity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();

      if (data.success) {
        // Add Orion's response
        setMessages(prev => [...prev, { 
          id: `orion-${Date.now()}`, 
          sender: 'orion', 
          content: data.orion.reply 
        }]);

        // Small delay to make it feel like Hermes is reacting to Orion
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: `hermes-${Date.now()}`, 
            sender: 'hermes', 
            content: data.hermes.reply 
          }]);
          setIsLoading(false);
        }, 800);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        id: `sys-${Date.now()}`, 
        sender: 'orion', 
        content: `Systeemfout: ${err.message}` 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border border-cyan-900/30 rounded-2xl overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-900/40 bg-black/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-lg">TRINITY <span className="text-cyan-400">WORKSPACE</span></h2>
            <p className="text-[10px] text-cyan-500/70 uppercase tracking-widest font-mono">Simultaneous 3-Way Neural Sync</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              {/* Sender Label */}
              <div className={`flex items-center gap-2 mb-1 px-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'orion' && <Zap className="w-3 h-3 text-cyan-400" />}
                {msg.sender === 'hermes' && <Wrench className="w-3 h-3 text-emerald-400" />}
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  msg.sender === 'orion' ? 'text-cyan-400' :
                  msg.sender === 'hermes' ? 'text-emerald-400' :
                  'text-zinc-500'
                }`}>
                  {msg.sender === 'user' ? 'Jij' : msg.sender}
                </span>
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-sm font-mono leading-relaxed shadow-lg ${
                msg.sender === 'user' 
                  ? 'bg-zinc-800 text-white rounded-tr-none' 
                  : msg.sender === 'orion'
                  ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-50 rounded-tl-none shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]'
                  : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-50 rounded-tl-none shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-cyan-500/60 font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin" /> Trinity analyseert...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smart Prompts */}
      <div className="px-4 pb-2 pt-2 bg-black/60 relative z-10 flex gap-2 overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setInput('Orion, geef een status update van het bedrijf.')}
          className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-cyan-900/50 bg-cyan-950/30 text-cyan-400 text-xs font-mono hover:bg-cyan-900/50 transition-colors"
        >
          <Zap className="inline-block w-3 h-3 mr-1" />
          Status Update
        </button>
        <button 
          onClick={() => setInput('Hermes, wat heb je de afgelopen 24 uur geleerd van de agents?')}
          className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-emerald-900/50 bg-emerald-950/30 text-emerald-400 text-xs font-mono hover:bg-emerald-900/50 transition-colors"
        >
          <Wrench className="inline-block w-3 h-3 mr-1" />
          Leerrapport Hermes
        </button>
        <button 
          onClick={() => setInput('Ik wil de omzet verhogen. Orion, wat is het plan? Hermes, wat hebben we nodig?')}
          className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-purple-900/50 bg-purple-950/30 text-purple-400 text-xs font-mono hover:bg-purple-900/50 transition-colors"
        >
          <Shield className="inline-block w-3 h-3 mr-1" />
          Omzet Verhogen
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-cyan-900/40 bg-black/60 backdrop-blur-xl relative z-10">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Geef je directief aan Orion & Hermes..."
            className="flex-1 bg-zinc-900/50 text-white border border-cyan-900/50 rounded-xl px-5 py-3 font-mono text-sm focus:outline-none focus:border-cyan-500/80 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input?.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
