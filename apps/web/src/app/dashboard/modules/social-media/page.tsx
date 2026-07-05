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
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-slate-950">
      <Link href="/dashboard/modules" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Terug naar Modules
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-3">
          <Share2 className="w-10 h-10 text-indigo-400" />
          AI Social Media Agency
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Vul de brand voice in en genereer direct een contentkalender vol met hoogwaardige social media posts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GENERATOR FORM */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-400" />
            Kalender Genereren
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Brand Voice (Tone of Voice)</label>
              <input 
                type="text" 
                value={brandVoice}
                onChange={e => setBrandVoice(e.target.value)}
                placeholder="Zakelijk, direct, beetje humor (Gary Vaynerchuk stijl)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Onderwerp / Niche</label>
              <textarea 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                rows={3}
                placeholder="AI tools voor ondernemers om tijd te besparen."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Aantal Dagen</label>
              <select 
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              >
                <option value={7}>1 Week (7 posts)</option>
                <option value={14}>2 Weken (14 posts)</option>
                <option value={30}>1 Maand (30 posts)</option>
              </select>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI is aan het schrijven...
                </>
              ) : "Genereer Content"}
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">Dit kan tot 30 seconden duren.</p>
          </form>
        </div>

        {/* LIST OF POSTS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" /> 
              Geplande Content
            </h2>
            <span className="bg-slate-800 text-slate-300 py-1 px-3 rounded-full text-xs font-bold">
              {posts.length} Posts
            </span>
          </div>
          
          {posts.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              Je kalender is leeg. Genereer je eerste batch posts aan de linkerkant!
            </div>
          )}

          <div className="space-y-4">
            {posts.map(post => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                      {post.platform.toLowerCase() === "twitter" ? (
                        <Twitter className="w-5 h-5 text-sky-400" />
                      ) : (
                        <Linkedin className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{post.platform}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(post.publishAt)}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl text-slate-300 text-sm whitespace-pre-wrap border border-slate-800">
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
