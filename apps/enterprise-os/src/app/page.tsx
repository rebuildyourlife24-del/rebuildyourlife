"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  FolderGit2, 
  Cpu, 
  FileText, 
  Library,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Power,
  Globe,
  Briefcase,
  PlayCircle,
  Image as ImageIcon,
  Share2
} from "lucide-react";

type Tab = 
  "Overview" | "Operations" | "Marketing" | "SEO" | "Growth" | "Finance" | 
  "Projects" | "AI_Activity" | "Reports" | "Knowledge" | "Board" | 
  "Webbuilder" | "Media" | "Social" | "Settings";

export default function UltimateSEODashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [defconActive, setDefconActive] = useState(false);

  const handleLogout = async () => {
    // Basic redirect for God Mode standalone
    window.location.href = "/login";
  };

  const navGroups = [
    {
      title: "Control Center",
      items: [
        { id: "Overview", label: "Executive Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "Board", label: "Board of Directors", icon: <Briefcase className="w-4 h-4" /> },
        { id: "AI_Activity", label: "Human Control (Queue)", icon: <CheckCircle2 className="w-4 h-4" /> },
        { id: "Finance", label: "Real-time Finance", icon: <DollarSign className="w-4 h-4" /> },
        { id: "Knowledge", label: "Knowledge Vault", icon: <Library className="w-4 h-4" /> },
      ]
    },
    {
      title: "Departments",
      items: [
        { id: "Operations", label: "Operations", icon: <Activity className="w-4 h-4" /> },
        { id: "Marketing", label: "Marketing", icon: <BarChart3 className="w-4 h-4" /> },
        { id: "SEO", label: "SEO & Content", icon: <TrendingUp className="w-4 h-4" /> },
        { id: "Growth", label: "Growth Radar", icon: <Globe className="w-4 h-4" /> },
      ]
    },
    {
      title: "Production Studios",
      items: [
        { id: "Webbuilder", label: "Webbuilder Studio", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "Media", label: "Media & Video Editor", icon: <PlayCircle className="w-4 h-4" /> },
        { id: "Social", label: "Social Hub", icon: <Share2 className="w-4 h-4" /> },
        { id: "Reports", label: "Black Box Logs", icon: <FileText className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800/50 bg-[#0e0e11] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
          <div className="w-5 h-5 rounded-sm bg-zinc-100 flex items-center justify-center mr-3">
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>
          <span className="font-semibold text-zinc-100 tracking-wide text-sm uppercase">Enterprise OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="px-3">
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-3">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeTab === item.id 
                        ? "bg-zinc-800/80 text-zinc-100 shadow-sm" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
        
        {/* TOPBAR */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium text-zinc-100 tracking-tight">
              {navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-400">
              God-Mode
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* KILL SWITCH */}
            <button 
              onClick={() => setDefconActive(!defconActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                defconActive 
                ? "bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse" 
                : "bg-zinc-900 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {defconActive ? "DEFCON ACTIVE (AI HALTED)" : "Kill Switch"}
            </button>

            <div className="w-px h-6 bg-zinc-800/80" />

            <div className="relative group cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div className="relative group cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-zinc-800/50">
              <div className="text-right">
                <div className="text-xs font-medium text-zinc-200 uppercase tracking-wider">Henk Semler</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Supreme Overseer</div>
              </div>
              <div className="w-8 h-8 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
                HS
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {defconActive && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">System Lockdown Active</h3>
                <p className="text-xs text-red-400/80 mt-1">All autonomous AI agents have been forcefully halted. No outgoing marketing, emails, or trades will be executed until the Kill Switch is deactivated.</p>
              </div>
            </div>
          )}

          {activeTab === "Overview" && <ExecutiveModeTab />}
          {activeTab === "Overview" && <ExecutiveModeTab />}
          {activeTab === "AI_Activity" && <HumanControlTab />}
          {activeTab === "Board" && <BoardOfDirectorsTab />}
          {activeTab === "Finance" && <FinanceTab />}
          {activeTab === "Webbuilder" && <WebbuilderTab />}
          {activeTab === "Media" && <MediaTab />}
          {activeTab === "Social" && <SocialTab />}
          
          {/* Work in progress placeholders */}
          {!["Overview", "AI_Activity", "Board", "Finance", "Webbuilder", "Media", "Social"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-medium space-y-4">
              <Cpu className="w-12 h-12 text-zinc-800" />
              <p>{navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label} Module is initializing...</p>
              <p className="text-xs text-zinc-500 font-normal">Connected to God-Mode Database.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 3: MEDIA & VIDEO EDITOR
// ---------------------------------------------------------------------------
function MediaTab() {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Media & Video Editor</h2>
          <p className="text-xs text-zinc-500 mt-1">AI Video Generation and Asset Management</p>
        </div>
        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          Export Media
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden min-h-[600px]">
        {/* Asset Library */}
        <div className="col-span-1 bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-4 flex flex-col">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Asset Library</h3>
          <input 
            type="text" 
            placeholder="Search images, videos, audio..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 mb-4 focus:outline-none focus:border-blue-500/50" 
          />
          <div className="grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar pr-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-video bg-zinc-800/50 rounded border border-zinc-700/50 flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
                <ImageIcon className="w-5 h-5 text-zinc-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Video Editor Canvas */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex-1 bg-zinc-900/30 border border-zinc-800/60 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <PlayCircle className="w-16 h-16 text-zinc-700 mb-4" />
              <div className="text-sm font-medium text-zinc-400">AI Video Preview</div>
              <div className="text-xs text-zinc-600 mt-2">Generate a video via prompt to start editing</div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="h-48 bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-4 flex flex-col">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Timeline</h3>
            <div className="flex-1 bg-zinc-900/50 rounded border border-zinc-800/50 relative">
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-red-500 z-10"></div>
              {/* Fake tracks */}
              <div className="h-10 mt-2 mx-2 bg-blue-500/20 border border-blue-500/30 rounded flex items-center px-2 text-[10px] text-blue-400">Video Track 1</div>
              <div className="h-10 mt-2 mx-2 bg-emerald-500/20 border border-emerald-500/30 rounded flex items-center px-2 text-[10px] text-emerald-400">Audio (Voiceover)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 3: SOCIAL HUB
// ---------------------------------------------------------------------------
function SocialTab() {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Social Media Hub</h2>
          <p className="text-xs text-zinc-500 mt-1">Multi-Channel AI Publishing & Engagement</p>
        </div>
        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        
        {/* Connected Accounts */}
        <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Connected Accounts</h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">52 Active</span>
          </div>
          <div className="space-y-3">
            {['Twitter/X (Main)', 'LinkedIn (CEO)', 'Instagram (Brand)', 'TikTok (Growth)', 'Facebook Page'].map(network => (
              <div key={network} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Share2 className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-xs text-zinc-300">{network}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-dashed border-zinc-700 text-zinc-500 rounded text-xs font-medium hover:text-zinc-300 hover:border-zinc-500 transition-colors">
            + Connect New Account
          </button>
        </div>

        {/* Content Calendar */}
        <div className="md:col-span-2 bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-5 flex flex-col">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">AI Publishing Queue</h3>
          <div className="flex-1 border border-zinc-800/50 rounded bg-zinc-900/30 p-4">
            <div className="space-y-4">
              <div className="p-4 border-l-2 border-blue-500 bg-zinc-800/30 rounded-r flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-blue-400 mb-1">SCHEDULED: 14:00 TODAY</div>
                  <div className="text-sm font-medium text-zinc-200">"5 lessons from building RebuildYourLife"</div>
                  <div className="text-xs text-zinc-500 mt-1">Targeting: Twitter, LinkedIn</div>
                </div>
                <button className="text-xs text-zinc-400 hover:text-white">Edit</button>
              </div>
              
              <div className="p-4 border-l-2 border-emerald-500 bg-zinc-800/30 rounded-r flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 mb-1">PUBLISHED: 09:00 TODAY</div>
                  <div className="text-sm font-medium text-zinc-200">Debt Relief Success Story Video</div>
                  <div className="text-xs text-zinc-500 mt-1">Targeting: Instagram, TikTok</div>
                </div>
                <div className="text-xs font-bold text-emerald-500">+4.2k Views</div>
              </div>
              
              <div className="p-4 border-l-2 border-amber-500 bg-zinc-800/30 rounded-r flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-amber-400 mb-1">DRAFT: AWAITING APPROVAL</div>
                  <div className="text-sm font-medium text-zinc-200">SEO Blog Announcement</div>
                  <div className="text-xs text-zinc-500 mt-1">Targeting: All Platforms</div>
                </div>
                <button className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold">Review</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 3: WEBBUILDER STUDIO
// ---------------------------------------------------------------------------
function WebbuilderTab() {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Webbuilder Studio</h2>
          <p className="text-xs text-zinc-500 mt-1">AI-Powered Drag & Drop Interface for RebuildYourLife Network</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-xs font-medium transition-colors">
            Preview
          </button>
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            Deploy Live
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-[600px]">
        {/* Left Sidebar - AI & Elements */}
        <div className="w-80 bg-[#0e0e11] border border-zinc-800/60 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800/50">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Architect Command</h3>
            <textarea 
              className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded p-3 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 resize-none custom-scrollbar"
              placeholder="e.g. 'Build a high-converting landing page for the debt relief program with a dark theme...'"
            ></textarea>
            <button className="w-full mt-3 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Generate Layout
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Drag & Drop Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Hero Section', 'Pricing Grid', 'Testimonials', 'Lead Form', 'Video Player', 'Feature List', 'FAQ Accordion', 'Footer'].map((el) => (
                <div key={el} className="p-3 border border-zinc-800/50 rounded bg-zinc-900/50 flex flex-col items-center justify-center cursor-move hover:bg-zinc-800 hover:border-zinc-700 transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-zinc-500 mb-2" />
                  <span className="text-[10px] text-zinc-400 font-medium text-center">{el}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-zinc-900/30 border border-zinc-800/60 rounded-lg relative overflow-hidden flex flex-col">
          {/* Browser Mockup Header */}
          <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="flex-1 max-w-md bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-[10px] text-zinc-500 font-mono text-center mx-auto">
              https://rebuildyourlife.eu/landing-page-draft
            </div>
            <div className="w-12"></div> {/* Spacer to balance header */}
          </div>
          
          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            <div className="max-w-4xl mx-auto min-h-full border border-dashed border-zinc-700 rounded-lg bg-[#0a0a0a] flex flex-col items-center justify-center relative group">
              
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              
              <div className="text-center z-10 p-8">
                <ImageIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">Empty Canvas</h3>
                <p className="text-xs text-zinc-600 mb-6 max-w-xs mx-auto">Drag elements here from the sidebar, or ask the AI Architect to generate a complete layout.</p>
              </div>

            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Properties */}
        <div className="w-64 bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-4 flex flex-col">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Properties & Styling</h3>
          <div className="flex flex-col items-center justify-center flex-1 text-center border border-dashed border-zinc-800 rounded">
            <Settings className="w-6 h-6 text-zinc-700 mb-2" />
            <p className="text-xs text-zinc-500 px-4">Select an element on the canvas to edit its properties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 5: EXECUTIVE MODE WIDGETS
// ---------------------------------------------------------------------------
function ExecutiveModeTab() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CEO Overview */}
      <div>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">CEO Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Revenue (MTD)" value="€24,500" trend="+12.5%" />
          <StatCard title="Active Campaigns" value="14" trend="Optimal" isNeutral />
          <StatCard title="System Alerts" value="2" trend="Action Required" isNegative />
          <StatCard title="AI Tasks Queued" value="38" trend="Awaiting Review" isNeutral />
        </div>
      </div>

      {/* Department Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COO Widget */}
        <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-5 shadow-sm">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">COO (Operations)</h3>
          <div className="space-y-4">
            <ProgressBar label="System Capacity" value={82} />
            <ProgressBar label="Task Delivery Rate" value={95} />
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <div className="text-xs text-zinc-400">Bottleneck Detected:</div>
              <div className="text-sm font-medium text-amber-500 mt-1">SEO Content Approval Queue is full.</div>
            </div>
          </div>
        </div>

        {/* CMO Widget */}
        <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-5 shadow-sm">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">CMO (Marketing)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Avg. ROAS</span>
              <span className="text-sm font-medium text-emerald-400">3.2x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Active Experiments</span>
              <span className="text-sm font-medium text-zinc-100">4 running</span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <div className="text-xs text-zinc-400">Campaign Health:</div>
              <div className="text-sm font-medium text-emerald-500 mt-1">All KPIs within acceptable thresholds.</div>
            </div>
          </div>
        </div>

        {/* DATA Widget */}
        <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-5 shadow-sm">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">DATA (Insights)</h3>
          <div className="space-y-4">
            <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800/50">
              <div className="text-xs text-zinc-500 mb-1">Prediction</div>
              <div className="text-sm text-zinc-300">Traffic spike expected next Tuesday based on competitor ad-spend drop.</div>
            </div>
            <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800/50">
              <div className="text-xs text-zinc-500 mb-1">Anomaly</div>
              <div className="text-sm text-zinc-300">Conversion rate on Landing Page B dropped by 4% in last 12 hours.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isNeutral = false, isNegative = false }: { title: string; value: string; trend: string; isNeutral?: boolean; isNegative?: boolean }) {
  let trendColor = "text-emerald-500";
  if (isNeutral) trendColor = "text-zinc-500";
  if (isNegative) trendColor = "text-red-500";

  return (
    <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-5 shadow-sm">
      <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">{title}</h4>
      <div className="text-2xl font-medium text-zinc-100 tracking-tight mb-2">{value}</div>
      <div className={`text-xs font-medium ${trendColor}`}>
        {trend}
      </div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300 font-medium">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500/80 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 4: HUMAN CONTROL / REVIEW QUEUE
// ---------------------------------------------------------------------------
function HumanControlTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Action Queue</h2>
          <p className="text-xs text-zinc-500 mt-1">AI Output requires Human Validation.</p>
        </div>
      </div>

      <div className="space-y-4">
        <QueueCard 
          result="Generated Q3 SEO Keyword Strategy"
          location="/Knowledge/SEO/Strategy"
          owner="SEO Director Agent"
          status="Pending Review"
          impact="Estimated +15% Organic Traffic"
          nextStep="Publish to Webbuilder Studio"
        />
        <QueueCard 
          result="Drafted 5 Legal Demand Letters"
          location="/Knowledge/Legal/Drafts"
          owner="Chief Legal Officer"
          status="Pending Approval"
          impact="€4,200 potential recovery"
          nextStep="Send via Email API"
        />
        <QueueCard 
          result="Paused underperforming FB Ad"
          location="/Knowledge/Marketing/Campaigns"
          owner="CMO Agent"
          status="Action Required"
          impact="Saved €150/day"
          nextStep="Allocate budget to Campaign B"
        />
      </div>
    </div>
  );
}

function QueueCard({ result, location, owner, status, impact, nextStep }: any) {
  return (
    <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg shadow-sm flex flex-col">
      <div className="p-5 border-b border-zinc-800/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Result</div>
            <div className="text-sm font-medium text-zinc-200">{result}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Owner</div>
            <div className="text-sm text-zinc-400">{owner}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Impact</div>
            <div className="text-sm text-emerald-400">{impact}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Location</div>
            <div className="text-sm text-zinc-400 font-mono text-xs">{location}</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Next Step</div>
          <div className="text-sm text-zinc-300">{nextStep}</div>
        </div>
      </div>
      
      {/* Dashboard Actions */}
      <div className="flex items-center gap-px bg-zinc-800/30 p-2 overflow-x-auto">
        <button className="flex-1 py-1.5 px-3 text-xs font-medium text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors">Approve</button>
        <button className="flex-1 py-1.5 px-3 text-xs font-medium text-red-400 hover:bg-red-400/10 rounded transition-colors">Reject</button>
        <button className="flex-1 py-1.5 px-3 text-xs font-medium text-zinc-400 hover:bg-zinc-800 rounded transition-colors">Edit</button>
        <button className="flex-1 py-1.5 px-3 text-xs font-medium text-amber-400 hover:bg-amber-400/10 rounded transition-colors">Pause</button>
        <button className="flex-1 py-1.5 px-3 text-xs font-medium text-zinc-400 hover:bg-zinc-800 rounded transition-colors">Undo</button>
        <button className="flex-1 py-1.5 px-3 text-xs font-medium text-blue-400 hover:bg-blue-400/10 rounded transition-colors">Assign</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BOARD OF DIRECTORS TAB
// ---------------------------------------------------------------------------
function BoardOfDirectorsTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Board of Directors</h2>
          <p className="text-xs text-zinc-500 mt-1">C-Level Elite Advisors continuously scanning the Enterprise Vault.</p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-xs font-bold tracking-widest uppercase">
          Threat Level: GREEN (Secure)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DirectorCard 
          title="Chief Legal Officer"
          status="Scanning contracts..."
          insight="No pending lawsuits found. Terms of Service on rebuildyourlife.eu is compliant with GDPR 2026 standards."
          isSafe
        />
        <DirectorCard 
          title="Chief Risk Officer"
          status="Analyzing cashflow..."
          insight="Burn rate is stable. Warning: Dependency on Stripe API is high, recommending secondary payment gateway setup."
          isWarning
        />
        <DirectorCard 
          title="Chief Financial Officer"
          status="Calculating margins..."
          insight="Current profit margin across 3 SaaS tiers is 82%. Tax reservations are automatically set aside in Virtual Folder /Finance/Taxes."
          isSafe
        />
        <DirectorCard 
          title="Chief Accounting Officer"
          status="Syncing bank feeds..."
          insight="Real-time Mollie & Knab sync complete. All new 2026 tax regulations applied to Q3 VAT declarations. No anomalies found."
          isSafe
        />
      </div>
    </div>
  );
}

function DirectorCard({ title, status, insight, isSafe, isWarning }: any) {
  return (
    <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
        <h3 className="text-[10px] font-bold text-zinc-100 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="text-xs font-mono text-zinc-500 mb-4">{status}</div>
      <div className="text-xs text-zinc-300 leading-relaxed flex-1">"{insight}"</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FINANCE & ACCOUNTING TAB (Real-time Banking)
// ---------------------------------------------------------------------------
function FinanceTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Real-time Financial Hub</h2>
          <p className="text-xs text-zinc-500 mt-1">Live Bank Feeds, Mollie API, and AI Bookkeeping Analysis.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-xs font-medium transition-colors">
          <Activity className="w-4 h-4" />
          Force Sync APIs
        </button>
      </div>

      {/* Connected Accounts Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-[#0e0e11] border border-zinc-800/60 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Zakelijk Knab</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-lg font-medium text-zinc-100">€ 42.150,00</div>
          <div className="text-xs text-zinc-500 mt-1">Updated 2m ago</div>
        </div>
        <div className="p-4 bg-[#0e0e11] border border-zinc-800/60 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Privé Rabobank</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-lg font-medium text-zinc-100">€ 14.280,45</div>
          <div className="text-xs text-zinc-500 mt-1">Updated 5m ago</div>
        </div>
        <div className="p-4 bg-[#0e0e11] border border-emerald-900/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">ASN Bank (SNS)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-lg font-medium text-zinc-100">€ 18.500,00</div>
          <div className="text-xs text-zinc-500 mt-1">Updated 10m ago</div>
        </div>
        <div className="p-4 bg-[#0e0e11] border border-blue-900/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Mollie Gateway</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="text-lg font-medium text-zinc-100">€ 3.450,00 <span className="text-xs text-zinc-500 font-normal">clearing</span></div>
          <div className="text-xs text-zinc-500 mt-1">92 transactions today</div>
        </div>
        <div className="p-4 bg-[#0e0e11] border border-purple-900/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Belastingdienst</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-lg font-medium text-zinc-100">€ 8.940,21 <span className="text-xs text-zinc-500 font-normal">BTW Q3</span></div>
          <div className="text-xs text-zinc-500 mt-1">Auto-reserving active</div>
        </div>
      </div>

      {/* Bookkeeper Agent Log */}
      <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/20 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Chief Accounting Officer (Log)</h3>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">STATUS: COMPLIANT</span>
        </div>
        <div className="divide-y divide-zinc-800/50">
          <div className="p-4 flex items-start gap-4 hover:bg-zinc-900/30">
            <div className="mt-0.5 text-blue-400"><DollarSign className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-medium text-zinc-200">Mollie Payout Matched</div>
              <div className="text-xs text-zinc-500 mt-1">Automatically matched €1,245.00 payout from Mollie to 14 individual SaaS invoices. Books are reconciled.</div>
            </div>
            <div className="ml-auto text-[10px] font-mono text-zinc-600">10:42 AM</div>
          </div>
          <div className="p-4 flex items-start gap-4 hover:bg-zinc-900/30">
            <div className="mt-0.5 text-purple-400"><FolderGit2 className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-medium text-zinc-200">New Tax Regulation Applied</div>
              <div className="text-xs text-zinc-500 mt-1">Detected update in Dutch KOR (Kleineondernemersregeling) limits for 2026. Applied changes to forecasting models. No action required.</div>
            </div>
            <div className="ml-auto text-[10px] font-mono text-zinc-600">08:15 AM</div>
          </div>
          <div className="p-4 flex items-start gap-4 hover:bg-zinc-900/30">
            <div className="mt-0.5 text-amber-400"><ShieldAlert className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-medium text-zinc-200">Private Expense Warning</div>
              <div className="text-xs text-zinc-500 mt-1">Transaction of €45.00 at "Albert Heijn" on Business Account flagged as Private Expense. Pushed to Review Queue for approval to reclassify.</div>
            </div>
            <div className="ml-auto text-[10px] font-mono text-zinc-600">YESTERDAY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
