'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

export function WalletTopUpButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async () => {
    try {
      setIsLoading(true);
      // For now, default to €100 top up to keep flow fast
      const res = await fetch('/api/payments/mollie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }),
      });
      
      const data = await res.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to initialize payment');
      }
    } catch (err: any) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleTopUp}
      disabled={isLoading}
      className="ml-4 flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
      Add €100
    </button>
  );
}
