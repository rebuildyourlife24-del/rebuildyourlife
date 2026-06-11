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
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

type Tab = "Overview" | "Operations" | "Marketing" | "SEO" | "Growth" | "Finance" | "Projects" | "AI_Activity" | "Reports" | "Knowledge" | "Settings";

export default function ControlCenter() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "Overview", label: "Executive Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "Operations", label: "Operations", icon: <Activity className="w-5 h-5" /> },
    { id: "Marketing", label: "Marketing", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "SEO", label: "SEO & Content", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "Growth", label: "Growth", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "Finance", label: "Finance", icon: <DollarSign className="w-5 h-5" /> },
    { id: "Projects", label: "Projects", icon: <FolderGit2 className="w-5 h-5" /> },
    { id: "AI_Activity", label: "AI Orchestration", icon: <Cpu className="w-5 h-5" /> },
    { id: "Reports", label: "Reports", icon: <FileText className="w-5 h-5" /> },
    { id: "Knowledge", label: "Knowledge Vault", icon: <Library className="w-5 h-5" /> },
    { id: "Settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-300 font-sans selection:bg-zinc-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800/50 bg-[#0c0c0e] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
          <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center mr-3">
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <span className="font-semibold text-zinc-100 tracking-wide text-sm">REBUILD OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4 px-3">Control Center</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-zinc-800/80 text-zinc-100 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#09090b]">
        
        {/* TOPBAR */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md z-10 sticky top-0">
          <h1 className="text-xl font-medium text-zinc-100 tracking-tight">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <div className="relative group cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#09090b]" />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-zinc-800/50">
              <div className="text-right">
                <div className="text-sm font-medium text-zinc-200">Henk Semler</div>
                <div className="text-xs text-zinc-500">Supreme Overseer</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                HS
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "AI_Activity" && <AIActivityTab />}
          {/* Other tabs will go here */}
          {activeTab !== "Overview" && activeTab !== "AI_Activity" && (
            <div className="flex items-center justify-center h-full text-zinc-600 font-medium">
              {navItems.find(i => i.id === activeTab)?.label} module is loading...
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 5: EXECUTIVE OVERVIEW WIDGETS
// ---------------------------------------------------------------------------
function OverviewTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="€24,500" trend="+12.5%" />
        <StatCard title="Active Campaigns" value="14" trend="Optimal" isNeutral />
        <StatCard title="System Alerts" value="2" trend="-1 from yesterday" isNeutral />
        <StatCard title="AI Tasks Completed" value="842" trend="+124 today" />
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CEO Widget */}
        <div className="lg:col-span-2 bg-[#0c0c0e] border border-zinc-800/60 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-zinc-100 tracking-wide">Revenue Forecast</h3>
            <select className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 rounded-md px-2 py-1 outline-none">
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-zinc-800/50 rounded-lg bg-zinc-900/20 text-zinc-600 text-sm">
            [Chart Area: Revenue Progression]
          </div>
        </div>

        {/* COO / Action Widget */}
        <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-medium text-zinc-100 tracking-wide mb-6">Action Queue (Review Mode)</h3>
          
          <div className="flex-1 space-y-3">
            <ActionCard title="Publish new SEO Strategy" agent="SEO Agent" priority="High" />
            <ActionCard title="Approve Ad Spend Increase" agent="CMO Agent" priority="Medium" />
            <ActionCard title="Merge Duplicate Leads" agent="Data Agent" priority="Low" />
          </div>

          <button className="w-full mt-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-sm font-medium transition-colors">
            Go to Review Queue
          </button>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isNeutral = false }: { title: string; value: string; trend: string; isNeutral?: boolean }) {
  return (
    <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-xl p-5 shadow-sm">
      <h4 className="text-xs font-medium text-zinc-500 tracking-wide mb-2">{title}</h4>
      <div className="text-2xl font-semibold text-zinc-100 mb-2">{value}</div>
      <div className={`text-xs font-medium ${isNeutral ? 'text-zinc-500' : 'text-emerald-500'}`}>
        {trend}
      </div>
    </div>
  );
}

function ActionCard({ title, agent, priority }: { title: string; agent: string; priority: string }) {
  return (
    <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-start gap-3 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
      <div className="mt-0.5">
        <Clock className="w-4 h-4 text-amber-500/70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-200 truncate">{title}</div>
        <div className="text-xs text-zinc-500 mt-1">Suggested by {agent}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER 4: HUMAN CONTROL / AI ACTIVITY QUEUE
// ---------------------------------------------------------------------------
function AIActivityTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-100">Review Queue</h2>
          <p className="text-sm text-zinc-500 mt-1">Items waiting for Human Approval before execution.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
            Reject All
          </button>
          <button className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-sm font-medium transition-colors">
            Approve Selected
          </button>
        </div>
      </div>

      <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-xl shadow-sm divide-y divide-zinc-800/50">
        <ReviewItem 
          title="Update Meta Tags for 15 URLs" 
          agent="SEO Agent" 
          impact="+12% CTR expected" 
          location="/SEO/Technical SEO"
        />
        <ReviewItem 
          title="Pause Underperforming Campaign (AdSet-4)" 
          agent="CMO Agent" 
          impact="€45/day savings" 
          location="/Marketing/Campaigns"
        />
        <ReviewItem 
          title="Archive 104 dead leads" 
          agent="Data Intelligence Agent" 
          impact="Database cleanup" 
          location="/Data/Scraper leads"
        />
      </div>
    </div>
  );
}

function ReviewItem({ title, agent, impact, location }: { title: string; agent: string; impact: string; location: string }) {
  return (
    <div className="p-5 flex items-center justify-between group hover:bg-zinc-900/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="mt-1 w-4 h-4 rounded border border-zinc-700 bg-zinc-900 cursor-pointer" />
        <div>
          <div className="text-sm font-medium text-zinc-200 mb-1">{title}</div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> {agent}</span>
            <span className="flex items-center gap-1.5"><FolderGit2 className="w-3.5 h-3.5" /> {location}</span>
            <span className="text-emerald-500/80">{impact}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Reject">
          <XCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Approve">
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
