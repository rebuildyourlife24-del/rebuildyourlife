'use client';

import { useState } from 'react';
import { saveSocialIntegration } from '@/actions/integrations';
import { CheckCircle2, Loader2, Key } from 'lucide-react';

interface SettingsSocialIntegrationsClientProps {
  platform: string;
  title: string;
  description: string;
  existingIntegration?: any;
}

export function SettingsSocialIntegrationsClient({ platform, title, description, existingIntegration }: SettingsSocialIntegrationsClientProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(!!existingIntegration);

  const handleSave = async () => {
    if (!apiKey && !saved) return;
    setLoading(true);
    try {
      await saveSocialIntegration(platform, apiKey);
      setSaved(true);
      setApiKey(''); // clear visual key for security after saving
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Key className="w-5 h-5 text-gray-400" />}
          <h4 className="font-semibold text-white">{title}</h4>
        </div>
        {saved && <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">Actief</span>}
      </div>
      <p className="text-sm text-gray-400">{description}</p>
      
      <div className="flex items-center gap-2">
        <input 
          type="password"
          placeholder={saved ? "•••••••••••••••• (Actief)" : "Plak hier je Access Token..."} 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex h-10 w-full rounded-md px-3 py-2 text-sm bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button 
          onClick={handleSave} 
          disabled={loading || (!apiKey && !saved)}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed ${saved && !apiKey ? "bg-white/10 text-white hover:bg-white/20" : "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"}`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (saved && !apiKey ? 'Update' : 'Koppel')}
        </button>
      </div>
    </div>
  );
}
