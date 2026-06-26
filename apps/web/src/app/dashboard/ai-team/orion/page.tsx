"use client";

import { useState, useEffect, useRef } from "react";
import { Cpu, Send, AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getConversationsAction, 
  getConversationMessagesAction, 
  sendAIMessageAction 
} from "@/app/actions/aiChat";

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function OrionChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    const res = await getConversationsAction("ORION");
    if (res.success && res.conversations) {
      setConversations(res.conversations);
      if (res.conversations.length > 0 && !activeConvId) {
        loadMessages(res.conversations[0].id);
      } else if (res.conversations.length === 0) {
        setMessages([]);
        setActiveConvId(null);
      }
    }
  }

  async function loadMessages(convId: string) {
    setLoadingMessages(true);
    setActiveConvId(convId);
    setError(null);
    const res = await getConversationMessagesAction(convId);
    if (res.success && res.messages) {
      setMessages(res.messages.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString()
      })));
    }
    setLoadingMessages(false);
  }

  async function handleSendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessageContent = inputValue.trim();
    setInputValue("");
    setError(null);

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessageContent,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    const res = await sendAIMessageAction("ORION", userMessageContent, activeConvId || undefined);
    
    if (!res.success) {
      setError(res.error || "Fout opgetreden");
      setMessages((prev) => prev.filter(m => m.id !== tempUserMsg.id));
    } else {
      if (!activeConvId && res.conversationId) {
        setActiveConvId(res.conversationId);
        loadConversations();
      }
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-80 border-r border-indigo-500/10 bg-black/50 backdrop-blur-md hidden md:flex flex-col">
        <div className="p-6 border-b border-indigo-500/10">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <Cpu className="w-6 h-6" />
            <h2 className="text-lg font-black uppercase tracking-widest">Orion</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Strategic Overseer</p>
        </div>

        <div className="p-4 border-b border-indigo-500/10">
          <button
            onClick={() => { setActiveConvId(null); setMessages([]); }}
            className="w-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all"
          >
            + Nieuwe Strategie
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => loadMessages(conv.id)}
              className={`w-full text-left p-3 rounded-lg text-xs transition-colors ${
                activeConvId === conv.id 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-zinc-400 hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="font-bold truncate">{conv.title || "Nieuw Gesprek"}</div>
              <div className="text-[9px] mt-1 opacity-50 uppercase">{new Date(conv.updatedAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-zinc-950/50">
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-900/5 pointer-events-none" />

        {/* Chat Header */}
        <div className="p-6 border-b border-indigo-500/10 backdrop-blur-md flex justify-between items-center z-10">
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest text-indigo-400">Orion Godbrain</h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase font-bold">Financiële & Architecturale Analyse</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">AURA ACTIVE</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-10 custom-scrollbar">
          {messages.length === 0 && !loadingMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <Cpu className="w-16 h-16 text-indigo-500/20 mb-6" />
              <h3 className="text-xl font-black uppercase text-zinc-300 mb-2">ORION GEREED</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                Vraag mij om marktonderzoek, risico-analyse of een blauwdruk voor je volgende onderneming.
              </p>
              <div className="grid grid-cols-1 gap-3 w-full">
                <button onClick={() => setInputValue("Bereken de ROI van een nieuwe SaaS app met $10/maand subscriptie en 500 gebruikers.")} className="p-3 bg-black/40 border border-indigo-500/10 rounded-xl text-xs text-left text-zinc-400 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all font-bold">
                  Bereken ROI voor SaaS ($10/m, 500 users)
                </button>
                <button onClick={() => setInputValue("Welke niches zijn momenteel ondergewaardeerd in de B2B software markt?")} className="p-3 bg-black/40 border border-indigo-500/10 rounded-xl text-xs text-left text-zinc-400 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all font-bold">
                  Analyseer B2B software niches.
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-5 ${
                    msg.role === "user" 
                      ? "bg-zinc-800 text-white border border-zinc-700" 
                      : "bg-black/60 text-zinc-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)] backdrop-blur-md"
                  }`}>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-3 text-indigo-400 text-[10px] font-black uppercase tracking-widest border-b border-indigo-500/10 pb-2">
                        <BarChart3 className="w-3.5 h-3.5" /> Orion
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-black/60 text-zinc-300 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                    <span className="text-xs font-mono">Calculeren...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-black/80 border-t border-indigo-500/10 backdrop-blur-xl z-20">
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="mb-4 p-3 bg-cyan-500/50 border border-cyan-500/50 text-cyan-500 rounded-xl text-xs font-bold flex items-center gap-2 uppercase">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Vraag Orion om strategisch advies..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="absolute right-2 p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
