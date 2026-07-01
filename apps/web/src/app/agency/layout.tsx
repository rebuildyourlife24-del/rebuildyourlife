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
          <div>
            <a href="https://rebuildyourlife.eu/dashboard" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm text-white/80 transition-colors">
              Naar RebuildYourLife (SaaS)
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
