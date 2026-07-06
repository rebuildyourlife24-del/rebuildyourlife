"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { runSemanticETLAction } from '@/app/actions/semantic-etl';
import { UISpec } from '@/lib/semantic-etl/schemas';

export function SciFiQnA({ onSpecGenerated }: { onSpecGenerated: (spec: UISpec) => void }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await runSemanticETLAction({
        datasetName: "User Query",
        datasetDescription: "Live on the fly requested data analysis.",
        taskGoal: query,
        userRoles: ["Operator"],
        branding: {
          companyName: "Rebuild Your Life",
          primaryColor: "#00ffea",
          accentColor: "#ff00aa"
        }
      });
      
      if (result.success && result.spec) {
        onSpecGenerated(result.spec);
        setQuery('');
      } else {
        setError(result.error || 'Kon geen data genereren. Probeer een specifiekere vraag.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Er is een fout opgetreden bij het bevragen van de AI Engine.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2 shadow-2xl"
      >
        <Sparkles className="w-5 h-5 text-cyan-400 ml-3 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stel een vraag over je data (bijv. 'Toon omzet per productcategorie')..."
          className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-zinc-500 text-sm md:text-base font-mono tracking-wide"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={isLoading || !query.trim()}
          className="ml-2 bg-white/5 hover:bg-white/10 text-zinc-300 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : <Search className="w-5 h-5" />}
        </button>
      </form>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-0 text-red-400 text-xs font-mono"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
