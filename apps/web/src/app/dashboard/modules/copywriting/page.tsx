"use client";

import { useState, useEffect } from "react";
import { generateCopy, getGeneratedCopyHistory } from "@/app/actions/copywriting";
import { PenTool, Loader2, Copy, CheckCircle, FileText } from "lucide-react";

export default function CopywritingPage() {
  const [projectType, setProjectType] = useState("AD");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professioneel");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [history, setHistory] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const res = await getGeneratedCopyHistory();
    if (res.success && res.history) {
      setHistory(res.history);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    setError("");

    const res = await generateCopy(projectType, topic, tone);
    if (res.success) {
      setTopic("");
      await loadHistory();
    } else {
      setError(res.error || "Er is iets misgegaan");
    }
    setLoading(false);
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">AI Copywriting Tool</h1>
        <p className="text-zinc-400 mt-2 text-lg font-light">
          Genereer hoog-converterende advertenties, e-mails en landingspagina's in seconden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form */}
        <div className="lg:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700"></div>

          <form onSubmit={handleGenerate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Type Content</label>
              <select 
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none appearance-none"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="AD">Facebook / Instagram Ad</option>
                <option value="EMAIL">E-mail / Nieuwsbrief</option>
                <option value="LANDING_PAGE">Landingspagina</option>
                <option value="SOCIAL_POST">Social Media Post</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Onderwerp / Product</label>
              <textarea 
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none resize-none custom-scrollbar min-h-[120px]"
                placeholder="Bijv. Een nieuwe cursus over time management voor drukke moeders..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Tone of Voice</label>
              <select 
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all outline-none appearance-none"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professioneel en zakelijk">Professioneel en zakelijk</option>
                <option value="Direct en overtuigend (Direct Response)">Direct en overtuigend (Direct Response)</option>
                <option value="Informeel en vrolijk">Informeel en vrolijk</option>
                <option value="Emotioneel en verhalend">Emotioneel en verhalend</option>
                <option value="Urgent (FOMO)">Urgent (FOMO)</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-xs font-mono border border-red-500/30 bg-red-500/10 p-2 rounded">{error}</p>}

            <button 
              type="submit" 
              disabled={loading || !topic}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-black uppercase tracking-widest py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <PenTool className="h-5 w-5" />}
              {loading ? "Bezig..." : "Genereer Tekst"}
            </button>
          </form>
        </div>

        {/* History / Results view */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-2 text-white">
            <FileText className="h-6 w-6 text-purple-500" /> Jouw Teksten
          </h2>
          
          {history.length === 0 ? (
            <div className="border border-dashed border-white/20 rounded-2xl p-12 text-center bg-transparent">
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-wider">Nog geen teksten gegenereerd. Vul het formulier in om te starten.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item) => (
                <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                  <div className="relative z-10 flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-mono tracking-widest font-bold px-2 py-1 rounded">
                        {item.projectType}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCopy(item.id, item.content)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 text-xs uppercase tracking-widest font-bold bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-xl transition-colors hover:border-cyan-500/30"
                    >
                      {copiedId === item.id ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-cyan-400" />}
                      {copiedId === item.id ? "Gekopieerd!" : "Kopieer"}
                    </button>
                  </div>
                  
                  <div className="mb-4 relative z-10">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Onderwerp:</h4>
                    <p className="text-sm text-zinc-300 line-clamp-1">{item.topic}</p>
                  </div>

                  <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed relative z-10 custom-scrollbar max-h-96 overflow-y-auto">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
