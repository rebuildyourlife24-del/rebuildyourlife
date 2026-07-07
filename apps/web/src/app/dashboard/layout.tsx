'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useRequireAuth } from '@/lib/auth';
import { AIHermesSidebar } from '@/components/AIHermesSidebar';
import { getUserProjectsAction } from '@/app/actions/projects';
import { 
  Shield, 
  Settings, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard,
  Network,
  Activity,
  Map,
  Terminal,
  Brain,
  Search,
  ShoppingCart,
  Users,
  Briefcase,
  Target,
  Bot,
  Database,
  Cpu,
  Lock,
  Workflow,
  Zap,
  BarChart,
  Command,
  MessageSquare,
  Layers,
  GraduationCap,
  Globe,
  Monitor
} from 'lucide-react';
import { NotificationDropdown, AppNotification } from '@/components/ui/NotificationDropdown';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { JarvisProvider } from '@/components/JarvisProvider';
import { JarvisOmniWidget } from '@/components/JarvisOmniWidget';
import { getNotificationsAction, markNotificationReadAction, markAllNotificationsReadAction } from '@/app/actions/dashboard';

const getGroupedNavItems = () => {
  return [
    { label: 'MISSION', href: '/dashboard', icon: <Target size={16} /> },
    { label: 'COMMAND', href: '/dashboard/command', icon: <Command size={16} /> },
    { label: 'NEXUS', href: '/dashboard/nexus', icon: <Brain size={16} /> },
    { label: 'BOARDROOM', href: '/dashboard/boardroom', icon: <Users size={16} /> },
    { label: 'PANOPTICON', href: '/dashboard/panopticon', icon: <Activity size={16} /> },
    { label: 'DIGITAL TWIN', href: '/dashboard/digital-twin', icon: <Layers size={16} /> },
    { label: 'AGENTS', href: '/dashboard/agents', icon: <Bot size={16} /> },
    { label: 'MEMORY', href: '/dashboard/memory', icon: <Database size={16} /> },
    { label: 'GENOME', href: '/dashboard/genome', icon: <Network size={16} /> },
    { label: 'KNOWLEDGE', href: '/dashboard/knowledge', icon: <GraduationCap size={16} /> },
    { label: 'RESEARCH', href: '/dashboard/research', icon: <Search size={16} /> },
    { label: 'OPERATIONS', href: '/dashboard/operations', icon: <Briefcase size={16} /> },
    { label: 'AUTOMATION', href: '/dashboard/automations', icon: <Zap size={16} /> },
    { label: 'TREASURY', href: '/dashboard/treasury', icon: <BarChart size={16} /> },
    { label: 'SIMULATION', href: '/dashboard/simulation', icon: <Cpu size={16} /> },
    { label: 'REALITY ENGINE', href: '/dashboard/reality-engine', icon: <Globe size={16} /> },
    { label: 'AI FACTORY', href: '/dashboard/ai-factory', icon: <Terminal size={16} /> },
    { label: 'EVOLUTION', href: '/dashboard/evolution', icon: <Workflow size={16} /> },
    { label: 'OBSERVABILITY', href: '/dashboard/observability', icon: <Monitor size={16} /> },
    { label: 'SECURITY', href: '/dashboard/security', icon: <Shield size={16} /> },
    { label: 'SENTINEL', href: '/dashboard/sentinel', icon: <Lock size={16} /> },
    { label: 'SETTINGS', href: '/dashboard/settings', icon: <Settings size={16} /> }
  ];
};

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

// Global Event Stream Ticker (Bloomberg Style)
function LiveEventStream() {
  const [events, setEvents] = useState([
    "Marketing Agent started Campaign Alpha",
    "Hermes solved refund request #1920",
    "Inventory updated for SKU-9002",
    "Meta ROAS increased by 14%",
    "Panopticon routed €500 to Treasury",
    "Workflow 'Abandoned Cart' triggered"
  ]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-black border-t border-[#00f0ff]/30 z-50 flex items-center overflow-hidden">
      <div className="bg-[#00f0ff] text-black text-[10px] font-black uppercase tracking-widest px-4 h-full flex items-center z-10 shrink-0">
        LIVE EVENTS
      </div>
      <div className="flex-1 whitespace-nowrap overflow-hidden relative">
        <motion.div 
          className="inline-flex items-center gap-12 absolute left-0"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...events, ...events, ...events].map((evt, idx) => (
            <span key={idx} className="text-[#00f0ff]/80 text-[10px] font-mono tracking-widest uppercase">
              <span className="text-[#00f0ff] mr-2">›</span>
              {evt}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useRequireAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  const isAdmin = user?.role === 'ADMIN' || user?.email === 'hsemler50@gmail.com';

  const theme = {
    color: 'text-[#00f0ff]',
    hoverColor: 'group-hover:text-[#00f0ff]',
    bgActive: 'bg-[#00f0ff]/10',
    border: 'border-[#00f0ff]/20',
    borderStrong: 'border-[#00f0ff]/50',
    borderHover: 'group-hover:border-[#00f0ff]',
    shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    pulseBg: 'bg-[#00f0ff]/20',
    pulseActive: 'bg-[#00f0ff]',
    gridLines: 'rgba(0,240,255,0.05)',
    orbTop: 'rgba(0,240,255,0.1)',
    orbBottom: 'rgba(0,240,255,0.05)',
    iconBg: 'bg-black border-[#00f0ff]/30',
    title: 'Argentic OS',
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6 relative">
          <div className="absolute inset-0 bg-[#00f0ff]/20 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute w-24 h-24 border border-dashed border-[#00f0ff]/40 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute w-16 h-16 border border-[#00f0ff]/60 rounded-full"
            />
            <div className="w-8 h-8 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_30px_#00f0ff]" />
          </div>

          <div className="text-center space-y-1 relative z-10 mt-8">
            <p className="text-[#00f0ff] text-xs font-black tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              Syndicate Core
            </p>
            <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">
              Establishing Neural Link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-black text-white selection:bg-[#00f0ff]/30 font-sans overflow-hidden pb-8`}>
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none cyber-grid">
        <div className="absolute inset-0 bg-black/90"></div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, ${theme.orbTop} 0%, rgba(0,0,0,0.9) 60%)` }}></div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom, ${theme.orbBottom} 0%, rgba(0,0,0,0) 60%)` }}></div>
        <div className="absolute inset-0 bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" style={{ backgroundImage: `linear-gradient(${theme.gridLines} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLines} 1px, transparent 1px)` }}></div>
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
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-black/60 backdrop-blur-xl
          transition-transform duration-300 ease-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex h-16 items-center justify-between border-b border-white/5 px-5 relative overflow-hidden group`}>
          <Link href="/dashboard" className="flex items-center gap-3 relative z-10">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${theme.iconBg} ${theme.shadow}`}>
              <Terminal className={`w-4 h-4 ${theme.color}`} />
            </div>
            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
              Enterprise <span className={theme.color}>OS</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity Block */}
        <div className={`p-4 border-b border-white/5 bg-black/40 relative overflow-hidden group`}>
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className={`w-10 h-10 border flex items-center justify-center bg-black transition-all ${theme.borderStrong} ${theme.borderHover} shadow-[0_0_15px_rgba(0,240,255,0.1)]`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
                <Cpu className={`w-4 h-4 ${theme.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-70 ${theme.color}`}>{theme.title}</div>
              <div className="text-white font-black tracking-widest uppercase text-[10px] truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'System Admin'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-0.5">
            {getGroupedNavItems().map((item: any) => {
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
                      group relative flex items-center gap-4 px-6 py-2.5 text-xs font-medium font-mono
                      transition-all duration-200
                      ${
                        isActive
                          ? `bg-gradient-to-r from-[#00f0ff]/10 to-transparent text-white`
                          : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute left-0 top-0 bottom-0 w-[2px] ${theme.pulseActive} shadow-[0_0_10px_#00f0ff]`}
                      />
                    )}
                    <span className={isActive ? theme.color : `text-zinc-600 ${theme.hoverColor}`}>
                      {item.icon}
                    </span>
                    <span className="tracking-[0.15em] uppercase text-[9px] font-black">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col relative z-10 w-full overflow-hidden">
        
        {/* Global AI Command Bar (Header) */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl px-4 sm:px-6">
          <div className="flex items-center gap-4 w-1/4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em]">
              <span className={theme.color}>SYSTEM</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">{pathname?.split('/').filter(Boolean).pop() || 'MISSION_CONTROL'}</span>
            </div>
          </div>

          {/* Centered Omnibar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00f0ff]/5 rounded-lg blur-md group-focus-within:bg-[#00f0ff]/20 transition-all"></div>
              <div className="relative flex items-center bg-black/80 border border-white/10 rounded-lg overflow-hidden group-focus-within:border-[#00f0ff]/50 transition-colors">
                <div className="pl-3 pr-2 py-2">
                  <Command className="w-4 h-4 text-[#00f0ff]" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ask anything... Run anything... Automate anything..." 
                  className="w-full bg-transparent border-none outline-none text-[11px] font-mono text-white placeholder-zinc-600 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="pr-3 pl-2 py-2 flex items-center gap-2">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase border border-zinc-700 px-1.5 py-0.5 rounded">⌘ K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-1/4 justify-end">
            <div className={`hidden md:flex items-center gap-2 bg-black/60 border px-3 py-1.5 rounded-full ${theme.borderStrong}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.pulseActive}`}></div>
              <div className="flex flex-col">
                <span className={`text-[6px] uppercase font-black tracking-widest leading-none ${theme.color}`}>System</span>
                <span className="text-[8px] text-zinc-400 font-mono leading-none mt-0.5">OPTIMAL</span>
              </div>
            </div>
            <NotificationBell />
            <button onClick={logout} className="text-zinc-500 hover:text-white transition-colors">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          <main id="main-scroll-container" className="flex-1 overflow-y-auto relative bg-transparent" style={{ scrollBehavior: 'smooth' }}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full min-h-full p-4 lg:p-8"
            >
              {children}
            </motion.div>
          </main>
        </div>

        <LiveEventStream />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JarvisProvider>
        <DashboardShell>{children}</DashboardShell>
        <JarvisOmniWidget />
      </JarvisProvider>
    </AuthProvider>
  );
}
