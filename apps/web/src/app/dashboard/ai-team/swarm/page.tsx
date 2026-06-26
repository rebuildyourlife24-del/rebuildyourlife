"use client";

import { useState, useEffect, useRef } from "react";
import { Brain, Send, AlertCircle, RefreshCw, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getConversationsAction, 
  getConversationMessagesAction, 
  sendAIMessageAction 
} from "@/app/actions/aiChat";
import { NeuralSwarm } from "@/components/ui/NeuralSwarm";

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

export default function SwarmChatPage() {
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
    const res = await getConversationsAction("SWARM");
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

    const res = await sendAIMessageAction("SWARM", userMessageContent, activeConvId || undefined);
    
    if (!res.success) {
      setError(res.error || "Fout opgetcyanen");
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
      <div className="w-80 border-r border-fuchsia-500/10 bg-black/50 backdrop-blur-md hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-fuchsia-500/10">
          <div className="flex items-center gap-3 text-fuchsia-400 mb-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-lg font-black uppercase tracking-widest">The Swarm</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Collective Hive Mind</p>
        </div>

        <div className="p-4 border-b border-fuchsia-500/10">
          <button
            onClick={() => { setActiveConvId(null); setMessages([]); }}
            className="w-full bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)]"
          >
            + Nieuw Swarm Project
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => loadMessages(conv.id)}
              className={`w-full text-left p-3 rounded-lg text-xs transition-colors ${
                activeConvId === conv.id 
                  ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)]" 
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
        {/* Background Visualizer */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
          <div className="scale-150 transform">
            <NeuralSwarm theme="purple" isSpeaking={loading} />
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-fuchsia-900/5 pointer-events-none z-0" />

        {/* Chat Header */}
        <div className="p-6 border-b border-fuchsia-500/10 backdrop-blur-md flex justify-between items-center z-10">
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest text-fuchsia-400">Swarm Intelligence</h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase font-bold">50+ Nodes Syncing</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                setLoading(true);
                setInputValue("INITIATING SWARM PROTOCOL...");
                try {
                  const res = await fetch('/api/swarm/execute', { method: 'POST' });
                  const data = await res.json();
                  if(data.success) {
                    setMessages(prev => [...prev, { role: 'assistant', content: 'Swarm asset gegenereerd. Check QC Terminal.' }]);
                  } else {
                    setError('Swarm fout: ' + data.error);
                  }
                } catch(e) {
                  setError('Netwerk fout');
                }
                setLoading(false);
                setInputValue("");
              }}
              className="px-4 py-2 bg-fuchsia-500/20 text-fuchsia-300 font-bold text-xs uppercase tracking-widest rounded border border-fuchsia-500/50 hover:bg-fuchsia-500/40 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)]"
            >
              Start Swarm Protocol
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]">
              <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
              <span className="text-[10px] text-fuchsia-400 font-black uppercase tracking-widest">HIVE LINK STABLE</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-10 custom-scrollbar">
          {messages.length === 0 && !loadingMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <Network className="w-16 h-16 text-fuchsia-500/20 mb-6" />
              <h3 className="text-xl font-black uppercase text-zinc-300 mb-2">THE SWARM IS LISTENING</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                Roep de kracht van meerdere agenten tegelijkertijd aan voor complexe datascraping, massale marktonderzoeken of multi-step automations.
              </p>
              <div className="grid grid-cols-1 gap-3 w-full">
                <button onClick={() => setInputValue("Start een massale scraping taak van de top 100 Shopify stores en extraheer hun best verkopende producten.")} className="p-3 bg-black/60 border border-fuchsia-500/10 rounded-xl text-xs text-left text-zinc-400 hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all font-bold backdrop-blur-sm">
                  Scrape 100 Shopify stores voor winning products.
                </button>
                <button onClick={() => setInputValue("Analyseer 50 verschillende e-mail marketing funnels en creëer een hybride winnend template.")} className="p-3 bg-black/60 border border-fuchsia-500/10 rounded-xl text-xs text-left text-zinc-400 hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all font-bold backdrop-blur-sm">
                  Analyseer 50 e-mail funnels en maak 1 master template.
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-5 ${
                    msg.role === "user" 
                      ? "bg-zinc-800 text-white border border-zinc-700 backdrop-blur-md" 
                      : "bg-black/80 text-zinc-300 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.1)] backdrop-blur-md"
                  }`}>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-3 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest border-b border-fuchsia-500/20 pb-2">
                        <Brain className="w-3.5 h-3.5" /> Swarm Collective
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
                  <div className="bg-black/80 text-zinc-300 border border-fuchsia-500/30 rounded-2xl p-5 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
                    <RefreshCw className="w-4 h-4 text-fuchsia-500 animate-spin" />
                    <span className="text-xs font-mono">Synthesizing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-black/80 border-t border-fuchsia-500/10 backdrop-blur-xl z-20">
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
                placeholder="Initialiseer de Swarm voor een grootschalige taak..."
                className="w-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 text-white rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all shadow-inner"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="absolute right-2 p-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg hover:bg-fuchsia-500/20 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(217,70,239,0.2)]"
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
