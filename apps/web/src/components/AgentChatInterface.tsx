"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, Sparkles, MessageSquare, AlertCircle, Zap, TrendingUp, Globe, Briefcase, Plus, Menu
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
  { id: 'ecom', icon: <Globe className="w-6 h-6" />, title: 'E-commerce & Dropshipping', desc: 'Lanceer of schaal een internationale webshop.' },
  { id: 'saas', icon: <Zap className="w-6 h-6" />, title: 'SaaS & Software', desc: 'Bouw een recurring revenue software business.' },
  { id: 'affiliate', icon: <TrendingUp className="w-6 h-6" />, title: 'Affiliate Marketing', desc: 'Genereer passief inkomen via performance marketing.' },
  { id: 'agency', icon: <Briefcase className="w-6 h-6" />, title: 'Agency & B2B (SMMA)', desc: 'Start een high-ticket service gebaseerd bedrijf.' }
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
  
  // Mobile history drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colorBase = themeColor.split("-")[1] || "zinc";

  useEffect(() => {
    loadConversations();
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
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
      }
    } catch (err) {
      console.error(err);
      setError("Kon berichten niet laden.");
    } finally {
      setLoadingMessages(false);
      setIsHistoryOpen(false); // Close history drawer on mobile when chat is selected
    }
  };

  const handleStartNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setInputValue("");
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputValue;
    if (!textToSend?.trim() || loading) return;

    setError(null);
    setLoading(true);

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
    <div className="w-full h-full flex flex-col relative bg-transparent">
      
      {/* Top Header - Super Minimal */}
      <div className="flex-none px-4 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className={`p-2.5 rounded-xl bg-black border border-white/10 ${themeColor} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest leading-none drop-shadow-md">{agentName}</h2>
            <p className="text-sm text-zinc-400 mt-1">{agentRole}</p>
          </div>
        </div>
        
        {/* Connection Status & New Chat Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartNewConversation}
            className="hidden md:flex bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold uppercase tracking-widest px-4 py-2 items-center gap-2 text-xs transition-colors backdrop-blur-md"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Sessie
          </button>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full ${themeColor.replace('text-', 'bg-')} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
            <span className={`text-[10px] font-bold uppercase ${themeColor} tracking-widest`}>
              Actief
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Floating History Drawer (Mobile & Optional Desktop) */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-black/80 backdrop-blur-3xl border-r border-white/10 z-30 p-4 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Sessie Logboek</span>
                <button onClick={handleStartNewConversation} className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
                {conversations.length === 0 ? (
                  <div className="text-center py-4 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Geen actieve sessies</div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        loadMessages(conv.id);
                      }}
                      className={`p-3.5 rounded-xl text-sm cursor-pointer font-medium transition-all flex items-center gap-3 truncate ${
                        activeConvId === conv.id 
                          ? `bg-zinc-900/80 text-white shadow-inner border border-white/5` 
                          : "bg-transparent text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300"
                      }`}
                    >
                      <MessageSquare className={`w-4 h-4 shrink-0 ${activeConvId === conv.id ? themeColor : ''}`} />
                      <span className="truncate">{conv.title}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages Area (Full Width, Centered Content) */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 custom-scrollbar">
          <div className="max-w-4xl mx-auto flex flex-col gap-8 min-h-full pb-32">
            
            {/* Empty State / Quick Start */}
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-auto py-12 flex flex-col items-center justify-center"
              >
                <div className={`p-6 rounded-3xl bg-black border border-white/5 shadow-2xl mb-8 ${themeColor} bg-gradient-to-br from-black to-zinc-900/50`}>
                  {icon && <div className="scale-[1.5]">{icon}</div>}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                  Klaar voor je Directive
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed text-center mb-12 max-w-2xl font-medium">
                  Kies een verdienmodel om een kickstart strategie te genereren, of stel direct je eigen specifieke vraag aan {agentName}.
                </p>

                {/* QUICK START GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-12">
                  {EARNING_MODELS.map((model, i) => (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={model.id}
                      onClick={() => handleModelSelect(model.id, model.title)}
                      className="p-6 bg-black/40 hover:bg-zinc-900/80 border border-white/5 hover:border-white/20 rounded-3xl text-left transition-all duration-300 group flex flex-col gap-4 backdrop-blur-md shadow-xl hover:shadow-2xl"
                    >
                      <div className={`p-4 bg-zinc-950 rounded-2xl w-max border border-white/5 ${themeColor} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                        {model.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-white mb-2">{model.title}</h4>
                        <p className="text-base text-zinc-400 leading-relaxed">{model.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Suggested Prompts */}
                <div className="flex flex-wrap justify-center gap-3 w-full">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt.text)}
                      disabled={loading}
                      className="bg-black/30 hover:bg-zinc-800/80 border border-white/5 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors flex items-center gap-2 text-zinc-300 hover:text-white"
                    >
                      <Sparkles className={`w-4 h-4 ${themeColor}`} />
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Render Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[90%] md:max-w-[85%] p-6 md:p-8 rounded-[2rem] text-lg leading-relaxed shadow-2xl ${
                    msg.role === "user" 
                      ? `bg-zinc-900 border border-zinc-700/50 text-white rounded-br-md` 
                      : "bg-[#050505]/80 backdrop-blur-xl border border-white/5 text-zinc-200 rounded-bl-md"
                  }`}
                >
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <span className={msg.role === "user" ? "text-white" : themeColor}>
                      {msg.role === "user" ? "Operator" : agentName}
                    </span>
                    <span>{new Date(msg.createdAt).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="prose prose-invert prose-lg max-w-none prose-p:leading-loose prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/10 prose-headings:font-black">
                    <p className="whitespace-pre-wrap font-medium">{msg.content.replace(/\[SYSTEM:.*?\]\s*/g, '')}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] rounded-bl-md p-6 text-base font-bold text-zinc-400 flex items-center gap-4 shadow-xl">
                  <div className="flex gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${themeColor.replace('text-', 'bg-')}`} style={{ animationDelay: "0ms" }}></span>
                    <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${themeColor.replace('text-', 'bg-')}`} style={{ animationDelay: "150ms" }}></span>
                    <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${themeColor.replace('text-', 'bg-')}`} style={{ animationDelay: "300ms" }}></span>
                  </div>
                  {agentName} is aan het nadenken...
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 backdrop-blur-md rounded-3xl p-6 text-base flex items-start gap-4 text-red-500 shadow-xl mx-auto w-full">
                <AlertCircle className="w-8 h-8 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black uppercase tracking-widest block mb-2">Systeem Foutmelding</span>
                  <p className="text-red-500/90 leading-relaxed font-medium">{error}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

      </div>

      {/* Chat Input (Floating at bottom) */}
      <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[800px] z-20">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-[2rem] p-2 flex gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder={`Geef commando's aan ${agentName}...`}
            disabled={loading}
            className="flex-1 bg-transparent px-6 py-4 text-lg font-medium focus:outline-none placeholder:text-zinc-600 transition-all text-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue?.trim()}
            className="bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-full font-black uppercase tracking-widest px-8 flex items-center gap-3 transition-all"
          >
            Verstuur
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
