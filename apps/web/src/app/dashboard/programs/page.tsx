"use client";

import { useState, useEffect } from "react";
import { Play, Info, X, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NetflixAcademyPage() {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/academy/progress')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          // If the real API returns empty array, we provide a structured empty state
          // to prevent UI breaking, but NO MOCK DATA.
          if (res.data.length === 0) {
             setCategories([]);
             setFeaturedVideo(null);
          } else {
             // For this example, assuming API returns a structured object or array
             // Mapping it to the required UI structure (this logic might need adjusting based on real API shape)
             // We fallback to empty structures if API doesn't match perfectly yet
             setCategories(res.data.categories || []);
             setFeaturedVideo(res.data.featuredVideo || null);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isModalOpen = selectedVideo !== null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white pb-20 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      
      {/* Hero Banner */}
      {featuredVideo ? (
        <div className="relative w-full h-[60vh] lg:h-[70vh] bg-black group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50 transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${featuredVideo.thumbnail || ''})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-4xl z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-400 font-black tracking-[0.3em] text-sm uppercase">
                {featuredVideo.category || "ACADEMY"}
              </span>
              <span className="text-white/50 text-xs tracking-widest px-2 border border-white/20">
                NIEUW
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter drop-shadow-xl text-white">
              {featuredVideo.title}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
              {featuredVideo.description}
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedVideo(featuredVideo)}
                className="bg-white hover:bg-white/90 text-black px-8 py-3 rounded flex items-center gap-2 font-bold transition-all"
              >
                <Play className="w-6 h-6 fill-black" />
                Afspelen
              </button>
              <button 
                onClick={() => setSelectedVideo(featuredVideo)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded flex items-center gap-2 font-bold transition-all border border-white/10"
              >
                <Info className="w-6 h-6" />
                Meer Informatie
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-black border-b border-white/10">
           <p className="text-zinc-500 font-bold tracking-widest uppercase">Geen live content gevonden via de API</p>
        </div>
      )}

      {/* Video Sliders */}
      <div className="relative z-20 -mt-10 space-y-12 pb-12">
        {categories.map((category, idx) => (
          <div key={idx} className="pl-4 md:pl-16">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer group">
              {category.title}
              <ChevronRight className="w-5 h-5 text-white/0 group-hover:text-white/100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 pr-16 hide-scrollbar snap-x">
              {category.videos?.map((video: any) => (
                <div 
                  key={video.id} 
                  onClick={() => setSelectedVideo(video)}
                  className="min-w-[280px] md:min-w-[320px] aspect-video relative rounded-md overflow-hidden cursor-pointer group snap-start transition-transform duration-300 hover:z-30 hover:scale-105 hover:ring-2 hover:ring-white"
                >
                  <img 
                    src={video.thumbnail || ''} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 p-4 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-bold text-sm mb-2">{video.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span className="flex items-center gap-1"><Play className="w-3 h-3 fill-white" /> {video.duration || "0:00"}</span>
                      <span className="border border-white/30 px-1 rounded">HD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-white text-white hover:text-black rounded-full p-2 backdrop-blur-md transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Real Video Player should go here */}
              <div 
                className="w-full h-full bg-cover bg-center relative group"
                style={{ backgroundImage: `url(${selectedVideo.thumbnail || ''})` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer">
                  <div className="w-20 h-20 bg-emerald-500/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 fill-white ml-2" />
                  </div>
                </div>

                {/* Player Controls (Fake UI for the real player component to replace) */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-1 bg-white/20 rounded cursor-pointer mb-4">
                    <div className="w-1/3 h-full bg-emerald-500 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center gap-4">
                      <Play className="w-6 h-6 fill-white cursor-pointer hover:text-emerald-400" />
                      <span>{selectedVideo.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>00:00 / {selectedVideo.duration || "0:00"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
