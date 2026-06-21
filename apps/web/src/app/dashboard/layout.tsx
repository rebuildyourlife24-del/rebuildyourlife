'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useRequireAuth } from '@/lib/auth';
import { 
  Shield, 
  Layers, 
  Heart, 
  Settings, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard,
  Network,
  Activity,
  Map,
  Ghost,
  Rocket,
  Skull,
  BookOpen
} from 'lucide-react';

const getNavItems = (user: any) => {
  const isAdmin = user?.role === 'ADMIN' || user?.email === 'hsemler50@gmail.com';
  
  const coreItems = [
    {
      labelKey: 'nav.dashboard',
      defaultLabel: 'Overzicht',
      href: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.budget',
      defaultLabel: 'Begroting',
      href: '/dashboard/budget',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.debts',
      defaultLabel: 'Schulden',
      href: '/dashboard/debts',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.tasks',
      defaultLabel: 'Taken',
      href: '/dashboard/tasks',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      defaultLabel: 'Levensbalans',
      href: '/dashboard/life-balance',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.9 4.9 14.2 14.2"/><path d="m4.9 19.1 14.2-14.2"/></svg>
    },
    {
      labelKey: 'nav.health',
      defaultLabel: 'Welzijn & Vitaliteit',
      href: '/dashboard/health',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.aiTeam',
      defaultLabel: 'AI Coaches',
      href: '/dashboard/ai-team',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" /><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4Z" /></svg>
    },
    {
      labelKey: 'nav.settings',
      defaultLabel: 'Instellingen',
      href: '/dashboard/settings',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>,
    },
  ];

  const adminItems = isAdmin ? [
    { type: 'divider', label: 'God Modus (Bestuur)' },
    {
      defaultLabel: 'Commando Centrum',
      href: '/dashboard/war-room',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h4l2-9 5 18 3-10h6" />
        </svg>
      ),
      isRed: true,
    },
    {
      defaultLabel: 'Syndicate',
      href: '/dashboard/syndicate',
      icon: <Ghost size={20} />,
      isRed: true,
    },
    {
      defaultLabel: 'Stellar Ascension',
      href: '/dashboard/stellar',
      icon: <Rocket size={20} />,
      isRed: true,
    },
    {
      defaultLabel: 'Bedrijfsnetwerk (Divisies)',
      href: '/dashboard/enterprise',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      ),
      isRed: true,
    },
    {
      defaultLabel: '🏭 Franchise Factory',
      href: '/dashboard/franchises',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10v12h16V10M2 10l10-5 10 5M12 15v7M8 15v7M16 15v7" />
        </svg>
      ),
      isRed: true,
    },
    {
      defaultLabel: '💎 Franchise Netwerk',
      href: '/dashboard/wealth',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    },
  ] : [];

  return [...coreItems, ...adminItems];
};


import { NotificationDropdown, AppNotification } from '@/components/ui/NotificationDropdown';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { OrionNeuralLink } from '@/components/OrionNeuralLink';
import { getNotificationsAction, markNotificationReadAction, markAllNotificationsReadAction } from '@/app/actions/dashboard';


function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // Poll every 30s
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const result = await getNotificationsAction();
      if (result.success) {
        setNotifications((result.notifications as any) || []);
        setUnreadCount(result.unreadCount || 0);
      }
    } catch (err) {
      // Notificaties zijn niet kritiek — stil falen
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationReadAction(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadAction();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationDropdown
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllRead}
    />
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useRequireAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  
  const isAdmin = user?.role === 'ADMIN' || user?.email === 'hsemler50@gmail.com';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 rounded-full border-2 border-gold/20 border-t-gold"
          />
          <p className="text-sm text-textSecondary">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-navy-light
          transition-transform duration-300 ease-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-textPrimary">
              Rebuild<span className="gradient-text-gold">YourLife</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-textSecondary transition-colors hover:bg-white/5 hover:text-textPrimary lg:hidden"
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Supreme Overseer Tactical Biometric Header (Militaristic/Alien) */}
        <div className="p-4 border-b border-white/[0.06] bg-black/40 relative overflow-hidden group">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(212,168,83,0.05)_3px,rgba(212,168,83,0.05)_3px)] pointer-events-none group-hover:bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(239,68,68,0.1)_3px,rgba(239,68,68,0.1)_3px)] transition-all"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              {/* Tactical hexagon container */}
              <div className="w-10 h-10 border border-gold/50 flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,168,83,0.2)] group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
                <Activity className="w-5 h-5 text-gold group-hover:text-red-500 transition-colors" />
              </div>
              {/* Tactical Crosshair overlay */}
              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-gold group-hover:border-red-500 transition-colors"></div>
              <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-gold group-hover:border-red-500 transition-colors"></div>
            </div>
            
            <div className="flex-1">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gold/70 group-hover:text-red-500/70 transition-colors">Supreme Overseer</div>
              <div className="text-white font-black tracking-widest uppercase text-xs truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Godbrain Alpha'}
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-[8px] font-mono tracking-widest text-gold bg-black/60 px-2 py-1 uppercase border border-gold/20 flex justify-between items-center group-hover:text-red-500 group-hover:border-red-500/30 transition-colors">
            <span>Biometric: SECURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse group-hover:bg-red-500 transition-colors"></span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {getNavItems(user).map((item: any, index: number) => {
              if (item.type === 'divider') {
                return (
                  <li key={`divider-${index}`} className="pt-4 pb-2 px-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-danger/80">
                      {item.label}
                    </div>
                  </li>
                );
              }

              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname?.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group relative flex items-center gap-4 rounded-xl px-4 py-3 text-base font-semibold
                      transition-all duration-200
                      ${
                        isActive
                          ? (item.isRed ? 'bg-danger/10 text-danger' : 'bg-gold/10 text-gold')
                          : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute left-0 top-1/2 h-6 w-[4px] -translate-y-1/2 rounded-r-full ${item.isRed ? 'bg-danger' : 'bg-gold'}`}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className={isActive ? (item.isRed ? 'text-danger' : 'text-gold') : 'text-zinc-400 group-hover:text-white'}>
                      {item.icon}
                    </span>
                    {item.defaultLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-light text-sm font-semibold text-textPrimary">
              {user?.firstName?.[0] || 'U'}
              {user?.lastName?.[0] || ''}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-textPrimary">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="truncate text-xs text-textSecondary">{user?.email || ''}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-textSecondary transition-colors hover:bg-white/5 hover:text-danger"
              aria-label="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-navy/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-textSecondary transition-colors hover:bg-white/5 hover:text-textPrimary lg:hidden"
              aria-label="Open sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            {/* Massive Hardware Kiosk Toggle (4D God Mode Switch) */}
            {isAdmin && (
              <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 flex-col gap-2 top-2">
                {/* UP: The Flip Over (Administration) */}
                <Link
                  href="/dashboard/administration"
                  className={`px-4 py-1.5 rounded-t-xl font-black tracking-widest text-[9px] uppercase transition-all flex items-center justify-center gap-2 w-full border-b-0 ${pathname === '/dashboard/administration' ? 'bg-white text-black border border-white shadow-[0_-5px_20px_rgba(255,255,255,0.4)]' : 'bg-black/60 text-zinc-500 hover:text-white hover:bg-white/10 border border-white/10'}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  Flip-Over (Admin)
                </Link>

                <div className="flex items-center gap-4 bg-black/60 p-2 rounded-b-xl border border-white/10 backdrop-blur-md shadow-2xl">
                  {/* Blue Side */}
                  <Link 
                    href="/dashboard/operations"
                    className={`px-6 py-2 rounded-lg font-black tracking-widest text-[10px] uppercase transition-all flex items-center gap-2 ${pathname === '/dashboard/operations' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-zinc-500 hover:text-cyan-400 border border-transparent'}`}
                  >
                    <Activity className="w-4 h-4" /> Operations
                  </Link>
                  
                  {/* The Physical Switch */}
                  <div className="relative w-16 h-8 bg-zinc-900 rounded-full border border-white/20 shadow-inner flex items-center px-1">
                    <div className={`w-6 h-6 rounded-full transition-all duration-300 shadow-md ${pathname === '/dashboard/war-room' ? 'translate-x-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : pathname === '/dashboard/operations' ? 'translate-x-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : pathname === '/dashboard/administration' ? 'translate-x-4 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'translate-x-4 bg-zinc-500'}`}></div>
                  </div>

                  {/* Red Side */}
                  <Link 
                    href="/dashboard/war-room"
                    className={`px-6 py-2 rounded-lg font-black tracking-widest text-[10px] uppercase transition-all flex items-center gap-2 ${pathname === '/dashboard/war-room' ? 'bg-red-900/50 text-red-500 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-zinc-500 hover:text-red-500 border border-transparent'}`}
                  >
                    <Skull className="w-4 h-4" /> War Room
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            
            {/* API Pulse Widget (Liquid Glass) */}
            <div className="hidden md:flex items-center gap-2 bg-black/40 border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] group cursor-default">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="flex flex-col">
                <span className="text-[7px] text-cyan-400 uppercase font-black tracking-widest leading-none">API Pulse</span>
                <span className="text-[9px] text-white font-mono leading-none mt-0.5 group-hover:text-cyan-300 transition-colors">12ms (Optimal)</span>
              </div>
            </div>

            <div className="w-px h-6 bg-white/10 mx-1"></div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <NotificationBell />

            {/* User Avatar */}
            <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-sm font-semibold text-navy">
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <OrionNeuralLink />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
