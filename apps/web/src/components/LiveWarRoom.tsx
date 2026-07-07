"use client";

import React, { useEffect, useState, useRef } from "react";
import { Activity, BrainCircuit, CheckCircle, Database, PlayCircle, ShieldAlert, Sparkles, TrendingUp, XCircle, Terminal } from "lucide-react";
import { ApprovalsMatrix } from "./ApprovalsMatrix";

import { getOperatorRank } from "@/actions/gamification";

export default function LiveWarRoom() {
  const [operatorRank, setOperatorRank] = useState({ level: 1, name: "Initiate", xp: 0, nextLevelXp: 1000, progress: 0 });
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [agents, setAgents] = useState([
    { id: "router", name: "Sovereign Router", role: "Traffic Controller", status: "idle", task: "Awaiting input" },
    { id: "ceo", name: "Orion", role: "Chief Executive", status: "idle", task: "Monitoring" },
    { id: "cmo", name: "Atlas", role: "Marketing Director", status: "idle", task: "Monitoring" },
    { id: "coo", name: "Sentinel", role: "Operations", status: "idle", task: "Monitoring" },
    { id: "orion", name: "Memory Core", role: "LTM Storage", status: "idle", task: "Indexing" }
  ]);
  const [memories, setMemories] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const rankData = await getOperatorRank();
        setOperatorRank(rankData);

        const memRes = await fetch("http://localhost:8000/api/intelligence/memory");
        if (memRes.ok) {
          const memData = await memRes.json();
          setMemories(memData.memories || []);
        }

        const campRes = await fetch("http://localhost:8000/api/marketing/campaigns");
        if (campRes.ok) {
          const campData = await campRes.json();
          setCampaigns(campData.campaigns || []);
        }
      } catch (err) {
        console.error("Failed to fetch War Room data", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s

    // Connect WebSocket
    const connectWs = () => {
      const ws = new WebSocket("ws://localhost:8000/ws/agents");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "AGENT_UPDATE" && data.payload?.agents) {
            // Update agent statuses
            setAgents(prev => {
              const newAgents = [...prev];
              data.payload.agents.forEach((agUpdate: any) => {
                const idx = newAgents.findIndex(a => a.id === agUpdate.id);
                if (idx !== -1) {
                  newAgents[idx] = { ...newAgents[idx], status: agUpdate.status, task: agUpdate.task };
                } else if (agUpdate.id !== "router" && agUpdate.id !== "ceo" && agUpdate.id !== "cmo" && agUpdate.id !== "coo" && agUpdate.id !== "orion") {
                    // It's a new dynamic agent from the 18 council
                    newAgents.push({ id: agUpdate.id, name: agUpdate.name || agUpdate.id, role: agUpdate.role || "Agent", status: agUpdate.status, task: agUpdate.task });
                }
              });
              return newAgents;
            });
          } else if (data.type === "WS_APPROVALS_UPDATE" && data.payload?.pending_approvals) {
            // Format incoming backend approvals for the ApprovalsMatrix
            const formattedApprovals = data.payload.pending_approvals.map((pa: any) => ({
              id: pa.id,
              agentType: pa.agent || "System",
              title: pa.action || "Pending Action",
              description: JSON.stringify(pa.details || {}).substring(0, 100),
              estimatedCost: 0, // Backend could provide this later
              estimatedRevenue: 0,
              riskLevel: "MEDIUM"
            }));
            
            setPendingApprovals(formattedApprovals);
            // Whenever there's a new update, re-fetch the operator rank just in case XP was awarded
            getOperatorRank().then(setOperatorRank);
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };

      ws.onclose = () => {
        setTimeout(connectWs, 3000); // Reconnect
      };
    };

    connectWs();

    return () => {
      clearInterval(interval);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* GAMIFICATION / RANK BADGE */}
      <section className="border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm relative overflow-hidden flex items-center justify-between">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-500 to-transparent opacity-50" />
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400 uppercase tracking-widest">
            <Sparkles className="w-6 h-6" />
            {operatorRank.name} (LVL {operatorRank.level})
          </h2>
          <p className="text-xs text-blue-700 uppercase mt-1">Operator Gamification Engine</p>
        </div>
        <div className="w-1/3 text-right">
          <div className="flex justify-between text-xs text-blue-500 mb-2 font-mono">
            <span>{operatorRank.xp} XP</span>
            <span>{operatorRank.nextLevelXp} XP (Next Rank)</span>
          </div>
          <div className="w-full bg-blue-950/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              style={{ width: `${operatorRank.progress}%` }} 
            />
          </div>
        </div>
      </section>

      {/* 0. GOVERNANCE PLANE (Pending Approvals) */}
      {pendingApprovals.length > 0 && (
        <section className="border border-yellow-900/50 bg-black/50 p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-500">
            <ShieldAlert className="w-5 h-5" />
            GOVERNANCE LOCK (PENDING APPROVALS)
          </h2>
          <ApprovalsMatrix initialActions={pendingApprovals} walletBalance={10000} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. ACTIVE COUNCIL (Agents) */}
      <section className="border border-green-900/50 bg-black/50 p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Database className="w-5 h-5" />
          ACTIVE COUNCIL ({agents.length})
        </h2>
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {agents.map(agent => (
            <div key={agent.id} className={`flex items-center justify-between p-3 border transition-colors ${agent.status !== 'idle' ? 'border-green-500 bg-green-900/20' : 'border-green-900/30 bg-green-950/10'}`}>
              <div className="flex flex-col flex-1 mr-4">
                <span className={`font-bold ${agent.status !== 'idle' ? 'text-green-400' : 'text-green-600'}`}>{agent.name}</span>
                <span className="text-xs text-green-700 uppercase">{agent.role}</span>
                <span className="text-xs text-green-400 mt-1 font-mono truncate w-full">{agent.task}</span>
              </div>
              {agent.status !== 'idle' ? (
                <Activity className="w-4 h-4 text-green-400 animate-pulse flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-green-800 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. EPISTEMIC GRID (Orion Memory) */}
      <section className="border border-green-900/50 bg-black/50 p-6 backdrop-blur-sm relative">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          ORION MEMORY STREAM
        </h2>
        <div className="space-y-4">
          {memories.map(mem => (
            <div key={mem.id} className="p-4 border border-green-900/50 bg-black">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs tracking-widest uppercase opacity-70">SYSTEM_DECISION</span>
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium mb-3">{mem.content}</p>
              <div className="flex items-center justify-between border-t border-green-900/50 pt-3 opacity-80">
                <span className="text-xs">INTENSITY: {mem.intensity}/10</span>
                <span className="text-xs text-green-500">{new Date(mem.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {memories.length === 0 && (
            <div className="text-center p-8 border border-dashed border-green-900/50 text-green-700">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
              NO MEMORIES DETECTED
            </div>
          )}
        </div>
      </section>

      {/* 3. CONTENT FACTORY (CMO Campaigns) */}
      <section className="border border-green-900/50 bg-black/50 p-6 backdrop-blur-sm relative">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          CMO CONTENT FACTORY
        </h2>
        <div className="space-y-6">
          {campaigns.map(camp => (
            <div key={camp.id} className="border border-green-900/50 overflow-hidden group">
              <div className="aspect-video bg-green-950/20 relative flex flex-col items-center justify-center border-b border-green-900/50 p-4">
                 <Terminal className="w-8 h-8 mb-2 opacity-50 text-green-600" />
                 <span className="text-xs uppercase tracking-widest text-green-500 mb-2">AD CREATIVE</span>
                 <p className="text-sm font-bold text-center text-green-300">
                   {camp.adSets?.[0]?.creatives?.[0]?.headline || "AI Generating Headline..."}
                 </p>
              </div>
              <div className="p-4 bg-black">
                <h3 className="text-sm font-bold truncate mb-1">{camp.campaignName}</h3>
                <p className="text-xs text-green-700 line-clamp-2">
                  {camp.adSets?.[0]?.creatives?.[0]?.body || "Processing body copy..."}
                </p>
                <div className="flex justify-between items-center mt-3 border-t border-green-900/30 pt-2">
                  <span className="text-xs opacity-60 uppercase">BUDGET: €{camp.budgetDaily}</span>
                  <span className="text-xs text-green-500">{camp.status}</span>
                </div>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="text-center p-8 border border-dashed border-green-900/50 text-green-700">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              NO ACTIVE CAMPAIGNS
            </div>
          )}
        </div>
      </section>

    </div>
    </div>
  );
}
