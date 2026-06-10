"use client";

import { useState } from 'react';
import { Settings, Globe, Code, ChevronDown, Bell, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="absolute top-0 w-full h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-cyan-400 glow-blue" />
        <span className="font-mono text-sm tracking-[0.2em] text-cyan-400">KLUIS: BEVEILIGD</span>
      </div>
      
      <div className="flex items-center gap-6 text-sm font-mono tracking-widest text-white/50">
        <span className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> 
          SYSTEEM STABIEL
        </span>
        <span className="hidden md:block">CEO: HENK SEMLER</span>

        <div className="relative flex items-center gap-4">
          <Link href="/ceo" className="text-xs font-bold text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors flex items-center gap-2">
            CEO DASHBOARD
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <Settings className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-64 glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="p-4 border-b border-white/5">
                  <h4 className="text-xs text-white/40 mb-3">INSTELLINGEN</h4>
                  
                  <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/5 text-left transition-colors">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-sm text-white/80">Taal & Stem</div>
                      <div className="text-[10px] text-white/40">ElevenLabs (Denzel W.) • NL</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/5 text-left transition-colors mt-1">
                    <Code className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-sm text-white/80">Plugins Beheer</div>
                      <div className="text-[10px] text-white/40">3 Actief • 1 Update</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/5 text-left transition-colors mt-1">
                    <Bell className="w-4 h-4 text-pink-400" />
                    <div>
                      <div className="text-sm text-white/80">Notificaties</div>
                      <div className="text-[10px] text-white/40">Alle meldingen aan</div>
                    </div>
                  </button>
                </div>
                
                <div className="h-px w-full bg-white/5 my-1" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium text-left">Systeem Verlaten</div>
                    <div className="text-xs text-red-400/50 text-left">Verbreek de verbinding met Orion</div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
