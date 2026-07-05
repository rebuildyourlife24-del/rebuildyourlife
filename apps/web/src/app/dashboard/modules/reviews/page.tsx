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

  const userId = "temp-user-id"; // TODO: Replace with auth context

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setFetching(true);
    const res = await getBusinessReviews(userId);
    if (res.success && res.reviews) {
      setReviews(res.reviews);
    }
    setFetching(false);
  }

  async function handleSync() {
    setLoading(true);
    const res = await syncGoogleReviews(userId, "dummy_place_id");
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
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground">
            Beheer Google & Trustpilot reviews op één plek en laat AI professionele reacties genereren.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <DownloadCloud className="h-4 w-4" />
          {loading ? "Synchroniseren..." : "Sync Reviews"}
        </button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {fetching ? (
          <div className="p-8 text-center text-gray-500">Reviews laden...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Je hebt nog geen reviews ingeladen. Klik op 'Sync Reviews' om te starten.
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 flex flex-col md:flex-row gap-6">
                
                {/* Review Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{review.authorName}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full font-mono text-gray-600">
                      {review.platform}
                    </span>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{review.text}"</p>
                  <p className="text-xs text-gray-400">Ontvangen op {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Reply Section */}
                <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-4 border">
                  {review.aiReply ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        AI Antwoord Gegenereerd
                      </div>
                      <textarea 
                        className="w-full text-sm p-3 border rounded-md bg-white min-h-[100px]"
                        defaultValue={review.aiReply}
                      />
                      <button className="w-full bg-black text-white text-sm py-2 rounded hover:bg-gray-800 transition-colors">
                        Publiceer Reactie (Simulatie)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Genereer AI Reactie
                      </label>
                      <input 
                        type="text" 
                        placeholder="Extra instructies? (Optioneel)" 
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                        className="w-full text-sm border rounded p-2"
                      />
                      <button 
                        onClick={() => handleGenerateReply(review.id)}
                        disabled={aiLoading === review.id}
                        className="w-full bg-blue-100 text-blue-700 text-sm font-medium py-2 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
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
