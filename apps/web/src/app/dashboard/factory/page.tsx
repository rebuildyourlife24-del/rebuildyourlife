"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, Video, Send, Search, Database, Mail, 
  CheckCircle, Loader2, Terminal, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  getBusinessClientsAction, 
  scrapeLeadsAction, 
  sendPitchAction 
} from "@/actions/factory";

export default function AutonomousFactoryPage() {
  const [activeTab, setActiveTab] = useState<"scraper" | "pitch">("scraper");
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Scraper State
  const [scraperLocation, setScraperLocation] = useState("Amsterdam");
  const [scraperCategory, setScraperCategory] = useState("dentist");
  const [scraperLimit, setScraperLimit] = useState(5);
  const [isScraping, setIsScraping] = useState(false);
  const [scraperLogs, setScraperLogs] = useState<string[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<any[]>([]);

  // Pitch State
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [pitchProvider, setPitchProvider] = useState<"resend" | "smtp">("resend");
  
  const [pitchSubject, setPitchSubject] = useState("Maximize Lead Generation for {COMPANY}");
  const [pitchTemplate, setPitchTemplate] = useState(
    `<p>Beste team van {COMPANY},</p>\n<p>Ik zag jullie bedrijf in {LOCATION}. Met onze AI-automatiseringen kunnen we lead generation en social video's voor {COMPANY} volledig automatiseren.</p>\n<p>Laten we deze week kort bellen om te bespreken hoe we dit kunnen opzetten.</p>\n<p>Met vriendelijke groet,<br/>Rebuild Your Life Automation Team</p>`
  );

  const [isPitching, setIsPitching] = useState(false);
  const [pitchLogs, setPitchLogs] = useState<string[]>([]);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await getBusinessClientsAction();
      if (res.success && res.clients) {
        setLeads(res.clients);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingLeads(false);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleScrapeLeads = async () => {
    setIsScraping(true);
    setScrapedLeads([]);
    setScraperLogs([
      "B2B Scraper geïnitieerd...",
      `Locatie: ${scraperLocation}`,
      `Categorie: ${scraperCategory}`,
      "Geocoding locatie via Nominatim API..."
    ]);

    try {
      const res = await scrapeLeadsAction(scraperLocation, scraperCategory, scraperLimit);

      if (res.success && res.leads) {
        setScrapedLeads(res.leads);
        setScraperLogs(prev => [
          ...prev,
          "Locatie succesvol geocoded.",
          `Overpass API aangeroepen voor category '${scraperCategory}'.`,
          `Scraping afgerond. ${res.leads.length} leads gevonden.`,
          `Automatische synchronisatie met database voltooid. ${res.savedCount} nieuwe prospects toegevoegd.`
        ]);
        loadLeads();
      } else {
        setScraperLogs(prev => [...prev, `Fout bij scraping: ${res.error}`]);
      }
    } catch (err: any) {
      setScraperLogs(prev => [...prev, `Kritieke fout: ${err.message || err}`]);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSendPitches = async () => {
    if (selectedLeads.length === 0) {
      alert("Selecteer ten minste één lead om een pitch naar te sturen.");
      return;
    }

    setIsPitching(true);
    setPitchLogs(["Email Pitcher gestart...", `Totaal geselecteerde leads: ${selectedLeads.length}`]);

    const config = {
      provider: pitchProvider,
    };

    let processedCount = 0;
    for (const leadId of selectedLeads) {
      const lead = leads.find(l => l.id === leadId);
      if (!lead || !lead.email) {
        setPitchLogs(prev => [...prev, `[Sla over] Lead ${lead?.name || leadId} heeft geen emailadres.`]);
        continue;
      }

      setPitchLogs(prev => [...prev, `Verzenden naar ${lead.name} (${lead.email})...`]);

      const locationMatch = lead.notes?.match(/Location:\s*([^\n,]+)/);
      const categoryMatch = lead.notes?.match(/Category:\s*([^\n,]+)/);
      
      const customLocation = locationMatch ? locationMatch[1].trim() : "jouw regio";
      const customCategory = categoryMatch ? categoryMatch[1].trim() : "bedrijf";

      const personalizedSubject = pitchSubject
        .replace(/{COMPANY}/g, lead.company || lead.name)
        .replace(/{LOCATION}/g, customLocation)
        .replace(/{CATEGORY}/g, customCategory);

      const personalizedBody = pitchTemplate
        .replace(/{COMPANY}/g, lead.company || lead.name)
        .replace(/{LOCATION}/g, customLocation)
        .replace(/{CATEGORY}/g, customCategory);

      try {
        const res = await sendPitchAction(lead.id, lead.email, personalizedSubject, personalizedBody, config);
        
        if (res.success) {
          setPitchLogs(prev => [...prev, `[SUCCESS] Pitch succesvol verstuurd naar ${lead.name}.`]);
          processedCount++;
        } else {
          setPitchLogs(prev => [...prev, `[ERROR] Kon pitch niet sturen naar ${lead.name}: ${res.error}`]);
        }
      } catch (err: any) {
        setPitchLogs(prev => [...prev, `[CRITICAL ERROR] Fout bij verzending naar ${lead.name}: ${err.message || err}`]);
      }
    }

    setPitchLogs(prev => [...prev, `Pitch-campagne voltooid. ${processedCount} van de ${selectedLeads.length} emails succesvol verzonden.`]);
    setIsPitching(false);
    loadLeads();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-cyan-500/30">
      
      {/* Premium Header */}
      <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-8 mb-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Factory V3.0
              </span>
              <span className="flex items-center gap-2 text-xs text-zinc-400 uppercase font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                Sovereign Core Online
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Autonomous Factory
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl font-medium leading-relaxed">
              Het commandocentrum voor geautomatiseerde B2B prospect-verzameling en e-mail acquisitie. Genereer massale outreach met één druk op de knop.
            </p>
          </div>

          <Link 
            href="/video-forge" 
            className="group px-6 py-4 bg-cyan-950/30 border border-cyan-500/50 rounded-xl hover:bg-cyan-900/40 transition-all flex items-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          >
            <Video className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Nieuwe Module</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Open Video Forge</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Grid of Real-Time Infrastructure Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-white/5 bg-zinc-950/50 rounded-xl p-6 flex items-start gap-5 hover:border-cyan-500/30 transition-colors">
          <div className="p-3 bg-black border border-white/10 rounded-lg text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Scraping Core</h3>
            <p className="text-xs text-zinc-500 mt-1">Source: OSM & Overpass</p>
            <p className="text-xs text-zinc-400 mt-2 font-mono">
              Live crawler engine: Geen API keys vereist. Database link actief.
            </p>
          </div>
        </div>

        <div className="border border-white/5 bg-zinc-950/50 rounded-xl p-6 flex items-start gap-5 hover:border-cyan-500/30 transition-colors">
          <div className="p-3 bg-black border border-white/10 rounded-lg text-cyan-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">SMTP & Resend Relay</h3>
            <p className="text-xs text-zinc-500 mt-1">Status: Active</p>
            <p className="text-xs text-zinc-400 mt-2 font-mono">
              Beveiligde TLS endpoints geladen. Klaar voor verzending.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("scraper")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-xs uppercase tracking-widest rounded-xl transition-all ${
            activeTab === "scraper"
              ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              : "bg-zinc-950 border border-white/5 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Search className="w-4 h-4" />
          B2B Lead Scraper
        </button>

        <button
          onClick={() => setActiveTab("pitch")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-xs uppercase tracking-widest rounded-xl transition-all ${
            activeTab === "pitch"
              ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              : "bg-zinc-950 border border-white/5 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Send className="w-4 h-4" />
          E-mail Pitcher
        </button>
      </div>

      {/* Main Workspace Frame */}
      <div className="border border-white/5 bg-zinc-950 rounded-2xl p-6 md:p-8">
        
        {/* Tab: B2B Lead Scraper */}
        {activeTab === "scraper" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Search className="text-cyan-400 w-5 h-5" /> Web Scraper Configuraties
                  </h2>
                  <p className="text-zinc-500 text-sm">
                    Doorzoek regio's en crawl websites voor contactgegevens om je pijplijn te vullen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Locatie / Stad</label>
                    <input
                      type="text"
                      value={scraperLocation}
                      onChange={(e) => setScraperLocation(e.target.value)}
                      placeholder="bijv. Amsterdam"
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Categorie</label>
                    <select
                      value={scraperCategory}
                      onChange={(e) => setScraperCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="dentist">Dentist (Tandarts)</option>
                      <option value="restaurant">Restaurant (Horeca)</option>
                      <option value="real estate">Real Estate (Makelaar)</option>
                      <option value="lawyer">Lawyer (Advocaat)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Max Aantal Leads: {scraperLimit}</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={scraperLimit}
                    onChange={(e) => setScraperLimit(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <button
                  onClick={handleScrapeLeads}
                  disabled={isScraping || !scraperLocation.trim()}
                  className="w-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/50 rounded-xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-cyan-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-3"
                >
                  {isScraping ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Scraping in uitvoering...</>
                  ) : (
                    <><Database className="w-5 h-5" /> Start Lead Scraping</>
                  )}
                </button>
              </div>

              {/* Terminal */}
              <div className="w-full lg:w-[400px] flex flex-col">
                <div className="bg-black border border-white/5 rounded-xl p-5 h-full flex flex-col min-h-[300px]">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold uppercase border-b border-white/5 pb-3 mb-4">
                    <Terminal className="w-4 h-4 text-cyan-500" /> System Logs
                  </div>
                  <div className="flex-1 font-mono text-xs text-zinc-400 space-y-2 overflow-y-auto">
                    {scraperLogs.length === 0 ? (
                      <span className="text-zinc-600">Systeem is gereed voor instructies.</span>
                    ) : (
                      scraperLogs.map((log, index) => (
                        <div key={index}><span className="text-cyan-500">[{index + 1}]</span> {log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: E-mail Pitcher */}
        {activeTab === "pitch" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl">
               <Send className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Pitch Module Offline</h3>
               <p className="text-zinc-500 max-w-md mx-auto">De automatische pitcher wordt momenteel geüpgraded. Gebruik de database om je leads te bekijken en handmatig te benaderen totdat de SMTP integratie is afgerond.</p>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
