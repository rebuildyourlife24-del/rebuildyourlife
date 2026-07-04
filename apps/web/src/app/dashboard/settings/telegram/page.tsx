import { Settings } from 'lucide-react';
import TelegramManager from './TelegramManager';

export default function TelegramSettingsPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-cyan-500" />
          Integraties
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Koppel externe platforms aan je Sovereign OS.</p>
      </div>

      <TelegramManager />
    </div>
  );
}
