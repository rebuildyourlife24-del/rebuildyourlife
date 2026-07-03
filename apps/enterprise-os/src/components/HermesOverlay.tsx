"use client";

import React, { useState } from "react";
import { MessageSquare, X, Command, Terminal, Cpu } from "lucide-react";

export function HermesOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "hermes"; text: string }[]>([
    { role: "hermes", text: "Supreme Overseer. De Godbrain connectie is actief. Wat is uw commando?" }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user" as const, text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate Hermes response for now -> Wired to actual backend API
    try {
      const response = await fetch("/api/hermes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: input, context: "enterprise-dashboard" })
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "hermes", text: data.message }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "hermes", text: "Fout: De neurale brug (API) is niet bereikbaar." }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-sm">
          {/* Header */}
          <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex justify-between items-center text-emerald-500">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              <span className="font-bold tracking-widest uppercase">Hermes Executive</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className={`text-[10px] uppercase tracking-wider mb-1 ${msg.role === 'user' ? 'text-neutral-500' : 'text-emerald-500/70'}`}>
                  {msg.role === 'user' ? 'Overseer' : 'Hermes'}
                </span>
                <div 
                  className={`p-3 rounded-lg max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-neutral-800 text-neutral-200' 
                      : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-800">
            <form onSubmit={handleSend} className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Initiate command sequence..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-10 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-emerald-500 transition-colors"
              >
                <Command className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 ${
          isOpen 
            ? 'bg-neutral-800 text-neutral-400' 
            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
