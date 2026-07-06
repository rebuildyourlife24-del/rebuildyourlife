'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function HelpCenterPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Hoe werkt de Sneeuwbal vs. Lawine methode voor schulden?',
      a: 'Bij de Sneeuwbalmethode focus je eerst op je kleinste schuld, voor snelle psychologische overwinningen. Bij de Lawinemethode focus je op de hoogste rente, wat je op lange termijn het meeste geld bespaart. Ons platform rekent beide voor je uit op de Schulden pagina.'
    },
    {
      q: 'Hoe activeer ik mijn AI CEO?',
      a: 'Je AI Coworkers (inclusief de CEO) wachten op je in het "AI Team" portaal. Zodra je een chat start, leest de AI direct de context van je hele platform (zoals je budget, doelen en schulden) om gericht strategisch advies te geven.'
    },
    {
      q: 'Wat doet het Levensbalans Wheel precies?',
      a: 'Het wiel meet 8 categorieën van je leven. Als een score onder de 40 komt, zal ons systeem pro-actief actie ondernemen en je Life Coach AI sturen om je te helpen dit gebied weer in balans te krijgen.'
    }
  ];

  const askCEO = () => {
    sessionStorage.setItem('ai_target_agent', 'CEO');
    sessionStorage.setItem('ai_initial_prompt', 'Hoi CEO, ik heb strategische hulp nodig om mijn RebuildYourLife doelen efficiënter te behalen. Kun je me begeleiden?');
    router.push('/dashboard/ai-team');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className="inline-block p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 mb-6 backdrop-blur-xl border border-emerald-500/20 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">Help Center & Support</h1>
          <p className="mt-4 text-lg text-textSecondary max-w-2xl mx-auto">
            Vind direct antwoorden of raadpleeg je persoonlijke AI-staf voor exclusieve strategische sturing.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full flex flex-col items-center justify-center text-center border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <h3 className="text-xl font-bold text-textPrimary mb-4">Strategisch Advies Nodig?</h3>
            <p className="text-textSecondary mb-8 text-sm">
              Je virtuele CEO Agent is geprogrammeerd om complexe bedrijfsmatige en persoonlijke beslissingen te overzien. 
            </p>
            <Button size="lg" className="w-full shadow-lg shadow-gold/20" onClick={askCEO}>
              Vraag de CEO Agent
            </Button>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h3 className="text-xl font-bold text-textPrimary mb-6">Veelgestelde Vragen</h3>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:bg-surface/50 transition-colors"
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className="p-4 flex justify-between items-center">
                <span className="font-medium text-textPrimary">{faq.q}</span>
                <span className={`transform transition-transform text-emerald-400 ${activeFaq === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              {activeFaq === index && (
                <div className="px-4 pb-4 text-sm text-textSecondary leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
