'use client';

import { useState } from 'react';
import { Calendar, PenTool, Send, Loader2 } from 'lucide-react';

type SocialPost = {
  id: string;
  platform: string;
  content: string;
  status: string;
  publishAt: string;
};

export default function ContentPlanner({ initialPosts }: { initialPosts: SocialPost[] }) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [platform, setPlatform] = useState('LINKEDIN');
  const [content, setContent] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Roept de bestaande content-forge AI api aan
      const res = await fetch('/api/content-forge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: "Business Growth & AI",
          contentType: "social_post",
          platform
        })
      });
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !publishAt) return;
    setIsScheduling(true);

    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, content, publishAt })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setContent('');
        setPublishAt('');
      }
    } catch (e) {
      console.error(e);
    }
    setIsScheduling(false);
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-cyan-500" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-white">Content Planner (Organic)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creator */}
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Nieuwe Post Inplannen</h3>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Platform</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="LINKEDIN">LinkedIn</option>
                <option value="TWITTER">X (Twitter)</option>
                <option value="INSTAGRAM">Instagram</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1 flex justify-between">
                <span>Content</span>
                <button type="button" onClick={handleGenerate} disabled={isGenerating} className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <PenTool className="w-3 h-3" />} AI Auto-Generate
                </button>
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Schrijf je post of gebruik AI..."
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Datum & Tijd</label>
              <input 
                type="datetime-local" 
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isScheduling || !content || !publishAt}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Schedule
            </button>
          </form>
        </div>

        {/* Kalender / Overzicht */}
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Ingeplande Posts ({posts.length})</h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {posts.length === 0 ? (
              <p className="text-zinc-500 text-sm">Geen posts ingepland momenteel.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="border border-white/10 p-4 rounded-lg bg-black hover:border-cyan-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{post.platform}</span>
                    <span className="text-[10px] px-2 py-1 rounded-full uppercase font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-3 line-clamp-3">{post.content}</p>
                  <p className="text-[10px] uppercase text-zinc-500 font-mono">
                    Publicatie: {new Date(post.publishAt).toLocaleString('nl-NL')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
