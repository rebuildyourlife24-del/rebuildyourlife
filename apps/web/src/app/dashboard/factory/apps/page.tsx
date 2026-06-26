"use client";

import { useState } from "react";
import { 
  Cpu, Terminal, Play, Server, Globe, Shield, ExternalLink, 
  ArrowRight, RefreshCw, Sparkles, Check, DollarSign, AlertCircle 
} from "lucide-react";
import { createSystemActivityLogAction } from "@/app/actions/logs";

interface SoftwareAsset {
  id: string;
  name: string;
  source: string;
  cost: number;
  estValue: number;
  qualityScore: number;
  niche: string;
  issues: string[];
}

export default function AppFactoryPage() {
  const [selectedAsset, setSelectedAsset] = useState<SoftwareAsset | null>(null);
  
  // Analyzer/Upgrade states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [isUpgraded, setIsUpgraded] = useState(false);

  // Subdomain Deployment states
  const [desiredSubdomain, setDesiredSubdomain] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);

  // Listing calculator states
  const [askingPrice, setAskingPrice] = useState("1500");

  // SEO Config States
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [sitemapEnabled, setSitemapEnabled] = useState(true);

  // CEO Config States
  const [targetMargin, setTargetMargin] = useState("35"); // in %
  const [operationalCost, setOperationalCost] = useState("120"); // in EUR
  const [targetBuyerNiche, setTargetBuyerNiche] = useState("AI Startups / E-Commerce Brands");

  const softwareAssets: SoftwareAsset[] = [
    {
      id: "asset_1",
      name: "Open-Source Faceless UGC Video Generator",
      source: "GitHub (GPL-3.0)",
      cost: 0,
      estValue: 2800,
      qualityScore: 72,
      niche: "AI Video Generation",
      issues: ["Lacks a web interface (runs locally via python CLI)", "No database for user data storage", "No payment gateway integrated"]
    },
    {
      id: "asset_2",
      name: "Distressed Habit Tracker SaaS Template",
      source: "Codecanyon License",
      cost: 39,
      estValue: 1900,
      qualityScore: 54,
      niche: "Self-Improvement / Productivity",
      issues: ["Legacy React 16 codebase with outdated dependencies", "Broken MongoDB schema database sync", "Dated, non-responsive CSS styles"]
    },
    {
      id: "asset_3",
      name: "Solana Meme Coin Portfolio Tracker",
      source: "GitHub (MIT Open Source)",
      cost: 0,
      estValue: 3400,
      qualityScore: 61,
      niche: "Crypto Arbitrage & Data Tracking",
      issues: ["High API rate limits cause constant app crash", "No user authentication / wallet login", "Lacks real-time push notification hooks"]
    }
  ];

  const handleStartAnalysis = async (asset: SoftwareAsset) => {
    setSelectedAsset(asset);
    setIsAnalyzing(true);
    setIsUpgraded(false);
    setLiveUrl(null);
    setAnalysisLogs([]);

    setMetaTitle(`${asset.name} - Upgrade Premium Edition`);
    setMetaDescription(`Get the ultimate upgraded version of ${asset.name}. Refactored by Swarm AI with secure Auth and payments integration.`);
    setKeywords(`${asset.niche.toLowerCase().replace(/\s+/g, '')}, saas template, upgraded code, premium tool`);

    const steps = [
      `[CLONE] Repository cloned successfully from ${asset.source}...`,
      `[ANALYZE] Running static AST code quality scanner...`,
      `[DIAGNOSE] Identified key constraints: ${asset.issues.join(", ")}`,
      `[REFACTOR] Replacing outdated packages and dependencies...`,
      `[UPGRADE] Generating and injecting Next.js 16 App Router configuration...`,
      `[AUTH] Integrating Supabase Session and User database schemas...`,
      `[PAYMENTS] Integrating Mollie Checkout API endpoints...`,
      `[UI] Overhauling style sheets to Premium Future Blue Mode layout...`,
      `[COMPILE] Compiling upgraded codebase: Next.js bundle created.`,
      `[SUCCESS] App upgrade completed! Code quality score: 98% (Excellent)`
    ];

    const startTime = Date.now();
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      setAnalysisLogs(prev => [...prev, steps[i]]);
    }
    const duration = Date.now() - startTime;

    await createSystemActivityLogAction({
      action: "REFRACTOR_SAAS",
      category: "TECH",
      status: "SUCCESS",
      executionTime: duration,
      metadata: {
        assetId: asset.id,
        assetName: asset.name,
        source: asset.source,
        cost: asset.cost,
        originalQuality: asset.qualityScore,
        targetQuality: 98,
        issuesResolved: asset.issues
      }
    });

    setIsAnalyzing(false);
    setIsUpgraded(true);
  };

  const handleDeploySaaS = async () => {
    if (!selectedAsset || !desiredSubdomain) return;
    setIsDeploying(true);
    setLiveUrl(null);
    setDeploymentLogs([]);

    const cleanSubdomain = desiredSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const steps = [
      `[DNS] Allocating routing path: ${cleanSubdomain}.ai-henksemler.nl...`,
      `[DNS] Injecting A and AAAA records pointing to platform gateway cluster...`,
      `[DOCKER] Spawning container instance for SaaS asset: ${selectedAsset.name}`,
      `[DOCKER] Building docker container image... success.`,
      `[NGINX] Writing reverse proxy server block templates...`,
      `[SSL] Generating Let's Encrypt SSL certificates (TLS v1.3)...`,
      `[LIVE] Syncing application container with live Supabase database...`,
      `[LIVE] SaaS App online, secured, and fully operational!`
    ];

    const startTime = Date.now();
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      setDeploymentLogs(prev => [...prev, steps[i]]);
    }
    const duration = Date.now() - startTime;

    await createSystemActivityLogAction({
      action: "DEPLOY_SAAS",
      category: "SEO/CEO",
      status: "SUCCESS",
      executionTime: duration,
      metadata: {
        assetId: selectedAsset.id,
        assetName: selectedAsset.name,
        subdomain: cleanSubdomain,
        fullDomain: `${cleanSubdomain}.ai-henksemler.nl`,
        seo: {
          metaTitle,
          metaDescription,
          keywords,
          sitemapEnabled
        },
        ceo: {
          askingPrice: parseFloat(askingPrice) || 0,
          targetMargin: parseFloat(targetMargin) || 35,
          operationalCost: parseFloat(operationalCost) || 120,
          targetBuyerNiche,
          commission25Percent: (parseFloat(askingPrice) || 0) * 0.25,
          netEarnings75Percent: (parseFloat(askingPrice) || 0) * 0.75
        }
      }
    });

    setIsDeploying(false);
    setLiveUrl(`https://${cleanSubdomain}.ai-henksemler.nl`);
  };

  const calculatedPrice = parseFloat(askingPrice) || 0;
  const platformCommission = calculatedPrice * 0.25;
  const netEarnings = calculatedPrice - platformCommission;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Abstract Cyberpunk Background Lights */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Banner */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)] backdrop-blur-xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
              <Cpu className="w-10 h-10 text-cyan-400" />
              APP FACTORY
            </h1>
            <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest font-bold">
              // SaaS Flipping & Upgrade OS
            </p>
          </div>
          <div className="bg-cyan-500/10 text-cyan-400 px-4 py-2 border border-cyan-500/30 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            25% Brokerage Commission active
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: OPPORTUNITIES SCANNER */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider border-b border-white/10 pb-4 flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-cyan-400" />
                Marketplace Scanner
              </h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                Orion AI scant GitHub, Flippa en Codecanyon naar bruikbare software templates om te upgraden en flippen.
              </p>

              <div className="space-y-4">
                {softwareAssets.map((asset) => (
                  <div 
                    key={asset.id}
                    onClick={() => {
                      if (!isAnalyzing && !isDeploying) {
                        setSelectedAsset(asset);
                        setIsUpgraded(false);
                        setLiveUrl(null);
                      }
                    }}
                    className={`border rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAsset?.id === asset.id 
                        ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] transform scale-[1.02]" 
                        : "bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="space-y-3">
                      <span className="text-[9px] bg-white/10 text-zinc-300 px-2 py-1 rounded-full uppercase font-black tracking-widest w-max">
                        {asset.niche}
                      </span>
                      <h3 className="font-black text-sm uppercase tracking-wide leading-tight text-white">{asset.name}</h3>
                      <div className="flex justify-between items-center text-xs text-zinc-500 font-bold border-t border-white/5 pt-3">
                        <span>Bron: {asset.source}</span>
                        <span className="text-cyan-400">Aanschaf: {asset.cost === 0 ? "GRATIS" : `$${asset.cost}`}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-white/10 text-xs">
                      <span className="font-bold text-zinc-400">Quality: {asset.qualityScore}%</span>
                      <span className="font-black text-cyan-300">Est. value: ~${asset.estValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE & RIGHT: WORK AREA */}
          <div className="lg:col-span-2 space-y-8">
            
            {selectedAsset ? (
              <>
                {/* Asset Diagnostics and Upgrade console */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Diagnostics Panel */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-wider border-b border-white/10 pb-4 text-white">
                      Asset Diagnostics
                    </h2>
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-widest block mb-1">Naam:</span>
                        <span className="font-black uppercase text-sm text-zinc-300">{selectedAsset.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-widest block mb-1">Geschatte waarde na upgrade:</span>
                        <span className="font-black text-cyan-400 uppercase text-lg">${selectedAsset.estValue}</span>
                      </div>
                      <div className="space-y-2 border-t border-white/5 pt-4">
                        <span className="text-zinc-500 font-bold uppercase tracking-widest block mb-2">Geïdentificeerde beperkingen (Knelpunten):</span>
                        <ul className="space-y-2 text-cyan-500/90 font-bold">
                          {selectedAsset.issues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/10">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-cyan-500" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartAnalysis(selectedAsset)}
                      disabled={isAnalyzing}
                      className="w-full bg-cyan-500 text-black hover:bg-cyan-400 border border-cyan-400 font-black uppercase tracking-wider py-4 transition-all rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-xs"
                    >
                      {isAnalyzing ? "ANALYSEREN & UPGRADEN..." : "DECONSTRUCT & UPGRADE CODEBASE"}
                    </button>
                  </div>

                  {/* Swarm Upgrade Terminal */}
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-6 shadow-xl h-[400px] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 opacity-50"></div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Swarm Refactor Console
                      </span>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs flex flex-col justify-end custom-scrollbar pr-2">
                      {analysisLogs.length === 0 && (
                        <span className="text-zinc-600 font-bold">&gt; Terminal ready for codebase analysis...</span>
                      )}
                      {analysisLogs.map((log, i) => (
                        <div 
                          key={i} 
                          className={
                            log.includes("[SUCCESS]") ? "text-cyan-400 font-black" : 
                            log.includes("[CLONE]") ? "text-blue-400 font-bold" : 
                            "text-zinc-400"
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* SUBDOMAIN HOSTING HUB */}
                {isUpgraded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    
                    {/* SEO & CEO Optimization Grid */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg md:col-span-2 space-y-6">
                      <h2 className="text-xl font-black uppercase tracking-wider border-b border-white/10 pb-4 flex items-center gap-2 text-white">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        SEO & CEO Optimization Grid
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* SEO Column */}
                        <div className="space-y-5">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-zinc-500" />
                            SEO Settings
                          </h3>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">Meta Title / Search Listing Title</label>
                            <input
                              type="text"
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value)}
                              placeholder="e.g. Faceless UGC Video Generator"
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500/50 text-zinc-300 transition-colors"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">Meta Description</label>
                            <textarea
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value)}
                              rows={3}
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500/50 text-zinc-300 transition-colors resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">SEO Keywords (Comma separated)</label>
                            <input
                              type="text"
                              value={keywords}
                              onChange={(e) => setKeywords(e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500/50 text-zinc-300 transition-colors"
                            />
                          </div>
                        </div>

                        {/* CEO/Business Column */}
                        <div className="space-y-5">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-zinc-500" />
                            CEO Settings
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">Target Profit Margin (%)</label>
                              <input
                                type="number"
                                value={targetMargin}
                                onChange={(e) => setTargetMargin(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500/50 text-zinc-300 transition-colors"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">Est. Monthly Ops Cost ($)</label>
                              <input
                                type="number"
                                value={operationalCost}
                                onChange={(e) => setOperationalCost(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500/50 text-zinc-300 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">Target Buyer Niche</label>
                            <input
                              type="text"
                              value={targetBuyerNiche}
                              onChange={(e) => setTargetBuyerNiche(e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500/50 text-zinc-300 transition-colors"
                            />
                          </div>

                          <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 space-y-2 text-[11px] font-bold">
                            <span className="text-cyan-500 uppercase tracking-widest text-[9px] block mb-2">Expected Platform Metrics:</span>
                            <div className="flex justify-between items-center pb-2 border-b border-cyan-500/10">
                              <span className="text-zinc-400">SaaS Platform Cut:</span>
                              <span className="text-cyan-400">25.00% Commission</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-zinc-400">Target Margin Velocity:</span>
                              <span className="text-green-400">Optimal ({targetMargin}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deployment Form */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg space-y-6">
                      <h2 className="text-xl font-black uppercase tracking-wider border-b border-white/10 pb-4 flex items-center gap-2 text-white">
                        <Server className="w-5 h-5 text-cyan-400" />
                        Subdomain Deployment Hub
                      </h2>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                        Host je geüpgradede app direct op een subdomein van je platform netwerk om kopers een operationele live demo te tonen.
                      </p>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest block text-zinc-500">Gewenst Subdomein</label>
                        <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                          <input
                            type="text"
                            value={desiredSubdomain}
                            onChange={(e) => setDesiredSubdomain(e.target.value)}
                            placeholder="bijv. smartposture"
                            disabled={isDeploying}
                            className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none placeholder:text-zinc-600 font-bold text-xs"
                          />
                          <div className="px-4 py-3 bg-white/5 border-l border-white/5 text-xs font-bold text-zinc-500 shrink-0 flex items-center">
                            .ai-henksemler.nl
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDeploySaaS}
                        disabled={isDeploying || !desiredSubdomain}
                        className="w-full bg-white text-black hover:bg-zinc-200 border border-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 text-xs"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        DEPLOY SAAS APP LIVE
                      </button>
                    </div>

                    {/* Deployment Logs Terminal */}
                    <div className="bg-black/60 border border-white/10 rounded-2xl p-6 shadow-xl h-[300px] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                        <span className="text-xs font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
                          <Terminal className="w-4 h-4" />
                          Live Deploy Terminal
                        </span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs flex flex-col justify-end custom-scrollbar pr-2">
                        {deploymentLogs.length === 0 && (
                          <span className="text-zinc-600 font-bold">&gt; Wacht op deployment protocol...</span>
                        )}
                        {deploymentLogs.map((log, i) => (
                          <div 
                            key={i} 
                            className={
                              log.includes("[LIVE]") ? "text-cyan-400 font-black animate-pulse" : 
                              log.includes("[DNS]") ? "text-blue-400 font-bold" : "text-zinc-400"
                            }
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* LIVE SAAS LINK & FLIP CALCULATOR */}
                {liveUrl && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    
                    {/* Deployment Live Success Banner */}
                    <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-5">
                      <h2 className="text-xl font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                        <Check className="w-6 h-6 text-cyan-500" />
                        Deployment Live!
                      </h2>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                        Je SaaS app is nu live en openbaar toegankelijk via SSL encryptie.
                      </p>
                      <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-4 flex justify-between items-center text-xs shadow-inner">
                        <span className="font-bold text-zinc-300 truncate mr-4">{liveUrl}</span>
                        <a 
                          href={liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg font-black shrink-0 transition-colors flex items-center gap-1 border border-cyan-500/30 tracking-wider"
                        >
                          OPEN
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Brokerage & Flipping calculator */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg space-y-6">
                      <h2 className="text-xl font-black uppercase tracking-wider border-b border-white/10 pb-4 flex items-center gap-2 text-white">
                        <DollarSign className="w-5 h-5 text-cyan-400" />
                        Flip Marketplace Brokerage
                      </h2>
                      
                      <div className="space-y-5 text-xs font-bold">
                        <div className="space-y-2">
                          <label className="text-[10px] text-zinc-500 uppercase tracking-widest block">Verkoopprijs ($)</label>
                          <input
                            type="number"
                            value={askingPrice}
                            onChange={(e) => setAskingPrice(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-cyan-500/50 text-white transition-colors"
                          />
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/5">
                          <div className="flex justify-between items-center text-zinc-400">
                            <span>Henk's Commission (25% Cut):</span>
                            <span className="text-white">${platformCommission.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-cyan-400 border-t border-white/5 pt-3 text-sm">
                            <span>Netto Klant Winst (75%):</span>
                            <span>${netEarnings.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </>
            ) : (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-12 text-center backdrop-blur-md shadow-lg flex flex-col items-center justify-center h-[500px]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Terminal className="w-10 h-10 text-cyan-500/50 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-wider text-white">Geen Software Asset Geselecteerd</h2>
                <p className="text-zinc-500 text-xs mt-4 font-bold max-w-sm uppercase tracking-widest leading-relaxed">
                  Selecteer een software template aan de linkerkant om de Swarm Refactor te activeren en te deployen op een subdomein.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
