'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams?.get('ref');
    
    if (ref) {
      // Sla de affiliate code op in localStorage voor backup
      localStorage.setItem('ryl_affiliate', ref);
      
      // Sla op als cookie (vervalt over 30 dagen)
      const expires = new Date();
      expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      document.cookie = `ryl_affiliate=${ref};expires=${expires.toUTCString()};path=/`;
      
      console.log('[AFFILIATE] Link detected and tracked for 30 days:', ref);
    }
  }, [searchParams]);

  return null; // Onzichtbaar component
}
