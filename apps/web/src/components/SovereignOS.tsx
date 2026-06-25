'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, LayoutDashboard, Globe, Shield, Maximize2, Search } from 'lucide-react';

type WindowApp = {
  id: string;
  title: string;
  icon: React.ReactNode;
  url: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
};

export function SovereignOS() {
  const [windows, setWindows] = useState<WindowApp[]>([
    {
      id: 'dashboard',
      title: 'RYL Core Integrations',
      icon: <LayoutDashboard size={18} className="text-cyan-400" />,
      url: '/dashboard',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
    },
    {
      id: 'trinity',
      title: 'Trinity War Room',
      icon: <Shield size={18} className="text-emerald-400" />,
      url: '/dashboard/trinity',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
    },
    {
      id: 'browser',
      title: 'Sovereign Web',
      icon: <Globe size={18} className="text-blue-400" />,
      url: 'https://www.bing.com', // Using Bing as it often allows framing better than Google
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
    }
  ]);

  const [browserUrl, setBrowserUrl] = useState('https://www.bing.com');
  const [searchInput, setSearchInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const bringToFront = (id: string) => {
    setWindows(prev => {
      const highestZ = Math.max(...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: highestZ + 1, isMinimized: false } : w);
    });
  };

  const toggleWindow = (id: string) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;

      if (!win.isOpen) {
        // Open it and bring to front
        const highestZ = Math.max(...prev.map(w => w.zIndex), 0);
        return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: highestZ + 1 } : w);
      } else if (win.isMinimized) {
        // Restore it
        const highestZ = Math.max(...prev.map(w => w.zIndex), 0);
        return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w);
      } else {
        // Minimize it
        return prev.map(w => w.id === id ? { ...w, isMinimized: true } : w);
      }
    });
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false, isMinimized: false } : w));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    bringToFront(id);
  };

  const handleBrowserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = searchInput;
    if (!url.startsWith('http')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = 'https://www.bing.com/search?q=' + encodeURIComponent(url);
      }
    }
    setBrowserUrl(url);
  };

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden font-sans">
      
      {/* 4K Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
         <video 
           autoPlay 
           loop 
           muted 
           playsInline
           className="w-full h-full object-cover opacity-30 mix-blend-screen"
         >
           <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
      </div>

      {/* WINDOWS */}
      <div className="relative w-full h-[calc(100vh-80px)]">
        <AnimatePresence>
          {windows.map(win => {
            if (!win.isOpen || win.isMinimized) return null;

            return (
              <motion.div
                key={win.id}
                drag={!win.isMaximized}
                dragMomentum={false}
                onDragStart={() => { setIsDragging(true); bringToFront(win.id); }}
                onDragEnd={() => setIsDragging(false)}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  width: win.isMaximized ? '100%' : '80%',
                  height: win.isMaximized ? '100%' : '80%',
                  x: win.isMaximized ? 0 : undefined,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ 
                  zIndex: win.zIndex,
                  position: 'absolute',
                  top: win.isMaximized ? 0 : '10%',
                  left: win.isMaximized ? 0 : '10%',
                }}
                className={`
                  flex flex-col bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden
                  ${win.isMaximized ? '!rounded-none border-none' : 'shadow-[0_0_50px_rgba(0,0,0,0.5)]'}
                `}
                onMouseDown={() => bringToFront(win.id)}
              >
                {/* Window Header (Draggable Area) */}
                <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-move">
                  <div className="flex items-center gap-3">
                    {win.icon}
                    <span className="text-white text-xs font-bold tracking-widest uppercase">{win.title}</span>
                  </div>
                  
                  {/* Browser Controls (Only for browser) */}
                  {win.id === 'browser' && (
                    <form onSubmit={handleBrowserSearch} className="flex-1 max-w-md mx-4 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                      <input 
                        type="text" 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search or enter URL..."
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full bg-black/50 border border-white/10 rounded-full py-1 pl-8 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
                      />
                    </form>
                  )}

                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleWindow(win.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" onMouseDown={e => e.stopPropagation()}>
                      <Minus size={14} />
                    </button>
                    <button onClick={() => maximizeWindow(win.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" onMouseDown={e => e.stopPropagation()}>
                      <Square size={12} />
                    </button>
                    <button onClick={() => closeWindow(win.id)} className="w-8 h-8 flex items-center justify-center hover:bg-gold/20 rounded-lg text-zinc-400 hover:text-gold transition-colors" onMouseDown={e => e.stopPropagation()}>
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Window Content */}
                <div className="flex-1 relative bg-black">
                  {/* Transparent overlay during drag to prevent iframe from stealing mouse events */}
                  {isDragging && <div className="absolute inset-0 z-50"></div>}
                  
                  <iframe 
                    src={win.id === 'browser' ? browserUrl : win.url} 
                    className="w-full h-full border-none"
                    title={win.title}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* OS DOCK / TASKBAR */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent flex items-end justify-center pb-4 z-50">
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {windows.map(win => (
            <button
              key={win.id}
              onClick={() => toggleWindow(win.id)}
              className={`
                relative group flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300
                ${win.isOpen && !win.isMinimized ? 'bg-white/10 scale-110' : 'hover:bg-white/5 hover:scale-105'}
              `}
            >
              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform origin-bottom bg-black border border-white/10 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap tracking-widest uppercase">
                {win.title}
              </div>
              {win.icon}
              
              {/* Active Indicator */}
              {win.isOpen && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
