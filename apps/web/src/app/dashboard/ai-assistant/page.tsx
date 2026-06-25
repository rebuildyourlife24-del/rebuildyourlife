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

    // If it's a new conversation, create local optimistic message first
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
        // Handle sentinel or paywall errors
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

  // Quick Strategy prompts
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
    <div className="max-w-7xl mx-auto h-[82vh] border-8 border-black bg-zinc-100 shadow-[8px_8px_0px_#000000] flex flex-col md:flex-row overflow-hidden font-mono text-black">
      
      {/* LEFT SIDEBAR: AGENT CHOOSE & CONVERSATIONS */}
      <div className="w-full md:w-80 border-b-8 md:border-b-0 md:border-r-8 border-black bg-zinc-200 flex flex-col justify-between shrink-0 h-1/3 md:h-full">
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Agent selection */}
          <div className="space-y-1">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider block">Kies AI Assistent</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedAgent("HERMES");
                  handleStartNewConversation();
                }}
                className={`border-2 border-black p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  selectedAgent === "HERMES" 
                    ? "bg-black text-white shadow-[2px_2px_0px_#22d3ee]" 
                    : "bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000000]"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Hermes</span>
                <span className="text-[8px] opacity-60">Uitvoerder</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAgent("ORION");
                  handleStartNewConversation();
                }}
                className={`border-2 border-black p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  selectedAgent === "ORION" 
                    ? "bg-black text-white shadow-[2px_2px_0px_#eab308]" 
                    : "bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000000]"
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Orion</span>
                <span className="text-[8px] opacity-60">Strategist</span>
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleStartNewConversation}
            className="w-full bg-white hover:bg-zinc-50 border-2 border-black font-black uppercase tracking-wider py-2 flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000000] text-xs transition-transform active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Nieuw Gesprek
          </button>

          {/* Conversation history */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-400">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider block">Recente Gesprekken</span>
            {loadingMessages && conversations.length === 0 ? (
              <div className="text-center py-4 text-xs text-zinc-500">Laden...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-xs text-zinc-500 uppercase font-bold">Geen geschiedenis</div>
            ) : (
              <div className="space-y-1.5 max-h-[180px] md:max-h-none overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      loadMessages(conv.id);
                    }}
                    className={`border-2 border-black p-2 text-xs cursor-pointer font-bold transition-all flex items-center gap-2 truncate ${
                      activeConvId === conv.id 
                        ? "bg-zinc-400 shadow-[1px_1px_0px_#000000]" 
                        : "bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000000]"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate uppercase">{conv.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sentinel Shield Status */}
        <div className="p-3 bg-zinc-300 border-t-2 border-black flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className={`w-3.5 h-3.5 ${sentinelSafe ? "text-black" : "text-gold animate-pulse"}`} />
            Sentinel: {sentinelSafe ? "SECURE" : "INTERCEPTED"}
          </span>
          <span className={`w-2 h-2 rounded-full ${sentinelSafe ? "bg-green-600" : "bg-gold animate-ping"}`} />
        </div>

      </div>

      {/* RIGHT: ACTIVE CHAT SCREEN */}
      <div className="flex-1 flex flex-col justify-between h-2/3 md:h-full bg-white">
        
        {/* Chat Header */}
        <div className="bg-zinc-200 p-4 border-b-4 border-black flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 border-2 border-black ${selectedAgent === "HERMES" ? "bg-cyan-100" : "bg-yellow-100"}`}>
              {selectedAgent === "HERMES" ? <Zap className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-1.5">
                {selectedAgent} ASSISTANT
              </h2>
              <span className="text-[8px] text-zinc-500 block uppercase font-bold">
                {selectedAgent === "HERMES" 
                  ? "// 24/7 Executieve Uitvoerder & Code Engine" 
                  : "// Strategisch Architect & Business Planner"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-zinc-300 border border-zinc-400 px-2 py-0.5 rounded font-mono font-bold uppercase text-zinc-700">
              API ROUTER: ACTIVE
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-50 flex flex-col gap-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
              <Brain className="w-12 h-12 text-zinc-400 mb-3" />
              <h3 className="text-sm font-black uppercase tracking-wider">Start je RYL AI Commando</h3>
              <p className="text-zinc-500 text-xs mt-1.5 uppercase font-bold leading-relaxed">
                Stuur een bericht of klik hieronder op een quick command om direct met {selectedAgent} te communiceren. De AI draait rechtstreeks op jouw eigen API sleutels.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-2xl p-4 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-zinc-200 text-black font-bold" 
                    : "bg-white text-black"
                }`}
              >
                <div className="flex justify-between items-center border-b border-zinc-200 pb-1.5 mb-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <span>{msg.role === "user" ? "Henk Semler" : selectedAgent}</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000000] text-xs font-bold text-zinc-600 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                {selectedAgent} is aan het nadenken via de Sovereign AI Router...
              </div>
            </div>
          )}

          {error && (
            <div className="border-4 border-red-600 bg-red-50 p-4 shadow-[4px_4px_0px_#dc2626] text-xs flex items-start gap-2.5 text-red-800 font-bold uppercase">
              <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <span>FOUTMELDING:</span>
                <p className="mt-1 normal-case text-zinc-800 font-mono font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Strategy Prompts panel */}
        <div className="px-6 py-3 bg-zinc-100 border-t-2 border-zinc-300 flex flex-wrap gap-2">
          {strategyPrompts[selectedAgent].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt.text)}
              disabled={loading}
              className="bg-white hover:bg-zinc-50 border-2 border-black text-[9px] font-black uppercase tracking-wider px-3 py-1.5 shadow-[2px_2px_0px_#000000] active:translate-y-0.5 shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t-4 border-black bg-zinc-200 flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder={`Stuur een commando naar ${selectedAgent}...`}
            disabled={loading}
            className="flex-1 bg-white border-2 border-black px-4 py-3 text-xs font-bold focus:outline-none placeholder:text-zinc-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue.trim()}
            className="bg-black text-white hover:bg-zinc-900 disabled:opacity-40 border-2 border-black font-black uppercase tracking-widest px-6 flex items-center gap-2 shadow-[3px_3px_0px_#22d3ee] active:translate-x-0.5 active:translate-y-0.5"
          >
            SEND
            <Send className="w-4 h-4 fill-white" />
          </button>
        </div>

      </div>

    </div>
  );
}
