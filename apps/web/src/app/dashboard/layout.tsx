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
  Terminal,
  Cpu,
  GraduationCap,
  Briefcase,
  Tv,
  ChevronDown,
  ChevronRight,
  Brain
} from 'lucide-react';

const getGroupedNavItems = (user: any) => {
  return [
    {
      id: 'sovereign',
      label: 'Sovereign Core',
      items: [
        {
          label: 'The Core (Centrale)',
          href: '/dashboard',
          icon: <Terminal size={16} />,
        },
        {
          label: 'War Room (Cockpit)',
          href: '/dashboard/war-room',
          icon: <Skull size={16} />,
          isAdminOnly: true,
        },
        {
          label: 'AI Assistant (Hermes/Orion)',
          href: '/dashboard/ai-assistant',
          icon: <Brain size={16} />,
        },
        {
          label: 'AI Taskforce',
          href: '/dashboard/ai-team',
          icon: <Network size={16} />,
        },
        {
          label: 'AI Concierge Logs',
          href: '/dashboard/concierge',
          icon: <Cpu size={16} />,
        },
        {
          label: 'Orion Neural Link',
          href: '/dashboard/orion-demo',
          icon: <Layers size={16} />,
        }
      ]
    },
    {
      id: 'capital',
      label: 'Capital & Wealth',
      items: [
        {
          label: 'Capital Reconstruction',
          href: '/dashboard/wealth',
          icon: <Briefcase size={16} />,
        },
        {
          label: 'Alpha Trading Floor',
          href: '/dashboard/trading',
          icon: <Activity size={16} />,
          isAdminOnly: true,
        },
        {
          label: 'Budget Tracker',
          href: '/dashboard/budget',
          icon: <Layers size={16} />,
        },
        {
          label: 'Debts Control',
          href: '/dashboard/debts',
          icon: <Shield size={16} />,
        },
        {
          label: 'Land Assets',
          href: '/dashboard/land-assets',
          icon: <Map size={16} />,
        }
      ]
    },
    {
      id: 'syndicate',
      label: 'Syndicate & Traffic',
      items: [
        {
          label: 'PR Traffic Factory',
          href: '/dashboard/traffic',
          icon: <Tv size={16} />,
        },
        {
          label: 'Syndicate Feed',
          href: '/dashboard/syndicate',
          icon: <Ghost size={16} />,
          isAdminOnly: true,
        },
        {
          label: 'Enterprise Network',
          href: '/dashboard/enterprise',
          icon: <LayoutDashboard size={16} />,
          isAdminOnly: true,
        },
        {
          label: 'Franchise Factory',
          href: '/dashboard/franchises',
          icon: <Shield size={16} />,
          isAdminOnly: true,
        },
        {
          label: 'Social Integration',
          href: '/dashboard/social',
          icon: <Network size={16} />,
        },
        {
          label: 'Content Factory',
          href: '/dashboard/factory',
          icon: <Rocket size={16} />,
        },
        {
          label: 'App Factory (SaaS Flip)',
          href: '/dashboard/factory/apps',
          icon: <Cpu size={16} />,
        }
      ]
    },
    {
      id: 'vitality',
      label: 'Vitality & Mindset',
      items: [
        {
          label: 'Biological Optimisation',
          href: '/dashboard/health',
          icon: <Heart size={16} />,
        },
        {
          label: 'Cognitive Reprogramming',
          href: '/dashboard/life-balance',
          icon: <Map size={16} />,
        },
        {
          label: 'Rebuild Programs',
          href: '/dashboard/programs',
          icon: <Layers size={16} />,
        },
        {
          label: 'Personal Goals',
          href: '/dashboard/goals',
          icon: <Rocket size={16} />,
        },
        {
          label: 'Daily Tasks',
          href: '/dashboard/tasks',
          icon: <Activity size={16} />,
        }
      ]
    },
    {
      id: 'system',
      label: 'System & Support',
      items: [
        {
          label: 'RYL Academy',
          href: '/dashboard/academy',
          icon: <GraduationCap size={16} />,
        },
        {
          label: 'System Settings',
          href: '/dashboard/settings',
          icon: <Settings size={16} />,
        },
        {
          label: 'Quality Control',
          href: '/dashboard/qc',
          icon: <Shield size={16} />,
        },
        {
          label: 'Help & Support',
          href: '/dashboard/help',
          icon: <Settings size={16} />,
        }
      ]
    }
  ];
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
    } catch (err) {}
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

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sovereign: true,
    capital: true,
    syndicate: false,
    vitality: false,
    system: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isAdmin = user?.role === 'ADMIN' || user?.email === 'hsemler50@gmail.com';

  // THEME CONFIGURATION - THE MILLIONAIRE AESTHETIC
  // Admin gets Navy Matrix. User gets Platinum/Monochrome Brutalism (Quiet Luxury)
  const theme = {
    color: isAdmin ? 'text-blue-500' : 'text-zinc-100',
    hoverColor: isAdmin ? 'group-hover:text-blue-500' : 'group-hover:text-white',
    bgActive: isAdmin ? 'bg-blue-500/10' : 'bg-white/5',
    border: isAdmin ? 'border-blue-900/20' : 'border-white/[0.04]',
    borderStrong: isAdmin ? 'border-blue-900/50' : 'border-white/10',
    borderHover: isAdmin ? 'group-hover:border-blue-500' : 'group-hover:border-white/20',
    shadow: isAdmin ? 'shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'shadow-[0_0_15px_rgba(255,255,255,0.03)]',
    pulseBg: isAdmin ? 'bg-blue-900' : 'bg-zinc-800',
    pulseActive: isAdmin ? 'bg-blue-500' : 'bg-white',
    gridLines: isAdmin ? 'rgba(59,130,246,0.03)' : 'rgba(255,255,255,0.015)',
    orbTop: isAdmin ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
    orbBottom: isAdmin ? 'rgba(30,58,138,0.08)' : 'rgba(255,255,255,0.01)',
    iconBg: isAdmin ? 'bg-blue-950/50 border-blue-500/30' : 'bg-[#050505] border-white/10',
    title: isAdmin ? 'The Architect' : 'Builder',
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`h-8 w-8 rounded-full border-2 border-t-transparent ${isAdmin ? 'border-emerald-500/20 border-t-cyan-500' : 'border-white/10 border-t-white'}`}
          />
          <p className={`text-sm font-mono tracking-widest uppercase ${theme.color} opacity-70`}>Initializing Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-black text-zinc-300 ${isAdmin ? 'selection:bg-emerald-500/30' : 'selection:bg-white/20'} font-sans overflow-hidden`}>
      
      {/* 110000X Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, ${theme.orbTop} 0%, rgba(0,0,0,1) 60%)` }}></div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom, ${theme.orbBottom} 0%, rgba(0,0,0,0) 60%)` }}></div>
        <div className="absolute inset-0 bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" style={{ backgroundImage: `linear-gradient(${theme.gridLines} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLines} 1px, transparent 1px)` }}></div>
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-black/40 backdrop-blur-xl
          transition-transform duration-300 ease-out
          lg:static lg:translate-x-0 ${theme.border}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex h-16 items-center justify-between border-b px-5 relative overflow-hidden group ${theme.border}`}>
          <Link href="/dashboard" className="flex items-center gap-3 relative z-10">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${theme.iconBg} ${theme.shadow}`}>
              <Activity className={`w-4 h-4 ${theme.color}`} />
            </div>
            <span className="text-sm font-bold text-white tracking-widest uppercase">
              R<span className={theme.color}>Y</span>L
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity Block */}
        <div className={`p-4 border-b bg-black/40 relative overflow-hidden group ${theme.border}`}>
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className={`w-10 h-10 border flex items-center justify-center bg-black transition-all ${theme.borderStrong} ${theme.borderHover} ${isAdmin ? 'shadow-[0_0_15px_rgba(255,0,51,0.1)] group-hover:shadow-[0_0_15px_rgba(255,0,51,0.4)]' : 'shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]'}`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
                <Terminal className={`w-4 h-4 ${theme.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-70 ${theme.color}`}>{theme.title}</div>
              <div className="text-white font-black tracking-widest uppercase text-xs truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Unknown Entity'}
              </div>
            </div>
          </div>
          
          <div className={`mt-3 text-[8px] font-mono tracking-widest bg-black/80 px-2 py-1 uppercase border flex justify-between items-center transition-colors ${theme.color} ${theme.borderStrong} ${theme.borderHover}`}>
            <span className="opacity-70">Status: SECURE</span>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors ${theme.pulseActive}`}></span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <ul className="space-y-3">
            {getGroupedNavItems(user).map((group: any) => {
              const visibleItems = group.items.filter((item: any) => !item.isAdminOnly || isAdmin);
              if (visibleItems.length === 0) return null;

              const isExpanded = expandedSections[group.id];

              return (
                <li key={group.id} className="space-y-1">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleSection(group.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.25em] 
                      transition-colors duration-200 border-b border-transparent
                      ${isAdmin ? 'text-emerald-400/70 hover:text-emerald-400Light' : 'text-zinc-500 hover:text-zinc-300'}
                    `}
                  >
                    <span>{group.label}</span>
                    <span>
                      {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    </span>
                  </button>

                  {/* Group Items */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden space-y-0.5 pl-1 pt-1"
                      >
                        {visibleItems.map((item: any) => {
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
                                  group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium font-mono
                                  transition-all duration-200
                                  ${
                                    isActive
                                      ? `${theme.bgActive} ${theme.color} border ${theme.borderStrong}`
                                      : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'
                                  }
                                `}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="activeNav"
                                    className={`absolute left-0 top-1/2 h-3.5 w-[2px] -translate-y-1/2 ${theme.pulseActive}`}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                  />
                                )}
                                <span className={isActive ? theme.color : `text-zinc-600 ${theme.hoverColor}`}>
                                  {item.icon}
                                </span>
                                <span className="tracking-wide uppercase text-[10px]">{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={`border-t p-3 bg-black/60 ${theme.border}`}>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-black border text-xs font-mono font-bold transition-colors ${theme.color} ${theme.borderStrong} ${theme.borderHover}`}>
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[11px] font-mono uppercase text-white tracking-widest">
                {user ? `${user.firstName}` : 'User'}
              </p>
              <p className="truncate text-[9px] font-mono text-zinc-500">{user?.email || 'OFFLINE'}</p>
            </div>
            <button
              onClick={logout}
              className={`rounded-lg p-1.5 text-zinc-500 transition-colors ${theme.hoverColor}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col relative z-10 w-full overflow-hidden">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-black/40 px-4 backdrop-blur-xl sm:px-6 ${theme.border}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Path Breadcrumbs */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <span className={theme.color}>R_Y_L_CORE</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">{pathname?.split('/').filter(Boolean).pop() || 'CORE'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Cinematic Live Pulse */}
            <div className={`hidden md:flex items-center gap-2 bg-black/60 border px-3 py-1.5 rounded-full ${theme.borderStrong}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.pulseActive}`}></div>
              <div className="flex flex-col">
                <span className={`text-[7px] uppercase font-black tracking-widest leading-none ${theme.color}`}>System Status</span>
                <span className="text-[9px] text-zinc-400 font-mono leading-none mt-0.5">Online</span>
              </div>
            </div>

            <div className={`w-px h-6 mx-1 ${isAdmin ? 'bg-navyLight/30' : 'bg-white/10'}`}></div>

            <LanguageSwitcher />
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
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
