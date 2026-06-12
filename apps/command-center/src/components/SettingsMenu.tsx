"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, X, Globe, Database, CreditCard, Mail, Brain,
  Shield, Zap, BarChart2, MessageCircle, Code, Key,
  ExternalLink, CheckCircle, AlertCircle, ChevronRight,
  LogOut, User, Moon, Bell, RefreshCw, Lock, Cpu
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'not_connected' | 'error';
  url: string;
  category: string;
}

const INTEGRATIONS: Integration[] = [
  // AI & Brains
  { id: 'google_ai', name: 'Google Gemini AI', description: 'GOOGLE_GENERATIVE_AI_API_KEY — Orion\'s hersenen', icon: <Brain className="w-5 h-5" />, status: 'connected', url: 'https://aistudio.google.com/apikey', category: 'AI' },
  { id: 'elevenlabs', name: 'ElevenLabs Stem', description: 'ELEVENLABS_API_KEY — Orion\'s stem', icon: <MessageCircle className="w-5 h-5" />, status: 'not_connected', url: 'https://elevenlabs.io', category: 'AI' },
  { id: 'openai', name: 'OpenAI GPT', description: 'OPENAI_API_KEY — Backup AI model', icon: <Cpu className="w-5 h-5" />, status: 'not_connected', url: 'https://platform.openai.com/api-keys', category: 'AI' },

  // Betalingen
  { id: 'mollie', name: 'Mollie Betalingen', description: 'MOLLIE_API_KEY — Nederlandse betaalverwerker', icon: <CreditCard className="w-5 h-5" />, status: 'not_connected', url: 'https://mollie.com/dashboard', category: 'Betalingen' },
  { id: 'stripe', name: 'Stripe (Backup)', description: 'STRIPE_SECRET_KEY — Internationale betalingen', icon: <CreditCard className="w-5 h-5" />, status: 'not_connected', url: 'https://dashboard.stripe.com/apikeys', category: 'Betalingen' },

  // Database & Cloud
  { id: 'supabase', name: 'Supabase Database', description: 'DATABASE_URL — PostgreSQL cloud database', icon: <Database className="w-5 h-5" />, status: 'connected', url: 'https://supabase.com/dashboard', category: 'Cloud' },
  { id: 'vercel', name: 'Vercel Deployment', description: 'VERCEL_TOKEN — Automatisch deployen', icon: <Globe className="w-5 h-5" />, status: 'connected', url: 'https://vercel.com/dashboard', category: 'Cloud' },

  // Communicatie
  { id: 'resend', name: 'Resend Email', description: 'RESEND_API_KEY — Transactie e-mails', icon: <Mail className="w-5 h-5" />, status: 'not_connected', url: 'https://resend.com/api-keys', category: 'Communicatie' },
  { id: 'twilio', name: 'WhatsApp (Twilio)', description: 'TWILIO_ACCOUNT_SID — WhatsApp Business', icon: <MessageCircle className="w-5 h-5" />, status: 'not_connected', url: 'https://console.twilio.com', category: 'Communicatie' },

  // Analytics & SEO
  { id: 'google_analytics', name: 'Google Analytics', description: 'GA4 Tracking — Websitebezoeker data', icon: <BarChart2 className="w-5 h-5" />, status: 'not_connected', url: 'https://analytics.google.com', category: 'Analytics' },
  { id: 'google_search', name: 'Google Search Console', description: 'GSC API — SEO prestaties', icon: <Globe className="w-5 h-5" />, status: 'not_connected', url: 'https://search.google.com/search-console', category: 'Analytics' },
  { id: 'semrush', name: 'SEMrush', description: 'SEMRUSH_API_KEY — Keyword research', icon: <Zap className="w-5 h-5" />, status: 'not_connected', url: 'https://semrush.com', category: 'Analytics' },

  // Beveiliging
  { id: 'jwt', name: 'JWT Secret', description: 'JWT_SECRET — Sessie beveiliging', icon: <Lock className="w-5 h-5" />, status: 'connected', url: 'https://jwt.io', category: 'Beveiliging' },
  { id: 'github', name: 'GitHub Repository', description: 'GitHub Actions CI/CD pipeline', icon: <Code className="w-5 h-5" />, status: 'connected', url: 'https://github.com/rebuildyourlife24-del', category: 'Cloud' },
];

const CATEGORIES = ['AI', 'Betalingen', 'Cloud', 'Communicatie', 'Analytics', 'Beveiliging'];

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('AI');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    document.cookie = 'cc_session=; Max-Age=0; path=/';
    document.cookie = 'ryl_session=; Max-Age=0; path=/';
    window.location.href = '/login';
  };

  const filteredIntegrations = INTEGRATIONS.filter(i => i.category === activeCategory);
  const connectedCount = INTEGRATIONS.filter(i => i.status === 'connected').length;

  return (
    <>
      {/* Settings Knop */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-white/60 hover:text-white hover:border-cyan-500/40 hover:bg-black/80 transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          INSTELLINGEN
          <span className="ml-1 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[9px]">
            {connectedCount}/{INTEGRATIONS.length}
          </span>
        </button>

        {/* Snelle navigatie links */}
        <div className="hidden lg:flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/[0.06] rounded-full px-3 py-1.5">
          {[
            { label: 'WAR ROOM', href: '/hq' },
            { label: 'CEO DASH', href: '/ceo' },
            { label: 'SEO', href: '/seo' },
          ].map(link => (
            <a key={link.href} href={link.href}
              className="text-[10px] font-mono font-bold tracking-widest text-white/40 hover:text-cyan-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-4 bg-white/10" />
          <a href="https://rebuildyourlife.eu" target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-mono font-bold tracking-widest text-white/40 hover:text-gold-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            KLANTEN SITE
          </a>
          <a href="https://enterprise.ai-henksemler.nl" target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-mono font-bold tracking-widest text-white/40 hover:text-purple-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            ENTERPRISE OS
          </a>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#080c14] border-l border-white/[0.06] z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Systeem Instellingen</h2>
                  <p className="text-xs text-white/40 font-mono mt-0.5">ORION SUPREME OVERSEER — v2.0</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profiel */}
              <div className="p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    HS
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">Hendrik Semler</p>
                    <p className="text-xs text-cyan-400 font-mono">SUPREME OVERSEER • CLEARANCE LEVEL 5</p>
                    <p className="text-xs text-white/30 mt-0.5">hendriksemler@rebuildyourlife.eu</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400 font-mono">LIVE</span>
                  </div>
                </div>
              </div>

              {/* Snelle acties */}
              <div className="p-4 border-b border-white/[0.06] grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center gap-2 p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.05] transition-colors">
                  <Bell className="w-4 h-4 text-white/50" />
                  <span className="text-[10px] text-white/40">Notificaties</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.05] transition-colors">
                  <Moon className="w-4 h-4 text-white/50" />
                  <span className="text-[10px] text-white/40">Dark Mode</span>
                </button>
                <button
                  onClick={async () => {
                    await fetch('/api/analytics', { method: 'DELETE' });
                    alert('Cache geleegd');
                  }}
                  className="flex flex-col items-center gap-2 p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.05] transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white/50" />
                  <span className="text-[10px] text-white/40">Cache legen</span>
                </button>
              </div>

              {/* Categorieën */}
              <div className="px-4 pt-4 pb-2 flex gap-1.5 overflow-x-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-wide whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/[0.03] text-white/40 border border-white/[0.05] hover:text-white/60'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Integraties lijst */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {filteredIntegrations.map(integration => (
                  <div key={integration.id} className="flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl transition-colors group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      integration.status === 'connected' ? 'bg-cyan-500/15 text-cyan-400' :
                      integration.status === 'error' ? 'bg-red-500/15 text-red-400' :
                      'bg-white/[0.05] text-white/30'
                    }`}>
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{integration.name}</p>
                        {integration.status === 'connected' && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        )}
                        {integration.status === 'not_connected' && (
                          <AlertCircle className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-white/30 font-mono truncate">{integration.description}</p>
                    </div>
                    <a
                      href={integration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4 text-white/40" />
                    </a>
                  </div>
                ))}

                {/* Vercel env vars instructie */}
                <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5" />
                    VERCEL ENVIRONMENT VARIABLES
                  </h4>
                  <div className="space-y-1 font-mono text-[11px] text-white/40">
                    {[
                      'GOOGLE_GENERATIVE_AI_API_KEY',
                      'ELEVENLABS_API_KEY',
                      'MOLLIE_API_KEY',
                      'RESEND_API_KEY',
                      'NEXT_PUBLIC_APP_URL=https://rebuildyourlife.eu',
                      'JWT_SECRET',
                      'DATABASE_URL',
                      'DIRECT_URL',
                    ].map(v => (
                      <div key={v} className="flex items-center justify-between">
                        <span className="text-white/50">{v}</span>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/[0.06]">
                {showLogoutConfirm ? (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-white/60 flex-1">Sessie beëindigen?</p>
                    <button onClick={() => setShowLogoutConfirm(false)} className="px-3 py-2 text-xs text-white/40 hover:text-white">Annuleer</button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/30">
                      UITLOGGEN
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-white/30 hover:text-red-400 hover:bg-red-500/5 rounded-xl border border-white/[0.05] hover:border-red-500/20 transition-all text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sessie Beëindigen
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
