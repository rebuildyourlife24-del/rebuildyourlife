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
    if (!newPostContent.trim()) return;
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
    if (!commentText || !commentText.trim()) return;

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
      case 1: return "border-zinc-500 text-zinc-400 bg-zinc-950";
      case 2: return "border-gold/50 text-goldLight bg-[#0a192f]/20";
      case 3: return "border-[#d4af37] text-gold bg-[#0a192f]/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]";
      case 4: return "border-gold bg-gold text-black font-black animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]";
      default: return "border-zinc-800 text-zinc-500";
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
      className="space-y-8 max-w-6xl mx-auto pb-20 font-mono text-zinc-300"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-[#d4af37] pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
               <Ghost className="w-10 h-10 text-gold animate-pulse" />
               THE SYNDICATE
             </h1>
             <Badge variant="outline" className="tracking-widest text-[10px] text-gold border-gold bg-[#0a192f]/20 px-3 py-1 font-bold">
               SECURED INTERFACE
             </Badge>
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
             <Skull className="w-4 h-4 text-gold" /> ENCRYPTED NODE // PROTOCOLS: COMMUNICATION FEED & ATTACK PROXY
          </p>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="border-2 border-[#d4af37] bg-black p-4 shadow-[4px_4px_0px_0px_#ef4444] min-w-[280px]">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 border-b border-zinc-900 pb-1">OPERATIVE PROFILE</div>
            <div className="font-bold text-white text-sm uppercase">{currentUser.firstName} {currentUser.lastName}</div>
            <div className="text-[10px] text-zinc-400 mt-1 flex justify-between">
              <span>CLEARANCE TIER:</span>
              <span className="text-gold font-bold">LEVEL {userClearance} ({getTierLabel(userClearance)})</span>
            </div>
            <div className="text-[10px] text-zinc-400 flex justify-between">
              <span>FACTION ROLE:</span>
              <span className="text-zinc-300 font-bold">{currentUser.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Brutalist Tab Switcher */}
      <div className="flex border-4 border-black bg-zinc-950 p-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-4 text-center font-black uppercase tracking-[0.2em] text-sm transition-all border-r-2 border-black last:border-r-0 ${
            activeTab === 'feed'
              ? 'bg-gold text-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.15)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          [ 01 // SYNDICATE FEED ]
        </button>
        <button
          onClick={() => setActiveTab('proxy')}
          className={`flex-1 py-4 text-center font-black uppercase tracking-[0.2em] text-sm transition-all ${
            activeTab === 'proxy'
              ? 'bg-gold text-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.15)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
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
              <div className="border-4 border-black bg-black p-6 shadow-[6px_6px_0px_0px_#ffffff] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rotate-45 transform translate-x-12 -translate-y-12 border-l border-gold" />
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-zinc-900 pb-3">
                  <Shield className="w-5 h-5 text-gold" /> BROADCAST DATA
                </h2>
                
                <form onSubmit={handleCreatePost} className="space-y-5">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-2 font-bold">
                      DATA HEADER / TITLE (OPTIONAL)
                    </label>
                    <Input 
                      value={newPostTitle}
                      onChange={e => setNewPostTitle(e.target.value)}
                      placeholder="e.g., RECON REPORT #291"
                      className="bg-zinc-950 border-2 border-zinc-800 rounded-none text-white focus:border-gold h-10 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-2 font-bold">
                      BROADCAST CONTENT
                    </label>
                    <textarea 
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      placeholder="Write encrypted intelligence..."
                      required
                      rows={5}
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-none text-white focus:border-gold p-3 font-mono text-sm focus:outline-none focus:ring-0"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-2 font-bold">
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
                            className={`py-2 text-center text-xs font-bold transition-all border-2 ${
                              !isAllowed 
                                ? 'border-zinc-900 text-zinc-700 bg-zinc-950/40 cursor-not-allowed'
                                : newPostTier === tier
                                  ? 'border-gold bg-[#0a192f]/30 text-white font-black'
                                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 bg-zinc-950'
                            }`}
                          >
                            T{tier}
                          </button>
                        );
                      })}
                    </div>
                    {newPostTier > 1 && (
                      <p className="text-[9px] text-goldLight/80 mt-2 uppercase tracking-wider">
                        ⚠️ Restricting view to Level {newPostTier}+ agents.
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isPosting || !newPostContent.trim()}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-none border-2 border-black py-6 shadow-[4px_4px_0px_0px_#ef4444]"
                  >
                    {isPosting ? 'BROADCASTING...' : 'DISPATCH TO SYNDICATE'}
                  </Button>
                </form>

                {/* Seed button */}
                <div className="mt-8 border-t border-zinc-900 pt-4 flex justify-between items-center">
                  <span className="text-[9px] text-zinc-500 uppercase">System DB Diagnostics</span>
                  <button 
                    onClick={handleManualSeed}
                    className="text-[9px] text-gold hover:text-goldLight font-bold uppercase tracking-widest flex items-center gap-1 bg-[#0a192f]/20 border border-[#d4af37] px-2 py-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Force Seed Mock Data
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Feed (Right 2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter bar */}
              <div className="border-2 border-zinc-850 bg-black p-4 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs uppercase text-zinc-500 tracking-wider">Filter Feed by Clearance:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFeedFilterTier('all')}
                    className={`px-3 py-1 text-xs font-bold transition-all border ${
                      feedFilterTier === 'all' 
                        ? 'border-gold bg-[#0a192f]/20 text-white' 
                        : 'border-zinc-800 text-zinc-500 hover:text-white'
                    }`}
                  >
                    ALL ACCESS
                  </button>
                  {[1, 2, 3, 4].map(tier => {
                    const isAllowed = tier <= userClearance;
                    return (
                      <button
                        key={tier}
                        onClick={() => isAllowed && setFeedFilterTier(tier)}
                        className={`px-3 py-1 text-xs font-bold transition-all border ${
                          !isAllowed 
                            ? 'border-zinc-950 text-zinc-800 cursor-not-allowed'
                            : feedFilterTier === tier
                              ? 'border-gold bg-[#0a192f]/20 text-white'
                              : 'border-zinc-800 text-zinc-500 hover:text-white'
                        }`}
                      >
                        T{tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              {loadingPosts ? (
                <div className="text-gold animate-pulse font-black uppercase tracking-widest py-12 text-center border-2 border-dashed border-[#d4af37]">
                  DECRYPTING DATABASE FEED DATA STREAM...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-zinc-500 uppercase tracking-widest border-2 border-dashed border-zinc-850 p-12 text-center">
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
                      className="border-4 border-black bg-zinc-950 p-6 shadow-[5px_5px_0px_0px_rgba(255,255,255,0.08)] hover:shadow-[5px_5px_0px_0px_rgba(239,68,68,0.3)] transition-all"
                    >
                      {/* Post Header */}
                      <div className="flex justify-between items-start gap-4 border-b-2 border-zinc-900 pb-4 mb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {post.title && (
                              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                                {post.title}
                              </h3>
                            )}
                            <Badge className={`text-[9px] font-black tracking-widest border py-0.5 px-2 ${getTierColor(post.tier)}`}>
                              {getTierLabel(post.tier)} REQUIRED
                            </Badge>
                          </div>
                          <div className="text-[10px] text-zinc-500 uppercase">
                            AGENT: <span className="text-zinc-300 font-bold">{post.author.firstName || "ANONYMOUS"}</span> // ID: <span className="text-zinc-400">{post.author.id.substring(0,8)}</span>
                          </div>
                        </div>
                        <div className="text-right text-[10px] text-zinc-500">
                          {new Date(post.createdAt).toLocaleString('nl-NL')}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed font-mono py-2 select-text selection:bg-gold selection:text-white">
                        {post.content}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-900">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-2 text-xs font-black uppercase px-3 py-1.5 border transition-all ${
                            post.isLiked
                              ? 'bg-gold border-gold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                              : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 bg-black'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>LIKE [{post.likesCount}]</span>
                        </button>

                        <button
                          onClick={() => toggleCommentsExpanded(post.id)}
                          className={`flex items-center gap-2 text-xs font-black uppercase px-3 py-1.5 border transition-all ${
                            expandedComments[post.id]
                              ? 'bg-zinc-800 border-zinc-700 text-white'
                              : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 bg-black'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>COMMENTS [{post.comments.length}]</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments[post.id] && (
                        <div className="mt-6 border-t-2 border-zinc-900 pt-6 space-y-4">
                          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            DECRYPTED TRANSMISSION FEEDBACK
                          </h4>

                          {/* List comments */}
                          <div className="space-y-3">
                            {post.comments.length === 0 ? (
                              <p className="text-xs text-zinc-600 uppercase italic">No transmission responses recorded.</p>
                            ) : (
                              post.comments.map((comment: any) => (
                                <div key={comment.id} className="bg-black/60 p-3 border border-zinc-900 text-xs">
                                  <div className="flex justify-between items-center text-[9px] text-zinc-500 mb-1 border-b border-zinc-950 pb-1">
                                    <span className="font-bold text-zinc-400 uppercase">
                                      AGENT: {comment.author.firstName}
                                    </span>
                                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-zinc-300 font-mono leading-relaxed">{comment.content}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add comment Form */}
                          <form 
                            onSubmit={(e) => handleAddComment(post.id, e)}
                            className="flex items-center gap-2 mt-4"
                          >
                            <Input
                              value={commentInputs[post.id] || ''}
                              onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Type secured reply..."
                              className="bg-black border-2 border-zinc-800 rounded-none text-xs focus:border-gold text-white font-mono h-9"
                              disabled={submittingComment[post.id]}
                            />
                            <Button 
                              type="submit" 
                              disabled={submittingComment[post.id] || !commentInputs[post.id]?.trim()}
                              className="bg-white hover:bg-zinc-200 text-black rounded-none border-2 border-black h-9 px-4 font-black flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3" />
                              <span className="text-xs uppercase font-black">SEND</span>
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
              <div className="border-4 border-black bg-black p-6 shadow-[6px_6px_0px_0px_#ffffff]">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-zinc-900 pb-3">
                  <Target className="w-5 h-5 text-gold" /> INITIATE CAMPAIGN
                </h2>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block mb-1">
                      CAMPAIGN NAME (e.g., NON-PAYERS DEBT Q2)
                    </label>
                    <Input 
                      value={newCampaignName}
                      onChange={e => setNewCampaignName(e.target.value)}
                      placeholder="Campaign name..."
                      required
                      className="bg-zinc-950 border-2 border-zinc-800 rounded-none text-white focus:border-gold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block mb-1">
                      DESCRIPTION / INTERNAL MEMO
                    </label>
                    <Input 
                      value={newCampaignDesc}
                      onChange={e => setNewCampaignDesc(e.target.value)}
                      placeholder="Notes and briefing..."
                      className="bg-zinc-950 border-2 border-zinc-800 rounded-none text-white focus:border-gold font-mono"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isCreatingCampaign}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-none border-2 border-black py-5 shadow-[4px_4px_0px_0px_#ef4444]"
                  >
                    {isCreatingCampaign ? 'GENERATING...' : 'INITIALIZE PROTOCOL'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Col: Active Campaigns */}
            <div className="lg:col-span-2 space-y-6">
              {loadingCampaigns ? (
                <div className="text-gold animate-pulse font-black uppercase tracking-widest py-12 text-center border-2 border-dashed border-[#d4af37]">
                  DECRYPTING ACTIVE CAMPAIGN RECORDS...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-zinc-500 uppercase tracking-widest border-2 border-dashed border-zinc-850 p-12 text-center">
                  NO ACTIVE PROXY EMAIL CAMPAIGNS REGISTERED.
                </div>
              ) : (
                campaigns.map(camp => (
                  <div 
                    key={camp.id} 
                    className="border-4 border-black bg-zinc-950 p-6 shadow-[5px_5px_0px_0px_rgba(255,255,255,0.08)] relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6 border-b-2 border-zinc-900 pb-4">
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest">{camp.name}</h3>
                        <p className="text-xs text-zinc-500 mt-1 uppercase">{camp.description || 'NO ADDITIONAL DATA ENTERED'}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`px-2 py-0.5 text-xs font-black uppercase border rounded-none ${
                          camp.status === 'ACTIVE' 
                            ? 'border-gold bg-[#0a192f]/20 text-goldLight' 
                            : 'border-zinc-800 text-zinc-400 bg-black'
                        }`}>
                          {camp.status}
                        </Badge>
                        <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">DISPATCHED: {camp.totalSent} MAILS</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-4 h-4 text-gold" /> SYSTEM TARGETS ({camp.targets.length})
                      </h4>
                      {camp.targets.length === 0 && (
                        <p className="text-xs text-zinc-600 uppercase italic">No proxy email targets added yet.</p>
                      )}
                      
                      {camp.targets.length > 0 && (
                        <div className="overflow-x-auto border border-zinc-900">
                          <table className="w-full text-left text-xs text-zinc-400 font-mono">
                            <thead>
                              <tr className="border-b-2 border-zinc-950 bg-black uppercase tracking-widest text-[9px]">
                                <th className="p-3">NAME / TARGET ORG</th>
                                <th className="p-3">EMAIL ADDRESS</th>
                                <th className="p-3">DEBT VALUE</th>
                                <th className="p-3 text-right">STATUS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {camp.targets.map((t: any) => (
                                <tr key={t.id} className="border-b border-zinc-950 bg-black/30 hover:bg-zinc-900/20">
                                  <td className="p-3 text-white font-bold">
                                    {t.name} <span className="text-zinc-650 font-normal">({t.company || 'n/v/t'})</span>
                                  </td>
                                  <td className="p-3 text-goldLight">{t.email}</td>
                                  <td className="p-3 font-mono">€{t.debtAmount?.toFixed(2) || '0.00'}</td>
                                  <td className="p-3 text-right">
                                    {t.status === 'SENT' ? (
                                      <span className="inline-flex items-center gap-1 text-gold font-black tracking-widest text-[9px] bg-[#0a192f]/20 px-2 py-0.5 border border-[#d4af37]">
                                        <CheckCircle2 className="w-3 h-3"/> DISPATCHED
                                      </span>
                                    ) : (
                                      <span className="text-zinc-600 font-bold text-[9px]">PENDING LAUNCH</span>
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
                    <div className="bg-black p-4 border border-zinc-900 mb-6">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3 font-bold">ADD NEW TARGET TO THIS PROTOCOL</div>
                      <form onSubmit={(e) => handleAddTarget(e, camp.id)} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <Input value={targetName} onChange={e=>setTargetName(e.target.value)} placeholder="Full Name" required className="h-9 text-xs bg-zinc-950 border-zinc-800 rounded-none text-white focus:border-gold font-mono"/>
                        <Input value={targetEmail} onChange={e=>setTargetEmail(e.target.value)} type="email" placeholder="Email" required className="h-9 text-xs bg-zinc-950 border-zinc-800 rounded-none text-white focus:border-gold font-mono"/>
                        <Input value={targetCompany} onChange={e=>setTargetCompany(e.target.value)} placeholder="Company (opt)" className="h-9 text-xs bg-zinc-950 border-zinc-800 rounded-none text-white focus:border-gold font-mono"/>
                        <Input value={targetDebt} onChange={e=>setTargetDebt(e.target.value)} type="number" placeholder="Debt Value €" className="h-9 text-xs bg-zinc-950 border-zinc-800 rounded-none text-white focus:border-gold font-mono"/>
                        <Button type="submit" disabled={addingToCampaign === camp.id} className="h-9 bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs rounded-none border border-black">+</Button>
                      </form>
                    </div>

                    {/* Launch Button */}
                    <Button 
                      onClick={() => handleLaunch(camp.id)}
                      disabled={launchingId === camp.id || camp.targets.filter((t:any) => t.status !== 'SENT').length === 0}
                      className="w-full bg-[#0a192f] hover:bg-gold text-black font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all rounded-none border-2 border-black py-6 text-sm"
                    >
                      {launchingId === camp.id ? (
                        <span className="flex items-center justify-center gap-2 animate-pulse">
                          <Zap className="w-5 h-5 text-black" /> DISPATCHING EMAILS VIA SECURITY MASK...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5 text-black" /> LAUNCH ATTACK PROTOCOL
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

