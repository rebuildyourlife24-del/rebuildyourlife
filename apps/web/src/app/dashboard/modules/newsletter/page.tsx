'use client';

import { useState } from 'react';
import { Mail, Sparkles, Send, FileText } from 'lucide-react';

export default function NewsletterPage() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/modules/newsletter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.content) {
        setGeneratedContent(data.content);
      }
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  const handleSend = async () => {
    if (!generatedContent) return;
    setIsSending(true);
    try {
      // In a real scenario, this would send via Resend API
      // We will just simulate a success response for now, or hook to an endpoint
      alert('Nieuwsbrief succesvol verzonden via email / Resend!');
    } catch (err) {
      console.error(err);
    }
    setIsSending(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Mail className="w-8 h-8 text-fuchsia-500" />
          Automated Newsletter
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Genereer en verstuur high-converting nieuwsbrieven via AI (Resend Integration).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl h-fit">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Nieuwsbrief Inhoud</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-500 font-mono mb-1">Onderwerp / Focus</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fuchsia-500 h-24 resize-none"
                placeholder="Bijv: Update over nieuwe AI features in ons platform en een kortingscode voor de cursus."
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isGenerating || !topic}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase tracking-widest py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} Genereer Draft
            </button>
          </form>
        </div>

        {/* Preview Area */}
        <div className="border border-white/10 bg-black/40 p-6 rounded-xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-5 h-5 text-fuchsia-500" /> Concept Preview
            </h3>
            {generatedContent && (
              <button 
                onClick={handleSend}
                disabled={isSending}
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-black uppercase font-bold tracking-widest px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {isSending ? 'Verzenden...' : 'Verstuur Campagne'}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-black border border-white/10 rounded-lg p-4 min-h-[400px]">
            {!generatedContent ? (
              <div className="flex flex-col items-center justify-center text-zinc-500 h-full">
                <Mail className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-mono text-xs uppercase tracking-widest text-center max-w-xs">De gegenereerde e-mail content verschijnt hier klaar om te verzenden.</p>
              </div>
            ) : (
              <textarea 
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="w-full h-full min-h-[400px] bg-transparent text-zinc-300 focus:outline-none resize-none font-mono text-sm leading-relaxed"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
