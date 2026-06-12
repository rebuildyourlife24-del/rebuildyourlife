"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { Shield, Fingerprint, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Accepteer zowel "hendriksemler" als "hendriksemler@rebuildyourlife.eu" als "admin@rebuildyourlife.eu"
  const resolveEmail = (input: string): string => {
    if (input.includes('@')) return input;
    // Simpele gebruikersnaam → email mapping
    const mapping: Record<string, string> = {
      'hendriksemler': 'hendriksemler@rebuildyourlife.eu',
      'admin': 'admin@rebuildyourlife.eu',
      'henk': 'hendriksemler@rebuildyourlife.eu',
      'henksemler': 'hendriksemler@rebuildyourlife.eu',
    };
    return mapping[input.toLowerCase()] || `${input}@rebuildyourlife.eu`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const email = resolveEmail(identifier);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/hq");
    }
  };

  return (
    <div className="h-screen w-full bg-[#030609] flex flex-col items-center justify-center relative overflow-hidden font-sans text-slate-200 select-none">

      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(6,182,212,0.04)_0%,transparent_100%)]" />
      </div>

      {/* Ambient glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(6,182,212,0.5) 2px,rgba(6,182,212,0.5) 4px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(6,182,212,0.2)', '0 0 40px rgba(6,182,212,0.4)', '0 0 20px rgba(6,182,212,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 bg-black border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-5 relative"
          >
            <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl" />
            <Shield className="w-10 h-10 text-cyan-400" />
          </motion.div>

          <h1 className="text-3xl font-bold tracking-[0.15em] text-white text-center">
            ORION
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <p className="text-[11px] font-mono text-cyan-500/60 tracking-[0.3em]">SUPREME ACCESS</p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl">

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl overflow-hidden"
              >
                <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300 font-mono">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-2 uppercase tracking-widest">
                Gebruikersnaam / Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="hendriksemler"
                autoComplete="username"
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.05] transition-all font-mono text-sm placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-2 uppercase tracking-widest">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-3.5 pr-12 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.05] transition-all font-mono text-sm placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full relative group overflow-hidden rounded-xl bg-cyan-600 text-white font-bold tracking-wider py-4 flex items-center justify-center gap-3 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  ACTIVEER GOD-MODE
                </>
              )}
            </motion.button>
          </form>

          {/* Hint */}
          <div className="mt-6 text-center">
            <p className="text-[10px] font-mono text-white/20">
              LOGIN: hendriksemler • WACHTWOORD: imperialdreams2055
            </p>
          </div>
        </div>

        {/* Security footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-mono text-white/20">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            256-BIT ENCRYPTED
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            HTTP-ONLY COOKIES
          </div>
        </div>
      </motion.div>
    </div>
  );
}
