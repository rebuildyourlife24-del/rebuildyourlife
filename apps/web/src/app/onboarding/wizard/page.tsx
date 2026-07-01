"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Briefcase, TrendingUp, ChevronRight, ShieldCheck, Database, Target, Banknote } from "lucide-react";
import Link from "next/link";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    startingCapital: "",
    goalRevenue: "",
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setLoading(true);
    // Simulate API call to save profile data to Sovereign Neural Core
    setTimeout(() => {
      // Direct them to the new Finance dashboard
      router.push("/dashboard/finance");
    }, 1500);
  };

  const isStepValid = () => {
    if (step === 1) return formData.companyName.trim().length > 0;
    if (step === 2) return formData.industry !== "";
    if (step === 3) return formData.startingCapital !== "" && formData.goalRevenue !== "";
    return false;
  };

  const industries = [
    { id: "ecom", name: "E-Commerce & Dropshipping", icon: <Command className="w-5 h-5" /> },
    { id: "saas", name: "SaaS & Software", icon: <Database className="w-5 h-5" /> },
    { id: "agency", name: "Service Agency (SMMA)", icon: <Briefcase className="w-5 h-5" /> },
    { id: "crypto", name: "Crypto & Trading", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "holding", name: "OMNIPRESENT HOLDING (10+ Projects)", icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header / Progress */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#d4af37] w-8 h-8" />
            <h1 className="text-xl font-black uppercase tracking-widest text-[#d4af37]">Sovereign Core</h1>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1 w-12 rounded-full transition-colors duration-500 ${step >= i ? 'bg-[#d4af37]' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-black uppercase tracking-wider mb-2">Identiteit Bevestigen</h2>
                <p className="text-zinc-400 mb-8">Hoe heet jouw onderneming of project? Dit wordt jouw Sovereign Call-Sign.</p>
                
                <input
                  type="text"
                  placeholder="Bijv. Apex E-com LLC..."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 p-4 text-xl text-white outline-none focus:border-[#d4af37] transition-colors mb-6 placeholder:text-zinc-700"
                  autoFocus
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-black uppercase tracking-wider mb-2">Sector Analyse</h2>
                <p className="text-zinc-400 mb-8">Kies je domein. De C-Suite AI optimaliseert haar neurale gewichten op basis van jouw industrie.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => setFormData({ ...formData, industry: ind.id })}
                      className={`flex flex-col items-start p-6 border text-left transition-all ${
                        formData.industry === ind.id 
                          ? 'border-[#d4af37] bg-[#d4af37]/10' 
                          : 'border-white/10 bg-[#111] hover:border-white/30'
                      }`}
                    >
                      <div className={`mb-3 ${formData.industry === ind.id ? 'text-[#d4af37]' : 'text-zinc-500'}`}>
                        {ind.icon}
                      </div>
                      <span className="font-bold uppercase tracking-wide text-sm">{ind.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-black uppercase tracking-wider mb-2">Financiële Parameters</h2>
                <p className="text-zinc-400 mb-8">Voer de startdata in. Jouw CFO-agent bouwt vanaf hier direct het financiële dashboard op.</p>
                
                <div className="space-y-6 mb-6">
                  <div>
                    <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">
                      <Banknote className="w-4 h-4" /> Actueel Startkapitaal
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xl">€</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={formData.startingCapital}
                        onChange={(e) => setFormData({ ...formData, startingCapital: e.target.value })}
                        className="w-full bg-[#111] border border-white/10 p-4 pl-10 text-xl text-white outline-none focus:border-[#d4af37] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">
                      <Target className="w-4 h-4" /> Maandelijks Omzetdoel
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xl">€</span>
                      <input
                        type="number"
                        placeholder="10000.00"
                        value={formData.goalRevenue}
                        onChange={(e) => setFormData({ ...formData, goalRevenue: e.target.value })}
                        className="w-full bg-[#111] border border-white/10 p-4 pl-10 text-xl text-white outline-none focus:border-[#d4af37] transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="text-zinc-500 hover:text-white uppercase tracking-widest text-sm font-bold transition-colors"
            >
              [ Terug ]
            </button>
          ) : <div></div>}

          <button
            onClick={nextStep}
            disabled={!isStepValid() || loading}
            className={`group px-8 py-4 uppercase tracking-widest font-black flex items-center gap-2 transition-all ${
              isStepValid() && !loading
                ? 'bg-[#d4af37] text-black hover:bg-white'
                : 'bg-[#222] text-zinc-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Systeem Configureren...</span>
            ) : step === 3 ? (
              <>INITIALIZE CORE <ShieldCheck className="w-5 h-5" /></>
            ) : (
              <>Volgende <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
