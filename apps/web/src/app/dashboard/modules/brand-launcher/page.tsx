'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Search, Copy, CheckCircle2, Building, Zap, Share2, Loader2, Send } from 'lucide-react';
import { generateBrandKitAction } from '@/app/actions/brandLauncher';
import { publishSocialPost } from '@/actions/social-poster';

export default function BrandLauncherPage() {
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('Tech & E-commerce');
  const [loading, setLoading] = useState(false);
  const [publishingTo, setPublishingTo] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!domain) return;
    setLoading(true);
    setResult(null);

    const res = await generateBrandKitAction(domain, industry);
    if (res.success) {
      setResult(res.brandKit);
    } else {
      alert(res.error || 'Er is een fout opgetreden.');
    }
    
    setLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePublish = async (platform: string, content: string) => {
    setPublishingTo(platform);
    try {
      const res = await publishSocialPost(platform.toUpperCase(), content);
      if (res.success) {
        alert(`Succes! Webhook is afgevuurd naar Make.com voor ${platform}!`);
      } else {
        alert('Fout: ' + res.error);
      }
    } catch (err) {
      console.error(err);
    }
    setPublishingTo(null);
  };

  const renderPlatformCard = (title: string, data: any) => {
    if (!data) return null;
    return (
      <div className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-mono text-zinc-500 mb-1 block">Bio / Profieltekst</label>
            <div className="relative group">
              <textarea 
                readOnly 
                value={data.bio} 
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-sm text-zinc-300 h-24 custom-scrollbar focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={() => copyToClipboard(data.bio, `${title}-bio`)}
                className="absolute top-2 right-2 p-1.5 bg-black/80 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedField === `${title}-bio` ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-zinc-500 mb-1 block">Lancering Post (Post 1)</label>
            <div className="relative group">
              <textarea 
                readOnly 
                value={data.firstPost} 
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-sm text-zinc-300 h-32 custom-scrollbar focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={() => copyToClipboard(data.firstPost, `${title}-post`)}
                className="absolute top-2 right-2 p-1.5 bg-black/80 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedField === `${title}-post` ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>
          </div>
          
          {(data.coverPrompt || data.profilePrompt || data.lensPrompt) && (
            <div>
              <label className="text-[10px] uppercase font-mono text-zinc-500 mb-1 block">AI Image/Lens Prompt (Midjourney)</label>
              <div className="relative group">
                <textarea 
                  readOnly 
                  value={data.coverPrompt || data.profilePrompt || data.lensPrompt} 
                  className="w-full bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-400 font-mono h-20 custom-scrollbar focus:outline-none"
                />
                <button 
                  onClick={() => copyToClipboard(data.coverPrompt || data.profilePrompt || data.lensPrompt, `${title}-prompt`)}
                  className="absolute top-2 right-2 p-1.5 bg-black/80 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === `${title}-prompt` ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => handlePublish(title, data.firstPost)}
            disabled={publishingTo === title}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {publishingTo === title ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Auto-Publish
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-500" />
          Omnichannel Brand Launcher
        </h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm">
          Genereer met 1 druk op de knop een volledige Social Media kit (Bio's, Posts, AI Visuals) voor een nieuw project.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-10 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase font-bold text-zinc-300 mb-2 block flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-500" />
              Domeinnaam / Projectnaam
            </label>
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="bijv. Henk.nl"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-zinc-300 mb-2 block flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              Industrie / Niche
            </label>
            <input 
              type="text" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="bijv. E-commerce, SaaS, Coaching"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleGenerate}
            disabled={loading || !domain}
            className={\`
              flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all
              \${loading || !domain 
                ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5' 
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/50 hover:bg-blue-500/20 hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
              }
            \`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                Systeem analyseert...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Lanceer Brand Kit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Strategy */}
          <div className="bg-blue-900/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-widest">Brand Voice & Strategie</h3>
            <p className="text-white text-lg font-medium">{result.strategy}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPlatformCard('Instagram', result.instagram)}
            {renderPlatformCard('Facebook', result.facebook)}
            {renderPlatformCard('LinkedIn', result.linkedin)}
            {renderPlatformCard('X (Twitter)', result.x)}
            {renderPlatformCard('Snapchat', result.snapchat)}
          </div>
        </motion.div>
      )}
    </div>
  );
}
