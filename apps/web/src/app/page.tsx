'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Target, Zap } from 'lucide-react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicLandingPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const elements = gsap.utils.toArray('.reveal');
    
    elements.forEach((el: any) => {
      gsap.fromTo(el, 
        { autoAlpha: 0, y: 50 },
        { 
          duration: 1.5, 
          autoAlpha: 1, 
          y: 0, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans bg-transparent selection:bg-cyan-500/30">
      
      {/* Cinematic HTML Overlay */}
      <div ref={contentRef} className="relative z-10">
        
        {/* HERO */}
        <section className="h-screen flex flex-col justify-center items-center text-center px-6">
          <div className="reveal">
            <div className="text-[10px] tracking-[0.4em] uppercase text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              The Engine is Active
            </div>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8 mix-blend-screen drop-shadow-2xl">
              REBUILD <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">YOUR LIFE</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-white/60 font-light mb-12">
              Voor de ondernemer die klaar is voor agressieve schaalvergroting en geavanceerde AI systemen. Ontsnap aan de massa.
            </p>
            <Link 
              href="/auth/login"
              className="group relative inline-block px-8 py-4 bg-transparent border border-white/20 overflow-hidden transition-all hover:border-cyan-400"
            >
              <div className="absolute inset-0 w-0 bg-cyan-400 transition-all duration-500 ease-out group-hover:w-full -z-10"></div>
              <span className="relative z-10 text-xs font-bold tracking-[0.2em] uppercase group-hover:text-black transition-colors duration-300">
                Initialiseer Protocol
              </span>
            </Link>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] uppercase text-white/40 animate-pulse">
            Scroll for Authorization
          </div>
        </section>

        {/* PILLARS */}
        <section className="min-h-screen py-32 px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="reveal p-8 border border-white/10 bg-black/20 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-cyan-400 mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Financiële Vesting</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Los schulden op en bouw een ondoordringbare financiële fundering. De architectuur is ontworpen voor maximale bescherming.
            </p>
          </div>
          
          <div className="reveal p-8 border border-white/10 bg-black/20 backdrop-blur-md mt-0 md:mt-16">
            <Target className="w-8 h-8 text-fuchsia-400 mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Laser Focus</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Krijg direct toegang tot bewezen bedrijfsmodellen en E-commerce blauwdrukken via de neurale link.
            </p>
          </div>

          <div className="reveal p-8 border border-white/10 bg-black/20 backdrop-blur-md mt-0 md:mt-32">
            <Zap className="w-8 h-8 text-[#C8A96B] mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Elite Netwerk</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Omring jezelf met winnaars in de exclusieve RYL command room. Vertraging is geen optie meer.
            </p>
          </div>
        </section>

        {/* FOOTER PADDING */}
        <section className="h-[50vh] flex items-center justify-center border-t border-white/10 bg-black/40 backdrop-blur-lg mt-32">
          <div className="text-center reveal">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-6">Systeem Gereed</h2>
            <Link href="/auth/login" className="text-cyan-400 text-sm font-bold tracking-[0.2em] uppercase hover:text-white transition-colors">
              Access Dashboard →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
