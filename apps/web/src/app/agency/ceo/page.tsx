'use client';

import { useRequireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, Users, TrendingUp, DollarSign, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CEOPortal() {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== 'SUPER_ADMIN' && user.role !== 'SUPREME_OVERSEER' && user.role !== 'ADMIN') {
      router.push('/agency/klanten');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CEO Master Control</h1>
          <p className="text-white/60 mt-2">White-label Agency Overzicht (ai-henksemler.nl)</p>
        </div>
        <Link href="/admin" className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-4 h-4" />
          <span>Enter GOD MODE</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Actieve Klanten</p>
              <h3 className="text-3xl font-bold mt-1">12</h3>
            </div>
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Maandelijks Terugkerend (MRR)</p>
              <h3 className="text-3xl font-bold mt-1">€ 2.450</h3>
            </div>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Totaal Gefactureerd</p>
              <h3 className="text-3xl font-bold mt-1">€ 14.200</h3>
            </div>
            <div className="p-2 bg-gold/20 text-gold rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">SaaS Platform (B2B)</p>
              <h3 className="text-lg font-bold mt-1">RebuildYourLife</h3>
            </div>
            <Link href="https://rebuildyourlife.eu/dashboard" target="_blank" className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold mb-4">Recente Klant Activiteit</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-black/20">
                <div>
                  <h4 className="font-medium">Klant {i} - Tandartspraktijk</h4>
                  <p className="text-sm text-white/50">Chatbot heeft 3 nieuwe afspraken geboekt.</p>
                </div>
                <span className="text-xs text-white/40">Vandaag</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold mb-4">Upsell Mogelijkheden</h2>
          <div className="space-y-4">
            <div className="p-4 border border-indigo-500/30 rounded-lg bg-indigo-500/10">
              <h4 className="font-medium text-indigo-400">Klant 2 heeft geen SEO Pakket</h4>
              <p className="text-sm text-white/60 mt-1 mb-3">Ze draaien al 3 maanden de chatbot. Tijd om SEO aan te bieden.</p>
              <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-sm text-white font-medium transition-colors">
                Genereer Voorstel (AI)
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
