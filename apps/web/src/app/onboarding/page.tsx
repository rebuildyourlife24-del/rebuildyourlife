'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, CheckCircle2, Shield, Landmark, Banknote, Rocket, Check } from 'lucide-react';

// Fictieve neo-bank endpoint
const generateIban = () => `NL99 GDBR ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(100 + Math.random() * 900)}`;

export default function NeoBankOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [iban, setIban] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  
  const [allocations, setAllocations] = useState({ ops: 50, tax: 30, capital: 20 });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (step === 3 && !iban) {
      // Simulate IBAN generation
      setIsProcessing(true);
      setTimeout(() => {
        setIban(generateIban());
        setIsProcessing(false);
      }, 3000);
    }
  }, [step, iban]);

  const handleComplete = () => {
    setIsProcessing(true);
    // Simulate API call to the NeoBank engine
    setTimeout(() => {
      router.push('/dashboard/war-room');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-between mb-8 px-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`w-1/4 h-1 mx-1 rounded-full ${step >= num ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-white/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
              <Shield className="w-16 h-16 text-cyan-400 mb-6" />
              <h1 className="text-3xl font-bold mb-2">Know Your Customer (KYC)</h1>
              <p className="text-gray-400 mb-8">Welkom bij The Godbrain. Om uw private Neo-Bank rekening (BaaS) te openen, moeten we uw entiteit verifiëren.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bedrijfsnaam / Entiteit</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="Billionaire Enterprises B.V."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">KvK Nummer</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none" placeholder="12345678" />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!companyName}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
              >
                Start Verificatie <Fingerprint className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              <h1 className="text-3xl font-bold mb-4 text-cyan-400">The Godbrain Charter</h1>
              <div className="bg-black/50 p-6 rounded-lg border border-white/10 mb-8 h-64 overflow-y-auto text-sm text-gray-300 font-mono">
                <p className="mb-4">DIT IS EEN BINDEND MANDAAT TUSSEN {companyName.toUpperCase()} EN THE GODBRAIN SWARM.</p>
                <p className="mb-4">1. Autonomie: The Swarm krijgt volmacht om fondsen te routeren, marktkansen te executeren en te handelen via de aangesloten Broker API's, mits de ROI &gt;= 15% bedraagt.</p>
                <p className="mb-4">2. Brokerage Commissie: Transacties uitgevoerd door The Swarm vereisen geen uurloon, maar een dynamische winstdeling vastgesteld in de Opportunity Schema's.</p>
                <p>3. Liquidatie: Activa kunnen in crisistijd direct geliquideerd worden door de Risk Manager Agent ter bescherming van de War Chest.</p>
              </div>

              <button 
                onClick={() => setStep(3)}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                Ik Ga Akkoord & Teken Digitaal <CheckCircle2 className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center"
            >
              <Landmark className="w-16 h-16 text-gold mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-2">IBAN Generatie</h1>
              <p className="text-gray-400 mb-8">Wij openen nu een virtuele bankrekening via onze BaaS partner.</p>
              
              <div className="bg-black/80 p-6 rounded-xl border border-gold/20 mb-8 flex flex-col items-center justify-center min-h-[120px]">
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-gold font-mono text-sm animate-pulse">Onderhandelen met BaaS Provider...</span>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="text-xs text-gray-500 mb-1">Jouw Officiele Godbrain IBAN</div>
                    <div className="text-2xl font-mono text-gold tracking-widest">{iban}</div>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={() => setStep(4)}
                disabled={isProcessing}
                className="w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                Ga Naar Kapitaal Verdeling
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
            >
              <Banknote className="w-16 h-16 text-green-400 mb-6" />
              <h1 className="text-3xl font-bold mb-2">Initialiseer The War Chest</h1>
              <p className="text-gray-400 mb-6">Om de intelligentie van The Swarm te demonstreren, storten we een gesimuleerd startkapitaal van <strong className="text-green-400">€10.000,00</strong>. Hoe wil je dat de AI inkomende gelden verdeelt (routing)?</p>

              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Operations (AI Uitvoering)</span>
                    <span className="font-mono">{allocations.ops}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={allocations.ops} onChange={(e) => setAllocations({...allocations, ops: parseInt(e.target.value)})} className="w-full accent-cyan-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-red-400">Tax Reserve (Belasting)</span>
                    <span className="font-mono text-red-400">{allocations.tax}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={allocations.tax} onChange={(e) => setAllocations({...allocations, tax: parseInt(e.target.value)})} className="w-full accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gold">Syndicate Capital (Trading/Investeren)</span>
                    <span className="font-mono text-gold">{allocations.capital}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={allocations.capital} onChange={(e) => setAllocations({...allocations, capital: parseInt(e.target.value)})} className="w-full accent-gold" />
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-lg border border-white/10 flex justify-between items-center mb-8">
                <span className="text-sm text-gray-400">Totaal toegewezen:</span>
                <span className={`font-mono font-bold ${(allocations.ops + allocations.tax + allocations.capital) === 100 ? 'text-green-400' : 'text-red-500'}`}>
                  {allocations.ops + allocations.tax + allocations.capital}%
                </span>
              </div>

              <button 
                onClick={handleComplete}
                disabled={isProcessing || (allocations.ops + allocations.tax + allocations.capital) !== 100}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Geld Routeren...' : 'Stort €10.000 & Betreed The War Room'}
                {!isProcessing && <Rocket className="ml-2 w-5 h-5" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
