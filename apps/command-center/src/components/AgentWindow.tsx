"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Send, Mic } from 'lucide-react';

interface AgentWindowProps {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentWindow({ id, title, icon, color, isOpen, onClose }: AgentWindowProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'agent', text: string}[]>([
    { role: 'agent', text: `${title} online. Klaar voor specifieke instructies.` }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');

    // Simulate Agent response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: `Ik verwerk je commando: "${currentInput}". Resultaten worden zo teruggestuurd.` 
      }]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -20 }}
          className={`glass-panel border-t-2 ${color.replace('text-', 'border-')} rounded-xl overflow-hidden flex flex-col transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 md:inset-10' : 'relative w-full h-[300px]'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md bg-white/5 ${color}`}>
                {icon}
              </div>
              <span className="font-mono text-xs tracking-widest text-white/80">{title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-white/40 hover:text-white">
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="text-white/40 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-2.5 text-xs font-mono leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/20' 
                    : 'bg-white/5 text-white/70 border border-white/10'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
            <button className="p-2 text-white/40 hover:text-cyan-400 transition-colors">
              <Mic className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Stuur bericht aan ${title.split(' ')[0]}...`}
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30 font-mono"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 text-white/40 hover:text-cyan-400 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
