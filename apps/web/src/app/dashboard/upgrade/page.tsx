'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function UpgradePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Features config
  const plans = [
    {
      name: t('upgrade.starter'),
      price: '€0',
      interval: '',
      description: t('upgrade.features.starterDesc'),
      features: ['Basis toegang', 'Beperkt AI-Team', 'Standaard support'],
      icon: Zap,
      isCurrent: true,
      planId: 'FREE',
      buttonText: t('upgrade.currentPlan'),
    },
    {
      name: t('upgrade.operator'),
      price: '€19,95',
      interval: '/mnd',
      description: t('upgrade.features.operatorDesc'),
      features: ['Onbeperkt AI-Team', 'War Room Predicties', 'Legal Engine PDF\'s', 'Priority support'],
      icon: Sparkles,
      highlight: true,
      planId: 'PREMIUM',
      buttonText: t('upgrade.chooseOperator'),
    },
    {
      name: t('upgrade.business'),
      price: '€59,95',
      interval: '/mnd',
      description: t('upgrade.features.businessDesc'),
      features: ['Alles in Operator', 'CRM Integraties', 'Facturatie', 'Zakelijke splitsing'],
      icon: Building2,
      planId: 'ENTERPRISE',
      buttonText: t('upgrade.chooseBusiness'),
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'FREE') return;
    
    setLoadingPlan(planId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/payments/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId }),
      });
      
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Fout bij aanmaken checkout sessie. Probeer het later opnieuw.");
      }
    } catch (error) {
      console.error("Checkout error", error);
      alert("Er is een fout opgetreden bij het verbinden met de betaalprovider.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentTier = user?.subscriptionTier || 'FREE';

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            {t('upgrade.choosePlan').split(' ')[0]} <span className="text-[#d4a853]">{t('upgrade.choosePlan').split(' ').slice(1).join(' ')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Upgrade naar God Mode en krijg toegang tot het volledige AI-ecosysteem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isHighlight = plan.highlight;
            const isCurrentPlan = currentTier === plan.planId;
            const isLoading = loadingPlan === plan.planId;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`relative rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 ${
                  isHighlight 
                    ? 'bg-[#0a0e1a] border-2 border-[#d4a853] shadow-[0_0_40px_rgba(212,168,83,0.15)] transform md:-translate-y-4' 
                    : 'bg-[#111827]/50 border border-white/10 hover:border-white/20'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d4a853] text-[#0a0e1a] px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                    Meest gekozen
                  </div>
                )}

                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    isHighlight ? 'bg-[#d4a853]/20 text-[#d4a853]' : 'bg-white/5 text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 h-12">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`w-5 h-5 mr-3 shrink-0 ${isHighlight ? 'text-[#d4a853]' : 'text-gray-400'}`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.planId)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
                    isHighlight
                      ? 'bg-[#d4a853] hover:bg-[#d4a853]/90 text-[#0a0e1a] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  } ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCurrentPlan ? (
                    t('upgrade.currentPlan')
                  ) : (
                    <>
                      {plan.buttonText}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
