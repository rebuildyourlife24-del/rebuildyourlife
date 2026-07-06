"use client";

import { useState, useEffect } from "react";
import { syncGoogleReviews, getBusinessReviews, generateAiReply } from "@/app/actions/reviews";
import { Star, MessageSquare, DownloadCloud, CheckCircle } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [customInstruction, setCustomInstruction] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setFetching(true);
    const res = await getBusinessReviews();
    if (res.success && res.reviews) {
      setReviews(res.reviews);
    }
    setFetching(false);
  }

  async function handleSync() {
    setLoading(true);
    const res = await syncGoogleReviews("dummy_place_id");
    if (res.success) {
      await loadReviews();
      alert("Nieuwe reviews gesynchroniseerd!");
    } else {
      alert("Fout bij synchroniseren: " + res.error);
    }
    setLoading(false);
  }

  async function handleGenerateReply(reviewId: string) {
    setAiLoading(reviewId);
    const res = await generateAiReply(reviewId, customInstruction);
    if (res.success) {
      await loadReviews();
      setCustomInstruction("");
    } else {
      alert("Fout bij AI generatie: " + res.error);
    }
    setAiLoading(null);
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">Review Management</h1>
          <p className="text-zinc-400 mt-2 text-lg font-light">
            Beheer Google & Trustpilot reviews op één plek en laat AI professionele reacties genereren.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-black font-black uppercase tracking-widest text-xs hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:shadow-none border border-transparent disabled:border-white/10"
        >
          <DownloadCloud className="h-4 w-4" />
          {loading ? "Synchroniseren..." : "Sync Reviews"}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none transition-colors"></div>
        
        {fetching ? (
          <div className="p-12 text-center text-zinc-500 font-mono uppercase tracking-widest text-sm animate-pulse">Reviews laden...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 border-2 border-dashed border-white/10 m-6 rounded-xl font-mono uppercase tracking-widest text-sm">
            Je hebt nog geen reviews ingeladen. Klik op 'Sync Reviews' om te starten.
          </div>
        ) : (
          <div className="divide-y divide-white/10 relative z-10">
            {reviews.map((review) => (
              <div key={review.id} className="p-8 flex flex-col md:flex-row gap-8 hover:bg-white/5 transition-colors group">
                
                {/* Review Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black uppercase tracking-wider text-xl text-white">{review.authorName}</span>
                    <span className="text-[10px] px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-400 font-black uppercase tracking-widest">
                      {review.platform}
                    </span>
                  </div>
                  <div className="flex text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-current" : "text-zinc-800"}`} />
                    ))}
                  </div>
                  <p className="text-zinc-300 italic text-lg leading-relaxed border-l-2 border-cyan-500/50 pl-4 py-1">"{review.text}"</p>
                  <p className="text-xs text-zinc-600 font-mono">Ontvangen op {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Reply Section */}
                <div className="w-full md:w-1/2 bg-zinc-900/50 rounded-xl p-6 border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                  {review.aiReply ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                        <CheckCircle className="h-4 w-4" />
                        AI Antwoord Gegenereerd
                      </div>
                      <textarea 
                        className="w-full text-sm p-4 border border-white/10 rounded-xl bg-black text-zinc-300 min-h-[120px] focus:outline-none focus:border-cyan-500 transition-colors custom-scrollbar"
                        defaultValue={review.aiReply}
                      />
                      <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest text-xs py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        Publiceer Reactie (Simulatie)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-cyan-500" />
                        Genereer AI Reactie
                      </label>
                      <input 
                        type="text" 
                        placeholder="Extra instructies? (Optioneel)" 
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                        className="w-full text-sm border border-white/10 bg-black text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                      <button 
                        onClick={() => handleGenerateReply(review.id)}
                        disabled={aiLoading === review.id}
                        className="w-full bg-cyan-900/40 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-400 text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-50"
                      >
                        {aiLoading === review.id ? "AI is aan het typen..." : "Genereer Reactie"}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
