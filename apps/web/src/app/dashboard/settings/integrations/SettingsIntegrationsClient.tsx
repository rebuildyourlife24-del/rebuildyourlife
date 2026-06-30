'use client';

import { useState } from 'react';
import { saveIntegration } from '@/actions/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Key } from 'lucide-react';

interface SettingsIntegrationsClientProps {
  provider: string;
  title: string;
  description: string;
  existingIntegration?: any;
}

export function SettingsIntegrationsClient({ provider, title, description, existingIntegration }: SettingsIntegrationsClientProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(!!existingIntegration);

  const handleSave = async () => {
    if (!apiKey && !saved) return;
    setLoading(true);
    try {
      await saveIntegration(provider, apiKey);
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
        <Input 
          type="password"
          placeholder={saved ? "•••••••••••••••• (Actief)" : "Plak hier je API Key..."} 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500"
        />
        <Button 
          onClick={handleSave} 
          disabled={loading || (!apiKey && !saved)}
          className={saved && !apiKey ? "bg-white/10 text-white hover:bg-white/20" : "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (saved && !apiKey ? 'Update' : 'Koppel')}
        </Button>
      </div>
    </div>
  );
}
