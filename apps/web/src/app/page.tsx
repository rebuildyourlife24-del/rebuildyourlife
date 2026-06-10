'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Shield, Cpu, BarChart3, Clock, Lock } from 'lucide-react';

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white selection:bg-[#d4a853] selection:text-[#0a0e1a] font-sans">
      
      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/[0.05] bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-light tracking-wide text-white">
              Rebuild<span className="text-[#d4a853] font-medium">YourLife</span>
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/auth/login" className="text-sm font-medium text-[#8892a4] hover:text-white transition-colors">
              Inloggen
            </Link>
            <Link href="#pricing" className="px-6 py-2.5 text-sm font-medium bg-white text-[#0a0e1a] rounded-sm transition-all hover:bg-[#d4a853]">
              Abonnementen
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight mb-8 text-white leading-[1.2]">
            Vind de rust terug in jouw <br />
            <span className="font-medium text-[#d4a853]">financiën en leven.</span>
          </h1>
          
          <p className="text-xl text-[#8892a4] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Het premium besturingssysteem voor overzicht en controle. Wij structureren je schulden, automatiseren je taken en begeleiden je naar financiële onafhankelijkheid.
          </p>

          <Link href="#pricing" className="inline-flex items-center justify-center gap-2 bg-[#d4a853] text-[#0a0e1a] px-10 py-4 rounded-sm font-medium text-lg transition-all hover:bg-white">
            Bekijk Abonnementen
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* How it Works (Calm layout) */}
      <section className="py-32 px-6 bg-[#141b2d]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">De fundamenten van overzicht</h2>
            <p className="text-[#8892a4] text-lg">Drie systemen die rust brengen in de chaos.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a0e1a] border border-white/5 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#d4a853]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium mb-4">Debt Engine</h3>
              <p className="text-[#8892a4] leading-relaxed font-light">Automatische afbetalingsplannen en juridische communicatie. Simuleer strategieën en krijg precies te zien wanneer je vrij bent.</p>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a0e1a] border border-white/5 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-[#d4a853]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium mb-4">AI-Advisering</h3>
              <p className="text-[#8892a4] leading-relaxed font-light">Jouw persoonlijke financiële en lifecoach, 24/7 bereikbaar. Voor nuchter, objectief en doeltreffend advies.</p>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0a0e1a] border border-white/5 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#d4a853]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium mb-4">War Room</h3>
              <p className="text-[#8892a4] leading-relaxed font-light">Eén centraal, rustgevend dashboard voor al je statistieken, doelen en dagelijkse taken. Altijd de controle behouden.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing / Sales Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">Abonnementen</h2>
            <p className="text-[#8892a4] text-lg">Kies het niveau van begeleiding dat je nodig hebt.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <motion.div {...fadeIn} className="bg-[#141b2d] border border-white/5 p-10 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Starter</h3>
                <div className="text-4xl font-light text-white mb-4">€0<span className="text-lg text-[#8892a4] ml-1">/mnd</span></div>
                <p className="text-[#8892a4] text-sm font-light">Voor wie zelfstandig aan de slag wil met basis tools.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Basis dashboards', 'Beperkte AI-Advisering', 'Doelen stellen'].map((feature, i) => (
                  <li key={i} className="flex items-center text-[#8892a4] text-sm">
                    <Check className="w-4 h-4 mr-3 text-[#d4a853]" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="w-full py-4 text-center border border-white/10 text-white hover:bg-white hover:text-[#0a0e1a] transition-colors text-sm font-medium">
                Kies Starter
              </Link>
            </motion.div>

            {/* Operator */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-[#0a0e1a] border border-[#d4a853] p-10 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4a853] text-[#0a0e1a] px-4 py-1 text-xs font-bold tracking-widest uppercase">
                Aanbevolen
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-[#d4a853] mb-2">Operator</h3>
                <div className="text-4xl font-light text-white mb-4">€19,95<span className="text-lg text-[#8892a4] ml-1">/mnd</span></div>
                <p className="text-[#8892a4] text-sm font-light">Volledige toegang tot het ecosysteem voor particulieren.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Onbeperkte AI-Coaches', 'Debt Engine (automatische afbetalingen)', 'Uitgebreide PDF/Document analyse', 'Prioriteit support'].map((feature, i) => (
                  <li key={i} className="flex items-center text-white text-sm">
                    <Check className="w-4 h-4 mr-3 text-[#d4a853]" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="w-full py-4 text-center bg-[#d4a853] text-[#0a0e1a] hover:bg-white transition-colors text-sm font-medium">
                Kies Operator
              </Link>
            </motion.div>

            {/* Business */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-[#141b2d] border border-white/5 p-10 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Business</h3>
                <div className="text-4xl font-light text-white mb-4">€59,95<span className="text-lg text-[#8892a4] ml-1">/mnd</span></div>
                <p className="text-[#8892a4] text-sm font-light">Voor ondernemers en zzp'ers.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Alles van Operator', 'Zakelijke dashboards', 'Facturatie modules', 'Btw- en belastingassistentie'].map((feature, i) => (
                  <li key={i} className="flex items-center text-[#8892a4] text-sm">
                    <Check className="w-4 h-4 mr-3 text-[#d4a853]" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="w-full py-4 text-center border border-white/10 text-white hover:bg-white hover:text-[#0a0e1a] transition-colors text-sm font-medium">
                Kies Business
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#0a0e1a]">
        <p className="text-[#8892a4] text-sm font-light">© 2026 RebuildYourLife. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
