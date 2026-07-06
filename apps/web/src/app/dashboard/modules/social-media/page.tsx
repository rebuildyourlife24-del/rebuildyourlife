"use client";

import React, { useState, useEffect } from "react";
import { generateSocialCalendar, getUserSocialPosts, deleteSocialPost } from "@/app/actions/social";
import { Share2, Loader2, Plus, Trash2, ArrowLeft, Calendar, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [brandVoice, setBrandVoice] = useState("");
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getUserSocialPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandVoice || !topic) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await generateSocialCalendar(brandVoice, topic, days);
      if (!res.success) {
        setError(res.error || "Fout bij genereren.");
      } else {
        await loadPosts();
        setTopic("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Weet je zeker dat je deze post wilt verwijderen?")) return;
    await deleteSocialPost(id);
    await loadPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <Link href="/dashboard/modules" className="flex items-center text-zinc-500 hover:text-cyan-400 mb-8 transition-colors font-mono uppercase tracking-widest text-xs">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] flex items-center gap-3">
          <Share2 className="w-10 h-10 text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          AI Social Media Agency
        </h1>
        <p className="text-zinc-400 mt-2 text-lg font-light">
          Vul de brand voice in en genereer direct een contentkalender vol met hoogwaardige social media posts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GENERATOR FORM */}
        <div className="lg:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-colors"></div>
          
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center relative z-10">
            <Plus className="w-5 h-5 mr-2 text-purple-500" />
            Kalender Genereren
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Brand Voice (Tone of Voice)</label>
              <input 
                type="text" 
                value={brandVoice}
                onChange={e => setBrandVoice(e.target.value)}
                placeholder="Zakelijk, direct, beetje humor (Gary Vaynerchuk stijl)"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Onderwerp / Niche</label>
              <textarea 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                rows={3}
                placeholder="AI tools voor ondernemers om tijd te besparen."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all resize-none custom-scrollbar"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Aantal Dagen</label>
              <select 
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all appearance-none uppercase tracking-wider text-xs font-bold"
              >
                <option value={7} className="bg-zinc-950 text-white">1 Week (7 posts)</option>
                <option value={14} className="bg-zinc-950 text-white">2 Weken (14 posts)</option>
                <option value={30} className="bg-zinc-950 text-white">1 Maand (30 posts)</option>
              </select>
            </div>

            {error && <div className="text-red-400 text-sm font-mono border border-red-500/20 bg-red-500/10 p-2 rounded-lg">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest text-xs py-4 px-4 rounded-xl transition-all flex items-center justify-center mt-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:shadow-none border border-transparent disabled:border-white/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI is aan het schrijven...
                </>
              ) : "Genereer Content"}
            </button>
            <p className="text-xs text-center font-mono text-zinc-600 mt-3">Dit kan tot 30 seconden duren per maand.</p>
          </form>
        </div>

        {/* LIST OF POSTS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-6 bg-black/40 border border-white/10 p-4 rounded-2xl">
            <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" /> 
              Geplande Content
            </h2>
            <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 py-1 px-3 rounded text-xs font-bold font-mono">
              {posts.length} Posts
            </span>
          </div>
          
          {posts.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 font-mono uppercase tracking-widest text-sm bg-black/40">
              Je kalender is leeg. Genereer je eerste batch posts aan de linkerkant!
            </div>
          )}

          <div className="space-y-4">
            {posts.map(post => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-colors group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5 group-hover:border-purple-500/20 transition-colors">
                      {post.platform.toLowerCase() === "twitter" ? (
                        <Twitter className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
                      ) : (
                        <Linkedin className="w-5 h-5 text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold uppercase tracking-wider text-sm text-white">{post.platform}</div>
                      <div className="text-xs font-mono text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {formatDate(post.publishAt)}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="text-white/30 hover:text-red-500 p-2 transition-colors bg-red-500/0 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="bg-zinc-900/50 p-4 rounded-xl text-zinc-300 text-sm whitespace-pre-wrap border border-white/5 relative z-10 leading-relaxed">
                  {post.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
