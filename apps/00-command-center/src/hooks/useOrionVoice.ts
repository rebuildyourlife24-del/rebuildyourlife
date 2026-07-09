"use client";

import { useEffect, useState, useCallback } from 'react';

export function useOrionVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Initialize Voice
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a male Dutch/English voice suitable for AI
      const preferred = voices.find(v => v.lang.includes('nl') && v.name.toLowerCase().includes('google')) 
                     || voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'))
                     || voices[0];
      setVoice(preferred || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    
    // Orion voice styling
    utterance.pitch = 0.8; // Lower pitch for authority
    utterance.rate = 1.1; // Slightly faster
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voice, isMuted]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) stop(); // Stop speaking if we mute
      return !prev;
    });
  }, [stop]);

  return {
    speak,
    stop,
    isSpeaking,
    isMuted,
    toggleMute
  };
}
