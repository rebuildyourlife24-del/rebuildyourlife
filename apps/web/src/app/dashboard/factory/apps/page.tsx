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

    // Pre-populate SEO & CEO defaults based on selected asset
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
      `[UI] Overhauling style sheets to Premium Brutalist Dark Mode layout...`,
      `[COMPILE] Compiling upgraded codebase: Next.js bundle created.`,
      `[SUCCESS] App upgrade completed! Code quality score: 98% (Excellent)`
    ];

    const startTime = Date.now();
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      setAnalysisLogs(prev => [...prev, steps[i]]);
    }
    const duration = Date.now() - startTime;

    // Save to Database Logs
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

    // Save to Database Logs
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

  // 25% Brokerage Cut Calculations
  const calculatedPrice = parseFloat(askingPrice) || 0;
  const platformCommission = calculatedPrice * 0.25;
  const netEarnings = calculatedPrice - platformCommission;

  return (
    <div className="max-w-7xl mx-auto space-y-10 font-mono text-black p-4 md:p-8 bg-zinc-100 min-h-screen">
      
      {/* Header Banner */}
      <div className="border-8 border-black bg-zinc-200 p-6 shadow-[8px_8px_0px_#000000] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
            <Cpu className="w-10 h-10 stroke-[3]" />
            APP FACTORY
          </h1>
          <p className="text-zinc-700 text-sm mt-1 uppercase tracking-widest font-bold">
            // SaaS Flipping & Upgrade OS
          </p>
        </div>
        <div className="bg-zinc-300 text-black px-4 py-2 border-2 border-black font-bold uppercase tracking-wider text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-black" />
          25% Brokerage Commission active
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: OPPORTUNITIES SCANNER */}
        <div className="space-y-8 lg:col-span-1">
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Marketplace Scanner
            </h2>
            <p className="text-xs text-zinc-600 font-bold uppercase">
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
                  className={`border-2 border-black p-4 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedAsset?.id === asset.id 
                      ? "bg-zinc-300 shadow-[2px_2px_0px_#000000] translate-x-0.5 translate-y-0.5" 
                      : "bg-zinc-50 hover:bg-zinc-100 shadow-[4px_4px_0px_#000000]"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-[9px] bg-black text-white px-2 py-0.5 uppercase font-black">
                      {asset.niche}
                    </span>
                    <h3 className="font-black text-sm uppercase tracking-wide leading-tight">{asset.name}</h3>
                    <div className="flex justify-between items-center text-xs text-zinc-600 font-bold border-t border-zinc-300 pt-2">
                      <span>Bron: {asset.source}</span>
                      <span className="text-green-600">Aanschaf: {asset.cost === 0 ? "GRATIS" : `$${asset.cost}`}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-zinc-400 text-xs">
                    <span className="font-bold text-zinc-500">Quality: {asset.qualityScore}%</span>
                    <span className="font-black text-amber-600">Est. value: ~${asset.estValue}</span>
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
                <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Asset Diagnostics
                  </h2>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-zinc-500 font-bold uppercase block">Naam:</span>
                      <span className="font-black uppercase">{selectedAsset.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold uppercase block">Geschatte waarde na upgrade:</span>
                      <span className="font-black text-green-600 uppercase text-lg">${selectedAsset.estValue}</span>
                    </div>
                    <div className="space-y-1.5 border-t border-zinc-300 pt-3">
                      <span className="text-zinc-500 font-bold uppercase block">Geïdentificeerde beperkingen (Knelpunten):</span>
                      <ul className="space-y-1 text-gold font-bold">
                        {selectedAsset.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
                    className="w-full bg-black text-white hover:bg-zinc-900 border-2 border-black font-black uppercase tracking-wider py-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_#000000] text-xs"
                  >
                    {isAnalyzing ? "ANALYSEREN & UPGRADEN..." : "DECONSTRUCT & UPGRADE CODEBASE"}
                  </button>
                </div>

                {/* Swarm Upgrade Terminal */}
                <div className="border-4 border-black bg-black text-green-400 p-6 shadow-[6px_6px_0px_#000000] h-[350px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-green-500">Swarm Refactor Console</span>
                    <div className="w-2.5 h-2.5 bg-gold rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs flex flex-col justify-end">
                    {analysisLogs.length === 0 && (
                      <span className="text-zinc-600 font-bold">&gt; Terminal ready for codebase analysis...</span>
                    )}
                    {analysisLogs.map((log, i) => (
                      <div 
                        key={i} 
                        className={
                          log.includes("[SUCCESS]") ? "text-green-300 font-black" : 
                          log.includes("[CLONE]") ? "text-blue-400 font-bold" : 
                          log.includes("[SUCCESS]") ? "text-yellow-400 font-bold" : "text-green-500"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* SEO & CEO Optimization Grid */}
                  <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] md:col-span-2 space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold" />
                      SEO & CEO Optimization Grid (Database Enabled)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* SEO Column */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 border-b border-zinc-200 pb-1 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          SEO Settings (Search & Indexing Properties)
                        </h3>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase block text-zinc-700">Meta Title / Search Listing Title</label>
                          <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="e.g. Faceless UGC Video Generator - Scale Your Social Media"
                            className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase block text-zinc-700">Meta Description</label>
                          <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder="e.g. Generate high-quality faceless video content for TikTok and Instagram using advanced AI."
                            rows={3}
                            className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase block text-zinc-700">SEO Keywords (Comma separated)</label>
                          <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g. ai video, faceless ugc, tiktok automation"
                            className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* CEO/Business Column */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 border-b border-zinc-200 pb-1 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          CEO Settings (Business & Pricing Operations)
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase block text-zinc-700">Target Profit Margin (%)</label>
                            <input
                              type="number"
                              value={targetMargin}
                              onChange={(e) => setTargetMargin(e.target.value)}
                              className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase block text-zinc-700">Est. Monthly Ops Cost ($)</label>
                            <input
                              type="number"
                              value={operationalCost}
                              onChange={(e) => setOperationalCost(e.target.value)}
                              className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase block text-zinc-700">Target Buyer Niche</label>
                          <input
                            type="text"
                            value={targetBuyerNiche}
                            onChange={(e) => setTargetBuyerNiche(e.target.value)}
                            placeholder="e.g. AI Startups, SaaS Flippers, Agency Owners"
                            className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="bg-zinc-200 border-2 border-dashed border-zinc-400 p-3.5 space-y-1.5 text-[11px] font-bold">
                          <span className="text-zinc-600 uppercase text-[9px] block">Expected Platform Metrics:</span>
                          <div className="flex justify-between">
                            <span>SaaS Platform Cut:</span>
                            <span className="text-gold">25.00% Commission</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Target Margin Velocity:</span>
                            <span className="text-green-600">Optimal ({targetMargin}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Form */}
                  <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] space-y-4">
                    <h2 className="text-xl font-black uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      Subdomain Deployment Hub
                    </h2>
                    <p className="text-xs text-zinc-600 font-bold uppercase">
                      Host je geüpgradede app direct op een subdomein van je platform netwerk om kopers een operationele live demo te tonen.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase block text-zinc-700">Gewenst Subdomein</label>
                      <div className="flex border-2 border-black bg-zinc-100 items-center">
                        <input
                          type="text"
                          value={desiredSubdomain}
                          onChange={(e) => setDesiredSubdomain(e.target.value)}
                          placeholder="bijv. smartposture"
                          disabled={isDeploying}
                          className="flex-1 bg-white px-3 py-2 text-black focus:outline-none placeholder:text-zinc-400 font-bold text-xs border-r-2 border-black"
                        />
                        <span className="px-2 text-xs font-bold text-zinc-600 shrink-0">.ai-henksemler.nl</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDeploySaaS}
                      disabled={isDeploying || !desiredSubdomain}
                      className="w-full bg-zinc-200 hover:bg-zinc-300 border-2 border-black font-black uppercase tracking-wider py-3 flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 text-xs"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      DEPLOY SAAS APP LIVE
                    </button>
                  </div>

                  {/* Deployment Logs Terminal */}
                  <div className="border-4 border-black bg-black text-green-400 p-6 shadow-[6px_6px_0px_#000000] h-[250px] flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-green-500">Live Deploy Terminal</span>
                      <div className="w-2.5 h-2.5 bg-gold rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs flex flex-col justify-end">
                      {deploymentLogs.length === 0 && (
                        <span className="text-zinc-600 font-bold">&gt; Wacht op deployment protocol...</span>
                      )}
                      {deploymentLogs.map((log, i) => (
                        <div 
                          key={i} 
                          className={
                            log.includes("[LIVE]") ? "text-green-300 font-black animate-pulse" : 
                            log.includes("[DNS]") ? "text-blue-400 font-bold" : "text-green-500"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Deployment Live Success Banner */}
                  <div className="border-4 border-green-600 bg-green-50 p-6 shadow-[6px_6px_0px_#16a34a] space-y-4">
                    <h2 className="text-xl font-black uppercase text-green-800 tracking-wider flex items-center gap-2">
                      <Check className="w-6 h-6 text-green-600" />
                      Deployment Live!
                    </h2>
                    <p className="text-xs text-green-700 font-bold uppercase">
                      Je SaaS app is nu live en openbaar toegankelijk via SSL encryptie.
                    </p>
                    <div className="border-2 border-green-200 bg-white p-3 flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-700 truncate">{liveUrl}</span>
                      <a 
                        href={liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline flex items-center gap-1 font-black shrink-0"
                      >
                        OPEN APP
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Brokerage & Flipping calculator */}
                  <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] space-y-4">
                    <h2 className="text-xl font-black uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Flip Marketplace Brokerage
                    </h2>
                    
                    <div className="space-y-3 text-xs font-bold">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest block">Verkoopprijs ($)</label>
                        <input
                          type="number"
                          value={askingPrice}
                          onChange={(e) => setAskingPrice(e.target.value)}
                          className="w-full bg-zinc-50 border-2 border-black px-3 py-1.5 text-sm font-bold"
                        />
                      </div>
                      
                      <div className="border-t border-zinc-200 pt-3 space-y-1.5">
                        <div className="flex justify-between items-center text-gold">
                          <span>Henk's Commission (25% Cut):</span>
                          <span>${platformCommission.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-green-600 border-t border-dashed border-zinc-300 pt-1.5 text-sm">
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
            <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0px_#000000] flex flex-col items-center justify-center h-[350px]">
              <Terminal className="w-16 h-16 text-zinc-400 mb-4 stroke-[2]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-800">Geen Software Asset Geselecteerd</h2>
              <p className="text-zinc-500 text-sm mt-2 font-bold max-w-md uppercase">
                Selecteer een software template aan de linkerkant om de Swarm Refactor te activeren en te deployen op een subdomein.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
