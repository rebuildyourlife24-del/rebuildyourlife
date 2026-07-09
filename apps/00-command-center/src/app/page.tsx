"use client";

import { useState } from 'react';

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
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex items-center justify-center font-sans text-white">
      <div className="w-full max-w-sm px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light tracking-wide mb-2">Orion Command</h1>
          <p className="text-[#8892a4] text-xs uppercase tracking-widest">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wachtwoord"
              className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] pb-2 text-center text-white placeholder:text-white/30 outline-none transition-colors"
              disabled={isAuthenticating}
            />
          </div>

          {error && (
            <div className="text-center text-red-400 text-xs">
              Toegang geweigerd.
            </div>
          )}

          <button 
            type="submit"
            disabled={isAuthenticating || !password}
            className="w-full py-3 bg-white text-[#0a0e1a] rounded-sm font-medium text-sm transition-all disabled:opacity-50 hover:bg-[#d4a853] hover:text-[#0a0e1a]"
          >
            {isAuthenticating ? 'Autoriseren...' : 'Inloggen'}
          </button>
        </form>
        
      </div>
    </main>
  );
}
