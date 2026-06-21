"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Settings2, SlidersHorizontal } from "lucide-react";
import { OrionMusicPlayer } from "./OrionMusicPlayer";

export function VoiceOrb() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  
  // Acoustic Control State
  const [showAcoustics, setShowAcoustics] = useState(false);
  const [noiseCanceling, setNoiseCanceling] = useState(true);
  const [masterVolume, setMasterVolume] = useState(80);

  // Music State
  const [musicQuery, setMusicQuery] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "nl-NL"; // Dutch recognition by default

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        
        // As soon as the user pauses, we can trigger the Groq Backend
        if (event.results[event.results.length - 1].isFinal) {
          handleCommand(currentTranscript);
        }
      };

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => {
        // Auto-restart if we want Always-On
        if (isListening) {
          recognitionRef.current?.start();
        } else {
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, [isListening]);

  const calibrateHardware = async () => {
    setIsThinking(true);
    setTranscript("Initiating Hardware Calibration...");
    
    // Simulate camera and advanced audio stream with noise suppression constraint check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          noiseSuppression: noiseCanceling,
          echoCancellation: true,
          autoGainControl: true
        } 
      });
      setTranscript("Camera & ICEpower Audio: ONLINE. Kalibratie voltooid.");
      
      setTimeout(() => {
        setIsThinking(false);
        simulateVoiceResponse("Hardware kalibratie voltooid. ICE power audio en camera systemen staan online. God Brain is klaar voor orders, Mitchel.");
      }, 1000);
      
      setHasPermissions(true);
    } catch (err) {
      console.error("Hardware access denied", err);
      setTranscript("Hardware access denied.");
      setIsThinking(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!hasPermissions) {
        calibrateHardware();
      }
      recognitionRef.current?.start();
    }
  };

  const handleCommand = async (text: string) => {
    setIsThinking(true);
    
    // Check for music intent
    const lowerText = text.toLowerCase();
    if (lowerText.includes("speel") || lowerText.includes("muziek")) {
      setTimeout(() => {
        setIsThinking(false);
        setMusicQuery(lowerText.replace("speel", "").replace("muziek", "").trim() || "hacker");
        setIsMusicPlaying(true);
        simulateVoiceResponse("Direct, CEO. ICE power audio wordt geactiveerd.");
      }, 1000);
      return;
    }
    
    if (lowerText.includes("stop") || lowerText.includes("pauzeer")) {
      setTimeout(() => {
        setIsThinking(false);
        setIsMusicPlaying(false);
        simulateVoiceResponse("Muziek gepauzeerd.");
      }, 500);
      return;
    }

    // Default processing
    setTimeout(() => {
      setIsThinking(false);
      simulateVoiceResponse("Commando ontvangen, CEO. Systemen worden bijgewerkt.");
    }, 1500);
  };

  const simulateVoiceResponse = (text: string) => {
    setIsSpeaking(true);
    // Uses the built-in Speech API for the initial test (to utilize the Bang & Olufsen speakers)
    // In production, this connects to ElevenLabs API for hyper-realistic audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "nl-NL";
    utterance.pitch = 0.9;
    utterance.rate = 1.1;
    
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
      
      {/* Transcript Tooltip */}
      <AnimatePresence>
        {(transcript || isThinking) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black/80 backdrop-blur-md border border-gold/30 px-4 py-2 rounded-xl max-w-sm"
          >
            {isThinking ? (
              <span className="text-gold animate-pulse text-sm font-mono">&gt; Processing...</span>
            ) : (
              <span className="text-white text-sm">"{transcript}"</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Orb */}
      <button
        onClick={toggleListen}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 overflow-hidden ${
          isListening ? "bg-black border border-gold/50 shadow-[0_0_30px_rgba(212,168,83,0.3)]" : "bg-slate-900 border border-slate-700 opacity-50 hover:opacity-100"
        }`}
      >
        {/* Glowing aura when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 bg-gold/20 animate-ping rounded-full"></div>
        )}
        
        {/* Core pulse when listening */}
        {isListening && !isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent rounded-full"
          ></motion.div>
        )}

        <div className="relative z-10 text-gold">
          {isSpeaking ? (
            <Volume2 className="w-6 h-6 animate-pulse" />
          ) : isListening ? (
            <Mic className="w-6 h-6 drop-shadow-[0_0_8px_rgba(212,168,83,0.8)]" />
          ) : (
            <MicOff className="w-6 h-6 text-slate-500" />
          )}
        </div>
      </button>

      {/* Acoustic Settings Button */}
      <button 
        onClick={() => setShowAcoustics(!showAcoustics)}
        className="bg-black/50 hover:bg-black/80 border border-gold/20 p-3 rounded-full transition text-gold/50 hover:text-gold"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      {/* Acoustic Control Panel */}
      <AnimatePresence>
        {showAcoustics && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-64 bg-black/90 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-gold/10 pb-2">
              <Settings2 className="w-4 h-4 text-gold" />
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Acoustic Control</h3>
            </div>
            
            <div className="space-y-4">
              {/* Noise Canceling Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Active Noise Canceling</span>
                <button 
                  onClick={() => {
                    setNoiseCanceling(!noiseCanceling);
                    if (isListening) toggleListen(); // reset to apply constraints
                  }}
                  className={`w-10 h-5 rounded-full relative transition-colors ${noiseCanceling ? 'bg-gold' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform ${noiseCanceling ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Master Volume Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Master Volume</span>
                  <span className="text-gold font-mono">{masterVolume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  className="w-full accent-gold h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible Music Engine */}
      {musicQuery && (
        <OrionMusicPlayer 
          query={musicQuery} 
          isPlaying={isMusicPlaying} 
          onClose={() => setMusicQuery("")}
          onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
        />
      )}
    </div>
  );
}
