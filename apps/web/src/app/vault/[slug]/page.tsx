"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function DossierReaderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [decrypted, setDecrypted] = useState(false);
  
  // Fake Decryption Effect
  const [glitchText, setGlitchText] = useState("ENCRYPTED DATABLOCK DETECTED...");

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let iterations = 0;
    
    const interval = setInterval(() => {
      setGlitchText(prev => prev.split('').map((char, index) => {
        if(index < iterations) {
          return "DOSSIER UNLOCKED: " + slug.toUpperCase();
        }
        return characters[Math.floor(Math.random() * characters.length)]
      }).join(''));
      
      if(iterations >= "DOSSIER UNLOCKED".length) {
        clearInterval(interval);
        setTimeout(() => setDecrypted(true), 500);
      }
      
      iterations += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [slug]);

  return (
    <div className="min-h-screen bg-navy text-textPrimary font-mono overflow-x-hidden pt-24 pb-12 px-6 md:px-12 selection:bg-success/30 selection:text-white">
      
      {/* 4K TERMINAL SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,51,0.1)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/vault" className="inline-flex items-center gap-2 text-success hover:text-white transition-colors mb-12 text-sm tracking-widest uppercase">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Terug naar Databank
        </Link>

        {!decrypted ? (
          <div className="h-[60vh] flex flex-col items-center justify-center border border-success/20 bg-success/5 backdrop-blur-md">
            <div className="w-16 h-16 border-2 border-success border-t-transparent rounded-full animate-spin mb-8"></div>
            <p className="text-success text-2xl font-black tracking-[0.3em] font-mono text-center px-4">
              {glitchText}
            </p>
          </div>
        ) : (
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-invert prose-green max-w-none"
          >
            <div className="border-b border-success/30 pb-8 mb-12">
              <div className="text-success text-xs font-bold tracking-[0.3em] uppercase mb-4">CLASSIFIED DOSSIER</div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                {slug.replace(/-/g, ' ')}
              </h1>
              <div className="flex gap-4 text-xs tracking-widest text-textSecondary opacity-80 uppercase">
                <span>AUTHOR: THE SOVEREIGN GRID</span>
                <span>//</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>

            {/* FAKE CONTENT FOR NOW - NEXT STEP IS TO READ REAL MD FILES */}
            <div className="bg-black/50 border border-white/10 p-8 md:p-12 text-lg leading-loose text-textSecondary rounded-xl backdrop-blur-lg">
              <p className="mb-6"><strong className="text-white">Opmerking:</strong> Dit is de 4K Dossier Reader Template. We hebben zojuist succesvol {slug} gedecrypt vanuit de database.</p>
              
              <h2 className="text-2xl text-white font-bold mt-10 mb-4 border-l-4 border-success pl-4">1. Intelligence Overview</h2>
              <p className="mb-6">De infrastructuur van The Real World berust op massale affiliatemarketing door tieners. Wij automatiseren dit met Hermes-Qwen en Grok. Hierdoor pakken wij 100% van de marge zonder de manuren.</p>
              
              <div className="bg-danger/10 border border-danger/30 p-6 my-8 text-danger">
                <strong>WARNING:</strong> De content van dit document bevat bedrijfsgeheimen. Delen is verboden en leidt tot directe afsluiting van The Sovereign Grid.
              </div>

              <h2 className="text-2xl text-white font-bold mt-10 mb-4 border-l-4 border-success pl-4">2. Execution Protocol</h2>
              <ul className="list-disc pl-6 space-y-4">
                <li>Installeer de AI Agents via de Terminal in het dashboard.</li>
                <li>Verifieer de Webhook connectie met je Shopify store.</li>
                <li>Zet de Opportunity Engine op 'Autonoom'.</li>
              </ul>
            </div>
          </motion.article>
        )}
      </div>
    </div>
  );
}
