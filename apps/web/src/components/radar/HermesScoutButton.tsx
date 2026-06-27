"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function HermesScoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleScan = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/radar/scan", {
        method: "POST"
      });
      
      if (!res.ok) {
        throw new Error("Failed to run scan");
      }

      // Refresh data
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Er ging iets mis bij de Hermes Scout scan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleScan}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-400 rounded-lg text-cyan-400 font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
      )}
      {isLoading ? 'Hermes is scanning...' : 'Hermes Scout Inzetten'}
    </button>
  );
}
