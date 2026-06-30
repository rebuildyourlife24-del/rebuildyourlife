"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, ShieldAlert, Sparkles, Plus, MessageSquare, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  getConversationsAction, 
  getConversationMessagesAction, 
  sendAIMessageAction 
} from "@/app/actions/aiChat";
import { useRequireAuth } from "@/lib/auth";

interface AgentChatInterfaceProps {
  agentId: "HERMES" | "ORION"; // We reuse the existing backend agents for now, just renaming them in UI
  agentName: string;
  agentRole: string;
  agentDescription: string;
  icon: React.ReactNode;
  suggestedPrompts: { label: string; text: string }[];
  themeColor: string; // Tailwind color class like "text-blue-500" or "text-emerald-500"
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

  // Extract color name for border/bg logic (e.g. "cyan" from "text-cyan-500")
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
      // Append a system instruction to act like the specific role
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

  return (
    <div className="max-w-7xl mx-auto h-[85vh] bg-zinc-950/50 border border-white/5 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden font-sans text-white backdrop-blur-xl relative">
      
      {/* Background glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-${colorBase}-900/5 hidden blur-3xl rounded-full pointer-events-none`}></div>

      {/* LEFT SIDEBAR: CONVERSATIONS */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col justify-between shrink-0 h-1/3 md:h-full z-10">
        
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="flex items-center gap-4 mb-4">
             <div className={`p-3 rounded-xl bg-black border border-white/10 ${themeColor}`}>
               {icon}
             </div>
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest">{agentName}</h2>
                <p className="text-[10px] text-zinc-500">{agentRole}</p>
             </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleStartNewConversation}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <Plus className={`w-4 h-4 ${themeColor}`} />
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
                        ? `bg-zinc-900 border-zinc-700 text-white` 
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

      </div>

      {/* RIGHT: ACTIVE CHAT SCREEN */}
      <div className="flex-1 flex flex-col justify-between h-2/3 md:h-full z-10 relative">
        
        {/* Chat Header */}
        <div className="bg-black/20 p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                {agentName} <span className="text-zinc-500 font-medium tracking-normal">Direct Link</span>
              </h2>
              <span className="text-[10px] text-zinc-500 block font-medium mt-1">
                {agentDescription}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] bg-${colorBase}-950/30 border border-${colorBase}-500/30 px-3 py-1 rounded-full font-bold uppercase ${themeColor} tracking-wider`}>
              Status: Actief
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
              <div className={`mb-6 p-4 rounded-2xl bg-black border border-white/10 ${themeColor}`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Connectie Geactiveerd</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Je bent direct verbonden met de {agentRole}. Geef een commando of kies een snelle actie.
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
                    ? `bg-zinc-900 border border-zinc-700 text-white` 
                    : "bg-black/50 border border-white/5 text-zinc-300"
                }`}
              >
                <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span className={msg.role === "user" ? themeColor : "text-white"}>
                    {msg.role === "user" ? "Operator" : agentName}
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString("nl-NL", {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content.replace(/\[SYSTEM:.*?\]\s*/g, '')}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 text-xs font-bold text-zinc-500 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce bg-${colorBase}-500`} style={{ animationDelay: "0ms" }}></span>
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce bg-${colorBase}-500`} style={{ animationDelay: "150ms" }}></span>
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce bg-${colorBase}-500`} style={{ animationDelay: "300ms" }}></span>
                </div>
                {agentName} analyseert...
              </div>
            </div>
          )}

          {error && (
            <div className="border border-red-500/30 bg-red-500/10 rounded-xl p-4 text-xs flex items-start gap-3 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-widest block mb-1">Systeem Foutmelding</span>
                <p className="text-red-500/80">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Strategy Prompts panel */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex flex-wrap gap-3">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt.text)}
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-2"
            >
              <Sparkles className={`w-3.5 h-3.5 ${themeColor}`} />
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
            placeholder={`Commando voor ${agentName}...`}
            disabled={loading}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-white/20 placeholder:text-zinc-600 transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue?.trim()}
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
