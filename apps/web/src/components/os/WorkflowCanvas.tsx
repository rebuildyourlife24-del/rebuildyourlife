"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node,
  Edge,
  Position,
  Handle,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Activity, Brain, Server, Shield, Zap } from 'lucide-react';

// Custom Node for Syndicate Agents
const SyndicateNode = ({ data }: any) => {
  return (
    <div className={`px-4 py-3 rounded-xl border backdrop-blur-md min-w-[180px] shadow-2xl transition-all ${
      data.status === 'active' 
        ? 'border-cyan-500/80 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
        : data.status === 'thinking'
        ? 'border-amber-500/80 bg-amber-950/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
        : 'border-white/10 bg-[#0d0d12]/80'
    }`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-zinc-500 border-none" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {data.icon}
          <span className="text-xs font-bold text-white uppercase tracking-widest">{data.label}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          data.status === 'active' ? 'bg-cyan-400 animate-pulse' : 
          data.status === 'thinking' ? 'bg-amber-400 animate-pulse' : 
          'bg-zinc-600'
        }`} />
      </div>
      <div className="text-[10px] text-zinc-400 font-mono mt-2">
        {data.task || "Awaiting instructions..."}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-zinc-500 border-none" />
    </div>
  );
};

const nodeTypes = {
  syndicate: SyndicateNode,
};

const initialNodes: Node[] = [
  {
    id: 'router',
    type: 'syndicate',
    position: { x: 250, y: 50 },
    data: { label: 'Hermes Router', icon: <Zap size={14} className="text-white"/>, status: 'idle', task: 'Listening on port 8000' }
  },
  {
    id: 'ceo',
    type: 'syndicate',
    position: { x: 250, y: 200 },
    data: { label: 'CEO Core', icon: <Brain size={14} className="text-white"/>, status: 'active', task: 'Evaluating global state' }
  },
  {
    id: 'cmo',
    type: 'syndicate',
    position: { x: 50, y: 350 },
    data: { label: 'Marketing (CMO)', icon: <Activity size={14} className="text-white"/>, status: 'idle', task: 'Ad optimization sleeping' }
  },
  {
    id: 'coo',
    type: 'syndicate',
    position: { x: 450, y: 350 },
    data: { label: 'Operations (COO)', icon: <Server size={14} className="text-white"/>, status: 'thinking', task: 'Checking server loads' }
  },
  {
    id: 'orion',
    type: 'syndicate',
    position: { x: 250, y: 500 },
    data: { label: 'Orion Memory', icon: <Shield size={14} className="text-white"/>, status: 'idle', task: 'Vector DB Sync' }
  }
];

const initialEdges: Edge[] = [
  { id: 'e-router-ceo', source: 'router', target: 'ceo', animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'e-ceo-cmo', source: 'ceo', target: 'cmo', animated: false, style: { stroke: '#3f3f46' } },
  { id: 'e-ceo-coo', source: 'ceo', target: 'coo', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-cmo-orion', source: 'cmo', target: 'orion', animated: false, style: { stroke: '#3f3f46' } },
  { id: 'e-coo-orion', source: 'coo', target: 'orion', animated: false, style: { stroke: '#3f3f46' } },
];

export default function WorkflowCanvas({ liveAgents }: { liveAgents: any[] }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    if (!liveAgents || liveAgents.length === 0) return;

    setNodes((nds) => 
      nds.map((node) => {
        let updatedStatus = node.data.status;
        let updatedTask = node.data.task;

        const liveMatch = liveAgents.find(ag => {
            if (node.id === 'cmo' && ag.id === 'market-analyzer') return true;
            if (node.id === 'ceo' && ag.id === 'decision-engine') return true;
            if (node.id === 'router' && ag.id === 'content-creator') return true;
            return false;
        });

        if (liveMatch) {
            updatedStatus = liveMatch.status;
            updatedTask = liveMatch.task;
        }

        return {
          ...node,
          data: {
            ...node.data,
            status: updatedStatus,
            task: updatedTask
          }
        };
      })
    );

  }, [liveAgents]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden" style={{ background: '#020203' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="dark"
      >
        <Background color="#3f3f46" gap={20} size={1} />
        <Controls className="bg-white/5 border border-white/10 fill-white text-white" />
      </ReactFlow>
    </div>
  );
}
