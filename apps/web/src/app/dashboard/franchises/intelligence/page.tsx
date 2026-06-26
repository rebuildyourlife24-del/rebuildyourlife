"use client";

import { useState, useEffect } from "react";
import { 
  getSuppliersAction, 
  compareSupplierPricesAction, 
  getProfitOptimizationLogsAction, 
  runPriceOptimizerAction,
  seedSupplierIntelligenceAction 
} from "@/actions/supplier";
import { getFranchises } from "@/actions/franchise";
import { 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Layers, 
  Activity, 
  RefreshCw, 
  Truck, 
  Percent, 
  BarChart3, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function SupplierIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState<"suppliers" | "comparison" | "pricing">("suppliers");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [comparison, setComparison] = useState<Record<string, any[]>>({});
  const [profitLogs, setProfitLogs] = useState<any[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [optimizingSku, setOptimizingSku] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const fRes = await getFranchises();
      setFranchises(fRes || []);

      const supRes = await getSuppliersAction();
      if (supRes.success && supRes.data) {
        setSuppliers(supRes.data);
      }

      const compRes = await compareSupplierPricesAction();
      if (compRes.success && compRes.data) {
        setComparison(compRes.data);
      }

      const logsRes = await getProfitOptimizationLogsAction();
      if (logsRes.success && logsRes.data) {
        setProfitLogs(logsRes.data);
      }
    } catch (err) {
      console.error("Error loading intelligence data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedSupplierIntelligenceAction();
      if (res.success) {
        setSeedResult("SUCCESS: Leveranciers en producten succesvol geïnitialiseerd!");
        await loadData();
      } else {
        setSeedResult(`ERROR: ${res.error}`);
      }
    } catch (err: any) {
      setSeedResult(`ERROR: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  }

  async function triggerOptimizer(sku: string, currentPrice: number) {
    setOptimizingSku(sku);
    try {
      const res = await runPriceOptimizerAction(sku, currentPrice);
      if (res.success && res.data) {
        await loadData();
        alert(`DYNAMIC PRICING ENGINE: Optimalisatie voltooid voor ${sku}. Nieuwe voorgestelde prijs: €${res.data.optimizedPrice.toFixed(2)} (Velocity: ${res.data.salesVelocity.toFixed(2)}/dag, Elasticiteit: ${res.data.elasticity.toFixed(2)})`);
      } else {
        alert(`FOUT: Kon optimizer niet draaien: ${res.error || 'Geen data geretourneerd'}`);
      }
    } catch (err: any) {
      alert(`FOUT: ${err.message}`);
    } finally {
      setOptimizingSku(null);
    }
  }

  const getDailyProfitData = () => {
    const dailyData: Record<string, number> = {};
    
    profitLogs.forEach(log => {
      const dateStr = new Date(log.createdAt).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit" });
      const totalProfitForLog = log.profitMargin * log.salesVelocity;
      dailyData[dateStr] = (dailyData[dateStr] || 0) + totalProfitForLog;
    });

    return Object.entries(dailyData)
      .map(([date, profit]) => ({ date, profit }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split("-").map(Number);
        const [dayB, monthB] = b.date.split("-").map(Number);
        return monthA === monthB ? dayA - dayB : monthA - monthB;
      });
  };

  const chartData = getDailyProfitData();
  const maxProfit = chartData.length > 0 ? Math.max(...chartData.map(d => d.profit)) : 100;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.1)] backdrop-blur-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-500/30 w-fit mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                SYSTEM ACTIVE: AI OPTIMIZER & FRANCHISE ENGINE v4.2
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                SUPPLIER INTELLIGENCE & PROFIT OPTIMIZER
              </h1>
              <p className="text-xs md:text-sm font-bold mt-2 text-zinc-500 uppercase tracking-widest">
                Winstmaximalisatie via Dynamic Pricing, Prijselasticiteit en Weighted Leverancier Selectie.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/dashboard/franchises"
                className="bg-black/50 text-white border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-xl px-5 py-2.5 text-xs font-black uppercase flex items-center gap-2 transition-all shadow-lg"
              >
                <ExternalLink className="w-4 h-4 text-cyan-500" /> Live Simulator
              </Link>
              <button
                onClick={loadData}
                className="bg-white text-black border border-white hover:bg-zinc-200 rounded-xl px-5 py-2.5 text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* No Data State / Seed Banner */}
        {suppliers.length === 0 && !loading && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.1)] mb-8">
            <h3 className="text-lg font-black uppercase flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert className="w-5 h-5" /> Leveranciersdata Ontbreekt!
            </h3>
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-widest">
              Om de betrouwbaarheid, prijsvergelijkingen en dynamische pricing te demonstreren, moeten we mock leveranciers en product logs genereren.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="mt-6 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50 rounded-xl font-black uppercase px-6 py-3 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Database className="w-4 h-4" /> {seeding ? "INITIALISEREN..." : "SEED SUPPLIER INTELLIGENCE DATA"}
            </button>
            {seedResult && (
              <div className="mt-4 text-xs font-black uppercase bg-black/60 text-white p-3 rounded-lg border border-red-500/20">
                {seedResult}
              </div>
            )}
          </div>
        )}

        {/* Stats Quick Grid */}
        {suppliers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-lg group hover:border-white/10 transition-colors">
              <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-cyan-500" /> Gekoppelde Leveranciers
              </div>
              <div className="text-3xl font-black uppercase text-white">{suppliers.length} Partners</div>
              <div className="text-[10px] text-zinc-400 mt-2 uppercase font-bold">Met actieve productfeeds</div>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-lg group hover:border-white/10 transition-colors">
              <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-cyan-500" /> Gem. Levertijd
              </div>
              <div className="text-3xl font-black uppercase text-white">
                {(suppliers.reduce((acc, s) => acc + s.avgDeliveryTime, 0) / suppliers.length).toFixed(1)} Dagen
              </div>
              <div className="text-[10px] text-cyan-400 mt-2 uppercase font-bold">Auto-routeert naar snelste</div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-lg group hover:border-white/10 transition-colors">
              <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-cyan-500" /> Succesratio Orders
              </div>
              <div className="text-3xl font-black uppercase text-white">
                {(suppliers.reduce((acc, s) => acc + s.successRate, 0) / suppliers.length * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-zinc-400 mt-2 uppercase font-bold">Gebaseerd op simulated orders</div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-lg group hover:border-white/10 transition-colors">
              <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" /> Optimalisatie Marge
              </div>
              <div className="text-3xl font-black text-cyan-400 uppercase">
                +{(profitLogs.reduce((acc, l) => acc + l.profitMargin, 0) / (profitLogs.length || 1)).toFixed(1)}%
              </div>
              <div className="text-[10px] text-zinc-400 mt-2 uppercase font-bold">Winst maximalisatie loop</div>
            </div>
          </div>
        )}

        {/* Tab Navigatie */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-6 py-4 text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
              activeTab === "suppliers"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            1. Leveranciers & Betrouwbaarheid
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-6 py-4 text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
              activeTab === "comparison"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            2. Prijsvergelijkings Matrix
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-6 py-4 text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
              activeTab === "pricing"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            3. Dynamic Pricing & Winstlijn
          </button>
        </div>

        {loading ? (
          <div className="bg-black/40 border border-white/5 rounded-2xl p-12 text-center backdrop-blur-md shadow-lg flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-500 mb-6" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">DATA INTELLIGENCE FEED LOADING...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* TAB 1: SUPPLIERS & RELIABILITY */}
            {activeTab === "suppliers" && (
              <div className="space-y-6">
                {suppliers.map(sup => (
                  <div 
                    key={sup.id} 
                    className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Leverancier Info */}
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wider text-white border-b border-white/10 pb-4 mb-4">
                        {sup.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mb-6 font-bold tracking-widest uppercase">Email: {sup.contactEmail || "N/A"}</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs uppercase">
                          <span className="font-black tracking-widest text-zinc-500">Betrouwbaarheidsscore:</span>
                          <span className={`font-black px-2.5 py-1 text-[10px] rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30`}>
                            {(sup.reliabilityScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs uppercase">
                          <span className="font-black tracking-widest text-zinc-500">Gemiddelde Levertijd:</span>
                          <span className="font-black text-white">{sup.avgDeliveryTime.toFixed(1)} Dagen</span>
                        </div>
                        <div className="flex justify-between items-center text-xs uppercase">
                          <span className="font-black tracking-widest text-zinc-500">Order Succesratio:</span>
                          <span className="font-black text-white">{(sup.successRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs uppercase">
                          <span className="font-black tracking-widest text-zinc-500">Leverancier Rating:</span>
                          <span className="font-black text-cyan-500 flex items-center gap-1">
                            {"★".repeat(Math.round(sup.rating)) || "N/A"} <span className="text-zinc-500 ml-1">({sup.rating})</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assortiment & Prijzen van deze Leverancier */}
                    <div className="border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8 pt-6 lg:pt-0">
                      <h4 className="text-[10px] font-black uppercase text-cyan-500 mb-4 tracking-widest">
                        PRODUCT FEED & INKOOPPRIJZEN
                      </h4>
                      <div className="space-y-3">
                        {sup.products.map((prod: any) => (
                          <div key={prod.id} className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs hover:border-white/10 transition-colors">
                            <div>
                              <div className="font-black text-white uppercase tracking-wide mb-1">{prod.name}</div>
                              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">SKU: {prod.sku} | Voorraad: {prod.stock}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-white text-sm">€{prod.costPrice.toFixed(2)}</div>
                              <div className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">SRP: €{prod.suggestedRetailPrice?.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recente Order Logs (Simulatie resultaten) */}
                    <div className="border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8 pt-6 lg:pt-0">
                      <h4 className="text-[10px] font-black uppercase text-cyan-500 mb-4 tracking-widest">
                        Fulfillment Logs (Laatste 5 orders)
                      </h4>
                      <div className="space-y-2">
                        {sup.orderLogs && sup.orderLogs.length > 0 ? (
                          sup.orderLogs.slice(0, 5).map((log: any) => (
                            <div 
                              key={log.id} 
                              className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex justify-between items-center ${
                                log.success 
                                  ? "bg-cyan-950/20 border-cyan-500/20 text-zinc-300" 
                                  : "bg-red-950/20 border-red-500/20 text-red-400"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {log.success ? (
                                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                )}
                                <span>Order: {log.orderId.substring(0, 8)}...</span>
                              </div>
                              <div>
                                {log.success ? (
                                  <span className="text-zinc-400">{log.deliveryTime?.toFixed(1)} dagen</span>
                                ) : (
                                  <span className="text-red-400">Mislukt</span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-zinc-500 text-xs font-bold bg-black/50 p-6 rounded-xl border border-dashed border-white/10 uppercase tracking-widest text-center leading-relaxed">
                            Nog geen orders gesimuleerd voor deze leverancier. Ga naar de simulator om transacties te starten.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: PRICE COMPARATIVE MATRIX */}
            {activeTab === "comparison" && (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg overflow-hidden">
                <h3 className="text-xl font-black uppercase tracking-wider mb-6 border-b border-white/10 pb-4 text-white">
                  VERGELIJKINGS-MATRIX LEVERANCIERS (INKOOPPRIJZEN)
                </h3>
                
                <div className="overflow-x-auto custom-scrollbar pb-4">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-500">
                        <th className="py-4 px-4">Product Naam / SKU</th>
                        {suppliers.map(s => (
                          <th key={s.id} className="py-4 px-4 text-center border-l border-white/5">
                            <div className="text-zinc-300 mb-1">{s.name}</div>
                            <div className="text-[9px] text-cyan-500">
                              Score: {(s.reliabilityScore * 100).toFixed(0)}%
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(comparison).map(([sku, prods]) => {
                        const firstProd = prods[0];
                        const minCost = Math.min(...prods.map(p => p.costPrice));

                        return (
                          <tr key={sku} className="border-b border-white/5 hover:bg-white/5 text-xs transition-colors">
                            <td className="py-5 px-4 font-bold">
                              <span className="text-white block font-black uppercase text-sm mb-1">{firstProd.name}</span>
                              <span className="text-zinc-500 text-[10px] uppercase tracking-widest">SKU: {sku}</span>
                            </td>
                            {suppliers.map(sup => {
                              const supProd = prods.find(p => p.supplierId === sup.id);
                              if (!supProd) {
                                return <td key={sup.id} className="py-5 px-4 text-center text-zinc-700 font-bold uppercase tracking-widest border-l border-white/5">[Niet Leverbaar]</td>;
                              }
                              
                              const isCheapest = supProd.costPrice === minCost;
                              const weightedScore = supProd.costPrice / Math.pow(Math.max(0.1, sup.reliabilityScore), 1.5);
                              const allWeightedScores = prods.map(p => {
                                const s = suppliers.find(su => su.id === p.supplierId);
                                return p.costPrice / Math.pow(Math.max(0.1, s?.reliabilityScore || 0.5), 1.5);
                              });
                              const isBestWeighted = weightedScore === Math.min(...allWeightedScores);

                              return (
                                <td key={sup.id} className={`py-5 px-4 text-center border-l border-white/5 transition-colors ${
                                  isBestWeighted ? "bg-cyan-950/20" : ""
                                }`}>
                                  <div className={`text-sm font-black ${isBestWeighted ? "text-cyan-400" : "text-zinc-300"}`}>
                                    €{supProd.costPrice.toFixed(2)}
                                  </div>
                                  
                                  <div className="mt-3 flex flex-col items-center gap-2">
                                    {isCheapest && (
                                      <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                                        GOEDKOOPSTE
                                      </span>
                                    )}
                                    {isBestWeighted && (
                                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                                        BEST WEIGHED
                                      </span>
                                    )}
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                      Stock: {supProd.stock}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 border-t border-white/10 pt-6 text-[10px] font-bold text-zinc-400 leading-relaxed uppercase tracking-widest">
                  <span className="font-black text-cyan-500">[INFO]:</span> De <strong>Best Weighed</strong> leverancier wordt door de order-simulator geselecteerd. 
                  De score wordt berekend door de inkoopprijs te wegen tegen de betrouwbaarheid van de leverancier: 
                  <code className="bg-black/50 text-cyan-400 border border-white/10 px-2 py-1 rounded ml-2">Inkooprijs / (Betrouwbaarheid ^ 1.5)</code>.
                </div>
              </div>
            )}

            {/* TAB 3: DYNAMIC PRICING & PROFIT OPTIMIZATION */}
            {activeTab === "pricing" && (
              <div className="space-y-8">
                
                {/* Winstlijn Grafiek */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
                  <h3 className="text-xl font-black uppercase tracking-wider mb-8 border-b border-white/10 pb-4 flex items-center gap-3 text-white">
                    <TrendingUp className="w-6 h-6 text-cyan-500" />
                    STIJGENDE WINSTLIJN: OPTIMALISATIE HISTORIE
                  </h3>
                  
                  {chartData.length > 0 ? (
                    <div>
                      <div className="w-full bg-black/60 border border-white/10 rounded-xl p-6 mb-4 shadow-inner">
                        <svg viewBox="0 0 800 300" className="w-full h-auto">
                          {/* Grid Lines */}
                          <line x1="50" y1="50" x2="750" y2="50" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                          <line x1="50" y1="125" x2="750" y2="125" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                          <line x1="50" y1="200" x2="750" y2="200" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                          <line x1="50" y1="250" x2="750" y2="250" stroke="#374151" strokeWidth="2" /> {/* Baseline */}

                          {/* Y-As Labels */}
                          <text x="10" y="55" fill="#6b7280" fontSize="10" className="font-sans font-bold">€{maxProfit.toFixed(0)}</text>
                          <text x="10" y="130" fill="#6b7280" fontSize="10" className="font-sans font-bold">€{(maxProfit * 0.6).toFixed(0)}</text>
                          <text x="10" y="205" fill="#6b7280" fontSize="10" className="font-sans font-bold">€{(maxProfit * 0.3).toFixed(0)}</text>
                          <text x="10" y="255" fill="#6b7280" fontSize="10" className="font-sans font-bold">€0</text>

                          {/* Bar chart elements */}
                          {chartData.map((d, index) => {
                            const x = 50 + index * (700 / (chartData.length || 1));
                            const height = (d.profit / maxProfit) * 200; 
                            const y = 250 - height;
                            const barWidth = Math.max(10, (700 / chartData.length) - 15);

                            return (
                              <g key={index} className="group cursor-pointer">
                                <rect 
                                  x={x} 
                                  y={y} 
                                  width={barWidth} 
                                  height={height} 
                                  fill={index === chartData.length - 1 ? "#06b6d4" : "#22d3ee"} 
                                  opacity={index === chartData.length - 1 ? "1" : "0.3"}
                                  rx="4"
                                  ry="4"
                                  className="transition-all duration-300 group-hover:opacity-100"
                                />
                                
                                <text 
                                  x={x + barWidth/2} 
                                  y={y - 12} 
                                  fill="#22d3ee" 
                                  fontSize="10" 
                                  textAnchor="middle" 
                                  className="opacity-0 group-hover:opacity-100 font-sans font-bold transition-all"
                                >
                                  €{d.profit.toFixed(0)}
                                </text>

                                {index % 2 === 0 && (
                                  <text 
                                    x={x + barWidth/2} 
                                    y="275" 
                                    fill="#6b7280" 
                                    fontSize="9" 
                                    textAnchor="middle" 
                                    className="font-sans font-bold uppercase tracking-widest"
                                  >
                                    {d.date}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-black px-4 tracking-widest">
                        <span>Stikstof V1 Start (Dag 1)</span>
                        <span className="text-cyan-500">AI Dynamic Pricing Live (Dag 15)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-500 text-xs font-bold tracking-widest bg-black/50 p-12 rounded-xl border border-dashed border-white/10 text-center uppercase leading-relaxed">
                      Geen optimalisatie logs beschikbaar. Klik op "Seeden" of voer orders uit om logs te genereren.
                    </div>
                  )}
                </div>

                {/* Dynamic Pricing Console */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
                  <h3 className="text-xl font-black uppercase tracking-wider mb-6 border-b border-white/10 pb-4 flex items-center gap-3 text-white">
                    <Activity className="w-6 h-6 text-cyan-500" />
                    DYNAMIC PRICING ENGINE CONTROLS
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    {Object.entries(comparison).map(([sku, prods]) => {
                      const firstProd = prods[0];
                      const minCost = Math.min(...prods.map(p => p.costPrice));
                      const skuLogs = profitLogs.filter(l => l.sku === sku);
                      const lastLog = skuLogs[skuLogs.length - 1];

                      const currentPrice = lastLog ? lastLog.sellingPrice : (firstProd.suggestedRetailPrice || 89.00);
                      const currentVelocity = lastLog ? lastLog.salesVelocity : 0.0;
                      const currentElasticity = lastLog ? lastLog.elasticity : -1.5;
                      const optimizedSuggestedPrice = lastLog ? lastLog.optimizedPrice : currentPrice;

                      return (
                        <div key={sku} className="bg-black/60 p-6 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-inner hover:border-white/10 transition-colors">
                          <div className="space-y-4 w-full md:w-auto flex-1">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-zinc-400 px-3 py-1.5 rounded-full w-fit mb-3 block">
                                SKU: {sku}
                              </span>
                              <h4 className="text-lg font-black uppercase text-white tracking-wide">{firstProd.name}</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 border-t border-white/5">
                              <div>
                                <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Laagste Inkoop</div>
                                <div className="text-sm font-black text-white">€{minCost.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Huidige Prijs</div>
                                <div className="text-sm font-black text-white">€{currentPrice.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Sales Velocity</div>
                                <div className="text-sm font-black text-zinc-400">
                                  {currentVelocity > 0 ? `${currentVelocity.toFixed(1)} / dag` : "Geen data"}
                                </div>
                              </div>
                              <div>
                                <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Elasticiteit (E)</div>
                                <div className="text-sm font-black text-zinc-400">
                                  {currentElasticity.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end gap-5 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-6 md:pt-0 pl-0 md:pl-8 lg:border-l">
                            <div className="text-left md:text-right">
                              <div className="text-[9px] text-cyan-400 uppercase font-black tracking-widest flex items-center gap-1.5 md:justify-end mb-1">
                                <TrendingUp className="w-3.5 h-3.5" /> AANBEVOLEN OPTIMALISATIE
                              </div>
                              <div className="text-3xl font-black text-white">
                                €{optimizedSuggestedPrice.toFixed(2)}
                              </div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-2">
                                Marge: <span className="text-green-400">€{(optimizedSuggestedPrice - minCost).toFixed(2)}</span> (+{(((optimizedSuggestedPrice - minCost) / minCost) * 100).toFixed(0)}%)
                              </div>
                            </div>
                            <button
                              onClick={() => triggerOptimizer(sku, currentPrice)}
                              disabled={optimizingSku === sku}
                              className="w-full md:w-auto bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-lg border border-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${optimizingSku === sku ? "animate-spin" : ""}`} />
                              {optimizingSku === sku ? "RE-CALCULATING..." : "RUN OPTIMIZER ENGINE"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
