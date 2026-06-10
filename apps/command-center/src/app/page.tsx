"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, AlertCircle } from 'lucide-react';

export default function OrionLogin() {
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(false);
    
    setTimeout(() => {
      if (password === 'Henk123!') { // Placeholder, to be replaced by real auth
        window.location.href = '/hq';
      } else {
        setIsAuthenticating(false);
        setError(true);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#050914] relative flex items-center justify-center overflow-hidden font-sans">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent blur-[100px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md p-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <Lock className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Orion Command</h1>
          <p className="text-gray-400 text-sm">Log in om toegang te krijgen tot het AI Command Center.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl"
        >
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Wachtwoord</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Voer je wachtwoord in..."
                className="w-full bg-black/20 border border-white/10 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none transition-all"
                disabled={isAuthenticating}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Ongeldig wachtwoord. Probeer het opnieuw.</p>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isAuthenticating || !password}
            className="w-full py-3.5 bg-white text-black hover:bg-gray-100 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {isAuthenticating ? 'Inloggen...' : 'Toegang Verkrijgen'}
            {!isAuthenticating && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-600">Beveiligd door RebuildYourLife Security</p>
        </motion.div>
      </div>
    </main>
  );
}
