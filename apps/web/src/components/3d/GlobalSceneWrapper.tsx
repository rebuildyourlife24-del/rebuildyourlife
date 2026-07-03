'use client';

import { useCinematicTheme } from '@/lib/contexts/ThemeContext';
import { SceneController } from './SceneController';

export function GlobalSceneWrapper() {
  const { activeTheme } = useCinematicTheme();
  
  return (
    <div className="fixed inset-0 w-screen h-screen z-[-100] bg-black pointer-events-none">
      <SceneController theme={activeTheme} />
    </div>
  );
}
