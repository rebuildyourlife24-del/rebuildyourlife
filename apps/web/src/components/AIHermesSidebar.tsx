'use client';

import { useState, useRef, useEffect } from 'react';
import { LiveAICore } from './ui/LiveAICore';
import { useChat } from '@ai-sdk/react';
import { Mic, Send, Zap, Command } from 'lucide-react';

export function AIHermesSidebar() {
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      { id: '1', role: 'system', content: 'HERMES CORE ONLINE. WAITING FOR DIRECTIVE.' }
    ],
    onFinish: (message) => {
      setAiState('speaking');
      if ('speechSynthesis' in window) {
        const cleanText = message.content.replace(/\*/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'nl-NL';
        utterance.pitch = 0.8;
        utterance.rate = 0.95;
        utterance.onend = () => setAiState('idle');
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setAiState('idle'), 2000);
      }
    }
  });

  useEffect(() => {
    if (isLoading && aiState !== 'listening') {
      setAiState('thinking');
    }
  }, [isLoading, aiState]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Spraakherkenning wordt niet ondersteund in deze browser.');
      return;
    }

    if (aiState === 'listening') {
      setAiState('idle');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setAiState('listening');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => setAiState('idle');
    recognition.onend = () => {
      if (aiState === 'listening') setAiState('idle');
    };

    recognition.start();
  };

  return (
    <div className="w-80 lg:w-96 h-full border-l border-zinc-800 bg-[#020202] flex flex-col shrink-0 relative z-20">
      {/* 3D Core at the top */}
      <LiveAICore state={aiState} />

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
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
                  <span className="text-[9px] uppercase tracking-widest text-cyan-400">Hermes</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-cyan-950/30 text-cyan-100 border border-cyan-500/30 p-3 rounded-xl rounded-tl-none shadow-[inset_0_0_15px_rgba(34,211,238,0.1)] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-500/20 bg-black/40">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <button 
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${aiState === 'listening' ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse' : 'bg-zinc-900 text-cyan-400 border-zinc-800 hover:border-cyan-500/50'}`}
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
    </div>
  );
}
