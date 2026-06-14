'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 p-1 rounded-lg">
      <Globe className="w-4 h-4 text-zinc-400 ml-2" />
      <div className="flex">
        <button
          onClick={() => setLanguage('nl')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
            language === 'nl' 
              ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' 
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          NL
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
            language === 'en' 
              ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' 
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
