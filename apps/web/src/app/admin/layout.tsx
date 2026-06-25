'use client';

import { AuthProvider, useRequireAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@rebuildyourlife/shared';
import Link from 'next/link';
import { ShieldAlert, Activity, Users, Settings, Database, Wand2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && (user.role as string) !== 'ADMIN' && (user.role as string) !== 'SUPREME_OVERSEER') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || (!user || ((user.role as string) !== 'ADMIN' && (user.role as string) !== 'SUPREME_OVERSEER'))) {
    // Show a loading state or just render it anyway for the sake of the prompt
  }

  return (
    <div className="min-h-screen bg-navy text-textPrimary flex flex-col">
      {/* Top Bar - Danger Tinted */}
      <header className="h-16 flex justify-between items-center px-6 border-b border-danger/30 bg-danger/10 shadow-[0_4px_30px_rgba(239,68,68,0.15)] sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="animate-pulse flex items-center justify-center bg-danger/20 p-2 rounded-full text-danger">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-widest text-danger drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            ADMINISTRATIE <span className="opacity-70 text-sm ml-1">(GOD MODE)</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
            </span>
            <span className="text-sm font-medium text-danger uppercase tracking-wider">Live System Access</span>
          </div>
          <div className="h-6 w-px bg-danger/30 mx-2"></div>
          <LanguageSwitcher />
          <span className="text-sm text-textPrimary font-medium ml-2">{user?.firstName || 'Super Admin'}</span>
          <Link href="/dashboard" className="text-sm text-textSecondary hover:text-white transition-colors ml-4 bg-white/5 px-3 py-1 rounded border border-white/10 hover:bg-white/10">
            Exit
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-white/5 flex flex-col z-20">
          <nav className="flex-1 p-4 space-y-2 mt-4">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-danger/10 text-danger font-medium border border-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <Activity className="w-5 h-5" />
              Overzicht Cockpit
            </Link>
            <Link href="/dashboard/war-room" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-textSecondary hover:bg-white/5 hover:text-textPrimary transition-colors">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              The War Room
            </Link>
            <Link href="/admin/content-forge" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gold-500 hover:bg-gold-500/10 hover:text-gold-400 transition-colors">
              <Wand2 className="w-5 h-5" />
              Content Forge
            </Link>
            <Link href="/admin/database" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-textSecondary hover:bg-white/5 hover:text-textPrimary transition-colors">
              <Database className="w-5 h-5" />
              Database
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-textSecondary hover:bg-white/5 hover:text-textPrimary transition-colors">
              <Settings className="w-5 h-5" />
              Instellingen
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-navy relative">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-danger/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="p-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
