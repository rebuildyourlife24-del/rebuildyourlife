'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  PenTool, 
  ShoppingCart, 
  Briefcase, 
  Smartphone, 
  Banknote,
  Bot,
  Image as ImageIcon,
  MessageSquare,
  BarChart,
  Mic,
  Cpu
} from 'lucide-react';

const tools = [
  // E-Commerce
  { id: 'video-forge', name: 'Video Forge', desc: 'Genereer dropship ads & VSLs.', icon: Video, category: 'E-Commerce', route: '/video-forge' },
  { id: 'tiktok-ai', name: 'TikTok AI', desc: 'Virale TikTok ad scripts.', icon: Smartphone, category: 'E-Commerce', api: '/api/tiktok-ai/generate' },
  { id: 'autods', name: 'AutoDS Sync', desc: 'Product sourcing & push.', icon: ShoppingCart, category: 'E-Commerce', api: '/api/autods' },
  
  // Agency
  { id: 'content-forge', name: 'Content Forge', desc: 'SEO Blogs & Copywriting.', icon: PenTool, category: 'Agency & B2B', route: '/admin/content-forge' },
  { id: 'b2b-ebook', name: 'B2B E-Book Maker', desc: 'Lead magnet generator.', icon: Briefcase, category: 'Agency & B2B', api: '/api/b2b-ebook/generate' },
  { id: 'seo-audit', name: 'SEO Audit Agent', desc: 'Volledige site analyses.', icon: BarChart, category: 'Agency & B2B', api: '/api/seo-audit' },
  
  // Creator
  { id: 'avatar-studio', name: 'Avatar Studio', desc: 'AI model & influencer gen.', icon: ImageIcon, category: 'Creator', api: '/api/avatar-studio/generate' },
  { id: 'onlyfans-ai', name: 'OnlyFans AI', desc: 'Chat & upsell automation.', icon: MessageSquare, category: 'Creator', api: '/api/onlyfans-ai/generate' },
  { id: 'tts', name: 'Voice Engine', desc: 'Text-to-Speech klonen.', icon: Mic, category: 'Creator', api: '/api/tts' },

  // Finance & Ops
  { id: 'trading', name: 'Crypto Trading', desc: 'Bybit algo integratie.', icon: Banknote, category: 'Finance', api: '/api/trading' },
  { id: 'godbrain', name: 'Godbrain Banking', desc: 'Treasury & tax routing.', icon: Cpu, category: 'Finance', route: '/dashboard/finance' },
  { id: 'hermes', name: 'Hermes Director', desc: 'Jouw AI CEO module.', icon: Bot, category: 'Finance', api: '/api/hermes' },
];

export default function UniversalForgeHub() {
  const router = useRouter();

  const handleLaunch = (tool: any) => {
    if (tool.route) {
      router.push(tool.route);
    } else {
      alert(`Handmatige controle geactiveerd voor ${tool.name}. (API: ${tool.api})`);
    }
  };

  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gray-800 pb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 mb-2">
                The Universal Forge
              </h1>
              <p className="text-gray-400">
                Manual Override. Start modules handmatig of laat de Swarm ze autonoom draaien.
              </p>
            </div>
            <div className="px-4 py-2 bg-indigo-900/50 border border-indigo-500/50 rounded-full text-indigo-300 text-sm flex items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2" />
              Autonomous Mode: Standby
            </div>
          </div>
        </header>

        <div className="space-y-16">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="text-2xl font-semibold mb-6 text-gray-200 border-l-4 border-cyan-500 pl-4">
                {cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter(t => t.category === cat).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div 
                      key={tool.id} 
                      className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-6 transition-all group relative overflow-hidden"
                    >
                      {/* Glow effect */}
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Icon className="w-24 h-24 text-cyan-500 -mt-8 -mr-8" />
                      </div>

                      <div className="relative z-10">
                        <div className="bg-cyan-950/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-cyan-800/50">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                        <p className="text-gray-400 text-sm mb-6 h-10">{tool.desc}</p>
                        
                        <button 
                          onClick={() => handleLaunch(tool)}
                          className="w-full py-2.5 bg-gray-800 hover:bg-cyan-900 text-white font-medium rounded-lg transition-colors border border-gray-700 hover:border-cyan-600 flex items-center justify-center"
                        >
                          Manual Launch
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
