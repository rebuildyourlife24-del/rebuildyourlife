'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Terminal, Play, CheckCircle2, AlertTriangle, Activity, Edit2, Save, X, MessageSquare } from 'lucide-react';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';
import { getAgents, updateAgent } from '@/actions/ai-team';
import { useCompletion } from '@ai-sdk/react';
import { useRequireAuth } from '@/lib/auth';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AITeamPage() {
  const auth = useRequireAuth();
  const router = useRouter();
  
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  
  // Task state
  const [taskInput, setTaskInput] = useState('');
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', role: '', department: '', systemPrompt: '' });
  const [saving, setSaving] = useState(false);

  // Streaming AI hook
  const { completion, complete, isLoading, stop, setCompletion } = useCompletion({
    api: '/api/ai-swarm',
    body: {
      agentId: selectedAgent?.id
    },
    onError: (error) => {
      console.error(error);
    }
  });

  useEffect(() => {
    if (auth.isAuthenticated && (auth.user?.subscriptionTier === 'ELITE' || auth.user?.role === 'SUPER_ADMIN')) {
      fetchAgents();
    } else {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.user]);

  const fetchAgents = async () => {
    const data = await getAgents();
    setAgents(data);
    if (data.length > 0 && !selectedAgent) setSelectedAgent(data[0]);
    setLoading(false);
  };

  const handleSelectAgent = (agent: any) => {
    setSelectedAgent(agent);
    setIsEditing(false);
    setTaskInput('');
    setCompletion(''); // clear previous stream
  };

  const handleDelegate = async () => {
    if (!taskInput?.trim() || !selectedAgent) return;
    setCompletion(''); // clear previous completion
    await complete(taskInput);
    setTaskInput(''); // clear input box
  };

  const startEdit = () => {
    setEditForm({
      name: selectedAgent.name,
      role: selectedAgent.role,
      department: selectedAgent.department,
      systemPrompt: selectedAgent.systemPrompt
    });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    const res = await updateAgent(selectedAgent.id, editForm);
    if (res.success) {
      await fetchAgents();
      setSelectedAgent({ ...selectedAgent, ...editForm });
      setIsEditing(false);
    } else {
      alert("Failed to save agent details.");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-64 h-64 opacity-50 relative pointer-events-none">
        <NeuralSwarm theme="cyan" />
      </div>
      <div className="text-cyan-500 font-mono text-sm uppercase tracking-widest animate-pulse">
        BEZIG MET LADEN...
      </div>
    </div>
  );

  if (auth.user?.subscriptionTier !== 'ELITE' && auth.user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-black text-white">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Classified Clearance Required</h1>
        <p className="text-gray-400 max-w-md mb-8">
          Jouw huidige clearance level staat de toegang tot de AI Boardroom niet toe. Upgrade naar het <strong>Elite Protocol</strong> om je eigen AI Swarm te ontgrendelen.
        </p>
        <button 
          onClick={() => router.push('/agency')}
          className="px-6 py-3 bg-red-900/50 hover:bg-red-800/80 text-red-200 border border-red-500/50 rounded-lg transition-colors font-medium"
        >
          Upgrade Clearance Level
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] p-6 text-white font-sans selection:bg-cyan-500/30 selection:text-white">
      
      {/* Header */}
      <div className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)] mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase flex items-center gap-4 text-white">
            AI TEAM <Network className="w-8 h-8 text-cyan-400" />
          </h1>
          <p className="text-cyan-400/60 mt-2 uppercase text-xs font-bold tracking-widest">
            Beheer en delegeer taken aan je leger van 500 autonome LLM-agenten via de Neural Swarm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Roster */}
        <div className="lg:col-span-1 space-y-4 h-[70vh] overflow-y-auto pr-2 hide-scrollbar">
          <div className="sticky top-0 bg-[#020202] z-10 pb-4 border-b border-white/10 mb-4">
             <h2 className="text-sm font-black uppercase tracking-widest text-white">Swarm Netwerk ({agents.length})</h2>
          </div>
          
          {agents.length === 0 ? (
            <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl text-xs text-zinc-500 uppercase tracking-widest text-center">
              Geen agenten gedetecteerd.
            </div>
          ) : (
            agents.map((agent: any) => (
              <div 
                key={agent.id} 
                onClick={() => handleSelectAgent(agent)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAgent?.id === agent.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan-500" /> {agent.name}
                  </h3>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ${agent.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {agent.status === 'ACTIVE' ? 'ACTIEF' : agent.status}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{agent.role}</p>
              </div>
            ))
          )}
        </div>

        {/* Active Agent Command Center */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col h-[70vh]"
            >
              {/* Background accent */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full hidden blur-[] pointer-events-none" />

              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4 relative z-10 shrink-0">
                <div>
                  {isEditing ? (
                     <input 
                       value={editForm.name} 
                       onChange={e => setEditForm({...editForm, name: e.target.value})}
                       className="text-2xl font-black uppercase tracking-widest bg-zinc-900 border border-cyan-500/50 rounded px-2 py-1 text-white focus:outline-none mb-2 w-full"
                     />
                  ) : (
                     <h2 className="text-2xl font-black uppercase text-white tracking-widest flex items-center gap-3">
                       {selectedAgent.name}
                       <button onClick={startEdit} className="text-zinc-500 hover:text-cyan-400 transition-colors">
                         <Edit2 className="w-4 h-4" />
                       </button>
                     </h2>
                  )}
                  
                  {isEditing ? (
                     <div className="flex gap-2 mt-2">
                       <input 
                         value={editForm.department} 
                         onChange={e => setEditForm({...editForm, department: e.target.value})}
                         className="text-sm font-bold uppercase tracking-widest bg-zinc-900 border border-white/20 rounded px-2 py-1 text-cyan-400 focus:outline-none w-1/2"
                         placeholder="Department"
                       />
                       <input 
                         value={editForm.role} 
                         onChange={e => setEditForm({...editForm, role: e.target.value})}
                         className="text-sm font-bold uppercase tracking-widest bg-zinc-900 border border-white/20 rounded px-2 py-1 text-zinc-400 focus:outline-none w-1/2"
                         placeholder="Role"
                       />
                     </div>
                  ) : (
                    <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mt-1">
                      {selectedAgent.department} <span className="text-zinc-500 mx-2">|</span> <span className="text-zinc-400">{selectedAgent.role}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Activity className={`w-5 h-5 ${isLoading ? 'text-cyan-400 animate-spin' : 'text-emerald-500 animate-pulse'}`} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto relative z-10 pr-2 hide-scrollbar flex flex-col gap-6">
                <div>
                  <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">
                    Systeem Prompt / Core Directive
                  </h3>
                  
                  {isEditing ? (
                     <textarea 
                       value={editForm.systemPrompt} 
                       onChange={e => setEditForm({...editForm, systemPrompt: e.target.value})}
                       className="w-full h-32 bg-zinc-900 border border-cyan-500/50 rounded-xl p-4 text-xs text-white font-mono focus:outline-none resize-none"
                     />
                  ) : (
                     <div className="bg-zinc-950/80 p-4 rounded-xl border border-white/5 text-xs text-cyan-50 font-mono leading-relaxed">
                       {selectedAgent.systemPrompt}
                     </div>
                  )}

                  {/* Edit Controls */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-2">
                       <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest rounded text-zinc-400 hover:bg-white/5">
                          <X className="w-4 h-4" />
                       </button>
                       <button onClick={saveEdit} disabled={saving} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-widest rounded shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                          {saving ? 'Bezig met opslaan...' : 'Wijzigingen Opslaan'} <Save className="w-4 h-4" />
                       </button>
                    </div>
                  )}
                </div>

                {/* AI Response Area */}
                {!isEditing && (completion || isLoading) && (
                  <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 mb-4">
                    <h3 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Reactie van {selectedAgent.name}
                    </h3>
                    <div className="text-sm text-cyan-50 whitespace-pre-wrap font-mono leading-relaxed">
                      {completion}
                      {isLoading && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />}
                    </div>
                  </div>
                )}
              </div>

              {/* Delegation Interface */}
              {!isEditing && (
                <div className="pt-4 border-t border-white/5 mt-4 shrink-0">
                  <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan-500" /> Directe Instructie
                  </h3>
                  <textarea
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder={`Geef een commando aan ${selectedAgent.name}...`}
                    className="w-full h-20 bg-zinc-950 border border-white/10 hover:border-cyan-500/30 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
                  />
                  
                  <div className="flex items-center justify-end mt-4">
                    <button
                      onClick={handleDelegate}
                      disabled={isLoading || !taskInput?.trim()}
                      className={`px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center gap-2 shrink-0 ${isLoading || !taskInput?.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? 'BEZIG MET VERWERKEN...' : 'INSTRUCTIE UITVOEREN'} <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-black/20 border border-white/5 rounded-2xl border-dashed">
              <AlertTriangle className="w-12 h-12 text-zinc-600 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Selecteer een Orion node om te configureren.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
