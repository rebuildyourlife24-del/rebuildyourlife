import React from 'react';
import { AuthProvider } from '@/lib/auth';

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050B14] text-white">
        {/* Agency Navigation Bar */}
        <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              AI-HENKSEMLER
            </div>
            <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 uppercase tracking-widest">
              Agency Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://rebuildyourlife.eu/dashboard" 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 hover:bg-emerald-900/40 rounded-lg text-sm text-emerald-400 font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>Main SaaS Platform</span>
            </a>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
