'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { AgentType, AGENT_DEFINITIONS } from '@rebuildyourlife/shared';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  agentType: AgentType;
  title: string;
  isActive: boolean;
  messages?: Message[];
}

export default function AITeamPage() {
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for incoming prompts from other pages (like Life Balance)
    const initialPrompt = sessionStorage.getItem('ai_initial_prompt');
    const targetAgent = sessionStorage.getItem('ai_target_agent') as AgentType | null;

    if (initialPrompt && targetAgent) {
      sessionStorage.removeItem('ai_initial_prompt');
      sessionStorage.removeItem('ai_target_agent');
      
      setActiveAgent(targetAgent);
      setInput(initialPrompt);
    }
  }, []);

  const handleAgentSelect = async (type: AgentType) => {
    setActiveAgent(type);
    setMessages([]);
    setConversation(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeAgent || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await api.post<{ conversationId: string; message: Message }>('/ai/chat', {
        message: currentInput,
        agentType: activeAgent,
        conversationId: conversation?.id,
      });

      if (!conversation) {
        setConversation({ id: res.data.conversationId, agentType: activeAgent, title: 'Chat', isActive: true });
      }
      setMessages((prev) => [...prev, res.data.message]);
    } catch (error) {
      console.error('Failed to send message', error);
      // rollback or show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col lg:flex-row gap-6">
      {/* Agent Selection Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">AI Coworkers</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Kies een specialist om mee te werken.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {AGENT_DEFINITIONS.map((agent) => (
            <motion.button
              key={agent.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAgentSelect(agent.type)}
              className={`w-full text-left rounded-xl p-4 transition-all duration-200 border
                ${
                  activeAgent === agent.type
                    ? 'bg-gold/10 border-gold/50 shadow-glow-sm'
                    : 'bg-surface/50 border-white/5 hover:bg-surface hover:border-white/10'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light text-xl">
                  {agent.avatarEmoji}
                </div>
                <div>
                  <h3 className={`font-semibold ${activeAgent === agent.type ? 'text-gold' : 'text-textPrimary'}`}>
                    {agent.name}
                  </h3>
                  <p className="text-xs text-textSecondary">{agent.role}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-w-0">
        <Card variant="glass" className="flex h-full flex-col overflow-hidden">
          {activeAgent ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-4 border-b border-white/10 p-4 bg-surface/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold text-xl shadow-glow-sm">
                  {AGENT_DEFINITIONS.find((a) => a.type === activeAgent)?.avatarEmoji}
                </div>
                <div>
                  <h2 className="font-semibold text-textPrimary">
                    {AGENT_DEFINITIONS.find((a) => a.type === activeAgent)?.name}
                  </h2>
                  <p className="text-xs text-textSecondary">
                    {AGENT_DEFINITIONS.find((a) => a.type === activeAgent)?.role}
                  </p>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <div className="text-4xl mb-4 opacity-50">
                        {AGENT_DEFINITIONS.find((a) => a.type === activeAgent)?.avatarEmoji}
                      </div>
                      <h3 className="text-lg font-medium text-textPrimary">Start een gesprek</h3>
                      <p className="text-sm text-textSecondary max-w-sm mt-2">
                        Stel een vraag of geef een opdracht aan {AGENT_DEFINITIONS.find((a) => a.type === activeAgent)?.name}.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          msg.role === 'user'
                            ? 'bg-gold text-navy rounded-br-sm'
                            : 'bg-surface-light text-textPrimary border border-white/5 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface-light text-textPrimary border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        <motion.div
                          className="h-2 w-2 rounded-full bg-textSecondary"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-textSecondary"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-textSecondary"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-white/10 p-4 bg-surface/50">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Typ je bericht..."
                      disabled={loading}
                      fullWidth
                    />
                  </div>
                  <Button type="submit" disabled={!input.trim() || loading} loading={loading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-center p-8">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-light mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-textSecondary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
                    <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-textPrimary">Welkom in de AI Team Hub</h2>
                <p className="text-sm text-textSecondary mt-2 max-w-md mx-auto">
                  Selecteer een AI Coworker in het linkermenu om een gesprek te starten. Elke coworker heeft zijn eigen specialiteit om je te helpen met je doelen en herstel.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
