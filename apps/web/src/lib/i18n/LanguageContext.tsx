'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { dictionaries, Language } from './dictionaries';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const saved = localStorage.getItem('rylos_language') as Language;
    if (saved && dictionaries[saved]) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = (language === 'ar' || language === 'fa') ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rylos_language', lang);
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = dictionaries[language];

    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key missing: ${key} for language: ${language}`);
        return key;
      }
      current = current[k];
    }

    if (typeof current !== 'string') {
      console.warn(`Translation key does not resolve to string: ${key}`);
      return key;
    }

    let result = current;
    if (variables) {
      for (const [vKey, vValue] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{${vKey}}`, 'g'), vValue);
      }
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
