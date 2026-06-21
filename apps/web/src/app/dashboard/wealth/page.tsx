'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Layers, Zap, FolderSync, TrendingUp, PlaySquare, Settings2, Globe } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function OmegaBuilderDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f2937] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Omega <span className="text-gold">Web Builder</span></h1>
            <Badge variant="warning" className="animate-pulse tracking-widest text-[10px]">ALL-IN-ONE ENGINE</Badge>
          </div>
          <p className="text-textSecondary uppercase tracking-widest text-sm font-mono">
            AI-Gestuurde E-Commerce Generatie // 100% Gecentraliseerde Materialen
          </p>
        </div>
      </motion.div>

      {/* Main Builder Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Generator & PR Machine */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Omega Generator Panel */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 bg-[#0a0e1a] border border-gold/30 shadow-[0_0_50px_rgba(212,168,83,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe className="w-48 h-48 text-gold" />
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-gold/10 rounded-xl border border-gold/20">
                  <Zap className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">Franchise Koppelen (Multi-Tenant)</h2>
                  <p className="text-xs text-textSecondary">Koppel je 8 subdomeinen op ai-henksemler.nl direct aan de Godbrain.</p>
                </div>
              </div>

              <form action={async (formData) => {
                setIsGenerating(true);
                try {
                  const { createFranchise } = await import('@/actions/franchise');
                  await createFranchise(formData.get('domain') as string || '');
                  alert('Domein succesvol gekoppeld! De Omega Storefront is nu live.');
                } catch (e: any) {
                  alert(e.message);
                } finally {
                  setIsGenerating(false);
                }
              }} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#111827] p-4 rounded-xl border border-[#1f2937]">
                    <label className="text-xs text-textSecondary uppercase font-bold mb-2 block">Subdomein (bijv. shop1.ai-henksemler.nl)</label>
                    <input type="text" name="domain" placeholder="shop1.ai-henksemler.nl" className="w-full bg-black text-white font-mono p-2 rounded border border-zinc-800 focus:border-gold outline-none" required />
                  </div>
                  <div className="bg-[#111827] p-4 rounded-xl border border-[#1f2937]">
                    <label className="text-xs text-textSecondary uppercase font-bold mb-2 block">Franchise Naam</label>
                    <input type="text" name="name" placeholder="E-Commerce Niche A" className="w-full bg-black text-white font-mono p-2 rounded border border-zinc-800 focus:border-gold outline-none" required />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-gold hover:bg-[#b0893a] text-black font-black uppercase tracking-[0.2em] py-6 text-lg shadow-[0_0_20px_rgba(212,168,83,0.4)] transition-all"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-5 h-5"></span>
                      Domein Koppelen...
                    </span>
                  ) : (
                    "LANCEREN & KOPPELEN"
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Shopify API Assimilation Panel */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 bg-black border-2 border-red-900 shadow-[inset_0_0_30px_rgba(153,27,27,0.2)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-red-950/50 rounded-none border border-red-900">
                  <Globe className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                    Shopify API Assimilatie <Badge variant="destructive" className="bg-red-600 text-[10px] animate-pulse">FASE 1.5</Badge>
                  </h2>
                  <p className="text-xs text-red-500/80 font-mono">Verbind de kassa en kanalen van externe Shopify winkels aan de War Room.</p>
                </div>
              </div>

              <form action={async (formData) => {
                setIsGenerating(true);
                try {
                  const { registerShopifyApi } = await import('@/app/actions/shopify');
                  await registerShopifyApi(formData);
                  alert('Shopify API Succesvol Geassimileerd! Data stroomt nu de War Room in.');
                } catch (e: any) {
                  alert(e.message);
                } finally {
                  setIsGenerating(false);
                }
              }} className="space-y-4 relative z-10">
                <div className="bg-[#050505] p-4 border border-red-900/50 mb-4 font-mono text-xs text-zinc-400">
                  <span className="text-red-500 font-bold">&gt; INSTRUCTIE:</span> Ga naar Shopify Dashboard &gt; Settings &gt; Apps &gt; Develop Apps. Maak een app genaamd "Orion Godbrain", geef Read/Write access op Orders en Products. Kopieer de "Admin API access token". (begint met <span className="text-white">shpat_</span>).
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-black p-4 border-b-2 border-red-900">
                    <label className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2 block">Shopify URL (bijv. shop.myshopify.com)</label>
                    <input type="text" name="shopUrl" placeholder="jouw-winkel.myshopify.com" className="w-full bg-transparent text-white font-mono p-2 border border-zinc-800 focus:border-red-500 outline-none" required />
                  </div>
                  <div className="bg-black p-4 border-b-2 border-red-900">
                    <label className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2 block">Admin API Toegangstoken (shpat_...)</label>
                    <input type="password" name="accessToken" placeholder="shpat_xxxxxxxxxxxxxxxxxxxx" className="w-full bg-transparent text-red-400 font-mono p-2 border border-zinc-800 focus:border-red-500 outline-none" required />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-red-950 hover:bg-red-900 text-red-500 border border-red-900 font-black uppercase tracking-[0.3em] py-6 text-lg transition-all"
                >
                  {isGenerating ? (
                    "ASSIMILATIE BEZIG..."
                  ) : (
                    "INITEER API ASSIMILATIE"
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* PR Sector (Content Forge Integration) */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-[#050505] border border-[#ef4444]/30 relative overflow-hidden">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <PlaySquare className="w-6 h-6 text-[#ef4444]" />
                   <h3 className="text-lg font-bold text-white uppercase tracking-widest">PR Sector (Content Forge)</h3>
                 </div>
                 <Badge variant="danger" className="bg-[#ef4444]/10 border-[#ef4444]/30">LIVE TRAFFIC ENGINE</Badge>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                    <div>
                      <p className="text-white font-bold text-sm">Campagne: "Dubai Lifestyle Hooks"</p>
                      <p className="text-xs text-textSecondary">Gekoppeld aan: shop1.ai-henksemler.nl</p>
                    </div>
                    <div className="text-right">
                      <p className="text-success font-mono font-bold">14.2k Views</p>
                      <p className="text-[10px] text-textSecondary uppercase">Laatste Uur</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                    <div>
                      <p className="text-white font-bold text-sm">Campagne: "Trading Setup 4K"</p>
                      <p className="text-xs text-textSecondary">Gekoppeld aan: shop3.ai-henksemler.nl</p>
                    </div>
                    <div className="text-right">
                      <p className="text-success font-mono font-bold">8.4k Views</p>
                      <p className="text-[10px] text-textSecondary uppercase">Laatste Uur</p>
                    </div>
                 </div>
               </div>
            </Card>
          </motion.div>

        </div>

        {/* Right Col: Centrale Materialen */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="p-6 bg-[#0a0a0a] border border-[#1f2937] h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <FolderSync className="w-6 h-6 text-[#3b82f6]" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Centrale Materialen</h3>
            </div>
            <p className="text-sm text-textSecondary mb-6">
              Alle AI-gegenereerde scripts, TikTok-renders, productfoto's en data staan hier gekoppeld. Geen externe mappen nodig.
            </p>

            <div className="space-y-3 flex-1">
              <div className="p-3 bg-[#111827] border border-[#1f2937] rounded flex items-center justify-between cursor-pointer hover:border-[#3b82f6]/50 transition-colors">
                <div className="flex items-center gap-2">
                  <PlaySquare className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-sm text-white font-mono">Render_Dubai_001.mp4</span>
                </div>
                <span className="text-xs text-success">Gekoppeld</span>
              </div>
              <div className="p-3 bg-[#111827] border border-[#1f2937] rounded flex items-center justify-between cursor-pointer hover:border-[#3b82f6]/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gold" />
                  <span className="text-sm text-white font-mono">Product_Catalog_Luxury.csv</span>
                </div>
                <span className="text-xs text-success">Gekoppeld</span>
              </div>
              <div className="p-3 bg-[#111827] border border-[#1f2937] rounded flex items-center justify-between cursor-pointer hover:border-[#3b82f6]/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-white font-mono">Sales_Copy_Variant_A.txt</span>
                </div>
                <span className="text-xs text-success">Gekoppeld</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6 border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/10">
              Open Bibliotheek
            </Button>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
