"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, Video, Send, Search, Database, Mail, Settings, Play, Download, 
  CheckCircle, AlertTriangle, Loader2, Terminal, ArrowRight, Lock, 
  Trash2, Globe, Phone, MapPin, RefreshCw, Layers, Sparkles
} from "lucide-react";
import { 
  getBusinessClientsAction, 
  scrapeLeadsAction, 
  sendPitchAction, 
  renderVideoAction 
} from "@/actions/factory";

export default function AutonomousFactoryPage() {
  const [activeTab, setActiveTab] = useState<"video" | "scraper" | "pitch">("video");
  const [activeShift, setActiveShift] = useState<"DAY" | "NIGHT">("DAY");

  // Database leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Video State
  const [videoScript, setVideoScript] = useState(
    "Stop wasting time with outdated software. Rebuild Your Life offers custom AI automation to streamline your B2B sales pipeline, generating highly qualified leads and drafting emails instantly. Get started today and reclaim 20 hours a week."
  );
  const [videoProvider, setVideoProvider] = useState<"openai" | "elevenlabs" | "google-free">("google-free");
  const [videoStyle, setVideoStyle] = useState<"space" | "nature" | "abstract" | "tech">("tech");
  const [openaiKey, setOpenaiKey] = useState("");
  const [openaiVoice, setOpenaiVoice] = useState("alloy");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const [elevenlabsVoiceId, setElevenlabsVoiceId] = useState("21m00Tcm4TlvDq8ikWAM");

  // Hyperrealism options states
  const [hyperrealistic, setHyperrealistic] = useState(true);
  const [grainStrength, setGrainStrength] = useState(8);
  const [vignetteStrength, setVignetteStrength] = useState(0.12);
  const [cameraShake, setCameraShake] = useState(true);
  const [lightBloom, setLightBloom] = useState(true);
  const [chromaticAberration, setChromaticAberration] = useState(true);
  const [roomReverb, setRoomReverb] = useState(true);
  const [ambientHiss, setAmbientHiss] = useState(true);
  
  const [isRendering, setIsRendering] = useState(false);
  const [videoLogs, setVideoLogs] = useState<string[]>([]);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

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
  
  // Pitch Credentials (saved in state for real actions)
  const [resendApiKey, setResendApiKey] = useState("");
  const [resendFrom, setResendFrom] = useState("onboarding@resend.dev");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");

  const [pitchSubject, setPitchSubject] = useState("Maximize Lead Generation for {COMPANY}");
  const [pitchTemplate, setPitchTemplate] = useState(
    `<p>Beste team van {COMPANY},</p>\n<p>Ik zag jullie bedrijf in {LOCATION}. Met onze AI-automatiseringen kunnen we lead generation en social video's voor {COMPANY} volledig automatiseren.</p>\n<p>Laten we deze week kort bellen om te bespreken hoe we dit kunnen opzetten.</p>\n<p>Met vriendelijke groet,<br/>Rebuild Your Life Automation Team</p>`
  );

  const [isPitching, setIsPitching] = useState(false);
  const [pitchLogs, setPitchLogs] = useState<string[]>([]);

  // Load Saved Leads from DB
  const loadLeads = async () => {
    setIsLoadingLeads(true);
    const res = await getBusinessClientsAction();
    if (res.success && res.clients) {
      setLeads(res.clients);
    }
    setIsLoadingLeads(false);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Handle Video Generation
  const handleRenderVideo = async () => {
    setIsRendering(true);
    setVideoLogs(["Initialiseren van rendering pipeline...", `Selected Style: ${videoStyle}`, `Selected TTS Provider: ${videoProvider}`]);
    setRenderedVideoUrl(null);

    try {
      const config = {
        provider: videoProvider,
        openaiKey: openaiKey || undefined,
        openaiVoice: openaiVoice,
        elevenlabsKey: elevenlabsKey || undefined,
        elevenlabsVoiceId: elevenlabsVoiceId,
        style: videoStyle,
        script: videoScript,
        hyperrealistic,
        grainStrength,
        vignetteStrength,
        cameraShake,
        lightBloom,
        chromaticAberration,
        roomReverb,
        ambientHiss
      };

      const res = await renderVideoAction(config);
      const data = res as any;

      if (data.success && data.videoUrl) {
        setRenderedVideoUrl(data.videoUrl);
        setVideoLogs(prev => [...prev, ...data.logs, "Video-rendering succesvol afgerond! Player geladen."]);
      } else {
        setVideoLogs(prev => [...prev, ...(data.logs || []), `Fout tijdens renderen: ${data.error}`]);
      }
    } catch (err: any) {
      setVideoLogs(prev => [...prev, `Kritieke fout: ${err.message || err}`]);
    } finally {
      setIsRendering(false);
    }
  };

  // Handle Scraping
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
        // Refresh local DB leads
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

  // Handle Pitch Campaign sending
  const handleSendPitches = async () => {
    if (selectedLeads.length === 0) {
      alert("Selecteer ten minste één lead om een pitch naar te sturen.");
      return;
    }

    setIsPitching(true);
    setPitchLogs(["Email Pitcher gestart...", `Totaal geselecteerde leads: ${selectedLeads.length}`]);

    const config = {
      provider: pitchProvider,
      resendApiKey: resendApiKey || undefined,
      resendFrom: resendFrom || undefined,
      smtpHost: smtpHost || undefined,
      smtpPort: smtpPort || undefined,
      smtpSecure: smtpSecure,
      smtpUser: smtpUser || undefined,
      smtpPass: smtpPass || undefined,
      smtpFrom: smtpFrom || undefined
    };

    let processedCount = 0;
    for (const leadId of selectedLeads) {
      const lead = leads.find(l => l.id === leadId);
      if (!lead || !lead.email) {
        setPitchLogs(prev => [...prev, `[Sla over] Lead ${lead?.name || leadId} heeft geen emailadres.`]);
        continue;
      }

      setPitchLogs(prev => [...prev, `Verzenden naar ${lead.name} (${lead.email})...`]);

      // Dynamic placeholder replacement
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
          setPitchLogs(prev => [...prev, `[SUCCESS] Pitch succesvol verstuurd naar ${lead.name}. Status bijgewerkt naar CONTACTED.`]);
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
    loadLeads(); // Reload status update in leads list
  };

  const handleSelectAllLeads = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(leads.filter(l => l.email).map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 p-6 md:p-10 font-mono selection:bg-amber-400 selection:text-black">
      
      {/* Brutalist Platinum Header Banner */}
      <div className="border-4 border-zinc-200 bg-zinc-900 p-6 md:p-8 mb-10 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-r from-transparent to-zinc-800 opacity-20 transform skew-x-12"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-amber-400 text-black px-2.5 py-1 text-xs font-black tracking-widest uppercase border border-black shadow-[2px_2px_0px_0px_#000]">
                FACTORY v2.0
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 uppercase font-black">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sovereign Core Online
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase mb-2">
              Autonomous Video Factory
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Gereedschap voor hyper-geautomatiseerde content-productie en B2B prospect-verzameling. Direct gekoppeld aan de database, met echte video-rendering en e-mailpitcher.
            </p>
          </div>

          {/* Shift selector panel */}
          <div className="border-2 border-zinc-200 bg-zinc-950 p-2 flex gap-1 shadow-[4px_4px_0px_0px_#000]">
            <button
              onClick={() => setActiveShift("DAY")}
              className={`px-4 py-2 text-xs font-black uppercase transition-all ${
                activeShift === "DAY"
                  ? "bg-amber-400 text-black border border-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Day Shift (Alpha-7)
            </button>
            <button
              onClick={() => setActiveShift("NIGHT")}
              className={`px-4 py-2 text-xs font-black uppercase transition-all ${
                activeShift === "NIGHT"
                  ? "bg-indigo-600 text-white border border-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Night Shift (Omega-9)
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Real-Time Infrastructure Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="border-2 border-zinc-700 bg-zinc-900/50 p-5 shadow-[4px_4px_0px_0px_#000] flex items-start gap-4">
          <div className="p-3 bg-zinc-800 border border-zinc-700 text-amber-400 shadow-[2px_2px_0px_0px_#000]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase text-sm">GPU Render Cluster</h3>
            <p className="text-xs text-zinc-500 mt-1">Status: Standby</p>
            <p className="text-xs text-zinc-400 mt-2 font-mono">
              {activeShift === "DAY" ? "Connected: Active (RunPod)" : "EcoMode active - Offline"}
            </p>
          </div>
        </div>

        <div className="border-2 border-zinc-700 bg-zinc-900/50 p-5 shadow-[4px_4px_0px_0px_#000] flex items-start gap-4">
          <div className="p-3 bg-zinc-800 border border-zinc-700 text-cyan-400 shadow-[2px_2px_0px_0px_#000]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase text-sm">Scraping Core</h3>
            <p className="text-xs text-zinc-500 mt-1">Source: OSM & Overpass</p>
            <p className="text-xs text-zinc-400 mt-2 font-mono">
              Live crawler engine: Geen API keys vereist.
            </p>
          </div>
        </div>

        <div className="border-2 border-zinc-700 bg-zinc-900/50 p-5 shadow-[4px_4px_0px_0px_#000] flex items-start gap-4">
          <div className="p-3 bg-zinc-800 border border-zinc-700 text-emerald-400 shadow-[2px_2px_0px_0px_#000]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase text-sm">SMTP & Resend Relay</h3>
            <p className="text-xs text-zinc-500 mt-1">Status: Active</p>
            <p className="text-xs text-zinc-400 mt-2 font-mono">
              Secure TLS / HTTP Rest endpoints geladen.
            </p>
          </div>
        </div>
      </div>

      {/* Brutalist Brutal Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase transition-all border-2 border-zinc-200 shadow-[4px_4px_0px_0px_#000] ${
            activeTab === "video"
              ? "bg-zinc-100 text-black translate-x-0.5 translate-y-0.5 shadow-none"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          1. AI Video Generator
        </button>

        <button
          onClick={() => setActiveTab("scraper")}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase transition-all border-2 border-zinc-200 shadow-[4px_4px_0px_0px_#000] ${
            activeTab === "scraper"
              ? "bg-zinc-100 text-black translate-x-0.5 translate-y-0.5 shadow-none"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4" />
          2. B2B Lead Scraper
        </button>

        <button
          onClick={() => setActiveTab("pitch")}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase transition-all border-2 border-zinc-200 shadow-[4px_4px_0px_0px_#000] ${
            activeTab === "pitch"
              ? "bg-zinc-100 text-black translate-x-0.5 translate-y-0.5 shadow-none"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Send className="w-4 h-4" />
          3. E-mail Pitcher
        </button>
      </div>

      {/* Main Workspace Frame */}
      <div className="border-4 border-zinc-200 bg-zinc-950 p-6 md:p-8 shadow-[8px_8px_0px_0px_#000000]">
        
        {/* Tab 1: AI Video Generator */}
        {activeTab === "video" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Form Settings */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white uppercase mb-2 flex items-center gap-2">
                    <Video className="text-amber-400 w-5 h-5" /> Video Script & TTS
                  </h2>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">
                    Voer het script in dat voorgelezen zal worden door de synthetische stem.
                  </p>
                  <textarea
                    rows={5}
                    value={videoScript}
                    onChange={(e) => setVideoScript(e.target.value)}
                    className="w-full bg-zinc-900 border-2 border-zinc-700 p-4 font-mono text-sm text-white focus:outline-none focus:border-amber-400 placeholder-zinc-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]"
                    placeholder="Schrijf hier je script..."
                  />
                  <div className="text-right text-xs text-zinc-500 mt-1 uppercase font-bold">
                    Tekens: {videoScript.length} / Woorden: {videoScript.split(/\s+/).filter(Boolean).length}
                  </div>
                </div>

                {/* Grid for TTS settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Voice Provider</label>
                    <select
                      value={videoProvider}
                      onChange={(e: any) => setVideoProvider(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="google-free">Free Google TTS (Geen key nodig)</option>
                      <option value="openai">OpenAI Audio Speech (TTS-1)</option>
                      <option value="elevenlabs">ElevenLabs Speech API</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Stock Clip Style</label>
                    <select
                      value={videoStyle}
                      onChange={(e: any) => setVideoStyle(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="tech">Future Technology (Neon Subway)</option>
                      <option value="space">Deep Space (Stars background)</option>
                      <option value="nature">Nature / Mountain Stream</option>
                      <option value="abstract">Abstract Laser Lights</option>
                    </select>
                  </div>
                </div>

                {/* Hyperrealism Settings Panel */}
                <div className="border-2 border-zinc-800 bg-zinc-900/20 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2 text-xs font-black text-white uppercase">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      Hyperrealism Details (Organic Quality)
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hyperrealistic} 
                        onChange={(e) => setHyperrealistic(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  </div>

                  {hyperrealistic && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Camera Shake (Handheld Jitter)</span>
                          <input 
                            type="checkbox" 
                            checked={cameraShake} 
                            onChange={(e) => setCameraShake(e.target.checked)}
                            className="accent-amber-400 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Light Bloom (Cinematic Glow)</span>
                          <input 
                            type="checkbox" 
                            checked={lightBloom} 
                            onChange={(e) => setLightBloom(e.target.checked)}
                            className="accent-amber-400 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Chromatic Aberration (Color Fringing)</span>
                          <input 
                            type="checkbox" 
                            checked={chromaticAberration} 
                            onChange={(e) => setChromaticAberration(e.target.checked)}
                            className="accent-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Room Reverb (Acoustic Space)</span>
                          <input 
                            type="checkbox" 
                            checked={roomReverb} 
                            onChange={(e) => setRoomReverb(e.target.checked)}
                            className="accent-amber-400 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Analog Tape Hiss (Pink Noise)</span>
                          <input 
                            type="checkbox" 
                            checked={ambientHiss} 
                            onChange={(e) => setAmbientHiss(e.target.checked)}
                            className="accent-amber-400 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-zinc-400">Film Grain ({grainStrength})</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="20" 
                            value={grainStrength} 
                            onChange={(e) => setGrainStrength(Number(e.target.value))}
                            className="w-24 accent-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Condtitional Key Inputs */}
                {videoProvider === "openai" && (
                  <div className="border-2 border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase">
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> OpenAI Config
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">OpenAI API Key (Optioneel)</label>
                        <input
                          type="password"
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                          placeholder="Laat leeg voor env variable..."
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Stem Model</label>
                        <select
                          value={openaiVoice}
                          onChange={(e) => setOpenaiVoice(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="alloy">Alloy (Neutrale stem)</option>
                          <option value="echo">Echo (Warm)</option>
                          <option value="fable">Fable (Verhalend)</option>
                          <option value="onyx">Onyx (Diepe stem)</option>
                          <option value="nova">Nova (Vriendelijk)</option>
                          <option value="shimmer">Shimmer (Professioneel)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {videoProvider === "elevenlabs" && (
                  <div className="border-2 border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase">
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> ElevenLabs Config
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">ElevenLabs API Key (Optioneel)</label>
                        <input
                          type="password"
                          value={elevenlabsKey}
                          onChange={(e) => setElevenlabsKey(e.target.value)}
                          placeholder="Laat leeg voor env variable..."
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Voice ID</label>
                        <input
                          type="text"
                          value={elevenlabsVoiceId}
                          onChange={(e) => setElevenlabsVoiceId(e.target.value)}
                          placeholder="bijv. 21m00Tcm4TlvDq8ikWAM"
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Trigger Button */}
                <button
                  onClick={handleRenderVideo}
                  disabled={isRendering || !videoScript.trim()}
                  className="w-full bg-amber-400 text-black border-4 border-black px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isRendering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      RENDERING MP4 VIDEO...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      GENEREER EN RENDER COMPLETE MP4 VIDEO
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Player & Real-time Terminal Log */}
              <div className="w-full lg:w-96 flex flex-col gap-6">
                
                {/* HTML5 Video Player */}
                <div className="border-2 border-zinc-700 bg-zinc-900 p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between min-h-[300px]">
                  <div className="text-xs text-zinc-400 font-bold uppercase mb-3 flex justify-between items-center border-b border-zinc-880 pb-2">
                    <span>OUTPUT MONITOR</span>
                    <span className="h-2 w-2 rounded-full bg-zinc-600"></span>
                  </div>

                  {renderedVideoUrl ? (
                    <div className="space-y-4">
                      <div className="border-2 border-black bg-black overflow-hidden relative aspect-video">
                        <video 
                          src={renderedVideoUrl} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <a
                        href={renderedVideoUrl}
                        download
                        className="w-full bg-zinc-100 text-black border-2 border-black py-2.5 font-black text-xs uppercase flex justify-center items-center gap-2 hover:bg-zinc-200 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download MP4 Video
                      </a>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-zinc-800 bg-zinc-950/40">
                      <Video className="w-12 h-12 text-zinc-700 mb-3" />
                      <p className="text-xs text-zinc-500 font-bold uppercase">Geen video gerenderd</p>
                      <p className="text-[10px] text-zinc-600 mt-1">Vul het script in en klik op genereren om de rendering te starten.</p>
                    </div>
                  )}
                </div>

                {/* Console Log Terminal */}
                <div className="border-2 border-zinc-700 bg-black p-4 shadow-[4px_4px_0px_0px_#000] flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase border-b border-zinc-850 pb-2 mb-3">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <span>SYSTEM CONSOLE LOGS</span>
                  </div>
                  <div className="flex-1 font-mono text-[10px] text-zinc-400 space-y-1.5 max-h-60 overflow-y-auto bg-zinc-950 p-3 border border-zinc-900">
                    {videoLogs.length === 0 ? (
                      <span className="text-zinc-600">Console is idle.</span>
                    ) : (
                      videoLogs.map((log, index) => (
                        <div key={index} className="leading-relaxed whitespace-pre-wrap">
                          <span className="text-zinc-600 font-bold">[{index + 1}]</span> {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Tab 2: B2B Lead Scraper */}
        {activeTab === "scraper" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Scraper controls */}
            <div className="border-2 border-zinc-800 bg-zinc-900/30 p-6">
              <h2 className="text-xl font-black text-white uppercase mb-2 flex items-center gap-2">
                <Search className="text-cyan-400 w-5 h-5" /> B2B Web Scraper
              </h2>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-6">
                Doorzoek gemeenten en regio's via OpenStreetMap Overpass en crawl websites voor contactgegevens.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Locatie / Stad</label>
                  <input
                    type="text"
                    value={scraperLocation}
                    onChange={(e) => setScraperLocation(e.target.value)}
                    placeholder="bijv. Amsterdam"
                    className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Categorie</label>
                  <select
                    value={scraperCategory}
                    onChange={(e) => setScraperCategory(e.target.value)}
                    className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="dentist">Dentist (Tandarts)</option>
                    <option value="restaurant">Restaurant (Horeca)</option>
                    <option value="bakery">Bakery (Bakkerij)</option>
                    <option value="gym">Gym / Sports Centre (Sportschool)</option>
                    <option value="lawyer">Lawyer (Advocaat)</option>
                    <option value="real estate">Real Estate (Makelaar)</option>
                    <option value="hairdresser">Hairdresser (Kapper)</option>
                    <option value="hotel">Hotel (Toerisme)</option>
                    <option value="car repair">Car Repair (Garage)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Max Aantal Leads ({scraperLimit})</label>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={scraperLimit}
                    onChange={(e) => setScraperLimit(Number(e.target.value))}
                    className="w-full accent-cyan-400 mt-4 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleScrapeLeads}
                disabled={isScraping || !scraperLocation.trim()}
                className="w-full bg-cyan-400 text-black border-4 border-black px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    CRAWLING & SCRAPING WEBSITES...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    START B2B LEAD SCRAPING & PIPELINE SYNC
                  </>
                )}
              </button>
            </div>

            {/* Terminal log for scraping */}
            <div className="border-2 border-zinc-700 bg-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase border-b border-zinc-850 pb-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>CRAWLER PROCESS MONITOR</span>
              </div>
              <div className="font-mono text-[10px] text-zinc-400 space-y-1.5 max-h-40 overflow-y-auto bg-zinc-950 p-3 border border-zinc-900">
                {scraperLogs.length === 0 ? (
                  <span className="text-zinc-600">Scraper is offline. Vul parameters in en klik op start.</span>
                ) : (
                  scraperLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      <span className="text-cyan-600 font-bold">[{index + 1}]</span> {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Scraped Results Table */}
            {scrapedLeads.length > 0 && (
              <div className="border-4 border-black bg-zinc-900 p-6 shadow-[6px_6px_0px_0px_#000]">
                <h3 className="text-lg font-black text-white uppercase mb-4 flex items-center gap-2">
                  <CheckCircle className="text-emerald-400 w-5 h-5" /> Gevonden Prospects (Automatisch Opgeslagen in DB)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-zinc-700 text-zinc-400">
                        <th className="pb-3 pr-4 uppercase">Bedrijfsnaam</th>
                        <th className="pb-3 pr-4 uppercase">E-mail</th>
                        <th className="pb-3 pr-4 uppercase">Telefoon</th>
                        <th className="pb-3 pr-4 uppercase">Website</th>
                        <th className="pb-3 uppercase">Adres</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {scrapedLeads.map((lead, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/40 text-zinc-200">
                          <td className="py-3 pr-4 font-bold text-white">{lead.name}</td>
                          <td className="py-3 pr-4">
                            {lead.email ? (
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5">
                                {lead.email}
                              </span>
                            ) : (
                              <span className="text-zinc-600 italic">Niet gevonden</span>
                            )}
                          </td>
                          <td className="py-3 pr-4">{lead.phone || <span className="text-zinc-600 italic">Geen tel</span>}</td>
                          <td className="py-3 pr-4">
                            {lead.website ? (
                              <a href={lead.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" /> Site
                              </a>
                            ) : (
                              <span className="text-zinc-600">-</span>
                            )}
                          </td>
                          <td className="py-3 text-zinc-400 max-w-xs truncate">{lead.address || "Onbekend"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Email Pitcher */}
        {activeTab === "pitch" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Side: Campaign config and lead selection */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white uppercase mb-2 flex items-center gap-2">
                    <Send className="text-orange-500 w-5 h-5" /> Pitch Instellingen
                  </h2>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">
                    Kies je verzendmethode en configureer de personalisatie-velden.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Provider</label>
                      <select
                        value={pitchProvider}
                        onChange={(e: any) => setPitchProvider(e.target.value)}
                        className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="resend">Resend API Rest client</option>
                        <option value="smtp">Direct SMTP Mail Server</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Verzend Adres / From Address</label>
                      <input
                        type="text"
                        value={pitchProvider === "resend" ? resendFrom : smtpFrom}
                        onChange={(e) => pitchProvider === "resend" ? setResendFrom(e.target.value) : setSmtpFrom(e.target.value)}
                        placeholder={pitchProvider === "resend" ? "onboarding@resend.dev" : "info@jouwdomein.nl"}
                        className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Credentials for Email pitch */}
                {pitchProvider === "resend" && (
                  <div className="border-2 border-zinc-850 bg-zinc-900/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase">
                      <Lock className="w-3.5 h-3.5 text-orange-500" /> Resend Credentials
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Resend API Key (Optioneel)</label>
                      <input
                        type="password"
                        value={resendApiKey}
                        onChange={(e) => setResendApiKey(e.target.value)}
                        placeholder="Laat leeg om RESEND_API_KEY env variabele te gebruiken..."
                        className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}

                {pitchProvider === "smtp" && (
                  <div className="border-2 border-zinc-850 bg-zinc-900/40 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase">
                      <Lock className="w-3.5 h-3.5 text-orange-500" /> SMTP Server credentials
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.example.com"
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Port</label>
                        <input
                          type="number"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(Number(e.target.value))}
                          placeholder="587"
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          id="smtpSecure"
                          checked={smtpSecure}
                          onChange={(e) => setSmtpSecure(e.target.checked)}
                          className="mr-2 accent-orange-500 cursor-pointer"
                        />
                        <label htmlFor="smtpSecure" className="text-[10px] font-black text-zinc-400 uppercase select-none cursor-pointer">SSL/TLS Secure</label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Username / E-mail</label>
                        <input
                          type="text"
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Password</label>
                        <input
                          type="password"
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Body template */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase mb-2">Onderwerp / Subject</label>
                    <input
                      type="text"
                      value={pitchSubject}
                      onChange={(e) => setPitchSubject(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase mb-2">E-mail HTML Template</label>
                    <div className="flex gap-2 mb-2 text-[10px] text-zinc-500 font-bold">
                      <span className="bg-zinc-800 px-2 py-0.5">Vervangings-tokens:</span>
                      <code className="text-orange-400 font-mono">&#123;COMPANY&#125;</code>
                      <code className="text-orange-400 font-mono">&#123;LOCATION&#125;</code>
                      <code className="text-orange-400 font-mono">&#123;CATEGORY&#125;</code>
                    </div>
                    <textarea
                      rows={8}
                      value={pitchTemplate}
                      onChange={(e) => setPitchTemplate(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-700 p-4 font-mono text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendPitches}
                  disabled={isPitching || selectedLeads.length === 0}
                  className="w-full bg-orange-500 text-black border-4 border-black px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isPitching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      CAMPAIGN IS RUNNING...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      DISPATCH COLD EMAIL CAMPAIGN ({selectedLeads.length} LEADS)
                    </>
                  )}
                </button>
              </div>

              {/* Right Side: Select Leads from DB */}
              <div className="w-full lg:w-96 flex flex-col gap-6">
                
                {/* Select client checklist */}
                <div className="border-2 border-zinc-700 bg-zinc-900 p-5 shadow-[4px_4px_0px_0px_#000] flex-1 flex flex-col">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
                    <span className="text-xs text-zinc-300 font-black uppercase flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-zinc-500" />
                      Prospect Pipeline
                    </span>
                    <button 
                      onClick={loadLeads} 
                      disabled={isLoadingLeads}
                      className="text-zinc-500 hover:text-white p-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4 bg-zinc-950 p-2 border border-zinc-800 text-[10px] uppercase font-bold text-zinc-400">
                    <input 
                      type="checkbox" 
                      id="selectAllLeads" 
                      onChange={handleSelectAllLeads}
                      checked={leads.length > 0 && selectedLeads.length === leads.filter(l => l.email).length}
                      className="accent-orange-500 cursor-pointer"
                    />
                    <label htmlFor="selectAllLeads" className="select-none cursor-pointer">Selecteer alle leads met e-mail</label>
                  </div>

                  {isLoadingLeads ? (
                    <div className="flex-1 flex justify-center items-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-zinc-800 bg-zinc-950/40">
                      <Database className="w-8 h-8 text-zinc-700 mb-2" />
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Geen prospects in database</p>
                      <p className="text-[9px] text-zinc-600 mt-1">Ga naar de B2B Lead Scraper tab om prospects te zoeken en te synchroniseren.</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1">
                      {leads.map((lead) => (
                        <div 
                          key={lead.id} 
                          className={`p-3 border-2 transition-all flex items-start gap-2.5 ${
                            selectedLeads.includes(lead.id) 
                              ? "bg-zinc-800 border-orange-500" 
                              : "bg-zinc-950 border-zinc-850 hover:border-zinc-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={!lead.email}
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="mt-0.5 accent-orange-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-xs font-bold text-white truncate uppercase">{lead.name}</p>
                              {lead.status === "CONTACTED" ? (
                                <span className="bg-orange-500/10 text-orange-400 text-[8px] font-black uppercase px-1 border border-orange-500/30">Pitched</span>
                              ) : (
                                <span className="bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase px-1 border border-zinc-700">New</span>
                              )}
                            </div>
                            {lead.email ? (
                              <p className="text-[10px] text-zinc-400 truncate mt-1">{lead.email}</p>
                            ) : (
                              <p className="text-[9px] text-goldLight italic mt-1 flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" /> Geen e-mailadres
                              </p>
                            )}
                            {lead.phone && <p className="text-[9px] text-zinc-500 mt-0.5">{lead.phone}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sender progress logs */}
                <div className="border-2 border-zinc-700 bg-black p-4 shadow-[4px_4px_0px_0px_#000] flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase border-b border-zinc-850 pb-2 mb-3">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <span>PITCH PROCESS LOGS</span>
                  </div>
                  <div className="flex-1 font-mono text-[10px] text-zinc-400 space-y-1.5 max-h-48 overflow-y-auto bg-zinc-950 p-3 border border-zinc-900">
                    {pitchLogs.length === 0 ? (
                      <span className="text-zinc-600">Console is idle.</span>
                    ) : (
                      pitchLogs.map((log, index) => (
                        <div key={index} className="leading-relaxed">
                          <span className="text-orange-500 font-bold">[{index + 1}]</span> {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
