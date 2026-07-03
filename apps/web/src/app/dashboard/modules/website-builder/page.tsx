'use client';

import { useState } from 'react';
import { LayoutPanelTop, Wand2, Monitor, Code } from 'lucide-react';

export default function WebsiteBuilderPage() {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/modules/website-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, targetAudience })
      });
      const data = await res.json();
      if (data.html) {
        setGeneratedHtml(data.html);
      }
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <LayoutPanelTop className="w-8 h-8 text-fuchsia-500" />
          AI Website Builder & CRO
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Genereer high-converting landingspagina's met the Syndicate AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Form */}
        <div className="lg:col-span-1 border border-white/10 bg-black/40 p-6 rounded-xl h-fit">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Campagne Details</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Product / Dienst</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="Bijv: AI Automatisering Agency"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Doelgroep</label>
              <input 
                type="text" 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fuchsia-500"
                placeholder="Bijv: MKB Bedrijven in Nederland"
              />
            </div>

            <button 
              type="submit" 
              disabled={isGenerating || !topic}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Wand2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />} Genereer Pagina
            </button>
          </form>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 border border-white/10 bg-black/40 p-6 rounded-xl flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Monitor className="w-5 h-5 text-fuchsia-500" /> Live Preview
            </h3>
            {generatedHtml && (
              <button className="text-xs uppercase font-bold tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                <Code className="w-4 h-4" /> Export HTML
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-white rounded-lg overflow-hidden min-h-[500px] border border-white/10 relative">
            {!generatedHtml ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-black">
                <LayoutPanelTop className="w-16 h-16 opacity-20 mb-4" />
                <p className="font-mono text-sm uppercase tracking-widest opacity-50">Vul de details in om een pagina te genereren</p>
              </div>
            ) : (
              <iframe 
                srcDoc={generatedHtml} 
                className="w-full h-full border-none"
                title="Generated Preview"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
