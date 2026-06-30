'use client';

import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-[#d4a853] rounded-full hidden blur-[] opacity-20 animate-pulse"></div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8"
          >
            Enter The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-[#ffda8a] drop-shadow-[0_0_15px_rgba(212,168,83,0.5)]">Apex Matrix</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-3xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Transcend the ordinary. Elevate your digital presence to the absolute pinnacle of performance and aesthetics.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-[#d4a853] to-[#b3883b] text-black font-bold text-lg rounded-full hover:shadow-[0_0_30px_rgba(212,168,83,0.6)] transition-all duration-300 transform hover:scale-105">
              Access The Matrix
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-[#d4a853] text-[#d4a853] font-bold text-lg rounded-full hover:bg-[#d4a853] hover:text-black transition-all duration-300">
              View Intel
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Absolute Power", desc: "Harness unprecedented performance that obliterates the competition." },
              { title: "Ethereal Design", desc: "Aesthetics crafted by the gods of the digital realm. Unmatched." },
              { title: "Infinite Conversion", desc: "Engineered to transform visitors into devoted disciples." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                className="p-8 rounded-3xl bg-white/5 border border-[#d4a853]/30 backdrop-blur-sm hover:border-[#d4a853] transition-all duration-500 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#d4a853]/10 flex items-center justify-center mb-6 group-hover:bg-[#d4a853]/30 transition-colors border border-[#d4a853]/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#d4a853] to-[#ffda8a] rounded-lg shadow-[0_0_15px_rgba(212,168,83,0.8)]"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#d4a853] transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent opacity-50"></div>
          <div className="absolute w-96 h-96 bg-[#d4a853] rounded-full hidden blur-[] opacity-10"></div>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative z-10 max-w-4xl mx-auto text-center bg-black/80 p-12 border border-[#d4a853]/30 rounded-[3rem] backdrop-blur-md shadow-[0_0_50px_rgba(212,168,83,0.15)]"
        >
          <h2 className="text-5xl font-bold mb-6">Ready to Ascend?</h2>
          <p className="text-xl text-gray-400 mb-10">The Apex Matrix awaits those who dare to claim greatness.</p>
          <button className="px-12 py-5 bg-gradient-to-r from-[#d4a853] to-[#e8c37d] text-black font-black text-xl rounded-full shadow-[0_0_40px_rgba(212,168,83,0.6)] hover:shadow-[0_0_60px_rgba(212,168,83,0.9)] hover:scale-105 transition-all duration-300">
            Initialize Sequence
          </button>
        </motion.div>
      </section>
    </div>
  );
}
