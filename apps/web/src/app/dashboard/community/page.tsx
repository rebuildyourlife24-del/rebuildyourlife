"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Flame, Award, Loader2, Send } from 'lucide-react';
import LeaderboardWidget from './LeaderboardWidget';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost, category: "GENERAL" })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewPost("");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30">
          <Award className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Syndicate Hub</h1>
          <p className="text-sm text-zinc-400 font-mono mt-1">Connect, share wins, and level up with other operators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Create Post */}
          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl relative">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a win, ask a question, or drop some value..."
          className="w-full bg-transparent text-white placeholder-zinc-600 focus:outline-none resize-none min-h-[100px] text-sm"
        />
        <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-3">
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 bg-zinc-900 text-zinc-400 rounded-full hover:text-white transition-colors">🔥 Win</button>
            <button className="text-xs px-3 py-1 bg-zinc-900 text-zinc-400 rounded-full hover:text-white transition-colors">💡 Idea</button>
            <button className="text-xs px-3 py-1 bg-zinc-900 text-zinc-400 rounded-full hover:text-white transition-colors">❓ Question</button>
          </div>
          <button 
            onClick={handlePostSubmit}
            disabled={isSubmitting || !newPost.trim()}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl group hover:border-indigo-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold font-mono text-zinc-400">
                  {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">{post.author?.firstName} {post.author?.lastName}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {post.category === 'WINS' && (
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                  <Flame size={12} /> Big Win
                </span>
              )}
            </div>

            <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>

            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/5">
              <button className="flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors text-xs font-bold">
                <Heart size={16} /> {post.likes}
              </button>
              <button className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors text-xs font-bold">
                <MessageSquare size={16} /> {post._count?.comments || 0}
              </button>
              <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold ml-auto">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        ))}

          {posts.length === 0 && (
            <div className="text-center p-12 border border-white/5 rounded-2xl bg-black/40">
              <Award className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-white font-bold uppercase tracking-widest mb-2">Geen berichten nog</h3>
              <p className="text-zinc-500 text-sm">Breek het ijs en wees de eerste die een bericht plaatst in The Syndicate.</p>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="hidden lg:block space-y-6">
          <LeaderboardWidget />
        </div>
      </div>
      </div>
    </div>
  );
}
