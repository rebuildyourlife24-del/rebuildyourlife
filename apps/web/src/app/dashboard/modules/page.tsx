"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  Mail, 
  Search, 
  Share2, 
  LayoutTemplate, 
  ShoppingBag, 
  GraduationCap, 
  Users, 
  Newspaper, 
  Briefcase
} from "lucide-react";

const RYL_MODULES = [
  {
    id: "ai_chatbot_agency",
    title: "AI Chatbot Agency",
    description: "Verkoop en installeer AI-klantenservice bots voor lokale bedrijven.",
    icon: Bot,
    category: "B2B",
    status: "AVAILABLE",
    profitPotential: "Hoog (€150+ per maand/klant)"
  },
  {
    id: "cold_email_outreach",
    title: "Cold Email Outreach",
    description: "Automatisch leads genereren en koude acquisitie via AI.",
    icon: Mail,
    category: "B2B",
    status: "AVAILABLE",
    profitPotential: "Hoog (€500+ per gesloten deal)"
  },
  {
    id: "seo_audit_tool",
    title: "SEO Audit Tool",
    description: "Automatische SEO website-verbeterrapporten genereren en verkopen.",
    icon: Search,
    category: "B2B",
    status: "COMING_SOON",
    profitPotential: "Gemiddeld (€50-€100 per rapport)"
  },
  {
    id: "ai_social_media",
    title: "AI Social Media Agency",
    description: "Volautomatisch inplannen en genereren van social media content.",
    icon: Share2,
    category: "B2B",
    status: "COMING_SOON",
    profitPotential: "Gemiddeld (€250+ per maand/klant)"
  },
  {
    id: "website_builder",
    title: "One-Pager Service",
    description: "1-klik AI website builder om te verhuren aan zzp'ers.",
    icon: LayoutTemplate,
    category: "B2B",
    status: "COMING_SOON",
    profitPotential: "Gemiddeld (€20-€50 per maand/klant)"
  },
  {
    id: "digital_product_store",
    title: "Digital Product Store",
    description: "Geautomatiseerde verkoop van templates, e-books en downloads.",
    icon: ShoppingBag,
    category: "B2C",
    status: "COMING_SOON",
    profitPotential: "Schaalbaar (100% winstmarge)"
  },
  {
    id: "online_course_platform",
    title: "Online Cursus Platform",
    description: "Verkoop videolessen met geautomatiseerde toegangscontrole.",
    icon: GraduationCap,
    category: "B2C",
    status: "COMING_SOON",
    profitPotential: "Hoog (Eenmalige of wederkerende omzet)"
  },
  {
    id: "paid_community",
    title: "Betaalde Online Community",
    description: "Paywall voor Discord/Telegram groepen met abonnementen.",
    icon: Users,
    category: "B2C",
    status: "COMING_SOON",
    profitPotential: "Schaalbaar (€5-€50 per lid/maand)"
  },
  {
    id: "automated_newsletter",
    title: "Geautomatiseerde Nieuwsbrief",
    description: "AI verzamelt nieuws en verstuurt dit naar betalende abonnees.",
    icon: Newspaper,
    category: "B2C",
    status: "COMING_SOON",
    profitPotential: "Gemiddeld (€5-€15 per lid/maand)"
  },
  {
    id: "drop_servicing",
    title: "Drop-servicing Portal",
    description: "Diensten verkopen, uitbesteden, en automatisch afleveren via Ryl.",
    icon: Briefcase,
    category: "B2B",
    status: "COMING_SOON",
    profitPotential: "Hoog (Arbitrage marges van 50%+)"
  }
];

export default function ModuleHub() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleActivate = (id: string, status: string) => {
    if (status === "COMING_SOON") return;
    setActiveModule(id);
    // TODO: Roep API aan om module te activeren voor deze gebruiker
    alert(`Module ${id} activatie-proces gestart!`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white bg-slate-950">
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Ryl Module Hub
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Kies jouw verdienmodel. Activeer het systeem. Draai omzet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RYL_MODULES.map((mod, idx) => (
          <motion.div 
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group flex flex-col h-full relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-3 bg-slate-800 rounded-xl text-blue-400 group-hover:text-emerald-400 transition-colors">
                <mod.icon size={28} />
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${mod.category === 'B2B' ? 'bg-blue-900/50 text-blue-300' : 'bg-purple-900/50 text-purple-300'}`}>
                {mod.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 relative z-10">{mod.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow relative z-10">
              {mod.description}
            </p>

            <div className="mt-auto relative z-10">
              <div className="text-xs text-slate-500 mb-3 font-medium">
                WINSTPOTENTIE: <span className="text-emerald-400">{mod.profitPotential}</span>
              </div>
              
              <button 
                onClick={() => handleActivate(mod.id, mod.status)}
                disabled={mod.status === "COMING_SOON"}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  mod.status === "AVAILABLE" 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {mod.status === "AVAILABLE" ? "Module Activeren" : "Binnenkort Beschikbaar"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
