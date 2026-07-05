'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { SwarmBrain } from './SwarmBrain';
import { Button } from './Button';
import { Input } from './Input';

export function SwarmAvatar({ theme = 'blue' }: { theme?: 'blue' | 'red' }) {
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
    };
  }, []);

  const playAudio = async (base64Audio: string) => {
    if (!audioContextRef.current || !analyserRef.current) return;

    // Decode base64 to array buffer
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    try {
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      
      sourceRef.current = audioContextRef.current.createBufferSource();
      sourceRef.current.buffer = audioBuffer;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      sourceRef.current.onended = () => {
        setIsSpeaking(false);
      };

      setIsSpeaking(true);
      sourceRef.current.start(0);
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsSpeaking(false);
    }
  };

  const handleCommand = async () => {
    if (!input?.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    
    // Stop any currently playing audio
    if (sourceRef.current) {
      sourceRef.current.stop();
    }

    try {
      // 1. Get Text Response from Hermes (ChatGPT)
      const chatRes = await fetch('/api/hermes/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const chatData = await chatRes.json();
      
      if (!chatRes.ok || !chatData.reply) {
        setResponse("Systeemfout: Kan niet verbinden met Hermes. Controleer de API.");
        setLoading(false);
        return;
      }

      setResponse(chatData.reply);

      // 2. Convert Text to Speech (Vin Diesel / Onyx)
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chatData.reply, voice: 'onyx' }),
      });
      const ttsData = await ttsRes.json();

      if (ttsData.audio) {
        await playAudio(ttsData.audio);
      }
    } catch (err) {
      console.error("Swarm Avatar Error:", err);
      setResponse("Systeemfout: De verbinding is verbroken.");
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className={`relative w-full h-[500px] bg-[#050810] rounded-2xl border ${theme === 'red' ? 'border-[#06b6d4]/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]' : 'border-[#00f0ff]/20 shadow-[0_0_50px_rgba(0,240,255,0.05)]'} overflow-hidden flex flex-col`}>
      {/* 3D Canvas rendering the SwarmBrain */}
      <div className="flex-1 relative cursor-move">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color={theme === 'red' ? '#06b6d4' : '#00f0ff'} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={theme === 'red' ? '#0891b2' : '#d4a853'} />
          <SwarmBrain isSpeaking={isSpeaking} analyserRef={analyserRef} theme={theme} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isSpeaking} autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Canvas>

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-mono border ${isSpeaking ? (theme === 'red' ? 'border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4]' : 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]') : 'border-white/10 bg-black/50 text-white/50'}`}>
            {isSpeaking ? '● TRANSMITTING' : '○ IDLE'}
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-mono border border-[#d4a853]/50 bg-[#d4a853]/10 text-[#d4a853]">
            VOICE: ONYX (ALPHA)
          </div>
        </div>
      </div>

      {/* Control Interface */}
      <div className={`p-4 bg-black/60 border-t ${theme === 'red' ? 'border-[#06b6d4]/10' : 'border-[#00f0ff]/10'} backdrop-blur-md`}>
        {response && (
          <div className={`mb-4 p-3 ${theme === 'red' ? 'bg-[#06b6d4]/5 border-[#06b6d4] text-[#06b6d4]' : 'bg-[#00f0ff]/5 border-[#00f0ff] text-[#00f0ff]'} border-l-2 font-mono text-sm`}>
            &gt; {response}
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            placeholder="Command the Swarm..."
            disabled={loading}
            fullWidth
            className={`bg-black/50 border-${theme === 'red' ? '[#06b6d4]/30 focus:border-[#06b6d4] text-[#06b6d4]' : '[#00f0ff]/30 focus:border-[#00f0ff] text-[#00f0ff]'} font-mono`}
          />
          <Button 
            onClick={handleCommand} 
            disabled={!input?.trim() || loading}
            loading={loading}
            className={`${theme === 'red' ? 'bg-[#06b6d4]/10 border-[#06b6d4]/50 text-[#06b6d4] hover:bg-[#06b6d4]/20' : 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20'} border font-mono tracking-widest uppercase min-w-[120px]`}
          >
            EXECUTE
          </Button>
        </div>
      </div>
    </div>
  );
}
