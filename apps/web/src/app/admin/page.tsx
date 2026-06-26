'use client';

import { 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  AlertTriangle, 
  Target, 
  DollarSign, 
  Activity, 
  Mic, 
  Users, 
  Power, 
  Cpu, 
  Terminal, 
  Layers,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrionEye } from '@/components/ui/OrionEye';
import { useState, useEffect } from 'react';
import { api, formatCurrency } from '@/lib/api';

export default function CommandCenterPage() {
  const [singularityActive, setSingularityActive] = useState(false);
  const [listening, setListening] = useState(false);
  
  // God Mode Database live states
  const [stats, setStats] = useState({ totalUsers: 0, activeFranchises: 0, platformCutsRevenue: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navy Matrix Terminal logs
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "INIT SYSTEM cyan GOD MODE CONSOLE...",
    "ESTABLISHING SECURE PROTOCOLS...",
    "SUPREME OVERSEER CLEARANCE GRANTED."
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const statsRes = await api.get<{ totalUsers: number; activeFranchises: number; platformCutsRevenue: number }>('/admin/stats');
      const usersRes = await api.get<any[]>('/admin/users');
      const franchisesRes = await api.get<any[]>('/admin/franchises');

      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (franchisesRes.data) setFranchises(franchisesRes.data);

      setTerminalOutput(prev => [
        ...prev,
        `[OK] LIVE STATS SYNCED: Users: ${statsRes.data?.totalUsers || 0}, Active Franchises: ${statsRes.data?.activeFranchises || 0}`,
        `[OK] SYNCED ${usersRes.data?.length || 0} USER NODES`,
        `[OK] SYNCED ${franchisesRes.data?.length || 0} FRANCHISE NODES`,
        `[SYSTEM_cyan] ONLINE AND AWAITING COMMAND.`
      ]);
    } catch (err: any) {
      setError(err.message || 'Fout bij het laden van live database.');
      setTerminalOutput(prev => [...prev, `[FAIL] CONNECTION TO DATABASE DEGRADED: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: { subscriptionTier?: string; role?: string; clearanceLevel?: number }) => {
    try {
      setTerminalOutput(prev => [...prev, `[SEND] PATCH NODE user:${userId} -> ${JSON.stringify(updates)}`]);
      await api.patch(`/admin/users/${userId}`, updates);
      setTerminalOutput(prev => [...prev, `[OK] NODE user:${userId} STABILIZED.`]);
      
      // Update local state to reflect changes instantly
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...updates } : u));
      
      // Re-fetch stats in background
      const statsRes = await api.get<{ totalUsers: number; activeFranchises: number; platformCutsRevenue: number }>('/admin/stats');
      if (statsRes.data) setStats(statsRes.data);
    } catch (err: any) {
      setTerminalOutput(prev => [...prev, `[FAIL] UPDATE FAILED: ${err.message}`]);
    }
  };

  const handleToggleFranchise = async (franchiseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setTerminalOutput(prev => [...prev, `[SEND] PATCH NODE franchise:${franchiseId} -> status:${newStatus}`]);
      await api.patch(`/admin/franchises/${franchiseId}/status`, { status: newStatus });
      setTerminalOutput(prev => [...prev, `[OK] NODE franchise:${franchiseId} STATUS SET TO ${newStatus}.`]);
      
      // Update local state to reflect changes instantly
      setFranchises(prevFrans => prevFrans.map(f => f.id === franchiseId ? { ...f, status: newStatus } : f));
      
      // Re-fetch stats in background
      const statsRes = await api.get<{ totalUsers: number; activeFranchises: number; platformCutsRevenue: number }>('/admin/stats');
      if (statsRes.data) setStats(statsRes.data);
    } catch (err: any) {
      setTerminalOutput(prev => [...prev, `[FAIL] FRANCHISE STATUS TOGGLE FAILED: ${err.message}`]);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      setTimeout(() => {
        try {
          recognition.start();
        } catch (e) {}
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase();
      if (command.includes('swarm') || command.includes('initiate swarm') || command.includes('apex')) {
        setSingularityActive(true);
        setTerminalOutput(prev => [...prev, "[VOICE] APEX PcyanATOR MODE ENGAGED VIA VOICE CORE."]);
      }
      if (command.includes('deactivate') || command.includes('stop')) {
        setSingularityActive(false);
        setTerminalOutput(prev => [...prev, "[VOICE] DECONSTRUCTING APEX PcyanATOR HIERARCHY."]);
      }
    };

    try {
      recognition.start();
    } catch (e) {}

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-gold font-mono">
      
      {/* Header - System cyan Aesthetics */}
      <div className="bg-black border border-gold/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#112240] to-transparent"></div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            THE ARCHITECT <span className="text-gold">GOD-MODE</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gold/80 tracking-widest text-xs uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping"></span>
              Sovereign Grid Overseer Panel
            </p>
            {listening && (
              <span className="flex items-center gap-1 text-[10px] text-gold border border-gold/40 px-2 py-0.5 rounded animate-pulse bg-[#0a192f]/20">
                <Mic className="w-3 h-3" /> VOICE CORE ACTIVE
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={fetchData} 
            className="bg-black border border-gold/40 hover:bg-[#0a192f]/20 text-gold px-4 py-2 flex items-center gap-2 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Database
          </Button>
          <div className="flex items-center gap-3 bg-black p-3 rounded-xl border border-gold/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.1)]">
            <FolderLock className="w-5 h-5 text-gold" />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Clearance Level</p>
              <p className="text-sm font-bold text-white">Lvl 10 (Supreme Overseer)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Live Stats - Navy Matrix cyan style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Card 1: Users */}
        <div className="bg-black border border-gold/20 rounded-2xl p-6 relative overflow-hidden group hover:border-gold/50 transition-colors duration-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24 text-gold" />
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Total Matrix Nodes (Users)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              {loading ? '...' : stats.totalUsers}
            </p>
            <span className="text-gold text-xs font-bold">Nodes</span>
          </div>
          <div className="w-full bg-[#0a192f]/40 h-[2px] mt-4 overflow-hidden relative">
            <div className="absolute h-full bg-gold w-2/3 animate-pulse"></div>
          </div>
        </div>

        {/* Stat Card 2: Active Franchises */}
        <div className="bg-black border border-gold/20 rounded-2xl p-6 relative overflow-hidden group hover:border-gold/50 transition-colors duration-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-24 h-24 text-gold" />
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Active Sub-Matrix Cores (Franchises)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              {loading ? '...' : stats.activeFranchises}
            </p>
            <span className="text-gold text-xs font-bold">Active Cores</span>
          </div>
          <div className="w-full bg-[#0a192f]/40 h-[2px] mt-4 overflow-hidden relative">
            <div className="absolute h-full bg-gold w-1/2 animate-pulse"></div>
          </div>
        </div>

        {/* Stat Card 3: Platform Cuts Revenue */}
        <div className="bg-black border border-gold/20 rounded-2xl p-6 relative overflow-hidden group hover:border-gold/50 transition-colors duration-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-24 h-24 text-gold" />
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Architect Platform Revenue (25% Cut)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              {loading ? '...' : formatCurrency(stats.platformCutsRevenue)}
            </p>
            <span className="text-gold text-xs font-bold">EUR</span>
          </div>
          <div className="w-full bg-[#0a192f]/40 h-[2px] mt-4 overflow-hidden relative">
            <div className="absolute h-full bg-gold w-3/4 animate-pulse"></div>
          </div>
        </div>

      </div>

      {/* 3D MAP & INTERACTIVE CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Orion Eye, Singularity & Console logs */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="w-full">
            <OrionEye apexMode={singularityActive} />
          </div>

          {/* SINGULARITY SWITCH */}
          <div className="bg-black border border-gold/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.05)] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${singularityActive ? 'bg-gold/20 text-gold animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-zinc-950 text-zinc-600 border border-zinc-800'}`}>
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Apex Singularity Core</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {singularityActive ? 'MAX AGGRESSION PROTOCOLS ACTIVE.' : 'STANDARD RESTRICTED OPERATION.'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setSingularityActive(!singularityActive);
                setTerminalOutput(prev => [
                  ...prev,
                  singularityActive ? "[WARN] DEACTIVATING APEX PROTOCOLS." : "[ALERT] CORE ENGAGING APEX MODE."
                ]);
              }}
              className={`w-full py-4 text-xs font-bold uppercase tracking-widest border-none transition-all duration-500 ${
                singularityActive 
                  ? 'bg-gold hover:bg-[#0a192f] text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                  : 'bg-zinc-950 hover:bg-zinc-900 text-gold border border-gold/30'
              }`}
            >
              {singularityActive ? 'Deactivate' : 'Engage Apex Mode'}
            </Button>
          </div>

          {/* Navy Matrix Console Output */}
          <div className="bg-black border border-gold/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(239,68,68,0.02)] flex flex-col h-[280px]">
            <div className="flex justify-between items-center pb-2 border-b border-gold/20 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-gold" />
                Live Node Courier Logs
              </span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0a192f]"></span>
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto text-[10px] space-y-1.5 pr-2 font-mono scrollbar-thin scrollbar-thumb-cyan-950">
              {terminalOutput.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#d4af37] font-bold">[{idx}]</span>
                  <span className={log.includes('[ERROR]') || log.includes('[FAIL]') ? 'text-goldLight font-bold' : log.includes('[OK]') ? 'text-emerald-500' : 'text-zinc-400'}>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: User Matrix & Franchise Nodes Grid */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* USER HIERARCHY MATRIX */}
          <div className="bg-black border border-gold/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <Users className="w-5 h-5 text-gold" /> User Matrix Core
              </h2>
              <span className="text-xs bg-[#0a192f]/50 text-gold border border-[#d4af37] px-2 py-0.5 rounded uppercase font-bold">
                {users.length} Nodes Registecyan
              </span>
            </div>

            {error && (
              <div className="bg-[#0a192f]/20 border border-gold/40 p-4 rounded-xl text-xs text-goldLight mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gold/10 text-zinc-500 uppercase tracking-widest text-[9px]">
                    <th className="py-3 px-2">Node Info</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Tier Level</th>
                    <th className="py-3 px-2 text-right">Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/5 text-zinc-300">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 animate-pulse">Syncing nodes with grid...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-600">No nodes detected in this sector.</td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-[#0a192f]/10 transition-colors group">
                        <td className="py-3 px-2">
                          <div className="font-bold text-white group-hover:text-goldLight transition-colors">{u.firstName} {u.lastName}</div>
                          <div className="text-[10px] text-zinc-500">{u.email}</div>
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                            className="bg-black border border-gold/20 rounded px-2 py-1 text-[10px] text-gold focus:outline-none focus:border-gold"
                          >
                            <option value="USER">USER</option>
                            <option value="PREMIUM">PREMIUM</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPREME_OVERSEER">SUPREME_OVERSEER</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={u.subscriptionTier} 
                            onChange={(e) => handleUpdateUser(u.id, { subscriptionTier: e.target.value })}
                            className="bg-black border border-gold/20 rounded px-2 py-1 text-[10px] text-gold focus:outline-none focus:border-gold"
                          >
                            <option value="FREE">FREE</option>
                            <option value="BASIC">BASIC</option>
                            <option value="PREMIUM">PREMIUM</option>
                            <option value="ENTERPRISE">ENTERPRISE</option>
                            <option value="ECOM">ECOM (Tier 2)</option>
                            <option value="TECH">TECH (Tier 3)</option>
                            <option value="ELITE">ELITE (Tier 4)</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <select 
                            value={u.clearanceLevel} 
                            onChange={(e) => handleUpdateUser(u.id, { clearanceLevel: parseInt(e.target.value) })}
                            className="bg-black border border-gold/20 rounded px-2 py-1 text-[10px] text-gold focus:outline-none focus:border-gold text-right"
                          >
                            {[1,2,3,4,5,6,7,8,9,10].map(lvl => (
                              <option key={lvl} value={lvl}>Lvl {lvl}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FRANCHISE CORE NODES */}
          <div className="bg-black border border-gold/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <Layers className="w-5 h-5 text-gold" /> Franchise Nodes Matrix
              </h2>
              <span className="text-xs bg-[#0a192f]/50 text-gold border border-[#d4af37] px-2 py-0.5 rounded uppercase font-bold">
                {franchises.length} Cores Managed
              </span>
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gold/10 text-zinc-500 uppercase tracking-widest text-[9px]">
                    <th className="py-3 px-2">Franchise</th>
                    <th className="py-3 px-2">Subdomain</th>
                    <th className="py-3 px-2">Omzet</th>
                    <th className="py-3 px-2">Platform Cut (25%)</th>
                    <th className="py-3 px-2 text-right">Access State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/5 text-zinc-300">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500 animate-pulse">Syncing franchise nodes...</td>
                    </tr>
                  ) : franchises.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-600">No active franchises registecyan.</td>
                    </tr>
                  ) : (
                    franchises.map(f => (
                      <tr key={f.id} className="hover:bg-[#0a192f]/10 transition-colors group">
                        <td className="py-3 px-2">
                          <div className="font-bold text-white group-hover:text-goldLight transition-colors">{f.name}</div>
                          <div className="text-[10px] text-zinc-500">Owner: {f.user?.firstName} {f.user?.lastName}</div>
                        </td>
                        <td className="py-3 px-2 text-zinc-400">
                          {f.subdomain}.rebuildyourlife.eu
                        </td>
                        <td className="py-3 px-2 font-bold text-zinc-200">
                          {formatCurrency(f.revenue || 0)}
                        </td>
                        <td className="py-3 px-2 text-gold font-bold">
                          {formatCurrency(f.platformCutTotal || (f.revenue * 0.25) || 0)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleToggleFranchise(f.id, f.status)}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold tracking-widest transition-all duration-300 ${
                              f.status === 'ACTIVE' 
                                ? 'bg-[#0a192f]/30 text-gold border-gold/40 hover:bg-gold/20' 
                                : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-white hover:bg-zinc-900'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 justify-end">
                              <Power className="w-3 h-3" />
                              {f.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

