'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, Unplug } from 'lucide-react';
import Link from 'next/link';

export default function TelegramManager() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"PENDING" | "CONNECTED" | "ERROR">("PENDING");
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchConnection();
  }, []);

  const fetchConnection = async () => {
    try {
      const res = await fetch('/api/telegram/connect');
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        if (data.status === 'PENDING') {
          setConnectUrl(data.url);
        } else if (data.status === 'CONNECTED') {
          setChatId(data.chatId);
        }
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      setStatus('ERROR');
    }
    setLoading(false);
  };

  const handleDisconnect = async () => {
    if (!confirm('Weet je zeker dat je Telegram wilt loskoppelen? GodBrain zal geen berichten meer sturen naar je telefoon.')) return;
    setActionLoading(true);
    try {
      await fetch('/api/telegram/connect', { method: 'DELETE' });
      await fetchConnection();
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
  }

  return (
    <div className="border border-white/10 bg-black/40 p-8 rounded-xl max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
          <Send className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Telegram Bot (GodBrain)</h2>
          <p className="text-sm text-zinc-400">Verbind je Telegram account met je AI assistent.</p>
        </div>
      </div>

      {status === 'CONNECTED' ? (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
            <div>
              <h3 className="font-bold text-green-400 uppercase tracking-widest">Verbonden</h3>
              <p className="text-sm text-green-500/80 mt-1">
                Jouw Telegram is succesvol gekoppeld (Chat ID: <span className="font-mono">{chatId}</span>). Je kunt nu direct chatten met GodBrain in Telegram.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleDisconnect}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm uppercase tracking-widest font-bold"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unplug className="w-4 h-4" />}
            Verbreek Verbinding
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            Met de Telegram integratie heb je altijd toegang tot GodBrain. Je kunt vragen stellen over je omzet, AI scripts genereren, of facturen opvragen, simpelweg door een appje te sturen.
          </p>
          
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg text-center">
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest">Stap 1: Open Telegram</h4>
            {connectUrl ? (
              <Link href={connectUrl} target="_blank" className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-black uppercase tracking-widest px-8 py-4 rounded-lg transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                Koppel Telegram Nu
              </Link>
            ) : (
              <p className="text-red-400">Kon koppel-link niet laden.</p>
            )}
            <p className="text-xs text-zinc-500 mt-4 font-mono">Klik op de knop hierboven en druk op 'Start' in Telegram.</p>
          </div>
          
          <div className="flex justify-center">
            <button onClick={fetchConnection} className="text-xs text-cyan-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Loader2 className="w-3 h-3" /> Ververs status als je geklikt hebt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
