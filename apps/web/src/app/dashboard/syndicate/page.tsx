"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Ghost, 
  Skull, 
  Target, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Lock, 
  Shield, 
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { 
  getSyndicateCampaigns, 
  createSyndicateCampaign, 
  addSyndicateTarget, 
  launchSyndicateCampaign,
  getSyndicatePosts,
  createSyndicatePost,
  toggleSyndicateLike,
  addSyndicateComment,
  seedSyndicatePostsIfEmpty,
  getCurrentUser
} from '@/actions/syndicate';

export default function SyndicatePage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'proxy'>('feed');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Feed States
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTier, setNewPostTier] = useState<number>(1);
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [feedFilterTier, setFeedFilterTier] = useState<number | 'all'>('all');

  // Proxy Engine States
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [targetName, setTargetName] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetDebt, setTargetDebt] = useState('');
  const [addingToCampaign, setAddingToCampaign] = useState<string | null>(null);
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setLoadingPosts(true);
    setLoadingCampaigns(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      // Seed if database has no posts
      await seedSyndicatePostsIfEmpty();
      
      await Promise.all([
        loadPosts(),
        loadCampaigns()
      ]);
    } catch (err) {
      console.error("Initialization error:", err);
    } finally {
      setLoadingPosts(false);
      setLoadingCampaigns(false);
    }
  };

  const loadPosts = async () => {
    try {
      const data = await getSyndicatePosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  const loadCampaigns = async () => {
    try {
      const data = await getSyndicateCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  };

  // --- Feed Handlers ---
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent?.trim()) return;
    setIsPosting(true);
    try {
      await createSyndicatePost(newPostContent, newPostTitle || undefined, newPostTier);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostTier(1);
      await loadPosts();
    } catch (err) {
      alert("Error posting to syndicate.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      // Optimistic Update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      }));
      
      await toggleSyndicateLike(postId);
      // Quiet reload
      const updated = await getSyndicatePosts();
      setPosts(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText?.trim()) return;

    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await addSyndicateComment(postId, commentText);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      await loadPosts();
    } catch (err) {
      alert("Failed to submit comment.");
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleCommentsExpanded = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // --- Proxy Handlers ---
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCampaign(true);
    try {
      await createSyndicateCampaign(newCampaignName, newCampaignDesc);
      setNewCampaignName('');
      setNewCampaignDesc('');
      await loadCampaigns();
    } catch (err) {
      alert("Error creating campaign.");
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  const handleAddTarget = async (e: React.FormEvent, campaignId: string) => {
    e.preventDefault();
    setAddingToCampaign(campaignId);
    try {
      await addSyndicateTarget(campaignId, targetEmail, targetName, targetCompany, parseFloat(targetDebt) || 0);
      setTargetName('');
      setTargetEmail('');
      setTargetCompany('');
      setTargetDebt('');
      await loadCampaigns();
    } catch (err) {
      alert("Error adding target.");
    } finally {
      setAddingToCampaign(null);
    }
  };

  const handleLaunch = async (campaignId: string) => {
    if (!confirm("Are you sure you want to trigger the proxy mail attack protocol? This will dispatch emails from our proxy network.")) return;
    setLaunchingId(campaignId);
    try {
      const result = await launchSyndicateCampaign(campaignId);
      alert(`Protocol Finished. ${result.sent} proxy mails dispatched.`);
      await loadCampaigns();
    } catch (err) {
      alert("Error executing protocol.");
    } finally {
      setLaunchingId(null);
    }
  };

  const handleManualSeed = async () => {
    if (confirm("Execute DB Syndicate seed protocol?")) {
      const success = await seedSyndicatePostsIfEmpty();
      if (success) {
        alert("Seed complete.");
        loadPosts();
      } else {
        alert("No seed needed or seeding failed.");
      }
    }
  };

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1: return "FACTION MEMBER";
      case 2: return "ENFORCER";
      case 3: return "LIEUTENANT";
      case 4: return "SUPREME OVERSEER";
      default: return `TIER ${tier}`;
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "border-cyan-900/50 text-cyan-700 bg-black";
      case 2: return "border-cyan-800/80 text-cyan-600 bg-cyan-950/10";
      case 3: return "border-cyan-500 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]";
      case 4: return "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-black animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.3)]";
      default: return "border-cyan-900/30 text-cyan-800";
    }
  };

  // Filter posts based on UI filter
  const filteredPosts = posts.filter(post => {
    if (feedFilterTier === 'all') return true;
    return post.tier === feedFilterTier;
  });

  const userClearance = currentUser?.clearanceLevel || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto font-sans text-white min-h-[85vh] space-y-8 pb-12 select-none relative z-10"
    >
      {/* Background glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/10 hidden blur-[] rounded-full pointer-events-none -z-10"></div>

      {/* Title Header */}
      <div className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase flex items-center gap-4">
               <Ghost className="w-8 h-8 text-cyan-500" />
               THE SYNDICATE
             </h1>
             <span className="text-[10px] font-bold tracking-widest text-cyan-400 border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 rounded-full uppercase">
               SECURED INTERFACE
             </span>
          </div>
          <p className="text-cyan-400/60 uppercase tracking-widest text-xs flex items-center gap-2 font-bold">
             <Skull className="w-4 h-4" /> ENCRYPTED NODE // PROTOCOLS: COMMUNICATION FEED & ATTACK PROXY
          </p>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-5 min-w-[280px]">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2 font-bold">OPERATIVE PROFILE</div>
            <div className="font-black text-white text-sm uppercase tracking-widest mb-3">{currentUser.firstName} {currentUser.lastName}</div>
            <div className="text-[10px] text-zinc-400 flex justify-between mb-1.5 font-bold uppercase tracking-widest">
              <span>CLEARANCE TIER:</span>
              <span className="text-cyan-400">LEVEL {userClearance} ({getTierLabel(userClearance)})</span>
            </div>
            <div className="text-[10px] text-zinc-400 flex justify-between font-bold uppercase tracking-widest">
              <span>FACTION ROLE:</span>
              <span className="text-white">{currentUser.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Smooth Tab Switcher */}
      <div className="flex bg-black/40 border border-white/5 rounded-xl p-1.5 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3.5 text-center font-bold uppercase tracking-widest text-xs rounded-lg transition-all ${
            activeTab === 'feed'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          [ 01 // SYNDICATE FEED ]
        </button>
        <button
          onClick={() => setActiveTab('proxy')}
          className={`flex-1 py-3.5 text-center font-bold uppercase tracking-widest text-xs rounded-lg transition-all ${
            activeTab === 'proxy'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          [ 02 // PROXY ATTACK ENGINE ]
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'feed' ? (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Create Post (Left Column) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rotate-45 transform translate-x-12 -translate-y-12 border-l border-cyan-500/20" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                  <Shield className="w-4 h-4 text-cyan-500" /> BROADCAST DATA
                </h2>
                
                <form onSubmit={handleCreatePost} className="space-y-5">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold">
                      DATA HEADER / TITLE (OPTIONAL)
                    </label>
                    <Input 
                      value={newPostTitle}
                      onChange={e => setNewPostTitle(e.target.value)}
                      placeholder="e.g., RECON REPORT #291"
                      className="bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 h-12 font-sans px-4 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold">
                      BROADCAST CONTENT
                    </label>
                    <textarea 
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      placeholder="Write encrypted intelligence..."
                      required
                      rows={5}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 p-4 font-sans text-sm focus:outline-none focus:ring-0 custom-scrollbar resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold">
                      ACCESS CLEARANCE LEVEL REQUIRED
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(tier => {
                        const isAllowed = tier <= userClearance;
                        return (
                          <button
                            key={tier}
                            type="button"
                            disabled={!isAllowed}
                            onClick={() => setNewPostTier(tier)}
                            className={`py-2.5 rounded-lg text-center text-xs font-bold transition-all border ${
                              !isAllowed 
                                ? 'border-white/5 text-zinc-700 bg-zinc-950/40 cursor-not-allowed'
                                : newPostTier === tier
                                  ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                                  : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-white bg-black'
                            }`}
                          >
                            T{tier}
                          </button>
                        );
                      })}
                    </div>
                    {newPostTier > 1 && (
                      <p className="text-[9px] text-cyan-400/80 mt-3 uppercase tracking-widest font-bold">
                        ⚠️ Restricting view to Level {newPostTier}+ agents.
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isPosting || !newPostContent?.trim()}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-xl py-4 transition-colors disabled:opacity-40"
                  >
                    {isPosting ? 'BROADCASTING...' : 'DISPATCH TO SYNDICATE'}
                  </Button>
                </form>

                {/* Seed button */}
                <div className="mt-8 border-t border-white/5 pt-5 flex justify-between items-center">
                  <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">System DB Diagnostics</span>
                  <button 
                    onClick={handleManualSeed}
                    className="text-[9px] text-zinc-400 hover:text-white font-bold uppercase tracking-widest flex items-center gap-1.5 bg-black border border-white/10 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Force Seed DB
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Feed (Right 2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter bar */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Filter Feed by Clearance:</span>
                <div className="flex gap-2 bg-black p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setFeedFilterTier('all')}
                    className={`px-4 py-1.5 text-[10px] rounded-md font-bold transition-all uppercase tracking-widest ${
                      feedFilterTier === 'all' 
                        ? 'bg-zinc-800 text-white' 
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    ALL
                  </button>
                  {[1, 2, 3, 4].map(tier => {
                    const isAllowed = tier <= userClearance;
                    return (
                      <button
                        key={tier}
                        onClick={() => isAllowed && setFeedFilterTier(tier)}
                        className={`px-4 py-1.5 text-[10px] rounded-md font-bold transition-all uppercase tracking-widest ${
                          !isAllowed 
                            ? 'text-zinc-800 cursor-not-allowed'
                            : feedFilterTier === tier
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                        }`}
                      >
                        T{tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              {loadingPosts ? (
                <div className="text-cyan-500 animate-pulse font-black uppercase tracking-widest py-16 text-center rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md text-xs">
                  DECRYPTING DATABASE FEED DATA STREAM...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-zinc-500 font-bold uppercase tracking-widest rounded-2xl bg-black/40 border border-white/5 p-16 text-center backdrop-blur-md text-xs">
                  NO INTEL LOGGED AT TIER {feedFilterTier !== 'all' ? feedFilterTier : '1-4'}.
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPosts.map((post, index) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.4) }}
                      className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md hover:border-white/10 transition-colors"
                    >
                      {/* Post Header */}
                      <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-4 mb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            {post.title && (
                              <h3 className="text-base font-black text-white uppercase tracking-widest">
                                {post.title}
                              </h3>
                            )}
                            <span className={`text-[9px] font-bold tracking-widest rounded-full border py-0.5 px-2.5 ${getTierColor(post.tier)}`}>
                              {getTierLabel(post.tier)} REQUIRED
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            AGENT: <span className="text-white">{post.author.firstName || "ANONYMOUS"}</span> <span className="text-zinc-700 mx-1">|</span> ID: <span className="text-cyan-500/70">{post.author.id.substring(0,8)}</span>
                          </div>
                        </div>
                        <div className="text-right text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          {new Date(post.createdAt).toLocaleDateString('nl-NL')}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed py-2 select-text selection:bg-cyan-500/30 selection:text-white">
                        {post.content}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-2 text-[10px] rounded-lg font-black uppercase px-4 py-2 border transition-all tracking-widest ${
                            post.isLiked
                              ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                              : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20 bg-black/50'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>LIKE [{post.likesCount}]</span>
                        </button>

                        <button
                          onClick={() => toggleCommentsExpanded(post.id)}
                          className={`flex items-center gap-2 text-[10px] rounded-lg font-black uppercase px-4 py-2 border transition-all tracking-widest ${
                            expandedComments[post.id]
                              ? 'bg-zinc-800 border-zinc-700 text-white'
                              : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20 bg-black/50'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>COMMENTS [{post.comments.length}]</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments[post.id] && (
                        <div className="mt-6 border-t border-white/5 pt-6 space-y-4">
                          <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3" /> DECRYPTED TRANSMISSION FEEDBACK
                          </h4>

                          {/* List comments */}
                          <div className="space-y-3">
                            {post.comments.length === 0 ? (
                              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">No transmission responses recorded.</p>
                            ) : (
                              post.comments.map((comment: any) => (
                                <div key={comment.id} className="bg-black/50 p-4 rounded-xl border border-white/5 text-xs">
                                  <div className="flex justify-between items-center text-[9px] text-zinc-500 mb-2 border-b border-white/5 pb-2">
                                    <span className="font-bold text-zinc-300 uppercase tracking-widest">
                                      AGENT: {comment.author.firstName}
                                    </span>
                                    <span className="tracking-widest">{new Date(comment.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-zinc-400 leading-relaxed">{comment.content}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add comment Form */}
                          <form 
                            onSubmit={(e) => handleAddComment(post.id, e)}
                            className="flex items-center gap-3 mt-4"
                          >
                            <Input
                              value={commentInputs[post.id] || ''}
                              onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Type secured reply..."
                              className="bg-black border border-white/10 rounded-xl text-xs focus:border-cyan-500/50 text-white h-11 px-4 flex-1"
                              disabled={submittingComment[post.id]}
                            />
                            <Button 
                              type="submit" 
                              disabled={submittingComment[post.id] || !commentInputs[post.id]?.trim()}
                              className="bg-white hover:bg-zinc-200 text-black rounded-xl border-none h-11 px-6 font-black flex items-center gap-2 transition-colors disabled:opacity-40"
                            >
                              <Send className="w-4 h-4" />
                              <span className="text-[10px] uppercase tracking-widest">SEND</span>
                            </Button>
                          </form>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Proxy Mail Attack Engine */
          <motion.div
            key="proxy"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Create Campaign */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                  <Target className="w-4 h-4 text-cyan-500" /> INITIATE CAMPAIGN
                </h2>
                <form onSubmit={handleCreateCampaign} className="space-y-5">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">
                      CAMPAIGN NAME (e.g., NON-PAYERS DEBT Q2)
                    </label>
                    <Input 
                      value={newCampaignName}
                      onChange={e => setNewCampaignName(e.target.value)}
                      placeholder="Campaign name..."
                      required
                      className="bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 h-12 px-4"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">
                      DESCRIPTION / INTERNAL MEMO
                    </label>
                    <Input 
                      value={newCampaignDesc}
                      onChange={e => setNewCampaignDesc(e.target.value)}
                      placeholder="Notes and briefing..."
                      className="bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-cyan-500/50 h-12 px-4"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isCreatingCampaign}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-xl py-4 transition-colors disabled:opacity-40"
                  >
                    {isCreatingCampaign ? 'GENERATING...' : 'INITIALIZE PROTOCOL'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Col: Active Campaigns */}
            <div className="lg:col-span-2 space-y-6">
              {loadingCampaigns ? (
                <div className="text-cyan-500 animate-pulse font-black uppercase tracking-widest py-16 text-center rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md text-xs">
                  DECRYPTING ACTIVE CAMPAIGN RECORDS...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-zinc-500 font-bold uppercase tracking-widest rounded-2xl bg-black/40 border border-white/5 p-16 text-center backdrop-blur-md text-xs">
                  NO ACTIVE PROXY EMAIL CAMPAIGNS REGISTERED.
                </div>
              ) : (
                campaigns.map(camp => (
                  <div 
                    key={camp.id} 
                    className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md hover:border-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-5">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">{camp.name}</h3>
                        <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest font-bold">{camp.description || 'NO ADDITIONAL DATA ENTERED'}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-full ${
                          camp.status === 'ACTIVE' 
                            ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' 
                            : 'border-white/10 text-zinc-500 bg-black/50'
                        }`}>
                          {camp.status}
                        </span>
                        <p className="text-[9px] text-zinc-600 mt-3 uppercase tracking-widest font-bold">DISPATCHED: <span className="text-white">{camp.totalSent}</span> MAILS</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3.5 h-3.5" /> SYSTEM TARGETS ({camp.targets.length})
                      </h4>
                      {camp.targets.length === 0 && (
                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">No proxy email targets added yet.</p>
                      )}
                      
                      {camp.targets.length > 0 && (
                        <div className="overflow-x-auto rounded-xl border border-white/5">
                          <table className="w-full text-left text-xs text-zinc-400">
                            <thead>
                              <tr className="border-b border-white/5 bg-black/60 uppercase tracking-widest text-[9px] font-bold">
                                <th className="p-4 text-zinc-500">NAME / TARGET ORG</th>
                                <th className="p-4 text-zinc-500">EMAIL ADDRESS</th>
                                <th className="p-4 text-zinc-500">DEBT VALUE</th>
                                <th className="p-4 text-right text-zinc-500">STATUS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {camp.targets.map((t: any) => (
                                <tr key={t.id} className="border-b border-white/5 bg-black/20 hover:bg-white/5 transition-colors">
                                  <td className="p-4 text-white font-medium">
                                    {t.name} <span className="text-zinc-600 text-[10px] ml-1">({t.company || 'n/v/t'})</span>
                                  </td>
                                  <td className="p-4 text-cyan-400/80">{t.email}</td>
                                  <td className="p-4 font-medium text-white">€{t.debtAmount?.toFixed(2) || '0.00'}</td>
                                  <td className="p-4 text-right">
                                    {t.status === 'SENT' ? (
                                      <span className="inline-flex items-center gap-1.5 text-cyan-400 font-bold tracking-widest text-[9px] bg-cyan-950/20 px-2.5 py-1 rounded-md border border-cyan-500/30">
                                        <CheckCircle2 className="w-3 h-3"/> DISPATCHED
                                      </span>
                                    ) : (
                                      <span className="text-cyan-800 font-bold tracking-widest text-[9px] uppercase">PENDING LAUNCH</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Add Target Form */}
                    <div className="bg-black/40 p-5 rounded-xl border border-white/5 mb-6">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">ADD NEW TARGET TO THIS PROTOCOL</div>
                      <form onSubmit={(e) => handleAddTarget(e, camp.id)} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <Input value={targetName} onChange={e=>setTargetName(e.target.value)} placeholder="Full Name" required className="h-10 text-xs bg-zinc-950 border-white/10 rounded-lg text-white focus:border-cyan-500/50 px-3"/>
                        <Input value={targetEmail} onChange={e=>setTargetEmail(e.target.value)} type="email" placeholder="Email" required className="h-10 text-xs bg-zinc-950 border-white/10 rounded-lg text-white focus:border-cyan-500/50 px-3"/>
                        <Input value={targetCompany} onChange={e=>setTargetCompany(e.target.value)} placeholder="Company (opt)" className="h-10 text-xs bg-zinc-950 border-white/10 rounded-lg text-white focus:border-cyan-500/50 px-3"/>
                        <Input value={targetDebt} onChange={e=>setTargetDebt(e.target.value)} type="number" placeholder="Debt Value €" className="h-10 text-xs bg-zinc-950 border-white/10 rounded-lg text-white focus:border-cyan-500/50 px-3"/>
                        <Button type="submit" disabled={addingToCampaign === camp.id} className="h-10 bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs rounded-lg border-none transition-colors">+</Button>
                      </form>
                    </div>

                    {/* Launch Button */}
                    <Button 
                      onClick={() => handleLaunch(camp.id)}
                      disabled={launchingId === camp.id || camp.targets.filter((t:any) => t.status !== 'SENT').length === 0}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all rounded-xl border-none py-4 text-xs disabled:opacity-40 disabled:shadow-none"
                    >
                      {launchingId === camp.id ? (
                        <span className="flex items-center justify-center gap-3 animate-pulse">
                          <Zap className="w-4 h-4" /> DISPATCHING EMAILS VIA SECURITY MASK...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          <Zap className="w-4 h-4" /> LAUNCH ATTACK PROTOCOL
                        </span>
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
