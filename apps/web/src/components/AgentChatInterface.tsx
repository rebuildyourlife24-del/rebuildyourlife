"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, ShieldAlert, Sparkles, Plus, MessageSquare, AlertCircle, Zap, TrendingUp, Globe, Briefcase, BrainCircuit, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getConversationsAction, 
  getConversationMessagesAction, 
  sendAIMessageAction 
} from "@/app/actions/aiChat";
import { useRequireAuth } from "@/lib/auth";

interface AgentChatInterfaceProps {
  agentId: "HERMES" | "ORION"; 
  agentName: string;
  agentRole: string;
  agentDescription: string;
  icon: React.ReactNode;
  suggestedPrompts: { label: string; text: string }[];
  themeColor: string; 
}

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

const EARNING_MODELS = [
  { id: 'ecom', icon: <Globe className="w-5 h-5" />, title: 'E-commerce & Dropshipping', desc: 'Lanceer of schaal een internationale webshop.' },
  { id: 'saas', icon: <Zap className="w-5 h-5" />, title: 'SaaS & Software', desc: 'Bouw een recurring revenue software business.' },
  { id: 'affiliate', icon: <TrendingUp className="w-5 h-5" />, title: 'Affiliate Marketing', desc: 'Genereer passief inkomen via performance marketing.' },
  { id: 'agency', icon: <Briefcase className="w-5 h-5" />, title: 'Agency & B2B (SMMA)', desc: 'Start een high-ticket service gebaseerd bedrijf.' }
];

export function AgentChatInterface({
  agentId,
  agentName,
  agentRole,
  agentDescription,
  icon,
  suggestedPrompts,
  themeColor
}: AgentChatInterfaceProps) {
  const { user } = useRequireAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sentinelSafe, setSentinelSafe] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const colorBase = themeColor.split("-")[1] || "zinc";

  useEffect(() => {
    loadConversations();
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    setLoadingMessages(true);
    try {
      const result = await getConversationsAction(agentId);
      if (result.success) {
        setConversations(result.conversations as any[]);
        if (result.conversations.length > 0) {
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
    if (!textToSend?.trim() || loading) return;

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
      const roleInstruction = `[SYSTEM: You are acting as ${agentName}, the ${agentRole}. Limit your responses to your domain of expertise: ${agentDescription}] `;
      const messageWithRole = roleInstruction + textToSend;

      const result = await sendAIMessageAction(agentId, messageWithRole, activeConvId || undefined);
      
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
        const errorText = typeof result.message === "string" ? result.message : 
                          (typeof result.error === "string" ? result.error : "Fout bij verzenden van bericht.");
        setError(errorText);
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

  const handleModelSelect = (modelId: string, modelTitle: string) => {
    handleSendMessage(`Ik wil direct starten met het verdienmodel: ${modelTitle}. Geef me een stap-voor-stap kickstart plan en de benodigde resources.`);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto h-[88vh] bg-[#050505] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 flex overflow-hidden font-sans text-white relative backdrop-blur-3xl">
      
      {/* Background glow global */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-${colorBase}-900/10 blur-[120px] rounded-full pointer-events-none`}></div>

      {/* LEFT SIDEBAR: CONVERSATIONS (Sleek, minimal) */}
      <div className="w-72 bg-black/60 border-r border-white/5 flex flex-col justify-between shrink-0 z-10 hidden md:flex">
        <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="flex items-center gap-4">
             <div className={`p-4 rounded-2xl bg-black border border-white/10 ${themeColor} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
               {icon}
             </div>
             <div>
                <h2 className="text-base font-black uppercase tracking-widest">{agentName}</h2>
                <p className="text-xs text-zinc-500 mt-1">{agentRole}</p>
             </div>
          </div>

          <button
            onClick={handleStartNewConversation}
            className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl font-bold uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 text-xs transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Sessie
          </button>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Geheugenlogboeken</span>
            {loadingMessages && conversations.length === 0 ? (
              <div className="text-center py-4 text-xs text-zinc-600">Archieven ophalen...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Geen actieve sessies</div>
            ) : (
              <div className="space-y-1 overflow-y-auto pr-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      loadMessages(conv.id);
                    }}
                    className={`p-3.5 rounded-xl text-xs cursor-pointer font-medium transition-all flex items-center gap-3 truncate ${
                      activeConvId === conv.id 
                        ? `bg-zinc-900/80 text-white shadow-inner border border-white/5` 
                        : "bg-transparent text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300"
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeConvId === conv.id ? themeColor : ''}`} />
                    <span className="truncate">{conv.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MIDDLE: ACTIVE CHAT SCREEN */}
      <div className="flex-1 flex flex-col justify-between z-10 relative bg-black/20">
        
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md bg-black/30">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
              {agentName} <span className="text-zinc-600 font-medium tracking-normal text-sm">/ {agentRole}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${themeColor.replace('text-', 'bg-')} animate-pulse`}></div>
            <span className={`text-xs font-bold uppercase ${themeColor} tracking-widest`}>
              Connectie Actief
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 custom-scrollbar">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full py-10"
            >
              <h3 className="text-2xl font-black uppercase tracking-widest mb-3 text-center">Initialisatie Voltooid</h3>
              <p className="text-zinc-400 text-base leading-relaxed text-center mb-12">
                Kies een verdienmodel om direct een kickstart strategie te genereren, of typ een specifiek commando.
              </p>

              {/* QUICK START EARNING MODELS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
                {EARNING_MODELS.map((model, i) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={model.id}
                    onClick={() => handleModelSelect(model.id, model.title)}
                    className="p-6 bg-zinc-900/40 hover:bg-zinc-800/80 border border-white/5 hover:border-white/20 rounded-2xl text-left transition-all group flex flex-col gap-3 shadow-lg"
                  >
                    <div className={`p-3 bg-black rounded-xl w-max border border-white/10 ${themeColor} group-hover:scale-110 transition-transform`}>
                      {model.icon}
                    </div>
                    <h4 className="font-bold text-lg">{model.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{model.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Classic Suggested Prompts */}
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt.text)}
                    disabled={loading}
                    className="bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider px-5 py-3 transition-colors flex items-center gap-2 text-zinc-300 hover:text-white"
                  >
                    <Sparkles className={`w-4 h-4 ${themeColor}`} />
                    {prompt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[75%] p-6 rounded-3xl text-base leading-relaxed shadow-2xl ${
                  msg.role === "user" 
                    ? `bg-zinc-900 border border-zinc-700 text-white rounded-br-sm` 
                    : "bg-[#0a0a0a] border border-white/5 text-zinc-300 rounded-bl-sm"
                }`}
              >
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5 text-xs font-black uppercase tracking-widest text-zinc-500">
                  <span className={msg.role === "user" ? themeColor : "text-white"}>
                    {msg.role === "user" ? "Operator" : agentName}
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="prose prose-invert max-w-none prose-p:leading-loose prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/10 text-zinc-300">
                  <p className="whitespace-pre-wrap">{msg.content.replace(/\[SYSTEM:.*?\]\s*/g, '')}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl rounded-bl-sm p-6 text-sm font-bold text-zinc-400 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <span className={`w-2 h-2 rounded-full animate-bounce ${themeColor.replace('text-', 'bg-')}`} style={{ animationDelay: "0ms" }}></span>
                  <span className={`w-2 h-2 rounded-full animate-bounce ${themeColor.replace('text-', 'bg-')}`} style={{ animationDelay: "150ms" }}></span>
                  <span className={`w-2 h-2 rounded-full animate-bounce ${themeColor.replace('text-', 'bg-')}`} style={{ animationDelay: "300ms" }}></span>
                </div>
                {agentName} synchroniseert neurale data...
              </div>
            </div>
          )}

          {error && (
            <div className="border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-sm flex items-start gap-4 text-red-500 mx-auto max-w-2xl w-full">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <span className="font-black uppercase tracking-widest block mb-2">Systeem Foutmelding</span>
                <p className="text-red-500/90 leading-relaxed font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 backdrop-blur-xl">
          <div className="flex gap-4 max-w-5xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder={`Geef commando's aan ${agentName}...`}
              disabled={loading}
              className="flex-1 bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 text-base font-medium focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 placeholder:text-zinc-600 transition-all shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputValue?.trim()}
              className="bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-2xl font-black uppercase tracking-widest px-8 flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Verstuur
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT: 3D NEURAL BRAIN AVATAR AREA */}
      <div className="w-[450px] border-l border-white/5 bg-black flex flex-col relative overflow-hidden hidden xl:flex shrink-0 z-10">
        
        {/* Placeholder for 3D Audio2Face Avatar / Neural Brain */}
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="/glowing_brain.png" 
            alt="Neural Engine" 
            className="w-full h-full object-cover opacity-60 mix-blend-screen scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>

        {/* Holographic Overlay Stats */}
        <div className="z-10 flex flex-col h-full justify-between p-8">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className={`w-6 h-6 ${themeColor}`} />
              <h3 className="text-sm font-black uppercase tracking-widest text-white drop-shadow-md">NVIDIA Audio2Face</h3>
            </div>
            
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-2xl">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2">3D Avatar Status</span>
              <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Standby voor Neurale Synapsis
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-5">Neural Labor Metrics</span>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-zinc-300">Context Verwerking</span>
                    <span className="font-bold text-white">98.4%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${themeColor.replace('text-', 'bg-')} w-[98%]`}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-zinc-300">Router Latency</span>
                    <span className="font-bold text-white">142ms</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${themeColor.replace('text-', 'bg-')} w-[15%]`}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-4">
              <Activity className="w-3 h-3" />
              Sovereign AI Node Active
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
