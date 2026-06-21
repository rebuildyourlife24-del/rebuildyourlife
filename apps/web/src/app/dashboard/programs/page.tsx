"use client";

import { useState } from "react";
import { Play, Info, X, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data voor de video's gebaseerd op de sectoren
const featuredVideo = {
  id: "feat-1",
  title: "De Omslag: Van Schade Naar Macht",
  description: "Een exclusieve Godbrain Masterclass. Hoe je een verlies omzet in een strategische overwinning, onafhankelijk van je sector.",
  thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&h=600&fit=crop",
  category: "MINDSET"
};

const categories = [
  {
    title: "Actuele Kansen & Tutorials (HOW-TO)",
    videos: [
      { id: "tut-1", title: "Aandelen Drop: Koop Signaal", thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop", duration: "4:20" },
      { id: "tut-2", title: "Incassobureau Vernietigen (Stap 1)", thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=225&fit=crop", duration: "7:15" },
      { id: "tut-3", title: "Nieuwe Shopify Niche Gevonden", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop", duration: "12:05" },
      { id: "tut-4", title: "Belasting Truc 2026", thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=225&fit=crop", duration: "5:30" },
    ]
  },
  {
    title: "Gezondheid & Sport",
    videos: [
      { id: "sp-1", title: "Ochtend Routine (High Performer)", thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop", duration: "15:00" },
      { id: "sp-2", title: "Testosteron Optimalisatie", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop", duration: "22:10" },
      { id: "sp-3", title: "Vechtsport: De Mentale Switch", thumbnail: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=225&fit=crop", duration: "8:45" },
      { id: "sp-4", title: "Dieet Systeem Voor C-Levels", thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop", duration: "11:20" },
    ]
  },
  {
    title: "Privé & Lifestyle",
    videos: [
      { id: "pr-1", title: "Digitale Detox Systeem", thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=225&fit=crop", duration: "9:15" },
      { id: "pr-2", title: "Netwerken op Topniveau", thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=225&fit=crop", duration: "18:30" },
      { id: "pr-3", title: "Veiligheid & Anonimiteit", thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop", duration: "14:00" },
      { id: "pr-4", title: "Relaties Binnen Het Imperium", thumbnail: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=225&fit=crop", duration: "25:40" },
    ]
  },
  {
    title: "Passie & Hobby's",
    videos: [
      { id: "hb-1", title: "Auto's: Investering of Liability?", thumbnail: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=225&fit=crop", duration: "10:05" },
      { id: "hb-2", title: "Horloges Als Valuta", thumbnail: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=225&fit=crop", duration: "13:20" },
      { id: "hb-3", title: "Wapen Training & Focus", thumbnail: "https://images.unsplash.com/photo-1595590424283-b8f1784cb2c8?w=400&h=225&fit=crop", duration: "6:45" },
      { id: "hb-4", title: "Boeken Die Je Moet Lezen", thumbnail: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=225&fit=crop", duration: "32:10" },
    ]
  }
];

export default function NetflixAcademyPage() {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  // Zorg ervoor dat body scroll blokkeert als modal open is
  const isModalOpen = selectedVideo !== null;

  return (
    <div className="bg-[#050505] min-h-screen text-white pb-20 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] lg:h-[70vh] bg-black group overflow-hidden">
        {/* Placeholder Image as background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${featuredVideo.thumbnail})` }}
        />
        {/* Gradient Overlay for seamless blend to black */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-4xl z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-600 font-black tracking-[0.3em] text-sm uppercase">
              {featuredVideo.category}
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

      {/* Video Sliders */}
      <div className="relative z-20 -mt-10 space-y-12 pb-12">
        {categories.map((category, idx) => (
          <div key={idx} className="pl-4 md:pl-16">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer group">
              {category.title}
              <ChevronRight className="w-5 h-5 text-white/0 group-hover:text-white/100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 pr-16 hide-scrollbar snap-x">
              {category.videos.map((video) => (
                <div 
                  key={video.id} 
                  onClick={() => setSelectedVideo(video)}
                  className="min-w-[280px] md:min-w-[320px] aspect-video relative rounded-md overflow-hidden cursor-pointer group snap-start transition-transform duration-300 hover:z-30 hover:scale-105 hover:ring-2 hover:ring-white"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 p-4 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-bold text-sm mb-2">{video.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span className="flex items-center gap-1"><Play className="w-3 h-3 fill-white" /> {video.duration}</span>
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
        {isModalOpen && (
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

              {/* Fake Video Player area */}
              <div 
                className="w-full h-full bg-cover bg-center relative group"
                style={{ backgroundImage: `url(${selectedVideo.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer">
                  <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 fill-white ml-2" />
                  </div>
                </div>

                {/* Player Controls (Fake) */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-1 bg-white/20 rounded cursor-pointer mb-4">
                    <div className="w-1/3 h-full bg-red-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center gap-4">
                      <Play className="w-6 h-6 fill-white cursor-pointer hover:text-red-500" />
                      <span>{selectedVideo.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>00:00 / {selectedVideo.duration || "10:00"}</span>
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
