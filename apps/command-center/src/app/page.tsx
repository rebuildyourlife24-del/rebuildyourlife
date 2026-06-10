"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldAlert, Fingerprint } from 'lucide-react';

export default function VaultLogin() {
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(false);
    
    // Simulate complex biometric/neural authentication
    setTimeout(() => {
      if (password === 'Henk123!') { // Placeholder, to be replaced by real auth
        window.location.href = '/hq';
      } else {
        setIsAuthenticating(false);
        setError(true);
      }
    }, 2000);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Deep Space Background handled in globals.css .stars */}
      <div className="stars"></div>
      
      {/* Central Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md p-8 relative flex flex-col items-center">
        
        {/* Abstract Digital Face / AI Core */}
        <motion.div 
          className="relative w-48 h-48 mb-12 flex items-center justify-center"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Outer glowing rings representing the mind */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-cyan-400/30 border-t-cyan-400 glow-blue"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 rounded-full border border-purple-500/30 border-b-purple-500 glow-purple"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner core - Abstract transparent face shape */}
          <div className="absolute inset-8 rounded-[40%] bg-gradient-to-b from-cyan-500/20 to-purple-600/20 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Cpu className="w-12 h-12 text-cyan-300 opacity-80" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-light tracking-[0.3em] text-white/90 mb-2">VAULT ACCESS</h1>
          <p className="text-cyan-400/60 text-sm font-mono tracking-widest">HENK SEMLER COMMAND CENTER</p>
        </motion.div>

        {/* Login Form */}
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="w-full glass-panel rounded-2xl p-6 relative overflow-hidden group"
        >
          {/* Scanning line animation */}
          {isAuthenticating && (
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-cyan-400 glow-blue z-20 opacity-50"
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          <div className="mb-6 relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER DECRYPTION KEY"
              className="w-full bg-transparent border-b border-white/10 focus:border-cyan-400 py-3 text-center text-white font-mono tracking-widest outline-none transition-colors placeholder:text-white/20"
              disabled={isAuthenticating}
            />
            <Fingerprint className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating || !password}
            className="w-full py-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/40 hover:to-purple-600/40 border border-white/10 rounded-lg text-white font-mono tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAuthenticating ? 'AUTHENTICATING...' : 'INITIATE OVERRIDE'}
          </button>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs font-mono mt-4 text-center flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" /> ACCESS DENIED. INTRUDER LOGGED.
            </motion.p>
          )}
        </motion.form>
      </div>
    </main>
  );
}
