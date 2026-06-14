'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Button } from '@/components/ui/Button';

function PulsatingBrain({ isSpeaking, analyzer }: { isSpeaking: boolean, analyzer: AnalyserNode | null }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Default slow pulse
    let scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    let distort = 0.4;
    
    // If speaking, react to audio frequencies
    if (isSpeaking && analyzer) {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      
      // Get average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const audioScale = average / 128; // Normalize somewhat
      
      scale = 1 + audioScale * 0.3;
      distort = 0.4 + audioScale * 0.5;
    }
    
    meshRef.current.scale.set(scale, scale, scale);
    meshRef.current.material.distort = distort;
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]}>
      <MeshDistortMaterial
        color={isSpeaking ? "#d4af37" : "#1a365d"} // Gold when speaking, Navy when idle
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.8}
        roughness={0.2}
        speed={isSpeaking ? 5 : 2}
      />
    </Sphere>
  );
}

export default function OrionDemoPage() {
  const [text, setText] = useState("Welcome to the Swarm, commander. I am Orion. My systems are fully operational.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speak = async () => {
    if (!text) return;
    
    setIsSpeaking(true);
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      
      // Setup Audio Analyzer for 3D reactivity
      const newAnalyzer = ctx.createAnalyser();
      newAnalyzer.fftSize = 256;
      source.connect(newAnalyzer);
      newAnalyzer.connect(ctx.destination);
      setAnalyzer(newAnalyzer);
      
      source.start(0);
      
      source.onended = () => {
        setIsSpeaking(false);
      };
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center p-6 bg-black/50 rounded-2xl border border-white/10">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">ORION: Sentient Prototype</h1>
        <p className="text-textSecondary">Test de zware 'Vin Diesel' achtige stem en de audio-reactieve 3D kern.</p>
      </div>
      
      {/* 3D Canvas */}
      <div className="w-full h-[400px] mb-8 relative rounded-xl overflow-hidden border border-white/5 bg-navy/20">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#d4af37" intensity={2} />
          <PulsatingBrain isSpeaking={isSpeaking} analyzer={analyzer} />
          <OrbitControls enableZoom={false} autoRotate={!isSpeaking} autoRotateSpeed={2} />
        </Canvas>
        
        {/* Holographic Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none box-shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Controls */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface/50 border border-white/10 text-textPrimary resize-none h-24"
          placeholder="Typ wat Orion moet zeggen..."
        />
        <Button onClick={speak} disabled={isSpeaking} className="w-full py-6 text-lg font-bold">
          {isSpeaking ? 'ORION SPREEKT...' : 'ACTIVEER STEM (VIN DIESEL)'}
        </Button>
      </div>
    </div>
  );
}
