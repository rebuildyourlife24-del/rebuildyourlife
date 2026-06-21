"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ExtremeVaultPage() {
  const [text, setText] = useState("");
  const fullText = "ACCESS GRANTED. INITIALIZING SECURE CONNECTION TO SUPREME DATABANK... FETCHING 200+ CLASSIFIED FILES.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-navy text-success font-mono overflow-x-hidden p-6 md:p-12 selection:bg-success/30 selection:text-white relative">
      
      {/* 4K TERMINAL SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,51,0.1)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
      </div>
      
      {/* RADAR SWEEP BACKGROUND */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,255,51,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto mt-12 relative z-10">
        
        <header className="mb-16 border-b border-success/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs uppercase tracking-[0.3em] mb-4 opacity-70 flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-success rounded-full animate-ping"></span>
              System: The Sovereign Grid // DB: Primary
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(0,255,51,0.3)]"
            >
              The Vault
            </motion.h1>
          </div>
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#00ff33", color: "#000" }}
              whileTap={{ scale: 0.95 }}
              className="border border-success/50 px-6 py-3 text-sm tracking-widest uppercase transition-colors"
            >
              [ Return to Grid ]
            </motion.button>
          </Link>
        </header>

        <div className="mb-16">
          <div className="bg-success/5 border border-success/30 p-6 max-w-3xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
            <p className="font-bold mb-2 text-white">SYSTEM BOOT SEQUENCE:</p>
            <p className="opacity-80">
              {text}<span className="animate-pulse">_</span>
            </p>
          </div>
        </div>

        {/* GLASSMORPHISM BENTO GRID FOR FILES */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Dossier 1 */}
          <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md border border-white/10 p-8 hover:border-success/50 transition-colors cursor-pointer group relative">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div className="text-xs opacity-50 mb-4 tracking-widest font-bold">DIR: /SUPREME_ONDERZOEKEN</div>
            <h3 className="text-2xl text-white font-black group-hover:text-success mb-3 transition-colors">Legacy Matrix Architectuur</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Analyse van de conventionele (handmatige) e-commerce modellen en hoe de The Syndicate Arbitrage dit volledig automatiseert en overneemt.</p>
          </motion.div>

          {/* Dossier 2 */}
          <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md border border-white/10 p-8 hover:border-success/50 transition-colors cursor-pointer group relative">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div className="text-xs opacity-50 mb-4 tracking-widest font-bold">DIR: /ORION_KNOWLEDGE</div>
            <h3 className="text-2xl text-white font-black group-hover:text-success mb-3 transition-colors">SaaS App Cloning Protocol</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Blauwdruk voor het kopiëren en lanceren van uiterst winstgevende micro-SaaS applicaties door gebruik te maken van Cursor AI.</p>
          </motion.div>

          {/* Dossier 3 */}
          <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md border border-white/10 p-8 hover:border-success/50 transition-colors cursor-pointer group relative">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div className="text-xs opacity-50 mb-4 tracking-widest font-bold">DIR: /SUPREME_ONDERZOEKEN</div>
            <h3 className="text-2xl text-white font-black group-hover:text-success mb-3 transition-colors">Agentic Commerce</h3>
            <p className="text-sm text-textSecondary leading-relaxed">De AI-to-AI economie: Hoe zwermen van autonome AI-agenten het handmatige dropshipping model overnemen en automatiseren.</p>
          </motion.div>

          {/* Dossier 4 */}
          <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md border border-white/10 p-8 hover:border-success/50 transition-colors cursor-pointer group relative">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div className="text-xs opacity-50 mb-4 tracking-widest font-bold">DIR: /ORION_KNOWLEDGE</div>
            <h3 className="text-2xl text-white font-black group-hover:text-success mb-3 transition-colors">Synthetische Media Fabriek</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Exacte instructies voor het opzetten van Faceless YouTube en TikTok imperiums via onvermoeibare AI Clones.</p>
          </motion.div>
          
          {/* Load More Mockup */}
          <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md border border-white/5 p-8 flex flex-col justify-center items-center opacity-50 hover:opacity-100 transition-opacity cursor-wait">
            <div className="w-8 h-8 border-2 border-success border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-xs tracking-widest text-center">DECRYPTING...</div>
            <h3 className="text-lg text-white font-bold mt-2 text-center">Verwerken van 196 overige bestanden in /src/data/vault...</h3>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}
