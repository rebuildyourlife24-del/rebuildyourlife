'use client';

import { useEffect, useRef, useState } from 'react';

export function SoundscapeEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API on first interaction
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Cinematic sub-bass hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(45, ctx.currentTime); // Low cinematic rumble
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2); // Fade in slowly
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        
        setIsPlaying(true);
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
        setIsPlaying(true);
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('scroll', initAudio, { once: true });

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('scroll', initAudio);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return null; // Invisible component
}
