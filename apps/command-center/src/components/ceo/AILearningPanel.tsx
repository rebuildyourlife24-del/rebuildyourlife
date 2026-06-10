"use client";

import { motion } from 'framer-motion';
import { X, Brain, Cpu, Lightbulb } from 'lucide-react';

interface AILearningPanelProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function AILearningPanel({ title, content, onClose }: AILearningPanelProps) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer"
      />
      <motion.div 
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-slate-950 border-l border-cyan-500/30 shadow-[-20px_0_50px_rgba(0,240,255,0.1)] z-50 p-6 md:p-8 flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-cyan-400 font-mono">ORION INTELLIGENCE</h2>
            <p className="text-xs text-slate-500">EXPLANATION MODULE</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{title}</h3>
          
          <div className="prose prose-invert prose-sm">
            <p className="text-slate-300 leading-relaxed text-[15px]">
              {content}
            </p>
          </div>

          <div className="mt-8 p-5 bg-gradient-to-br from-cyan-950/40 to-blue-900/20 border border-cyan-500/20 rounded-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Hoe kun jij dit gebruiken?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Als CEO is het belangrijk dat je de logica van dit besluit snapt. Dit patroon (dalende marketing ROI vs stabiele organische groei) laat zien dat we in de toekomst beter kunnen investeren in SEO dan in Meta Ads voor deze specifieke niche. Ik heb deze parameter opgeslagen in mijn lange-termijn geheugen.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            BEGREPEN, SLUIT PANEEL
          </button>
        </div>

      </motion.div>
    </>
  );
}
