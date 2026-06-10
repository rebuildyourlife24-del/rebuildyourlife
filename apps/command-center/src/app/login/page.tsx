"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { Shield, Fingerprint, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Success, redirect to HQ
      router.push("/hq");
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans text-slate-200">
      
      {/* Background Matrix/Cyber grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Glowing Orb */}
      <div className="absolute top-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 border border-slate-700 shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-white text-center">REBUILD YOUR LIFE</h1>
          <p className="text-sm font-mono text-cyan-500/70 tracking-[0.2em] mt-2">SUPREME OVERSEER ACCESS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200 font-mono">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Identificatie</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@rebuildyourlife.eu"
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Kluiscode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-lg bg-cyan-600 text-white font-bold tracking-wider py-3 px-4 flex items-center justify-center gap-2 hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Fingerprint className="w-5 h-5" />
                INITIATE GOD-MODE
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs font-mono text-slate-600">
          <Lock className="w-3 h-3" />
          256-BIT ENCRYPTED ORION CONNECTION
        </div>
      </div>
    </div>
  );
}
