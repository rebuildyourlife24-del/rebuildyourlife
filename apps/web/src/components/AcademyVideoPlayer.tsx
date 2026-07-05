'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';

interface AcademyVideoPlayerProps {
  videoUrl: string;
  lessonId: string;
}

export function AcademyVideoPlayer({ videoUrl, lessonId }: AcademyVideoPlayerProps) {
  // In a real implementation this would integrate with Vimeo, YouTube, or a custom HTML5 player.
  // For now, we mock the UI of a high-end custom player.
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="group relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
      
      {/* Fake Video Layer */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
        {/* We would render an iframe or video tag here */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
        
        {!isPlaying && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="z-20 w-20 h-20 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-500/50 flex items-center justify-center hover:scale-110 hover:bg-purple-500/40 transition-all"
          >
            <Play className="w-8 h-8 text-white ml-2" />
          </button>
        )}
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-white/20 rounded-full mb-4 cursor-pointer hover:h-2 transition-all">
          <div 
            className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          {/* Scrubber knob */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
            style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-purple-400 transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button className="text-white hover:text-purple-400 transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-zinc-300">00:00 / 12:45</span>
          </div>

          <div>
            <button className="text-white hover:text-purple-400 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
