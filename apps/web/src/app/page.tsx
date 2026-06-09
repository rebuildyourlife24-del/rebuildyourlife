'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Zap, Sparkles, Building2, ShieldAlert, Cpu, BarChart3, Users, Briefcase } from 'lucide-react';

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white selection:bg-[#d4a853] selection:text-[#0a0e1a] overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4a853]/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00f0ff]/10 blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0a0e1a]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a853] to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(212,168,83,0.3)]">
              <Sparkles className="w-5 h-5 text-[#0a0e1a]" />
            </div>
            <span className="text-xl font-bold tracking-tight">Rebuild<span className="text-[#d4a853]">YourLife</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
              Inloggen
            </Link>
            <Link href="/auth/register" className="px-5 py-2.5 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 backdrop-blur-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 sm:px-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/20 text-[#d4a853] text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4a853]"></span>
            </span>
            RebuildYourLife AI OS v2.0
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Herbouw je leven. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-amber-300">Neem de controle terug.</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Het eerste AI-aangedreven besturingssysteem voor je financiën, carrière en mentale gezondheid. Van schulden tot succes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#d4a853] text-[#0a0e1a] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-[#ebd299] hover:scale-105 hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]">
              Start Jouw Systeem (Gratis)
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">De motor achter je wederopbouw</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Drie krachtige systemen die naadloos samenwerken om elk aspect van je leven te optimaliseren.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              {...fadeIn} transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-[#00f0ff]/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-7 h-7 text-[#00f0ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Debt Engine</h3>
              <p className="text-gray-400 leading-relaxed">Automatische afbetalingsplannen en juridische brieven. Simuleer strategieën en bevries rente met één druk op de knop.</p>
            </motion.div>

            <motion.div 
              {...fadeIn} transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-[#d4a853]/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#d4a853]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-7 h-7 text-[#d4a853]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI-Team</h3>
                <p className="text-gray-400 leading-relaxed">Jouw persoonlijke CEO en Life Coach, 24/7 beschikbaar. Delegeer taken, vraag financieel advies en optimaliseer je dagen.</p>
              </div>
            </motion.div>

            <motion.div 
              {...fadeIn} transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">War Room</h3>
              <p className="text-gray-400 leading-relaxed">Datavisualisatie van je toekomst. Voorspel je cashflow, analyseer uitgaven en zie exact wanneer je schuldenvrij bent.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Voor wie bouwen we dit?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">RebuildYourLife past zich aan jouw unieke situatie aan.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="flex gap-6 items-start bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Particulieren</h3>
                <p className="text-gray-400">Overzicht in de chaos. Of je nu je doelen wilt behalen of uit de schulden wilt komen, het systeem biedt structuur, houvast en een helder pad vooruit.</p>
              </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="flex gap-6 items-start bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-[#d4a853]/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-[#d4a853]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Ondernemers (ZZP)</h3>
                <p className="text-gray-400">Facturatie en privé-financiën op één plek. Laat de AI je belastingen inschatten, facturen genereren en de lijn tussen zakelijk en privé bewaken.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-32 px-6 bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Kies jouw arsenaal</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Investeer in de tool die zichzelf terugverdient.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {/* Starter */}
            <motion.div {...fadeIn} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="mb-8">
                <Zap className="w-8 h-8 text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold">Starter</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  €0<span className="text-xl text-gray-400 ml-1 font-medium">/mnd</span>
                </div>
                <p className="mt-4 text-gray-400">Begin met bouwen.</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Basis toegang', 'Beperkt AI-Team', 'Standaard support'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 mr-3 text-gray-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block w-full py-4 rounded-xl font-bold text-center bg-white/10 hover:bg-white/20 transition-all">
                Start Gratis
              </Link>
            </motion.div>

            {/* Operator (Highlighted) */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="relative bg-[#0a0e1a] border-2 border-[#d4a853] rounded-3xl p-8 backdrop-blur-sm shadow-[0_0_40px_rgba(212,168,83,0.15)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4a853] text-[#0a0e1a] px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                Meest Gekozen
              </div>
              <div className="mb-8">
                <Sparkles className="w-8 h-8 text-[#d4a853] mb-4" />
                <h3 className="text-2xl font-bold">Operator</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-[#d4a853]">
                  €19,95<span className="text-xl text-gray-400 ml-1 font-medium">/mnd</span>
                </div>
                <p className="mt-4 text-gray-400">God Mode voor particulieren.</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Onbeperkt AI-Team', 'War Room Predicties', "Legal Engine PDF's", 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-100">
                    <Check className="w-5 h-5 mr-3 text-[#d4a853]" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block w-full py-4 rounded-xl font-bold text-center bg-[#d4a853] text-[#0a0e1a] hover:bg-[#ebd299] transition-all shadow-[0_0_20px_rgba(212,168,83,0.3)]">
                Kies Operator
              </Link>
            </motion.div>

            {/* Business */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="mb-8">
                <Building2 className="w-8 h-8 text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold">Business</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  €59,95<span className="text-xl text-gray-400 ml-1 font-medium">/mnd</span>
                </div>
                <p className="mt-4 text-gray-400">Complete controle voor ondernemers.</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Alles in Operator', 'CRM Integraties', 'Facturatie', 'Zakelijke splitsing'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 mr-3 text-gray-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block w-full py-4 rounded-xl font-bold text-center bg-white/10 hover:bg-white/20 transition-all">
                Kies Business
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-24 px-6 text-center">
        <motion.div {...fadeIn} className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Klaar om de controle terug te nemen?</h2>
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-white text-[#0a0e1a] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">
            Start Vandaag
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 RebuildYourLife AI OS. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
