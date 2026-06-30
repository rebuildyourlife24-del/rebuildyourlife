'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere, Ring, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from './Button';
import { Mic, ShieldAlert } from 'lucide-react';

interface SatelliteCoreProps {
  theme?: 'blue';
}

function OrbitalCore({ isSpeaking, isPunishing }: { isSpeaking: boolean, isPunishing: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const mainColor = isPunishing ? '#06b6d4' : '#06b6d4'; // Red if punishing, Cyan if normal
  const glowColor = isPunishing ? '#164e63' : '#0891b2';

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Core breathing and distortion
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.2;
      coreRef.current.rotation.z = time * 0.1;
      const scale = isSpeaking ? 1.1 + Math.sin(time * (isPunishing ? 15 : 5)) * 0.05 : 1.0 + Math.sin(time * 2) * 0.02;
      coreRef.current.scale.set(scale, scale, scale);
    }

    // Rings rotating at different speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2;
      ring1Ref.current.rotation.y = time * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3;
      ring2Ref.current.rotation.y = -time * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 4;
      ring3Ref.current.rotation.y = time * 0.8;
    }
  });

  return (
    <group>
      {/* Liquid Core */}
      <Sphere ref={coreRef} args={[1, 64, 64]}>
        <MeshDistortMaterial 
          color={mainColor} 
          emissive={glowColor}
          emissiveIntensity={isSpeaking ? 2 : 0.5}
          distort={isSpeaking ? (isPunishing ? 0.6 : 0.3) : 0.1}
          speed={isSpeaking ? (isPunishing ? 8 : 4) : 2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Outer Rings */}
      <Ring ref={ring1Ref} args={[1.5, 1.55, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={mainColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </Ring>
      
      <Ring ref={ring2Ref} args={[2.0, 2.02, 64]} rotation={[-Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color={mainColor} transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>
      
      <Ring ref={ring3Ref} args={[2.5, 2.51, 64]} rotation={[-Math.PI / 4, 0, 0]}>
        <meshBasicMaterial color={mainColor} transparent opacity={0.8} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

export function SatelliteCore({ theme = 'blue' }: SatelliteCoreProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [punishmentProtocol, setPunishmentProtocol] = useState(false);

  const mainColorClass = punishmentProtocol ? 'text-gold' : 'text-cyan-400';
  const borderColorClass = punishmentProtocol ? 'border-gold/40' : 'border-cyan-500/40';
  const shadowClass = punishmentProtocol ? 'shadow-[0_0_80px_rgba(239,68,68,0.15)]' : 'shadow-[0_0_80px_rgba(34,211,238,0.15)]';
  const bgClass = punishmentProtocol ? 'bg-gold/10' : 'bg-cyan-500/10';

  return (
    <div className={`relative w-full h-[550px] bg-[#020617] rounded-3xl border ${borderColorClass} ${shadowClass} overflow-hidden flex flex-col group transition-all duration-500`}>
      {/* Background glow overlay */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] ${punishmentProtocol ? 'bg-gold/10' : 'bg-cyan-500/10'} hidden blur-[] pointer-events-none rounded-full transition-colors duration-1000`}></div>

      {/* 3D Canvas rendering the Satellite Core */}
      <div className="flex-1 relative z-10">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={punishmentProtocol ? 2 : 1} color={punishmentProtocol ? '#06b6d4' : '#06b6d4'} />
          <OrbitalCore isSpeaking={isSyncing} isPunishing={punishmentProtocol} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Canvas>

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
          <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${punishmentProtocol ? 'border-gold text-gold bg-[#0a192f]/50' : 'border-cyan-500 text-cyan-400 bg-cyan-950/50'} backdrop-blur-md rounded-full shadow-lg`}>
             {punishmentProtocol ? '[ IRON FIST: ENGAGED ]' : '[ STRATEGY: SERENE ]'}
          </div>
        </div>

        <div className="absolute top-6 right-6 pointer-events-auto">
          <button 
            onClick={() => setPunishmentProtocol(!punishmentProtocol)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${punishmentProtocol ? 'bg-gold text-white border-gold shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-black/50 border-cyan-500/50 text-cyan-500 hover:bg-cyan-900/50'}`}
          >
            <ShieldAlert className="w-3 h-3" />
            Punishment Protocol
          </button>
        </div>
      </div>

      {/* Voice / Comm Interface */}
      <div className="p-6 bg-black/60 border-t border-cyan-900/30 backdrop-blur-xl relative z-20">
        <div className="flex justify-between items-center relative z-10">
          <div className={`flex flex-col gap-1 ${mainColorClass} uppercase tracking-widest`}>
            <div className="flex items-center gap-2 text-xs font-black">
              <div className={`w-2 h-2 rounded-full ${isSyncing ? 'animate-ping' : ''} ${punishmentProtocol ? 'bg-gold' : 'bg-cyan-400'}`}></div>
              {isSyncing ? (punishmentProtocol ? "ESCALATING VERBAL REPRIMAND..." : "TRANSMITTING NEURAL LINK...") : "AI COUNCEL STANDBY"}
            </div>
            <div className={`text-[9px] font-bold opacity-50`}>
              {punishmentProtocol ? "WARNING: HOSTILE COACHING ACTIVE" : "OPTIMIZED FOR MENTAL WELLBEING"}
            </div>
          </div>
          
          <Button 
            onClick={() => setIsSyncing(!isSyncing)} 
            className={`${bgClass} border ${borderColorClass} ${mainColorClass} hover:bg-white hover:text-black font-black tracking-[0.2em] uppercase rounded-full transition-all px-8 py-6 shadow-lg`}
          >
            <Mic className="w-5 h-5 mr-3" />
            {isSyncing ? "TERMINATE" : "INITIATE"}
          </Button>
        </div>
      </div>
    </div>
  );
}

