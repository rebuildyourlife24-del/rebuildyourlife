'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/dictionaries';
import { Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'af', label: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sr', label: 'Српски', flag: '🇷🇸' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'ku', label: 'Kurdî', flag: '🇹🇯' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-navyLighter/50 border border-borderSubtle hover:border-gold/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 text-textMuted" />
        <span className="hidden sm:inline-block text-sm font-medium text-textPrimary">
          {currentLang.flag} {currentLang.label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-navyLighter border border-borderSubtle shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${
                    language === lang.code
                      ? 'bg-gold/10 text-gold font-medium'
                      : 'text-textPrimary hover:bg-navy hover:text-gold'
                  }`}
                >
                  <span className="mr-2 text-lg leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
