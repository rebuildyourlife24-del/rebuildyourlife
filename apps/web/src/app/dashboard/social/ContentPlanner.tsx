'use client';

import { useState, useTransition } from 'react';
import { Calendar, PenTool, Send, Loader2, CheckCircle, Zap } from 'lucide-react';
import { generateWeeklyContentAction, approvePostAction } from '@/app/actions/social';
import { publishPostAction } from '@/app/actions/social-posting';

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

  const [isPending, startTransition] = useTransition();

  const handleBatchGenerate = () => {
    startTransition(async () => {
      await generateWeeklyContentAction(platform);
      // Let op: in een echte RSC app zorgt revalidatePath in de action dat deze lijst refresht
      // Omdat dit een client component is die initialPosts gebruikt, doen we voor de demo een window.location.reload() of vertrouwen we op RSC router refresh.
      window.location.reload();
    });
  };

  const handleApprove = (postId: string) => {
    startTransition(async () => {
      await approvePostAction(postId);
      window.location.reload();
    });
  };

  const handlePublish = (postId: string) => {
    startTransition(async () => {
      const res = await publishPostAction(postId);
      if (!res.success) {
        alert(`Error: ${res.error}`);
      } else if (res.simulated) {
        alert('Succesvol gesimuleerd (geen API sleutels gevonden voor dit platform).');
      } else {
        alert('Post succesvol live gezet op social media!');
      }
      window.location.reload();
    });
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-cyan-500" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-white">Content Planner (Organic)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <Zap className="w-16 h-16 text-cyan-500 mb-4" />
          <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">AI Auto-Generatie</h3>
          <p className="text-sm text-zinc-400 mb-6">Laat de Copywriter Agent autonoom 5 posts voor komende week bedenken en inplannen als DRAFT (Concept).</p>
          
          <div className="w-full max-w-xs space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1 text-left">Platform</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="LINKEDIN">LinkedIn</option>
                <option value="TWITTER">X (Twitter)</option>
              </select>
            </div>
            
            <button 
              onClick={handleBatchGenerate}
              disabled={isPending}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />} Genereer 1 Week
            </button>
          </div>
        </div>

        {/* Kalender / Overzicht */}
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Content Kalender ({posts.length})</h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {posts.length === 0 ? (
              <p className="text-zinc-500 text-sm">Geen posts ingepland momenteel.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="border border-white/10 p-4 rounded-lg bg-black hover:border-cyan-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{post.platform}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-mono border ${
                      post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      post.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-3 line-clamp-3">{post.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-[10px] uppercase text-zinc-500 font-mono">
                      Publicatie: {new Date(post.publishAt).toLocaleString('nl-NL')}
                    </p>
                    
                    <div className="flex gap-2">
                      {post.status === 'DRAFT' && (
                        <button 
                          onClick={() => handleApprove(post.id)}
                          disabled={isPending}
                          className="text-[10px] uppercase bg-green-600/20 text-green-400 hover:bg-green-600/40 px-3 py-1 rounded font-bold transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {post.status === 'SCHEDULED' && (
                        <button 
                          onClick={() => handlePublish(post.id)}
                          disabled={isPending}
                          className="text-[10px] uppercase bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 px-3 py-1 rounded font-bold transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Publish Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
