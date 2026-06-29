'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from './Button';
import { Mic, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface NeuralSwarmProps {
  theme?: 'red' | 'blue' | 'cyan' | 'purple';
}

// Data nodes that orbit the core
const MOCK_NODES = [
  { id: '1', label: 'Meta Ad #001', type: 'marketing', status: 'active', color: '#10b981', position: [3, 1, 0] },
  { id: '2', label: 'Shopify Sync', type: 'system', status: 'active', color: '#3b82f6', position: [-2, 2, 2] },
  { id: '3', label: 'Overdue Debt', type: 'finance', status: 'alert', color: '#ef4444', position: [1, -2, -2] },
  { id: '4', label: 'AI Hermes', type: 'agent', status: 'idle', color: '#f59e0b', position: [-3, -1, 1] },
];

function DataNode({ data, onClick }: { data: any, onClick: (data: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Small floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + data.id) * 0.005;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={data.position as [number, number, number]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'crosshair'; }}
      onClick={(e) => { e.stopPropagation(); onClick(data); }}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={hovered ? '#ffffff' : data.color} 
        emissive={data.color} 
        emissiveIntensity={hovered ? 3 : 1} 
      />
      {hovered && (
        <Html distanceFactor={10} position={[0, 0.3, 0]} center>
          <div className="bg-black/90 border border-[#06b6d4]/50 px-3 py-1.5 rounded-lg text-white font-mono text-[10px] whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="font-bold text-[#06b6d4]">{data.label}</span>
            <span className="block text-zinc-500 text-[8px] mt-0.5">Click to inspect</span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function SwarmCore({ isSpeaking, onNodeClick }: { isSpeaking: boolean, onNodeClick: (data: any) => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const particleCount = 100;
  
  // Setup generic background swarm
  const { positions, lineGeometry } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const lineIndices: number[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      lineIndices.push(i, particleCount);
    }

    const finalPos = new Float32Array((particleCount + 1) * 3);
    finalPos.set(pos);
    finalPos[particleCount * 3] = 0;
    finalPos[particleCount * 3 + 1] = 0;
    finalPos[particleCount * 3 + 2] = 0;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(finalPos, 3));
    geometry.setIndex(lineIndices);

    return { positions: finalPos, lineGeometry: geometry };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05;
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = isSpeaking ? 0.2 + Math.sin(time * 5) * 0.1 : 0.05;
    }
    if (coreRef.current) {
      const scale = isSpeaking ? 1.2 + Math.sin(time * 8) * 0.1 : 1.0 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Central Godbrain */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshBasicMaterial color="#06b6d4" wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Interactive Data Nodes */}
      {MOCK_NODES.map(node => (
        <DataNode key={node.id} data={node} onClick={onNodeClick} />
      ))}

      {/* Background Streams */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#0ea5e9" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Background Particles */}
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial transparent color="#22d3ee" size={0.05} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Points>
    </group>
  );
}

export function NeuralSwarm({ theme = 'cyan' }: NeuralSwarmProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeClick = (data: any) => {
    setSelectedNode(data);
    // Vibrate device if mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="relative w-full h-[500px] bg-[#050505] rounded-none border-2 border-[#06b6d4]/40 shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col group">
      {/* 3D Canvas */}
      <div className="flex-1 relative cursor-crosshair z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
          <SwarmCore isSpeaking={isSyncing} onNodeClick={handleNodeClick} />
          <OrbitControls enableZoom={true} maxDistance={15} minDistance={3} autoRotate={!selectedNode} autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Canvas>

        {/* Tactical Overlays */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.5)]">
             [ INTERACTIVE SWARM ACTIVE ]
          </div>
          <p className="text-zinc-500 text-[9px] font-mono mt-2 uppercase tracking-widest">
            {selectedNode ? 'TARGET ACQUIRED' : 'HOVER OR DRAG TO INSPECT NODES'}
          </p>
        </div>

        {/* Selected Node Info Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-64 bg-black/90 border border-cyan-500/50 p-4 rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-in slide-in-from-right-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-cyan-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <Activity className="w-4 h-4" /> NODE_DETAILS
              </h3>
              <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">IDENTIFIER</span>
                <span className="text-white font-bold">{selectedNode.label}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">TYPE</span>
                <span className="text-white uppercase">{selectedNode.type}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">STATUS</span>
                <span className={`uppercase font-bold ${selectedNode.status === 'alert' ? 'text-red-400' : 'text-green-400'}`}>
                  {selectedNode.status}
                </span>
              </div>
            </div>
            {selectedNode.status === 'alert' && (
              <button className="w-full mt-3 bg-red-500/20 text-red-400 border border-red-500 hover:bg-red-500 hover:text-black py-1.5 rounded uppercase tracking-widest text-[9px] font-bold transition-colors">
                RESOLVE THREAT
              </button>
            )}
            {selectedNode.status === 'active' && (
              <button className="w-full mt-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500 hover:bg-cyan-500 hover:text-black py-1.5 rounded uppercase tracking-widest text-[9px] font-bold transition-colors">
                VIEW METRICS
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Interface */}
      <div className="p-4 bg-black/80 border-t-2 border-[#06b6d4]/30 backdrop-blur-md relative z-20">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4 text-[#06b6d4] font-black text-xs uppercase tracking-widest">
            <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-[#06b6d4] animate-ping' : 'bg-[#06b6d4]/30'}`}></div>
            {isSyncing ? "SYNCING LIVE DATA..." : "SWARM IDLE. ROTATE TO INSPECT."}
          </div>
          <Button 
            onClick={() => setIsSyncing(!isSyncing)} 
            className="bg-[#06b6d4]/10 border-2 border-[#06b6d4]/50 text-[#06b6d4] hover:bg-[#06b6d4] hover:text-black font-black tracking-widest uppercase rounded-none transition-all"
          >
            <Cpu className="w-4 h-4 mr-2" />
            {isSyncing ? "STOP SYNC" : "SYNC LIVE NODES"}
          </Button>
        </div>
      </div>
    </div>
  );
}

