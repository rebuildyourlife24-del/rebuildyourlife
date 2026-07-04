'use client';

import { useState } from 'react';
import { Video, Wand2, Loader2, Play, Calendar, Copy } from 'lucide-react';

export default function ViralFactoryUI({ initialDrafts }: { initialDrafts: any[] }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TIKTOK');
  const [length, setLength] = useState('30');
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [currentScript, setCurrentScript] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);

    try {
      const res = await fetch('/api/video-factory/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, length })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentScript(data.script);
        setDrafts([data.post, ...drafts]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
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
            <div className="bg-black border border-white/5 p-4 rounded-lg max-h-[300px] overflow-y-auto">
              <pre className="text-zinc-300 text-sm whitespace-pre-wrap font-sans">{currentScript}</pre>
            </div>
            <button className="w-full border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-bold uppercase tracking-widest py-3 rounded-lg mt-4 flex justify-center items-center gap-2 transition-colors">
              <Play className="w-4 h-4" /> Genereer Voice-over (Soon)
            </button>
          </div>
        )}
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
