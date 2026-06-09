'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Rocket, Target, Zap, Brain, CheckCircle2, ChevronRight, Coins } from 'lucide-react';

const missions = [
  {
    id: 'debt-free',
    title: 'Schulden vrij worden',
    description: 'Neem controle over je financiën met AI-gedreven strategieën.',
    icon: Coins,
    color: 'text-gold',
    bg: 'bg-gold/10'
  },
  {
    id: 'life-balance',
    title: 'Levensbalans vinden',
    description: 'Optimaliseer je tijd, gezondheid en mentale rust.',
    icon: Brain,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10'
  },
  {
    id: 'productivity',
    title: 'Extreme productiviteit',
    description: 'Verdubbel je output zonder extra uren te werken.',
    icon: Zap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  }
];

const loadingSteps = [
  "AI Coworkers configureren...",
  "Neural pathways initialiseren...",
  "Klaar voor lancering"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  
  // Loading state variables
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (step === 3) {
      if (loadingProgress < 40) {
        setLoadingTextIndex(0);
      } else if (loadingProgress < 85) {
        setLoadingTextIndex(1);
      } else {
        setLoadingTextIndex(2);
      }
    }
  }, [loadingProgress, step]);

  const nextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-textPrimary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/10 text-gold border border-gold/20 shadow-glow">
                <Rocket className="w-12 h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Welkom bij <span className="text-transparent bg-clip-text bg-gradient-gold">RebuildYourLife</span>
              </h1>
              <p className="text-lg text-textSecondary mb-10 max-w-lg mx-auto leading-relaxed">
                Je persoonlijke AI Coworker Operating System. 
                Samen gaan we bouwen aan de beste versie van jouw leven. 
                Geen excuses, alleen resultaat.
              </p>
              <Button size="lg" onClick={nextStep} className="group">
                Start Initialisatie
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Selecteer je Primaire Missie</h2>
                <p className="text-textSecondary">
                  Kies je hoofddoel. Je AI Coworkers zullen zich hierop afstemmen.
                </p>
              </div>

              <div className="grid gap-4 mb-10">
                {missions.map((mission) => (
                  <Card 
                    key={mission.id}
                    variant={selectedMission === mission.id ? 'gold' : 'glass'}
                    hover
                    className={`transition-all duration-300 ${
                      selectedMission === mission.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedMission(mission.id)}
                  >
                    <div className="flex items-center p-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-6 ${mission.bg} ${mission.color}`}>
                        <mission.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold mb-1">{mission.title}</h3>
                        <p className="text-sm text-textSecondary">{mission.description}</p>
                      </div>
                      {selectedMission === mission.id && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }}
                          className="text-gold ml-4"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setStep(1)}>Terug</Button>
                <Button 
                  disabled={!selectedMission} 
                  onClick={nextStep}
                >
                  Bevestig Missie
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-12 relative flex justify-center items-center">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: loadingProgress === 100 ? [1, 1.2, 1] : 1
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5 }
                  }}
                  className={`w-32 h-32 rounded-full border-4 flex items-center justify-center relative z-10 ${
                    loadingProgress === 100 ? 'border-success text-success bg-success/10' : 'border-gold/30 text-gold border-t-gold bg-surface'
                  }`}
                >
                  {loadingProgress === 100 ? (
                    <Target className="w-12 h-12" />
                  ) : (
                    <span className="text-2xl font-bold">{loadingProgress}%</span>
                  )}
                </motion.div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.h3
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-2xl font-bold mb-8 ${
                    loadingProgress === 100 ? 'text-success' : 'text-textPrimary'
                  }`}
                >
                  {loadingSteps[loadingTextIndex]}
                </motion.h3>
              </AnimatePresence>

              <div className="max-w-md mx-auto mb-10">
                <ProgressBar value={loadingProgress} color={loadingProgress === 100 ? 'success' : 'gold'} size="lg" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loadingProgress === 100 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => router.push('/dashboard')}
                  disabled={loadingProgress < 100}
                  className="animate-pulse"
                >
                  Ga naar Dashboard
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
