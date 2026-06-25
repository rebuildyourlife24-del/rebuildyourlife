'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

export default function AlphaTradingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/trading');
  }, [router]);

  return (
    <div className="flex h-[60vh] items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-white" />
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Redirecting to Alpha Trading Floor...</p>
      </div>
    </div>
  );
}
