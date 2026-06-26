"use client";

import { useState } from "react";
import { Shield, Mail, Key, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function EmailVaultPage() {
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuleer een API call naar een veilige IMAP server integratie
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail("");
      setAppPassword("");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono">
      <div className="border-b-2 border-[#d4af37] pb-4 relative overflow-hidden">
        <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase flex items-center gap-3 relative z-10 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
          <Mail className="w-8 h-8 text-emerald-400" />
          E-MAIL VAULT
        </h1>
        <p className="text-emerald-400/80 mt-2 text-sm tracking-widest relative z-10">
          KOPPEL JOUW POSTVAK AAN DE GODBRAIN AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Info */}
        <div className="space-y-6">
          <div className="border border-navyLight bg-black p-6 shadow-[inset_0_0_30px_rgba(153,27,27,0.2)]">
            <h2 className="text-white text-lg font-bold mb-4 tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" /> AUTONOME SCANNER
            </h2>
            <p className="text-emerald-400/80 text-sm leading-relaxed mb-4">
              Zodra je jouw e-mail koppelt, krijgt de Godbrain Neural Network de opdracht om in de achtergrond facturen en incassobrieven op te sporen.
            </p>
            <ul className="text-sm text-white space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&gt;</span> Herkent PDF facturen en incassodreigementen.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&gt;</span> Berekent automatisch illegale extra kosten.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">&gt;</span> Stuurt deze naar het Debt Center ter goedkeuring.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Form */}
        <div className="border border-navyLight bg-black p-6 relative overflow-hidden shadow-[inset_0_0_30px_rgba(153,27,27,0.2)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a192f] to-transparent"></div>
          <h2 className="text-white text-lg font-bold mb-6 tracking-widest flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" /> NIEUWE KOPPELING
          </h2>

          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a192f]/20 border border-navyLight text-white px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="bijv. administratie@jouwbedrijf.nl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex justify-between">
                <span>App Wachtwoord (IMAP)</span>
                <span className="text-[#d4af37] cursor-pointer hover:text-emerald-400 transition-colors">Hoe kom ik hieraan?</span>
              </label>
              <input
                type="password"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                required
                className="w-full bg-[#0a192f]/20 border border-navyLight text-white px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.2em] py-4 transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              {loading ? "BEZIG MET ASSIMILEREN..." : "KOPPEL POSTVAK"}
            </button>
          </form>

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 border border-green-500 bg-green-950/30 p-3 text-green-500 text-xs tracking-widest font-bold flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> E-MAIL SUCCESVOL GEKOPPELD AAN GODBRAIN.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

