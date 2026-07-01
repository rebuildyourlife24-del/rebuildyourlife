'use client';

import { useRequireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Activity, MessageSquare, Mail, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KlantenPortal() {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();

  // Redirect users who aren't basic users if needed, or allow everyone.
  // We allow everyone for now.

  if (isLoading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welkom terug, {user.firstName || 'Klant'}</h1>
          <p className="text-white/60 mt-2">Bekijk de prestaties van je actieve AI-diensten.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/60 text-sm">AI Chatbot Gesprekken</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Leads Gegenereerd</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/60 text-sm">ROI Geschat</p>
              <h3 className="text-2xl font-bold">€ 3.450</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 border-white/10 bg-gradient-to-br from-white/5 to-transparent">
        <h2 className="text-xl font-semibold mb-4">Mijn AI Diensten</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-medium">Klantenservice Bot (Website)</h4>
                <p className="text-sm text-white/50">Actief sinds 12 mei</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
              Bekijk Transcripten
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-blue-500/20 rounded-xl bg-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-blue-500 text-[10px] font-bold uppercase rounded-bl-lg">
              Upsell
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-400">Verhoog je Omzet met SEO AI</h4>
                <p className="text-sm text-white/60">Laat onze AI je website scannen en optimaliseren voor Google.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Upgrade Nu (€299)
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
