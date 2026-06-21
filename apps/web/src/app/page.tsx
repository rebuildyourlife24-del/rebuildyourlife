"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ParticleGrid } from '@/components/ui/ParticleGrid';

export default function ExtremeLandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Framer Motion variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-navy text-textPrimary font-mono overflow-x-hidden selection:bg-danger/30 selection:text-danger">
      
      {/* 3D WEBGL PARTICLE SYSTEM (4K-16K Fidelity) */}
      <div className="fixed inset-0 z-0 opacity-80">
        <ParticleGrid />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        
        {/* HEADER / HERO */}
        <motion.header 
          style={{ y, opacity }}
          className="text-center mb-24 space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 border border-danger/40 bg-danger/5 backdrop-blur-md px-4 py-1.5 text-xs tracking-[0.3em] uppercase mb-4 text-danger shadow-[0_0_20px_rgba(255,0,60,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
            System Status: Online
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Een paar uur werk.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-danger to-red-500">
              De rest vrijheid.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-textSecondary max-w-3xl mx-auto font-light tracking-wide leading-relaxed"
          >
            De concurrentie verkoopt theorie. Wij leveren een <strong className="text-white">Autonoom AI-Systeem</strong>. 
            Installeer de infrastructuur, stuur de machines aan, en domineer de schaduwmarkten.
          </motion.p>
        </motion.header>

        {/* 4K MANIFESTO FILMS PLACEHOLDER */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl mb-40 relative group"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-danger/30 via-transparent to-danger/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          {/* Glassmorphism Video Container */}
          <div className="relative aspect-video bg-navyLight/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="z-10 text-danger mb-6"
            >
              <svg className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="square" strokeLinejoin="miter" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            
            <div className="z-10 text-center">
              <p className="text-white tracking-[0.2em] text-sm uppercase font-bold drop-shadow-md">Manifesto Film [ 4K-16K Ready ]</p>
              <p className="text-textSecondary/50 text-xs mt-2 font-mono">Awaiting High-Bitrate Video Inject</p>
            </div>
          </div>
        </motion.section>

        {/* ASYMMETRIC BENTO GRID: DE 4 ZUILEN */}
        <section className="w-full mb-40">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] bg-danger/50 flex-grow"></div>
              <h2 className="text-sm text-danger font-bold uppercase tracking-[0.3em]">Architectuur van the Grid</h2>
              <div className="h-[1px] bg-danger/50 flex-grow"></div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Bento 1: Large left */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-surfaceLight/20 backdrop-blur-xl border border-white/10 rounded-2xl p-10 hover:border-danger/40 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="text-8xl font-black text-white leading-none">01</span>
              </div>
              <div className="text-danger font-bold text-sm tracking-widest mb-4">SYSTEM CORE</div>
              <h3 className="text-4xl font-bold mb-6 text-white uppercase tracking-tight">De AI Infrastructuur</h3>
              <p className="text-textSecondary text-lg leading-relaxed max-w-md">
                Wij verkopen geen theorie. Je installeert jouw persoonlijke AI-bankier, strateeg en code-schrijvers. Het systeem doet het zware rekenwerk, jij zit in de commandostoel.
              </p>
            </motion.div>

            {/* Bento 2: Small right */}
            <motion.div variants={fadeUp} className="bg-surfaceLight/20 backdrop-blur-xl border border-white/10 rounded-2xl p-10 hover:border-danger/40 transition-colors group relative overflow-hidden">
              <div className="text-danger font-bold text-sm tracking-widest mb-4">ENGINE</div>
              <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-tight">Motivatie & Stimulering</h3>
              <p className="text-textSecondary leading-relaxed">
                Een kille machine werkt niet als de mens faalt. Onze AI pusht je, trekt je door dalen heen en forceert onbreekbare discipline.
              </p>
            </motion.div>

            {/* Bento 3: Small left */}
            <motion.div variants={fadeUp} className="bg-surfaceLight/20 backdrop-blur-xl border border-white/10 rounded-2xl p-10 hover:border-danger/40 transition-colors group relative overflow-hidden">
              <div className="text-danger font-bold text-sm tracking-widest mb-4">NETWORK</div>
              <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-tight">The Syndicate</h3>
              <p className="text-textSecondary leading-relaxed">
                Geen openbaar Discord forum voor kinderen. Een decentrale, versleutelde community via Signal, Telegram en WhatsApp.
              </p>
            </motion.div>

            {/* Bento 4: Large right (Verdienmodellen) */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-surfaceLight/20 backdrop-blur-xl border border-white/10 rounded-2xl p-10 hover:border-danger/40 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="text-8xl font-black text-white leading-none">04</span>
              </div>
              <div className="text-danger font-bold text-sm tracking-widest mb-4">REVENUE STREAMS</div>
              <h3 className="text-4xl font-bold mb-6 text-white uppercase tracking-tight">The Opportunity Engine</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="text-white font-bold mb-2">SaaS App Cloning</h4>
                  <p className="text-textSecondary text-sm">Laat AI winstgevende micro-apps herschrijven en lanceer je software-imperium binnen dagen.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Agentic Commerce</h4>
                  <p className="text-textSecondary text-sm">Autonome AI-agenten vinden producten, bouwen webshops en schrijven advertenties.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">High-Ticket AI Sales</h4>
                  <p className="text-textSecondary text-sm">Verkoop onzichtbare AI-infrastructuur (receptionistes/chatbots) aan fysieke bedrijven.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Synthetische Media</h4>
                  <p className="text-textSecondary text-sm">Genereer massaal organische views met AI-clones voor faceless YouTube & TikTok kanalen.</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* THE VAULT CTA (GLASSMORPHISM) */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-16 text-center shadow-2xl mb-24"
        >
          {/* Subtle radar ping in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            <div className="absolute inset-0 border border-danger/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-4 border border-danger/5 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white uppercase tracking-tighter drop-shadow-md">
              Enter The Vault
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto mb-10 font-light">
              Wij verbergen ons niet achter theorie. Krijg exclusieve toegang tot onze Intelligence Databank met <strong>200+ geclassificeerde onderzoeken</strong> over AI-systemen en bedrijfsmodellen.
            </p>
            
            <Link href="/vault">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
              >
                Access Databank
              </motion.button>
            </Link>
          </div>
        </motion.section>

        {/* INITIATE PROTOCOL CTA */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center pb-20 relative z-10"
        >
          <p className="text-textSecondary mb-6 uppercase tracking-[0.3em] text-xs font-bold">Systeemcapaciteit is gelimiteerd</p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(255,0,60,0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-danger text-white px-16 py-6 text-xl font-black uppercase tracking-[0.2em] transition-shadow shadow-[0_0_20px_rgba(255,0,60,0.3)]"
          >
            [ INITIATE PROTOCOL ]
          </motion.button>
        </motion.section>

      </div>
    </div>
  );
}
