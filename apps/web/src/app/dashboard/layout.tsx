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
  Brain,
  Search,
  Globe,
  ShoppingCart,
  Users,
  CreditCard,
  Building,
  MessageSquare,
  MousePointerClick,
  Mail,
  LifeBuoy,
  Target,
  Monitor,
  Send,
  Newspaper,
  Bot,
  Link2,
  Database
} from 'lucide-react';

const getGroupedNavItems = (user: any) => {
  return [
    {
      id: 'boardroom',
      label: 'The Boardroom',
      items: [
        { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'CEO (Growth)', href: '/dashboard/c-suite/ceo', icon: <Brain size={16} /> },
        { label: 'CFO (Profit)', href: '/dashboard/c-suite/cfo', icon: <Briefcase size={16} /> },
        { label: 'CMO (Acquisition)', href: '/dashboard/c-suite/cmo', icon: <Activity size={16} /> },
        { label: 'COO (Systems)', href: '/dashboard/c-suite/coo', icon: <Network size={16} /> }
      ]
    },
    {
      id: 'finance',
      label: 'Finance & Admin',
      items: [
        { label: 'Treasury Vault', href: '/dashboard/finance', icon: <Briefcase size={16} /> },
        { label: 'Bank & Transacties', href: '/dashboard/finance/banking', icon: <CreditCard size={16} /> },
        { label: 'Schulden & Budget', href: '/dashboard/finance/debts', icon: <Layers size={16} /> },
        { label: 'CRM & Facturatie', href: '/dashboard/crm', icon: <Users size={16} /> },
        { label: 'Mijn Abonnement', href: '/dashboard/billing', icon: <Shield size={16} /> }
      ]
    },
    {
      id: 'revenue',
      label: 'Verdienmodellen',
      items: [
        { label: 'E-Commerce / Dropship', href: '/dashboard/ecommerce', icon: <ShoppingCart size={16} /> },
        { label: 'Social & Marketing', href: '/dashboard/social', icon: <MessageSquare size={16} /> },
        { label: 'SaaS & Enterprise', href: '/dashboard/enterprise', icon: <Building size={16} /> },
        { label: 'The Syndicate', href: '/dashboard/community', icon: <Globe size={16} /> },
        { label: 'Partner Netwerk', href: '/dashboard/affiliate', icon: <Network size={16} /> }
      ]
    },
    {
      id: 'sovereign',
      label: 'Sovereign OS',
      items: [
        { label: 'Funnel Builder', href: '/dashboard/funnels', icon: <MousePointerClick size={16} /> },
        { label: 'Website Builder', href: '/dashboard/modules/website-builder', icon: <Monitor size={16} /> },
        { label: 'E-mail Marketing', href: '/dashboard/marketing/email', icon: <Mail size={16} /> },
        { label: 'Helpdesk', href: '/dashboard/support', icon: <LifeBuoy size={16} /> },
        { label: 'Ad-Manager', href: '/dashboard/marketing/ads', icon: <Target size={16} /> }
      ]
    },
    {
      id: 'machines',
      label: 'AI Machines',
      items: [
        { label: 'Viral Video Factory', href: '/dashboard/modules/viral-factory', icon: <Tv size={16} /> },
        { label: 'Cold Email B2B', href: '/dashboard/modules/cold-email', icon: <Send size={16} /> },
        { label: 'Newsletter AI', href: '/dashboard/modules/newsletter', icon: <Newspaper size={16} /> },
        { label: 'SEO Audit', href: '/dashboard/modules/seo-audit', icon: <Activity size={16} /> },
        { label: 'AI Chatbot', href: '/dashboard/modules/ai-chatbot', icon: <Bot size={16} /> }
      ]
    },
    {
      id: 'agents',
      label: 'Revenue Agents',
      items: [
        { label: 'SEO & Traffic', href: '/dashboard/agents/seo', icon: <Search size={16} /> },
        { label: 'CRO & Funnel', href: '/dashboard/agents/cro', icon: <Map size={16} /> },
        { label: 'Copy & Content', href: '/dashboard/agents/copywriter', icon: <Terminal size={16} /> },
        { label: 'Ads & Media', href: '/dashboard/agents/ads', icon: <Tv size={16} /> }
      ]
    },
    {
      id: 'system',
      label: 'System & Admin',
      items: [
        { label: 'Integrations (Telegram)', href: '/dashboard/settings/telegram', icon: <Link2 size={16} /> },
        { label: 'Databases', href: '/dashboard/databases', icon: <Database size={16} /> },
        { label: 'Security & Access', href: '/dashboard/security', icon: <Shield size={16} /> },
        { label: 'Platform Settings', href: '/dashboard/settings', icon: <Settings size={16} /> }
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
    machines: true,
  });

  const [activeProject, setActiveProject] = useState<any>("holding");
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getUserProjectsAction();
      if (res.success && res.projects) {
        setUserProjects(res.projects);
      }
    }
    load();
  }, []);

  useEffect(() => {
    // Scroll to top of main container on route change
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isAdmin = user?.role === 'ADMIN' || user?.email === 'hsemler50@gmail.com';

  // THEME CONFIGURATION - THE 2026 CYBER AESTHETIC
  // Admin gets Neon Cyan/Purple. User gets Deep Blue Neon.
  const theme = {
    color: isAdmin ? 'text-neonCyan' : 'text-neonBlue',
    hoverColor: isAdmin ? 'group-hover:text-neonCyan' : 'group-hover:text-neonBlue',
    bgActive: isAdmin ? 'bg-neonCyanDim' : 'bg-neonBlueDim',
    border: isAdmin ? 'border-neonCyan/20' : 'border-neonBlue/10',
    borderStrong: isAdmin ? 'border-neonCyan/50' : 'border-neonBlue/30',
    borderHover: isAdmin ? 'group-hover:border-neonCyan' : 'group-hover:border-neonBlue',
    shadow: isAdmin ? 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    pulseBg: isAdmin ? 'bg-neonCyan/20' : 'bg-neonBlue/20',
    pulseActive: isAdmin ? 'bg-neonCyan' : 'bg-neonBlue',
    gridLines: isAdmin ? 'rgba(6,182,212,0.05)' : 'rgba(59,130,246,0.03)',
    orbTop: isAdmin ? 'rgba(6,182,212,0.15)' : 'rgba(59,130,246,0.1)',
    orbBottom: isAdmin ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.05)',
    iconBg: isAdmin ? 'bg-[#020202] border-neonCyan/30' : 'bg-[#020202] border-neonBlue/20',
    title: isAdmin ? 'System Override' : 'Operator',
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`h-8 w-8 rounded-full border-2 border-t-transparent ${isAdmin ? 'border-neonCyan/20 border-t-neonCyan' : 'border-neonBlue/20 border-t-neonBlue'}`}
          />
          <p className={`text-sm font-mono tracking-widest uppercase neon-text opacity-70`}>Initializing Neuromatrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-[#020202] text-zinc-300 ${isAdmin ? 'selection:bg-neonCyan/30' : 'selection:bg-neonBlue/20'} font-sans overflow-hidden`}>
      
      {/* 110000X Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none cyber-grid">
        <div className="absolute inset-0 bg-[#020202]/90"></div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, ${theme.orbTop} 0%, rgba(2,2,2,0.9) 60%)` }}></div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom, ${theme.orbBottom} 0%, rgba(2,2,2,0) 60%)` }}></div>
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
              <div className={`w-10 h-10 border flex items-center justify-center bg-black transition-all ${theme.borderStrong} ${theme.borderHover} ${isAdmin ? 'shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]'}`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
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

            {/* Direct Connection to AI Agency */}
            {isAdmin && (
              <a 
                href="https://ai-henksemler.nl/agency/ceo" 
                className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-blue-900/20 border border-blue-500/30 rounded-md hover:bg-blue-900/40 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">AI Agency Control Room</span>
              </a>
            )}

            {/* Project Switcher */}
            <div className="relative ml-4">
              <button 
                onClick={() => setShowProjectSwitcher(!showProjectSwitcher)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-black/60 border rounded-md transition-colors ${showProjectSwitcher ? theme.borderStrong : theme.border}`}
              >
                <div className={`w-2 h-2 rounded-full ${activeProject === 'holding' ? 'bg-[#d4af37]' : 'bg-emerald-500'} animate-pulse`}></div>
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  {activeProject === 'holding' ? 'Holding (God-Mode)' : (userProjects.find(p => p.id === activeProject)?.name || 'E-Com Alpha')}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>
              
              <AnimatePresence>
                {showProjectSwitcher && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jouw Portfolio</span>
                    </div>
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => { setActiveProject('holding'); setShowProjectSwitcher(false); }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${activeProject === 'holding' ? 'bg-[#d4af37]/10 border border-[#d4af37]/30' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                        <Network className={`w-4 h-4 ${activeProject === 'holding' ? 'text-[#d4af37]' : 'text-zinc-400'}`} />
                        <div>
                          <p className={`text-xs font-bold uppercase ${activeProject === 'holding' ? 'text-[#d4af37]' : 'text-zinc-300'}`}>Holding View</p>
                          <p className="text-[10px] text-zinc-500">Alle projecten geaggregeerd</p>
                        </div>
                      </button>
                      
                      {userProjects.map((proj) => (
                        <button 
                          key={proj.id}
                          onClick={() => { setActiveProject(proj.id); setShowProjectSwitcher(false); }}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${activeProject === proj.id ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                          <Briefcase className={`w-4 h-4 ${activeProject === proj.id ? 'text-emerald-500' : 'text-zinc-400'}`} />
                          <div>
                            <p className={`text-xs font-bold uppercase ${activeProject === proj.id ? 'text-emerald-500' : 'text-zinc-300'}`}>{proj.name}</p>
                            <p className="text-[10px] text-zinc-500">{proj.domainUrl || `${proj.industry} Project`}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-white/10 bg-black/50">
                      <button className="w-full text-left text-xs font-mono text-zinc-400 hover:text-white transition-colors p-2 flex items-center gap-2">
                        + Subdomein Toevoegen
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Cinematic Live Pulse */}
            <div className={`hidden md:flex items-center gap-2 bg-black/60 border px-3 py-1.5 rounded-full ${theme.borderStrong}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.pulseActive}`}></div>
              <div className="flex flex-col">
                <span className={`text-[7px] uppercase font-black tracking-widest leading-none ${theme.color}`}>Systeemstatus</span>
                <span className="text-[9px] text-zinc-400 font-mono leading-none mt-0.5">Online</span>
              </div>
            </div>

            <div className={`w-px h-6 mx-1 ${isAdmin ? 'bg-navyLight/30' : 'bg-white/10'}`}></div>

            <LanguageSwitcher />
            <NotificationBell />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main id="main-scroll-container" className="flex-1 overflow-y-auto relative bg-black" style={{ scrollBehavior: 'smooth' }}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full min-h-full"
            >
              {children}
            </motion.div>
          </main>
          <AIHermesSidebar />
        </div>
      </div>
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
