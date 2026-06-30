"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Brain, Send, Zap, Cpu, Terminal, ShieldAlert, Sparkles, 
  Trash2, Plus, MessageSquare, AlertCircle, RefreshCw, Layers 
} from "lucide-react";
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

export default function AIAssistantPage() {
  const [selectedAgent, setSelectedAgent] = useState<"HERMES" | "ORION">("HERMES");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sentinel indicator status
  const [sentinelSafe, setSentinelSafe] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations when agent changes
  useEffect(() => {
    loadConversations();
  }, [selectedAgent]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoadingMessages(true);
    try {
      const result = await getConversationsAction(selectedAgent);
      if (result.success) {
        setConversations(result.conversations as any[]);
        if (result.conversations.length > 0) {
          // Set first conversation as active
          setActiveConvId(result.conversations[0].id);
          loadMessages(result.conversations[0].id);
        } else {
          setActiveConvId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadMessages = async (convId: string) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const result = await getConversationMessagesAction(convId);
      if (result.success) {
        setMessages((result.messages as any[]) || []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      setError("Kon berichten niet laden.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleStartNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setInputValue("");
    setError(null);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputValue;
    if (!textToSend.trim() || loading) return;

    setError(null);
    setLoading(true);
    setSentinelSafe(true);

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: textToSend,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempUserMsg]);
    if (!customMessage) setInputValue("");

    try {
      const result = await sendAIMessageAction(selectedAgent, textToSend, activeConvId || undefined);
      
      if (result.success && result.message && typeof result.message === "object") {
        const msg = result.message as any;
        if (!activeConvId) {
          setActiveConvId(result.conversationId || null);
          loadConversations();
        }
        setMessages(prev => [
          ...prev.filter(m => !m.id.startsWith("temp-")),
          {
            id: msg.id,
            role: "assistant",
            content: msg.content,
            createdAt: msg.createdAt
          }
        ]);
      } else {
        if (result.error === "SENTINEL_BLOCK") {
          setSentinelSafe(false);
        }
        setError(typeof result.message === "string" ? result.message : "Fout bij verzenden van bericht.");
        setMessages(prev => prev.filter(m => !m.id.startsWith("temp-")));
      }
    } catch (err: any) {
      console.error(err);
      setError("Netwerkfout bij verbinding met AI.");
      setMessages(prev => prev.filter(m => !m.id.startsWith("temp-")));
    } finally {
      setLoading(false);
    }
  };

  const strategyPrompts = {
    HERMES: [
      { label: "Start Nieuw Bedrijf", text: "Hermes, start het protocol om een nieuw SaaS-bedrijf te ontwerpen. Geef me direct een stappenplan, tech-stack en automation scripts." },
      { label: "Check 24/7 Taken", text: "Hermes, voer een statuscheck uit op de RYL platform automation. Lopen de Shopify syncs, orders en de 25% platform cut correct?" },
      { label: "Genereer SEO Meta", text: "Hermes, schrijf een high-conversion SEO meta-titel en beschrijving voor een AI Video generator app." }
    ],
    ORION: [
      { label: "Marktonderzoek Niche", text: "Orion, voer een diepgaande marktanalyse uit naar de meest winstgevende software niches in 2026 waar we apps voor kunnen bouwen." },
      { label: "Marges & ROI Analyse", text: "Orion, help me de pricing, operationele kosten en ROI te berekenen van een nieuw SaaS-platform met 25% brokerage cut." },
      { label: "Strategisch Groeiplan", text: "Orion, ontwerp een strategisch lange-termijn groeiplan om de totale omzet van ons RYL netwerk te maximaliseren." }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto h-[85vh] bg-zinc-950/50 border border-white/5 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col md:flex-row overflow-hidden font-sans text-white backdrop-blur-xl relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 hidden blur-[] rounded-full pointer-events-none"></div>

      {/* LEFT SIDEBAR: AGENT CHOOSE & CONVERSATIONS */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col justify-between shrink-0 h-1/3 md:h-full z-10">
        
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Agent selection */}
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Neural Core Selection</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedAgent("HERMES");
                  handleStartNewConversation();
                }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedAgent === "HERMES" 
                    ? "bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white" 
                    : "bg-zinc-950 border-white/5 hover:border-white/20 text-zinc-400"
                }`}
              >
                <Zap className={`w-5 h-5 ${selectedAgent === "HERMES" ? "text-cyan-400" : "text-zinc-500"}`} />
                <span className="text-xs font-bold uppercase tracking-wider">Hermes</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAgent("ORION");
                  handleStartNewConversation();
                }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedAgent === "ORION" 
                    ? "bg-indigo-950/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-white" 
                    : "bg-zinc-950 border-white/5 hover:border-white/20 text-zinc-400"
                }`}
              >
                <Cpu className={`w-5 h-5 ${selectedAgent === "ORION" ? "text-indigo-400" : "text-zinc-500"}`} />
                <span className="text-xs font-bold uppercase tracking-wider">Orion</span>
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleStartNewConversation}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-500" />
            Nieuwe Sessie
          </button>

          {/* Conversation history */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Geheugenlogboeken</span>
            {loadingMessages && conversations.length === 0 ? (
              <div className="text-center py-4 text-xs text-zinc-600">Archieven ophalen...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Geen actieve sessies</div>
            ) : (
              <div className="space-y-2 max-h-[180px] md:max-h-none overflow-y-auto pr-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      loadMessages(conv.id);
                    }}
                    className={`p-3 rounded-lg text-xs cursor-pointer font-bold transition-all flex items-center gap-3 truncate border ${
                      activeConvId === conv.id 
                        ? "bg-zinc-900 border-zinc-700 text-white" 
                        : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sentinel Shield Status */}
        <div className="p-4 bg-black/60 border-t border-white/5 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <ShieldAlert className={`w-4 h-4 ${sentinelSafe ? "text-cyan-500" : "text-cyan-500 animate-pulse"}`} />
            Sentinel Core: {sentinelSafe ? <span className="text-cyan-500">SECURE</span> : <span className="text-cyan-500">INTERCEPTED</span>}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${sentinelSafe ? "bg-cyan-500" : "bg-cyan-500 animate-ping"}`} />
        </div>

      </div>

      {/* RIGHT: ACTIVE CHAT SCREEN */}
      <div className="flex-1 flex flex-col justify-between h-2/3 md:h-full z-10 relative">
        
        {/* Chat Header */}
        <div className="bg-black/20 p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl bg-black border ${selectedAgent === "HERMES" ? "border-cyan-500/30 text-cyan-400" : "border-indigo-500/30 text-indigo-400"}`}>
              {selectedAgent === "HERMES" ? <Zap className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                {selectedAgent} <span className="text-zinc-500 font-medium tracking-normal">Direct Link</span>
              </h2>
              <span className="text-[10px] text-zinc-500 block font-medium mt-1">
                {selectedAgent === "HERMES" 
                  ? "24/7 Executieve Uitvoerder & Automation Engine" 
                  : "Strategisch Architect & Business Planner"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-cyan-950/30 border border-cyan-500/30 px-3 py-1 rounded-full font-bold uppercase text-cyan-400 tracking-wider">
              Connection: Stable
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
              <Brain className="w-16 h-16 text-zinc-800 mb-6" />
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Neural Link Geactiveerd</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Je bent nu direct verbonden met {selectedAgent}. Stuur een commando of kies een snelle protocol-optie hieronder om te beginnen.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-2xl p-5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-cyan-900/20 border border-cyan-500/20 text-white" 
                    : "bg-zinc-900/50 border border-white/5 text-zinc-300"
                }`}
              >
                <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span className={msg.role === "user" ? "text-cyan-400" : "text-white"}>{msg.role === "user" ? "Operator (Henk)" : selectedAgent}</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 text-xs font-bold text-zinc-500 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                {selectedAgent} verwerkt data...
              </div>
            </div>
          )}

          {error && (
            <div className="border border-cyan-500/30 bg-cyan-500/20 rounded-xl p-4 text-xs flex items-start gap-3 text-cyan-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-widest block mb-1">Systeem Foutmelding</span>
                <p className="text-cyan-500/80">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Strategy Prompts panel */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex flex-wrap gap-3">
          {strategyPrompts[selectedAgent].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt.text)}
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-2"
            >
              <Sparkles className={`w-3.5 h-3.5 ${selectedAgent === "HERMES" ? "text-cyan-400" : "text-indigo-400"}`} />
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-black/60 border-t border-white/5 flex gap-4 backdrop-blur-md">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder={`Commando voor ${selectedAgent}...`}
            disabled={loading}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-cyan-500/50 placeholder:text-zinc-600 transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue.trim()}
            className="bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold uppercase tracking-widest px-8 flex items-center gap-3 transition-colors"
          >
            Verstuur
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
