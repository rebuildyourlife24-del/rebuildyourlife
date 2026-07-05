'use client';

import { useState } from 'react';
import { Video, Wand2, Loader2, Play, Calendar, Copy, Volume2, Smartphone } from 'lucide-react';

import { generateViralScriptAction } from '@/app/actions/modules';
import { generateVoiceAction } from '@/app/actions/voice';
import { publishSocialPost } from '@/actions/social-poster';

export default function ViralFactoryUI({ initialDrafts }: { initialDrafts: any[] }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TIKTOK');
  const [length, setLength] = useState('30');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [currentScript, setCurrentScript] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);

    try {
      const res = await generateViralScriptAction(topic, platform);
      
      if (res.success) {
        setCurrentScript(res.script || '');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!currentScript) return;
    setPublishing(true);
    try {
      const res = await publishSocialPost(platform, currentScript, audioUrl || undefined);
      if (res.success) {
        alert('Succes! Webhook is afgevuurd naar Make.com!');
        // Refresh de drafts (in theorie regelt de server action revalidatePath dit al bij een reload)
        setDrafts([{
          id: Math.random().toString(),
          platform: platform,
          status: 'PUBLISHED',
          content: currentScript,
          createdAt: new Date().toISOString()
        }, ...drafts]);
      } else {
        alert('Fout: ' + res.error);
      }
    } catch (err) {
      console.error(err);
    }
    setPublishing(false);
  };

  const handleGenerateAudio = async () => {
    if (!currentScript) return;
    setGeneratingAudio(true);
    try {
      const res = await generateVoiceAction(currentScript);
      if (res.success && res.audioBase64) {
        setAudioUrl(res.audioBase64);
      } else {
        alert(res.error || 'Er ging iets mis.');
      }
    } catch (err) {
      console.error(err);
    }
    setGeneratingAudio(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Generator Section */}
      <div className="border border-white/10 bg-black/40 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
        <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-cyan-400" /> Genereer Script
        </h3>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Onderwerp / Hook Idea</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
              placeholder="Bijv: Waarom dropshipping dood is in 2026..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Platform</label>
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
              >
                <option value="TIKTOK">TikTok</option>
                <option value="INSTAGRAM_REEL">Instagram Reels</option>
                <option value="YOUTUBE_SHORT">YouTube Shorts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Lengte</label>
              <select 
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
              >
                <option value="15">15 seconden (Fast-paced)</option>
                <option value="30">30 seconden (Standaard)</option>
                <option value="60">60 seconden (Educatief)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !topic}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest py-4 rounded-lg mt-4 flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />} Start AI Generation
          </button>
        </form>

        {currentScript && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Resultaat:</h4>
              <button onClick={() => navigator.clipboard.writeText(currentScript)} className="text-zinc-500 hover:text-white flex items-center gap-1 text-xs">
                <Copy size={12} /> Kopieer
              </button>
            </div>
            <div className="bg-black border border-white/5 p-4 rounded-lg max-h-[150px] overflow-y-auto mb-4">
              <pre className="text-zinc-300 text-sm whitespace-pre-wrap font-sans">{currentScript}</pre>
            </div>
            
            {audioUrl ? (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs mb-1">
                  <Volume2 className="w-4 h-4" /> ElevenLabs Audio Klaar
                </div>
                <audio controls src={audioUrl} className="w-full h-10" />
              </div>
            ) : (
              <button 
                onClick={handleGenerateAudio}
                disabled={generatingAudio}
                className="w-full border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
              >
                {generatingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Genereer Voice-over (ElevenLabs)
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button 
                onClick={async () => {
                  if (!currentScript) return;
                  alert("B-Roll Video Job (minimax/video-01) gestart via Inngest!");
                  await fetch('/api/inngest/broll', { method: 'POST', body: JSON.stringify({ prompt: currentScript.split('.')[0] }) });
                }}
                className="w-full bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors text-xs"
              >
                <Video className="w-4 h-4" /> B-Roll Video
              </button>
              
              <button 
                onClick={async () => {
                  if (!audioUrl) return alert("Genereer eerst een Voice-over!");
                  alert("Avatar Render Job (SadTalker) gestart via Inngest!");
                  await fetch('/api/inngest/avatar', { method: 'POST', body: JSON.stringify({ audioUrl }) });
                }}
                className="w-full bg-fuchsia-900/40 hover:bg-fuchsia-900/60 border border-fuchsia-500/50 text-fuchsia-400 font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors text-xs"
              >
                <Wand2 className="w-4 h-4" /> AI Avatar
              </button>
            </div>

            {/* NEW PUBLISH BUTTON */}
            <button 
              onClick={handlePublish}
              disabled={publishing}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest py-4 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
            >
              {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />} Auto-Publish naar Socials
            </button>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="border border-white/10 bg-black/40 p-6 rounded-xl flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2 w-full">
          <Smartphone className="w-5 h-5 text-emerald-400" /> 4K Video Preview
        </h3>
        
        <div className="relative w-[300px] h-[533px] bg-zinc-900 rounded-[2rem] border-8 border-zinc-800 overflow-hidden shadow-2xl">
          {/* Fake 4K Video Background (Looping gradient/placeholder for now to simulate stock footage) */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-pulse opacity-50"></div>
          
          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
             {currentScript ? (
               <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-2xl">
                 <p className="text-white font-bold text-lg leading-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
                   {currentScript.split('.')[0]}...
                 </p>
               </div>
             ) : (
               <p className="text-white/30 font-bold uppercase tracking-widest text-sm text-center">
                 Wachtend op Script...
               </p>
             )}
          </div>

          {/* Fake UI Overlays */}
          <div className="absolute right-3 bottom-20 flex flex-col gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><div className="w-6 h-6 bg-white rounded-full" /></div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><div className="w-6 h-6 bg-white rounded-full" /></div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><div className="w-6 h-6 bg-white rounded-full" /></div>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-6 text-center max-w-[300px]">
          Live preview van je content. Gebruik CapCut om de gegenereerde audio en tekst samen te voegen met luxe 4K stock-footage.
        </p>
      </div>

      {/* Library Section */}
      <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-400" /> Video Library
        </h3>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {drafts.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8 border border-dashed border-white/10 rounded-lg">Geen scripts gegenereerd.</p>
          ) : (
            drafts.map((draft: any) => (
              <div key={draft.id} className="border border-white/5 bg-black/60 p-4 rounded-lg hover:border-cyan-500/30 transition-colors cursor-pointer" onClick={() => setCurrentScript(draft.content)}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase">{draft.platform}</span>
                  <span className="text-[10px] px-2 py-1 bg-white/5 rounded uppercase font-mono text-zinc-400">{draft.status}</span>
                </div>
                <p className="text-sm text-zinc-300 line-clamp-2 mb-3">{draft.content}</p>
                <div className="flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-mono">
                  <Calendar size={10} /> {new Date(draft.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
