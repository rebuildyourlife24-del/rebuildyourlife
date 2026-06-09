'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Tier = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

const TIER_ORDER: Record<Tier, number> = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
};

interface PaywallProps {
  children: ReactNode;
  requiredTier: 'PREMIUM' | 'ENTERPRISE';
}

export function Paywall({ children, requiredTier }: PaywallProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Default to FREE if no user or no tier specified
  const userTier = (user?.subscriptionTier as Tier) || 'FREE';
  const hasAccess = TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
  const router = useRouter();

  if (hasAccess) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    router.push('/dashboard/upgrade');
  };

  return (
    <div className="relative group w-full h-full">
      <div className="opacity-20 pointer-events-none blur-[4px] select-none transition-all duration-300 h-full w-full">
        {children}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <div className="bg-[#0a0e1a]/85 backdrop-blur-xl border border-[#d4a853]/20 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-[#0a0e1a] border border-[#d4a853]/30 p-4 rounded-full mb-6 shadow-[0_0_15px_rgba(212,168,83,0.2)]">
            <Lock className="w-8 h-8 text-[#d4a853]" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
            {t('paywall.unlockGodMode')}
          </h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {t('paywall.requiresSubscription', { tier: requiredTier })}
          </p>
          
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-[#d4a853] hover:bg-[#d4a853]/90 text-[#0a0e1a] font-bold py-3 text-lg shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.5)]"
          >
            {t('paywall.upgradeNow')}
          </Button>
        </div>
      </div>
    </div>
  );
}
