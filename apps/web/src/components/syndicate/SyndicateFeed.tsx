'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Send, Flame } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    avatarUrl: string | null;
  };
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    avatarUrl: string | null;
  };
  likes: { userId: string }[];
  comments: Comment[];
}

interface SyndicateFeedProps {
  currentUserId: string;
}

export default function SyndicateFeed({ currentUserId }: SyndicateFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/syndicate/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/syndicate/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });
      const data = await res.json();
      if (data.success) {
        setNewPostContent('');
        setPosts([data.post, ...posts]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/syndicate/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            const hasLiked = p.likes.some(l => l.userId === currentUserId);
            return {
              ...p,
              likes: hasLiked 
                ? p.likes.filter(l => l.userId !== currentUserId)
                : [...p.likes, { userId: currentUserId }]
            };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      const res = await fetch(`/api/syndicate/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...p.comments, data.comment] };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Zojuist';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m geleden`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}u geleden`;
      return `${Math.floor(diffInSeconds / 86400)}d geleden`;
    } catch {
      return 'Zojuist';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.05)] backdrop-blur-sm">
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Deel een win, vraag of update met The Syndicate..."
            className="w-full bg-black/40 border border-cyan-900/30 rounded-lg p-4 text-sm text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-500/50 resize-none min-h-[100px] mb-3"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-cyan-600 flex items-center gap-1">
              <Flame className="w-3 h-3" /> +10 XP per Post
            </span>
            <button 
              type="submit"
              disabled={submitting || !newPostContent.trim()}
              className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 px-6 py-2 rounded-lg text-xs uppercase font-black tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Plaatsen
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => {
          const hasLiked = post.likes.some(l => l.userId === currentUserId);
          return (
            <div key={post.id} className="bg-black/30 border border-cyan-900/30 rounded-xl p-5 hover:border-cyan-800/50 transition-colors">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400">
                  {post.author.firstName?.[0] || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{post.author.firstName} {post.author.lastName}</span>
                    {post.author.role === 'ADMIN' && (
                      <span className="bg-amber-900/40 border border-amber-500/30 text-amber-500 text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                        Founder
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-cyan-600 uppercase font-black tracking-widest">
                    {formatTime(post.createdAt)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <p className="text-cyan-100/90 text-sm whitespace-pre-wrap leading-relaxed mb-6 font-mono">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-6 border-t border-cyan-900/20 pt-4 mb-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${hasLiked ? 'text-rose-400' : 'text-cyan-600 hover:text-cyan-400'}`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} /> {post.likes.length}
                </button>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-600">
                  <MessageSquare className="w-4 h-4" /> {post.comments.length}
                </div>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-600 hover:text-cyan-400 ml-auto">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="space-y-4 mb-4 bg-cyan-950/10 rounded-lg p-4 border border-cyan-900/10">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-900/20 flex-shrink-0 flex items-center justify-center text-[9px] font-black text-cyan-500">
                        {comment.author.firstName?.[0] || 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-cyan-100 text-xs">{comment.author.firstName}</span>
                          <span className="text-[9px] text-cyan-700 uppercase font-bold tracking-widest">{formatTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-cyan-300/70 text-xs">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  placeholder="Schrijf een reactie..."
                  className="flex-1 bg-black/40 border border-cyan-900/30 rounded-lg px-4 py-2 text-xs text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-500/50"
                />
                <button 
                  type="submit"
                  disabled={!commentInputs[post.id]?.trim()}
                  className="bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-400 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          );
        })}
        
        {posts.length === 0 && (
          <div className="text-center py-20 border border-cyan-900/30 rounded-xl bg-cyan-950/10">
            <MessageSquare className="w-12 h-12 text-cyan-500/30 mx-auto mb-4" />
            <h3 className="text-cyan-300 font-bold uppercase tracking-widest mb-2">Geen Posts Gevonden</h3>
            <p className="text-cyan-500/50 text-sm">Wees de eerste die iets deelt met The Syndicate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
