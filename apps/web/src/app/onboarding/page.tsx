'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const TIERS = [
  {
    id: 'ecom',
    name: 'Commerce Syndicate',
    price: '€50/mnd',
    priceId: 'tier_ecom_50',
    description: 'E-commerce operaties & AI inzet',
  },
  {
    id: 'tech',
    name: 'SaaS Protocol',
    price: '€99/mnd',
    priceId: 'tier_tech_99',
    description: 'App cloning & grotere verdiensten',
  },
  {
    id: 'elite',
    name: 'Elite Team',
    price: '€1500 + uplink fee',
    priceId: 'tier_elite_1500',
    description: 'Volledig systeem toegang & begeleiding',
  },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTier = searchParams ? searchParams.get('tier') : null;

  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(
    TIERS.find(t => t.id === preselectedTier) || null
  );
  const [form, setForm] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bootText, setBootText] = useState('');

  // Boot sequence animation
  const bootLines = [
    '> SOVEREIGN GRID // AUTHORIZATION PROTOCOL',
    '> ESTABLISHING ENCRYPTED UPLINK...',
    '> CONNECTION SECURED.',
    '> AWAITING IDENTITY VERIFICATION...',
  ];

  useEffect(() => {
    if (step === 1) {
      let lineIndex = 0;
      let charIndex = 0;
      let currentText = '';
      const interval = setInterval(() => {
        if (lineIndex >= bootLines.length) {
          clearInterval(interval);
          return;
        }
        const line = bootLines[lineIndex];
        if (charIndex < line.length) {
          currentText += line[charIndex];
          setBootText(currentText);
          charIndex++;
        } else {
          currentText += '\n';
          setBootText(currentText);
          lineIndex++;
          charIndex = 0;
        }
      }, 18);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleNextStep = () => {
    if (step === 2 && !selectedTier) {
      setError('Selecteer een tier om door te gaan.');
      return;
    }
    if (step === 3) {
      if (!form.name.trim() || !form.email.trim()) {
        setError('Vul alle velden in.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('Voer een geldig e-mailadres in.');
        return;
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleInitiatePayment = async () => {
    if (!selectedTier) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mollie/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: selectedTier.priceId,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/onboarding`,
          name: form.name,
          email: form.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // For now, navigate to dashboard in mock mode
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Verbindingsfout. Probeer opnieuw.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative flex flex-col">

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,60,0.015)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,60,0.07)_0%,transparent_60%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff003c] flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Sovereign Grid</span>
        </div>
        <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
          [ Abort ]
        </Link>
      </nav>

      {/* Progress bar */}
      <div className="relative z-10 flex gap-1 px-6 md:px-12 pt-6">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={`h-[2px] flex-1 transition-colors duration-500 ${step >= n ? 'bg-[#ff003c]' : 'bg-white/10'}`}></div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative z-10 flex items-center justify-center px-6 md:px-12 py-16">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">

            {/* STEP 1: BOOT SEQUENCE */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-start">
                <div className="text-[10px] text-[#ff003c] font-mono uppercase tracking-widest mb-6">STAP 01 / 04 // VERBINDING INITIALISEREN</div>
                <div className="w-full bg-black border border-white/10 p-8 font-mono text-sm text-[#ff003c] leading-7 whitespace-pre-line min-h-[160px]">
                  {bootText}<span className="animate-pulse">_</span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-8 bg-[#ff003c] text-black font-black uppercase tracking-[0.2em] px-12 py-5 text-lg hover:bg-white transition-colors flex items-center gap-4"
                >
                  Identiteit Verifiëren <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: TIER SELECTION */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="text-[10px] text-[#ff003c] font-mono uppercase tracking-widest mb-4">STAP 02 / 04 // SELECTEER PROTOCOL</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-none">
                  KIES JE<br /><span className="text-[#ff003c]">DIMENSIE.</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {TIERS.map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`text-left p-6 border transition-all ${selectedTier?.id === tier.id ? 'border-[#ff003c] bg-[#ff003c]/10' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-[10px] text-[#ff003c] font-mono uppercase tracking-widest">TIER {TIERS.indexOf(tier) + 1}</span>
                        {selectedTier?.id === tier.id && <Check className="w-4 h-4 text-[#ff003c]" />}
                      </div>
                      <div className="text-xl font-black uppercase tracking-wide mb-2">{tier.name}</div>
                      <div className="text-sm text-zinc-400 mb-4">{tier.description}</div>
                      <div className="text-lg font-bold text-white">{tier.price}</div>
                    </button>
                  ))}
                </div>
                {error && <div className="flex items-center gap-2 text-[#ff003c] text-sm mb-4"><AlertCircle className="w-4 h-4" />{error}</div>}
                <button onClick={handleNextStep} className="bg-[#ff003c] text-black font-black uppercase tracking-[0.2em] px-12 py-5 text-lg hover:bg-white transition-colors flex items-center gap-4">
                  Doorgaan <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {/* STEP 3: IDENTITY / FORM */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="text-[10px] text-[#ff003c] font-mono uppercase tracking-widest mb-4">STAP 03 / 04 // IDENTITEIT REGISTREREN</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-none">
                  WIE BEN<br /><span className="text-[#ff003c]">JIJ?</span>
                </h2>
                <div className="space-y-4 mb-8 max-w-xl">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Volledige Naam</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="De Architect"
                      className="w-full bg-black border border-white/10 focus:border-[#ff003c] outline-none px-5 py-4 text-white font-mono text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">E-mailadres</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="jij@domein.com"
                      type="email"
                      className="w-full bg-black border border-white/10 focus:border-[#ff003c] outline-none px-5 py-4 text-white font-mono text-sm transition-colors"
                    />
                  </div>
                </div>
                {error && <div className="flex items-center gap-2 text-[#ff003c] text-sm mb-4"><AlertCircle className="w-4 h-4" />{error}</div>}
                <button onClick={handleNextStep} className="bg-[#ff003c] text-black font-black uppercase tracking-[0.2em] px-12 py-5 text-lg hover:bg-white transition-colors flex items-center gap-4">
                  Grid Verbinden <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="text-[10px] text-[#ff003c] font-mono uppercase tracking-widest mb-4">STAP 04 / 04 // UPLINK AUTORISATIE</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-none">
                  AUTORISEER<br /><span className="text-[#ff003c]">TOEGANG.</span>
                </h2>

                {/* Summary box */}
                <div className="bg-black border border-white/10 p-8 max-w-xl mb-8">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Overzicht</div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-black uppercase tracking-wide">{selectedTier?.name}</div>
                      <div className="text-sm text-zinc-400">{form.name} // {form.email}</div>
                    </div>
                    <div className="text-[#ff003c] font-black text-xl">{selectedTier?.price}</div>
                  </div>
                  <div className="border-t border-white/5 pt-3 mt-3">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse inline-block"></span>
                      Betaaloptie: iDEAL / Creditcard via Mollie
                    </div>
                  </div>
                </div>

                {error && <div className="flex items-center gap-2 text-[#ff003c] text-sm mb-4"><AlertCircle className="w-4 h-4" />{error}</div>}
                
                <button
                  onClick={handleInitiatePayment}
                  disabled={isLoading}
                  className="bg-[#ff003c] text-black font-black uppercase tracking-[0.2em] px-12 py-5 text-lg hover:bg-white transition-colors flex items-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
                  {isLoading ? 'UPLINK INITIALISEREN...' : 'INITIATE UPLINK'}
                </button>

                <p className="mt-4 text-[10px] text-zinc-600 font-mono uppercase tracking-widest max-w-sm">
                  Betaling verloopt beveiligd via Mollie. Geen gegevens worden opgeslagen op onze servers.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff003c] animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
