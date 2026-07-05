'use client';

import { useState } from 'react';
import { generateWebsiteAction } from '@/app/actions/modules';
import { Loader2, Code, Eye, Globe, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WebsiteBuilderPage() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic || !audience) return;
    
    setLoading(true);
    setError(null);
    setHtmlCode(null);
    
    try {
      const result = await generateWebsiteAction(topic, audience);
      if (result.success && result.html) {
        setHtmlCode(result.html);
      } else {
        setError(result.error || 'Er is een fout opgetreden.');
      }
    } catch (err: any) {
      setError(err.message || 'Kon server niet bereiken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="p-3 bg-neonCyan/10 rounded-xl border border-neonCyan/30">
            <Globe className="w-6 h-6 text-neonCyan" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-white">Sovereign Website Builder</h1>
            <p className="text-sm font-mono text-zinc-500 mt-1">Genereer onmiddellijk hoog-converterende HTML landingspagina's</p>
          </div>
        </div>

        {/* Builder Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-neonCyan" /> Input Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase">Product / Dienst</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="bijv. AI Automatisering Software"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm focus:border-neonCyan focus:ring-1 focus:ring-neonCyan outline-none transition-all text-white placeholder-zinc-700"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase">Doelgroep</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="bijv. MKB Bedrijven met €1M+ omzet"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm focus:border-neonCyan focus:ring-1 focus:ring-neonCyan outline-none transition-all text-white placeholder-zinc-700"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic || !audience}
                  className="w-full mt-6 bg-neonCyan hover:bg-neonCyanLight text-black font-black uppercase tracking-widest text-sm p-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bezig met genereren...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Genereer HTML
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Result Output */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 border border-white/10 rounded-2xl h-full min-h-[600px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Output Renderer</h3>
                {htmlCode && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-black border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('preview')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${viewMode === 'preview' ? 'bg-neonCyan text-black' : 'text-zinc-500 hover:text-white'}`}
                      >
                        <Eye className="w-4 h-4" /> Preview
                      </button>
                      <button
                        onClick={() => setViewMode('code')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${viewMode === 'code' ? 'bg-neonCyan text-black' : 'text-zinc-500 hover:text-white'}`}
                      >
                        <Code className="w-4 h-4" /> Code
                      </button>
                    </div>
                    <button
                      onClick={async () => {
                        const { saveWebsiteToDatabaseAction } = await import('@/app/actions/modules');
                        const res = await saveWebsiteToDatabaseAction(topic, htmlCode);
                        if (res.success) {
                           alert('Website is succesvol opgeslagen in je Database (Funnels)!');
                        } else {
                           alert('Fout bij opslaan: ' + res.error);
                        }
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Opslaan in Database
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 relative bg-white">
                {!htmlCode && !loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-[#020202]">
                    <Globe className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-mono text-sm">Wachtend op input...</p>
                  </div>
                )}
                
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neonCyan bg-[#020202]">
                    <Loader2 className="w-16 h-16 animate-spin mb-4" />
                    <p className="font-mono text-sm animate-pulse">Sovereign Grid is code aan het schrijven...</p>
                  </div>
                )}

                {htmlCode && !loading && viewMode === 'preview' && (
                  <iframe 
                    srcDoc={htmlCode} 
                    className="w-full h-full border-none"
                    title="Website Preview"
                    sandbox="allow-scripts"
                  />
                )}

                {htmlCode && !loading && viewMode === 'code' && (
                  <pre className="p-6 bg-[#020202] text-zinc-300 w-full h-full overflow-auto text-xs font-mono">
                    <code>{htmlCode}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
