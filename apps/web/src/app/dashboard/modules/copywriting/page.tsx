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

  const userId = "temp-user-id"; // TODO: Replace with real auth

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const res = await getGeneratedCopyHistory(userId);
    if (res.success && res.history) {
      setHistory(res.history);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    setError("");

    const res = await generateCopy(userId, projectType, topic, tone);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Copywriting Tool</h1>
        <p className="text-muted-foreground">
          Genereer hoog-converterende advertenties, e-mails en landingspagina's in seconden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form */}
        <div className="lg:col-span-1 border rounded-xl p-6 bg-white shadow-sm space-y-6 h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type Content</label>
              <select 
                className="w-full border rounded-md p-2 bg-gray-50"
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
              <label className="block text-sm font-medium mb-1">Onderwerp / Product</label>
              <textarea 
                className="w-full border rounded-md p-2 min-h-[120px]"
                placeholder="Bijv. Een nieuwe cursus over time management voor drukke moeders..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tone of Voice</label>
              <select 
                className="w-full border rounded-md p-2 bg-gray-50"
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit" 
              disabled={loading || !topic}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <PenTool className="h-5 w-5" />}
              {loading ? "Bezig met schrijven..." : "Genereer Tekst"}
            </button>
          </form>
        </div>

        {/* History / Results view */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" /> Jouw Teksten
          </h2>
          
          {history.length === 0 ? (
            <div className="border rounded-xl p-12 text-center bg-gray-50 border-dashed">
              <p className="text-gray-500">Nog geen teksten gegenereerd. Vul het formulier in om te starten.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item) => (
                <div key={item.id} className="border rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                        {item.projectType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCopy(item.id, item.content)}
                      className="text-gray-500 hover:text-black flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      {copiedId === item.id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copiedId === item.id ? "Gekopieerd!" : "Kopieer"}
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Onderwerp:</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.topic}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
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
