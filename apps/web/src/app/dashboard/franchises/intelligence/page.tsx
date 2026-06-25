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
        // Herlaad gegevens om de update te zien
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

  // Bereken totale winstontwikkeling per dag voor de grafiek
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
        // Sorteer op datum
        const [dayA, monthA] = a.date.split("-").map(Number);
        const [dayB, monthB] = b.date.split("-").map(Number);
        return monthA === monthB ? dayA - dayB : monthA - monthB;
      });
  };

  const chartData = getDailyProfitData();
  const maxProfit = chartData.length > 0 ? Math.max(...chartData.map(d => d.profit)) : 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-mono">
      
      {/* Brutalistische Platinum / Monochrome Header */}
      <div className="border-4 border-white bg-white text-black p-6 md:p-8 shadow-[8px_8px_0px_#71717a] mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase bg-black text-white px-2 py-1 w-fit mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse text-green-400" />
              SYSTEM ACTIVE: AI OPTIMIZER & FRANCHISE ENGINE v4.2
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              SUPPLIER INTELLIGENCE & PROFIT OPTIMIZER
            </h1>
            <p className="text-xs md:text-sm font-bold mt-2 opacity-80 uppercase">
              Winstmaximalisatie via Dynamic Pricing, Prijselasticiteit en Weighted Leverancier Selectie.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/dashboard/franchises"
              className="bg-black text-white border-2 border-black hover:bg-zinc-800 hover:text-white px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-[4px_4px_0px_#71717a]"
            >
              <ExternalLink className="w-4 h-4" /> Live Simulator
            </Link>
            <button
              onClick={loadData}
              className="bg-zinc-200 text-black border-2 border-black hover:bg-zinc-300 px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-[4px_4px_0px_#000000]"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* No Data State / Seed Banner */}
      {suppliers.length === 0 && !loading && (
        <div className="border-4 border-gold bg-red-950/50 p-6 shadow-[6px_6px_0px_#ef4444] mb-8">
          <h3 className="text-lg font-black uppercase flex items-center gap-2 text-goldLight">
            <ShieldAlert className="w-5 h-5" /> Leveranciersdata Ontbreekt!
          </h3>
          <p className="text-xs font-bold mt-2 uppercase">
            Om de betrouwbaarheid, prijsvergelijkingen en dynamische pricing te demonstreren, moeten we mock leveranciers en product logs genereren.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="mt-4 bg-gold hover:bg-gold text-white font-black uppercase px-6 py-3 text-sm border-2 border-white shadow-[4px_4px_0px_#ffffff] disabled:opacity-50 flex items-center gap-2"
          >
            <Database className="w-4 h-4" /> {seeding ? "INITIALISEREN..." : "SEED SUPPLIER INTELLIGENCE DATA"}
          </button>
          {seedResult && (
            <div className="mt-3 text-xs font-black uppercase bg-black text-white p-2 border border-gold">
              {seedResult}
            </div>
          )}
        </div>
      )}

      {/* Stats Quick Grid */}
      {suppliers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="border-4 border-white bg-zinc-900 p-4 shadow-[4px_4px_0px_#ffffff]">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Gekoppelde Leveranciers
            </div>
            <div className="text-3xl font-black mt-1 uppercase">{suppliers.length} Partners</div>
            <div className="text-[10px] text-zinc-500 mt-1 uppercase">Met actieve productfeeds</div>
          </div>
          
          <div className="border-4 border-white bg-zinc-900 p-4 shadow-[4px_4px_0px_#ffffff]">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Gem. Levertijd
            </div>
            <div className="text-3xl font-black mt-1 uppercase">
              {(suppliers.reduce((acc, s) => acc + s.avgDeliveryTime, 0) / suppliers.length).toFixed(1)} Dagen
            </div>
            <div className="text-[10px] text-green-400 mt-1 uppercase">Auto-routeert naar snelste</div>
          </div>

          <div className="border-4 border-white bg-zinc-900 p-4 shadow-[4px_4px_0px_#ffffff]">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" /> Succesratio Orders
            </div>
            <div className="text-3xl font-black mt-1 uppercase">
              {(suppliers.reduce((acc, s) => acc + s.successRate, 0) / suppliers.length * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-zinc-500 mt-1 uppercase">Gebaseerd op simulated orders</div>
          </div>

          <div className="border-4 border-white bg-zinc-900 p-4 shadow-[4px_4px_0px_#ffffff]">
            <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" /> Optimalisatie Marge
            </div>
            <div className="text-3xl font-black mt-1 text-green-400 uppercase">
              +{(profitLogs.reduce((acc, l) => acc + l.profitMargin, 0) / (profitLogs.length || 1)).toFixed(1)}%
            </div>
            <div className="text-[10px] text-zinc-500 mt-1 uppercase">Winst maximalisatie loop</div>
          </div>
        </div>
      )}

      {/* Brutalistische Tab Navigatie */}
      <div className="flex border-b-4 border-white mb-6">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`px-4 py-3 text-xs md:text-sm font-black uppercase border-t-4 border-x-4 border-white -mb-[4px] mr-2 transition-all ${
            activeTab === "suppliers"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          1. Leveranciers & Betrouwbaarheid
        </button>
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-3 text-xs md:text-sm font-black uppercase border-t-4 border-x-4 border-white -mb-[4px] mr-2 transition-all ${
            activeTab === "comparison"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          2. Prijsvergelijkings Matrix
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-3 text-xs md:text-sm font-black uppercase border-t-4 border-x-4 border-white -mb-[4px] transition-all ${
            activeTab === "pricing"
              ? "bg-white text-black"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          3. Dynamic Pricing & Winstlijn
        </button>
      </div>

      {loading ? (
        <div className="border-4 border-white bg-zinc-900 p-12 text-center shadow-[6px_6px_0px_#ffffff]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-white mb-4" />
          <p className="text-sm font-black uppercase tracking-widest">DATA INTELLIGENCE FEED LOADING...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* TAB 1: SUPPLIERS & RELIABILITY */}
          {activeTab === "suppliers" && (
            <div className="space-y-6">
              {suppliers.map(sup => (
                <div 
                  key={sup.id} 
                  className="border-4 border-white bg-zinc-900 p-6 shadow-[6px_6px_0px_#ffffff] grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Leverancier Info */}
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-wider text-white border-b-2 border-zinc-700 pb-2">
                      {sup.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2">Email: {sup.contactEmail || "N/A"}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs uppercase">
                        <span className="font-bold text-zinc-400">Betrouwbaarheidsscore:</span>
                        <span className={`font-black px-2 py-0.5 text-xs bg-white text-black`}>
                          {(sup.reliabilityScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs uppercase">
                        <span className="font-bold text-zinc-400">Gemiddelde Levertijd:</span>
                        <span className="font-black text-white">{sup.avgDeliveryTime.toFixed(1)} Dagen</span>
                      </div>
                      <div className="flex justify-between items-center text-xs uppercase">
                        <span className="font-bold text-zinc-400">Order Succesratio:</span>
                        <span className="font-black text-white">{(sup.successRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs uppercase">
                        <span className="font-bold text-zinc-400">Leverancier Rating:</span>
                        <span className="font-black text-yellow-400">{"★".repeat(Math.round(sup.rating)) || "N/A"} ({sup.rating})</span>
                      </div>
                    </div>
                  </div>

                  {/* Assortiment & Prijzen van deze Leverancier */}
                  <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-zinc-700 lg:pl-6">
                    <h4 className="text-xs font-black uppercase text-zinc-400 mb-3 tracking-widest">
                      PRODUCT FEED & INKOOPPRIJZEN
                    </h4>
                    <div className="space-y-2">
                      {sup.products.map((prod: any) => (
                        <div key={prod.id} className="bg-zinc-800 p-2.5 border border-zinc-600 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-black text-white uppercase">{prod.name}</div>
                            <div className="text-[10px] text-zinc-400">SKU: {prod.sku} | Voorraad: {prod.stock}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-white">€{prod.costPrice.toFixed(2)}</div>
                            <div className="text-[9px] text-zinc-400 uppercase">SRP: €{prod.suggestedRetailPrice?.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recente Order Logs (Simulatie resultaten) */}
                  <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-zinc-700 lg:pl-6">
                    <h4 className="text-xs font-black uppercase text-zinc-400 mb-3 tracking-widest">
                      Fulfillment Logs (Laatste 5 orders)
                    </h4>
                    <div className="space-y-1.5">
                      {sup.orderLogs && sup.orderLogs.length > 0 ? (
                        sup.orderLogs.slice(0, 5).map((log: any) => (
                          <div 
                            key={log.id} 
                            className={`p-2 border text-[10px] font-bold uppercase flex justify-between items-center ${
                              log.success 
                                ? "bg-zinc-800 border-zinc-700 text-zinc-300" 
                                : "bg-red-950/40 border-navyLight text-red-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {log.success ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                              )}
                              <span>Order: {log.orderId.substring(0, 8)}...</span>
                            </div>
                            <div>
                              {log.success ? (
                                <span>Geleverd in {log.deliveryTime?.toFixed(1)} dagen</span>
                              ) : (
                                <span className="font-black text-goldLight">Fulfillment Mislukt</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-zinc-500 text-xs italic bg-zinc-800/40 p-4 border border-dashed border-zinc-700 uppercase">
                          [!] Nog geen orders gesimuleerd voor deze leverancier. Ga naar de simulator om transacties te starten.
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
            <div className="border-4 border-white bg-zinc-900 p-6 shadow-[6px_6px_0px_#ffffff]">
              <h3 className="text-xl font-black uppercase tracking-wider mb-6 border-b-2 border-white pb-2">
                VERGELIJKINGS-MATRIX LEVERANCIERS (INKOOPPRIJZEN)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-white text-xs uppercase font-black text-zinc-400">
                      <th className="py-3 px-4">Product Naam / SKU</th>
                      {suppliers.map(s => (
                        <th key={s.id} className="py-3 px-4 text-center border-l border-zinc-700">
                          {s.name}
                          <div className="text-[10px] mt-0.5 text-zinc-500 font-bold uppercase">
                            Score: {(s.reliabilityScore * 100).toFixed(0)}%
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(comparison).map(([sku, prods]) => {
                      const firstProd = prods[0];
                      // Bereken welk product het goedkoopste is
                      const minCost = Math.min(...prods.map(p => p.costPrice));

                      return (
                        <tr key={sku} className="border-b border-zinc-800 hover:bg-zinc-800/40 text-xs transition-all">
                          <td className="py-4 px-4 font-bold">
                            <span className="text-white block font-black uppercase text-sm">{firstProd.name}</span>
                            <span className="text-zinc-400 text-[10px]">SKU: {sku}</span>
                          </td>
                          {suppliers.map(sup => {
                            const supProd = prods.find(p => p.supplierId === sup.id);
                            if (!supProd) {
                              return <td key={sup.id} className="py-4 px-4 text-center text-zinc-600 border-l border-zinc-800">[Niet Leverbaar]</td>;
                            }
                            
                            const isCheapest = supProd.costPrice === minCost;
                            // Bereken de weighted intelligence score
                            const weightedScore = supProd.costPrice / Math.pow(Math.max(0.1, sup.reliabilityScore), 1.5);
                            const allWeightedScores = prods.map(p => {
                              const s = suppliers.find(su => su.id === p.supplierId);
                              return p.costPrice / Math.pow(Math.max(0.1, s?.reliabilityScore || 0.5), 1.5);
                            });
                            const isBestWeighted = weightedScore === Math.min(...allWeightedScores);

                            return (
                              <td key={sup.id} className={`py-4 px-4 text-center border-l border-zinc-850 ${
                                isBestWeighted ? "bg-zinc-950 text-white font-black" : "text-zinc-300"
                              }`}>
                                <div className="text-sm font-black">€{supProd.costPrice.toFixed(2)}</div>
                                
                                <div className="mt-1 flex flex-col items-center gap-1">
                                  {isCheapest && (
                                    <span className="bg-green-500 text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm">
                                      GOEDKOOPSTE
                                    </span>
                                  )}
                                  {isBestWeighted && (
                                    <span className="bg-white text-black border border-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm shadow-[2px_2px_0px_#22c55e]">
                                      BEST WEIGHED
                                    </span>
                                  )}
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">
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
              <div className="mt-6 border-t-2 border-zinc-800 pt-4 text-xs text-zinc-400 leading-relaxed uppercase">
                <span className="font-black text-white">[INFO]:</span> De <strong>Best Weighed</strong> leverancier wordt door de order-simulator geselecteerd. 
                De score wordt berekend door de inkoopprijs te wegen tegen de betrouwbaarheid van de leverancier: 
                <code className="bg-black text-green-400 px-1 py-0.5 ml-1 text-[11px]">Inkooprijs / (Betrouwbaarheid ^ 1.5)</code>.
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC PRICING & PROFIT OPTIMIZATION (STIJGENDE WINSTLIJN) */}
          {activeTab === "pricing" && (
            <div className="space-y-8">
              
              {/* Winstlijn Grafiek (Brutalist Monochrome SVG) */}
              <div className="border-4 border-white bg-zinc-900 p-6 shadow-[6px_6px_0px_#ffffff]">
                <h3 className="text-xl font-black uppercase tracking-wider mb-6 border-b-2 border-white pb-2 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  STIJGENDE WINSTLIJN: OPTIMALISATIE HISTORIE (TOTAAL WINST PER DAG)
                </h3>
                
                {chartData.length > 0 ? (
                  <div>
                    {/* SVG Brutalistische Chart */}
                    <div className="w-full bg-black border-2 border-zinc-700 p-4 mb-2">
                      <svg viewBox="0 0 800 300" className="w-full h-auto">
                        {/* Grid Lines */}
                        <line x1="50" y1="50" x2="750" y2="50" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
                        <line x1="50" y1="125" x2="750" y2="125" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
                        <line x1="50" y1="200" x2="750" y2="200" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
                        <line x1="50" y1="250" x2="750" y2="250" stroke="#52525b" strokeWidth="2" /> {/* Baseline */}

                        {/* Y-As Labels */}
                        <text x="10" y="55" fill="#a1a1aa" fontSize="10" className="font-mono font-bold">€{maxProfit.toFixed(0)}</text>
                        <text x="10" y="130" fill="#a1a1aa" fontSize="10" className="font-mono font-bold">€{(maxProfit * 0.6).toFixed(0)}</text>
                        <text x="10" y="205" fill="#a1a1aa" fontSize="10" className="font-mono font-bold">€{(maxProfit * 0.3).toFixed(0)}</text>
                        <text x="10" y="255" fill="#a1a1aa" fontSize="10" className="font-mono font-bold">€0</text>

                        {/* Bar chart elements with heavy contrast */}
                        {chartData.map((d, index) => {
                          const x = 50 + index * (700 / (chartData.length || 1));
                          const height = (d.profit / maxProfit) * 200; // max height is 200px
                          const y = 250 - height;
                          const barWidth = Math.max(10, (700 / chartData.length) - 15);

                          return (
                            <g key={index} className="group">
                              {/* De Winst Barlijn */}
                              <rect 
                                x={x} 
                                y={y} 
                                width={barWidth} 
                                height={height} 
                                fill={index === chartData.length - 1 ? "#22c55e" : "#ffffff"} 
                                stroke="#18181b" 
                                strokeWidth="2" 
                              />
                              
                              {/* Hover tooltip hint */}
                              <text 
                                x={x + barWidth/2} 
                                y={y - 8} 
                                fill="#22c55e" 
                                fontSize="9" 
                                textAnchor="middle" 
                                className="opacity-0 group-hover:opacity-100 font-mono font-bold transition-all"
                              >
                                €{d.profit.toFixed(0)}
                              </text>

                              {/* X-As Labels (dates) */}
                              {index % 2 === 0 && (
                                <text 
                                  x={x + barWidth/2} 
                                  y="275" 
                                  fill="#a1a1aa" 
                                  fontSize="9" 
                                  textAnchor="middle" 
                                  className="font-mono font-bold uppercase"
                                >
                                  {d.date}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-black px-2">
                      <span>Stikstof V1 Start (Dag 1)</span>
                      <span className="text-green-400 font-bold">AI Dynamic Pricing Optimalisatie Live (Dag 15)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-500 text-xs italic bg-black p-12 border border-dashed border-zinc-700 text-center uppercase">
                    [!] Geen optimalisatie logs beschikbaar. Klik op "Seeden" of voer orders uit om logs te genereren.
                  </div>
                )}
              </div>

              {/* Dynamic Pricing Console */}
              <div className="border-4 border-white bg-zinc-900 p-6 shadow-[6px_6px_0px_#ffffff]">
                <h3 className="text-xl font-black uppercase tracking-wider mb-6 border-b-2 border-white pb-2 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  DYNAMIC PRICING ENGINE CONTROLS
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(comparison).map(([sku, prods]) => {
                    const firstProd = prods[0];
                    // Bereken inkoopprijs (laagste)
                    const minCost = Math.min(...prods.map(p => p.costPrice));

                    // Vind meest recente log voor deze SKU om huidige prijs, velocity, etc. te tonen
                    const skuLogs = profitLogs.filter(l => l.sku === sku);
                    const lastLog = skuLogs[skuLogs.length - 1];

                    const currentPrice = lastLog ? lastLog.sellingPrice : (firstProd.suggestedRetailPrice || 89.00);
                    const currentVelocity = lastLog ? lastLog.salesVelocity : 0.0;
                    const currentElasticity = lastLog ? lastLog.elasticity : -1.5;
                    const optimizedSuggestedPrice = lastLog ? lastLog.optimizedPrice : currentPrice;

                    return (
                      <div key={sku} className="bg-black p-5 border-2 border-zinc-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                          <span className="text-xs font-black uppercase bg-zinc-800 text-white px-2 py-0.5 w-fit block">
                            SKU: {sku}
                          </span>
                          <h4 className="text-lg font-black uppercase text-white">{firstProd.name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div>
                              <div className="text-[9px] text-zinc-500 uppercase font-black">Laagste Inkoop</div>
                              <div className="text-sm font-black text-white">€{minCost.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-zinc-500 uppercase font-black">Huidige Prijs</div>
                              <div className="text-sm font-black text-white">€{currentPrice.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-zinc-500 uppercase font-black">Sales Velocity</div>
                              <div className="text-sm font-black text-zinc-300">
                                {currentVelocity > 0 ? `${currentVelocity.toFixed(1)} / dag` : "Geen data"}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] text-zinc-500 uppercase font-black">Elasticiteit (E)</div>
                              <div className="text-sm font-black text-zinc-300">
                                {currentElasticity.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                          <div className="text-left md:text-right">
                            <div className="text-[9px] text-green-400 uppercase font-black flex items-center gap-1 md:justify-end">
                              <TrendingUp className="w-3.5 h-3.5" /> AANBEVOLEN OPTIMALISATIE
                            </div>
                            <div className="text-2xl font-black text-white mt-0.5">
                              €{optimizedSuggestedPrice.toFixed(2)}
                            </div>
                            <div className="text-[9px] text-zinc-500 uppercase font-bold mt-0.5">
                              Marge: €{(optimizedSuggestedPrice - minCost).toFixed(2)} (+{(((optimizedSuggestedPrice - minCost) / minCost) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <button
                            onClick={() => triggerOptimizer(sku, currentPrice)}
                            disabled={optimizingSku === sku}
                            className="bg-green-500 hover:bg-green-600 text-black font-black uppercase text-xs px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#ffffff] disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
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

      {/* Footer info console */}
      <div className="border-4 border-white bg-zinc-900 p-4 shadow-[4px_4px_0px_#ffffff] mt-8 text-center text-xs font-bold uppercase text-zinc-500">
        Rebuild Your Life - Supplier Intelligence Dashboard &copy; 2026. SECURE ACCESS CLEARED (LEVEL 1)
      </div>

    </div>
  );
}
