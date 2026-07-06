'use client';

import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ViralShort } from '../../remotion/ViralShort';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function RemotionStudio() {
  const [title, setTitle] = useState("VIRAL HOOK HIER");
  const [themeColor, setThemeColor] = useState("#00f0ff"); // Default Orion Cyan

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Settings / Prompts */}
      <Card className="p-6 bg-black/40 border-[#00f0ff]/20">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-[#00f0ff]">
          Video Parameters
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Video Titel (Hook)</label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/50 border-[#00f0ff]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Neon Themakleur</label>
            <Input 
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="bg-black/50 border-[#00f0ff]/30 h-10 w-full cursor-pointer"
            />
          </div>

          <div className="pt-6 border-t border-[#00f0ff]/10">
            <Button className="w-full bg-[#00f0ff]/10 border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20">
              Genereer Script met AI
            </Button>
            <Button className="w-full mt-2 bg-[#d4af37]/10 border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/20">
              Genereer Audio via ElevenLabs
            </Button>
          </div>
        </div>
      </Card>

      {/* Render Player */}
      <div className="flex flex-col items-center justify-center bg-black/60 border border-[#00f0ff]/20 rounded-xl p-4 shadow-[0_0_30px_rgba(0,240,255,0.05)]">
        <div className="w-full max-w-[320px] rounded-lg overflow-hidden border border-[#00f0ff]/30">
          <Player
            component={ViralShort}
            inputProps={{
              title: title,
              themeColor: themeColor,
              audioUrl: "" // Connect dit in de toekomst met de ElevenLabs output
            }}
            durationInFrames={150} // 5 seconden test
            fps={30}
            compositionWidth={1080}
            compositionHeight={1920}
            style={{
              width: '100%',
              aspectRatio: '9/16'
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <p className="mt-4 text-xs text-gray-500 uppercase tracking-wider">Client-Side Render Engine</p>
      </div>
    </div>
  );
}
