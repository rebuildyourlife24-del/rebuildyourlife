'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'scifi' | 'cyberpunk' | 'dark';

interface ThemeContextType {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveThemeState] = useState<Theme>('scifi');

  useEffect(() => {
    // Load saved theme from localStorage on mount
    const saved = localStorage.getItem('ryl-cinematic-theme') as Theme;
    if (saved && ['scifi', 'cyberpunk', 'dark'].includes(saved)) {
      setActiveThemeState(saved);
    }
  }, []);

  const setActiveTheme = (theme: Theme) => {
    setActiveThemeState(theme);
    localStorage.setItem('ryl-cinematic-theme', theme);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCinematicTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCinematicTheme must be used within a ThemeProvider');
  }
  return context;
}
