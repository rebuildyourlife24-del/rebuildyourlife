'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getUserFeaturesAction, type FeatureName } from '@/app/actions/featureFlags';

interface PaywallGateProps {
  feature: FeatureName;
  children: ReactNode;
  // Optioneel: wat te tonen als gebruiker geen toegang heeft
  fallback?: ReactNode;
  // Optioneel: toon overlay op bestaande content i.p.v. te verbergen
  overlay?: boolean;
}

const TIER_LABELS: Record<string, string> = {
  PREMIUM: 'Operator (€14,95/mnd)',
  ENTERPRISE: 'Business (€49,95/mnd)',
  ADMIN: 'Admin Only',
  SUPREME_OVERSEER: 'God-Mode Only',
};

const TIER_COLORS: Record<string, string> = {
  PREMIUM: 'text-gold border-gold/30 bg-gold/5',
  ENTERPRISE: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  ADMIN: 'text-goldLight border-[#d4af37]/30 bg-[#0a192f]/5',
  SUPREME_OVERSEER: 'text-gold border-gold/30 bg-gold/5',
};

export default function PaywallGate({ feature, children, fallback, overlay = false }: PaywallGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [requiredTier, setRequiredTier] = useState<string>('PREMIUM');

  useEffect(() => {
    getUserFeaturesAction().then(({ features }) => {
      setHasAccess(features[feature]);
      // Bepaal welke tier nodig is
      // Simpele mapping gebaseerd op feature naam
      if (feature.includes('business') || feature.includes('invoic') || feature.includes('crm')) {
        setRequiredTier('ENTERPRISE');
      } else if (feature.includes('god') || feature.includes('wealth') || feature.includes('enterprise')) {
        setRequiredTier('SUPREME_OVERSEER');
      } else {
        setRequiredTier('PREMIUM');
      }
    });
  }, [feature]);

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="animate-pulse bg-white/5 rounded-xl h-32 w-full" />
    );
  }

  // Toegang — toon gewoon de content
  if (hasAccess) {
    return <>{children}</>;
  }

  // Geen toegang — gebruik fallback of toon paywall overlay
  if (fallback) {
    return <>{fallback}</>;
  }

  const colorClass = TIER_COLORS[requiredTier] || TIER_COLORS.PREMIUM;

  if (overlay) {
    return (
      <div className="relative">
        {/* Vervaagde content */}
        <div className="pointer-events-none blur-sm opacity-30 select-none">
          {children}
        </div>
        {/* Paywall overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 backdrop-blur-sm rounded-xl">
          <div className={`border rounded-xl px-6 py-5 text-center max-w-xs ${colorClass}`}>
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="text-sm font-bold mb-1">Upgrade Vereist</h3>
            <p className="text-xs opacity-70 mb-4">
              Dit is beschikbaar in het <strong>{TIER_LABELS[requiredTier]}</strong> abonnement.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-block px-4 py-2 bg-gold text-navy text-xs font-bold rounded-lg hover:bg-goldLight transition-colors"
            >
              Upgraden →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Standaard: toon upgrade kaart
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-6 text-center ${colorClass}`}
    >
      <div className="text-3xl mb-3">🔒</div>
      <h3 className="font-bold text-base mb-2">Functie Geblokkeerd</h3>
      <p className="text-sm opacity-70 mb-5">
        Activeer <strong>{TIER_LABELS[requiredTier]}</strong> om toegang te krijgen.
      </p>
      <Link
        href="/dashboard/upgrade"
        className="inline-block px-6 py-2.5 bg-gold text-navy font-bold rounded-xl hover:bg-goldLight transition-colors text-sm"
      >
        Bekijk Abonnementen
      </Link>
    </motion.div>
  );
}

