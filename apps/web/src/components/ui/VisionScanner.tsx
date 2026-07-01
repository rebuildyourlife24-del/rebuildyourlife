"use client";

import { useState } from "react";
import { Camera, Upload, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { analyzeStoreScreenshot } from "@/actions/cro-vision";
import { motion } from "framer-motion";

export function VisionScanner({ userId }: { userId: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setResult(null);
    
    // In a real scenario, this would convert a file input to base64.
    // For this PoC, we pass dummy data.
    const mockImageBase64 = "data:image/png;base64,..."; 
    
    const response = await analyzeStoreScreenshot(mockImageBase64, userId, "https://rebuildyourlife.eu/product/1");
    
    if (response.success) {
      setResult(response.data);
    }
    
    setIsScanning(false);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-fuchsia-600/20 blur-3xl rounded-full pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Camera className="text-fuchsia-400" /> CRO Vision API (GPT-4o)
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Upload een screenshot van je productpagina. De Vision Agent zoekt visueel naar knelpunten in je conversie.
      </p>

      {!isScanning && !result && (
        <div 
          onClick={handleScan}
          className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 transition-all group"
        >
          <div className="bg-white/5 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Upload className="text-slate-300 group-hover:text-fuchsia-400" />
          </div>
          <span className="text-slate-300 font-medium">Klik om een screenshot te scannen (PoC Simulatord)</span>
        </div>
      )}

      {isScanning && (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="relative flex h-12 w-12">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-12 w-12 bg-fuchsia-500"></span>
          </div>
          <p className="text-fuchsia-400 font-mono text-sm animate-pulse">Running Neural Vision Analysis...</p>
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="text-4xl font-black text-fuchsia-400">{result.score}</div>
            <div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Conversie Score</div>
              <div className="text-white font-medium">Ruimte voor verbetering gevonden.</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mt-4">AI Inzichten</h4>
            {result.suggestions.map((suggestion: string, idx: number) => (
              <div key={idx} className="flex gap-3 bg-white/5 p-3 rounded-lg text-sm text-slate-200">
                <AlertTriangle className="text-amber-400 shrink-0" size={18} />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mt-4 flex gap-3">
             <Zap className="text-emerald-400 shrink-0 mt-1" size={18} />
             <div>
               <h4 className="text-emerald-400 font-bold mb-1">A/B Test Voorgesteld</h4>
               <p className="text-sm text-emerald-100/70 mb-3">Ik heb zojuist een voorstel voor een A/B test (Knopkleur wijzigen) naar je Action Center gestuurd.</p>
               <a href="/klanten/kalender" className="text-xs bg-emerald-500 text-slate-900 px-3 py-1.5 rounded-md font-bold hover:bg-emerald-400 transition-colors inline-block">
                 Bekijk in Kalender
               </a>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
