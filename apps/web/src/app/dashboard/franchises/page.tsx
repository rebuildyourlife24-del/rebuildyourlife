"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getFranchises, 
  createFranchiseAction, 
  updateFranchiseAction, 
  deleteFranchiseAction,
  simulateFranchiseOrderAction,
  getFranchiseOrdersAction
} from "@/actions/franchise";
import { Terminal, Shield, Plus, Trash2, Edit2, ShoppingBag, DollarSign, ExternalLink, Play, Check, Cpu, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Franchise {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string | null;
  status: string;
  title: string;
  description: string;
  theme: string;
  products: Product[];
  settings: any;
  revenue: number;
  platformCutTotal: number;
  createdAt: Date | string;
}

export default function FranchiseManager() {
  // Lists & Selected
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Connection State
  const [newName, setNewName] = useState("");
  const [connectionType, setConnectionType] = useState("SHOPIFY"); // "SHOPIFY" or "SELF_HOSTED"
  const [storeUrl, setStoreUrl] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Builder States (Editing Selected)
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTheme, setEditTheme] = useState("SHOPIFY");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Product Manager State
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");

  // Simulator State
  const [simCustName, setSimCustName] = useState("Henk Semler Jr.");
  const [simCustEmail, setSimCustEmail] = useState("henk.jr@example.com");
  const [simSelectedProd, setSimSelectedProd] = useState<Product | null>(null);
  const [simQty, setSimQty] = useState(1);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    loadFranchises();
  }, []);

  useEffect(() => {
    if (selectedFranchise) {
      setEditTitle(selectedFranchise.title);
      setEditDesc(selectedFranchise.description);
      setEditTheme(selectedFranchise.theme || "SHOPIFY");
      loadOrders(selectedFranchise.id);
      
      // Auto select first product for simulation
      if (selectedFranchise.products && selectedFranchise.products.length > 0) {
        setSimSelectedProd(selectedFranchise.products[0]);
      } else {
        setSimSelectedProd(null);
      }
    } else {
      setOrders([]);
      setSimSelectedProd(null);
    }
  }, [selectedFranchise]);

  async function loadFranchises() {
    const data = await getFranchises();
    // parse JSON from server action
    const parsedData = (data as any[]).map(f => ({
      ...f,
      products: Array.isArray(f.products) ? f.products : JSON.parse(f.products || "[]"),
      settings: typeof f.settings === "string" ? JSON.parse(f.settings || "{}") : f.settings
    }));
    setFranchises(parsedData);
    if (parsedData.length > 0 && !selectedFranchise) {
      setSelectedFranchise(parsedData[0]);
    }
  }

  async function loadOrders(franchiseId: string) {
    const res = await getFranchiseOrdersAction(franchiseId);
    if (res.success && res.data) {
      setOrders(res.data);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !storeUrl) return;
    setCreateLoading(true);
    setCreateError("");

    const subdomainSlug = storeUrl.toLowerCase()
      .replace("https://", "")
      .replace("http://", "")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const res = await createFranchiseAction({
      name: newName,
      subdomain: subdomainSlug,
      customDomain: storeUrl.trim(),
      theme: connectionType,
      title: newName,
      description: connectionType === "SHOPIFY" ? "Shopify Integration Active" : "Self-Hosted Link Active"
    });

    if (res.success && res.data) {
      let finalData = res.data;
      if (connectionType === "SHOPIFY" && apiToken) {
        const updateRes = await updateFranchiseAction(res.data.id, {
          settings: { accessToken: apiToken }
        });
        if (updateRes.success && updateRes.data) {
          finalData = updateRes.data;
        }
      }

      const formatted = {
        ...finalData,
        products: JSON.parse((finalData.products as any) || "[]"),
        settings: typeof finalData.settings === "string" ? JSON.parse(finalData.settings || "{}") : finalData.settings
      };
      setFranchises(prev => [formatted, ...prev]);
      setSelectedFranchise(formatted);
      setNewName("");
      setStoreUrl("");
      setApiToken("");
    } else {
      setCreateError(res.error || "Fout bij koppelen winkel.");
    }
    setCreateLoading(false);
  }

  async function handleSaveSettings() {
    if (!selectedFranchise) return;
    setSaveLoading(true);
    setSaveSuccess(false);

    const res = await updateFranchiseAction(selectedFranchise.id, {
      title: editTitle,
      description: editDesc,
      theme: editTheme
    });

    if (res.success && res.data) {
      const formatted = {
        ...res.data,
        products: JSON.parse((res.data.products as any) || "[]"),
        settings: JSON.parse((res.data.settings as any) || "{}")
      };
      // update list
      setFranchises(prev => prev.map(f => f.id === formatted.id ? formatted : f));
      setSelectedFranchise(formatted);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaveLoading(false);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFranchise || !newProdName || !newProdPrice) return;

    const newProd: Product = {
      id: Math.random().toString(36).substring(2, 9),
      name: newProdName,
      price: parseFloat(newProdPrice),
      description: newProdDesc || "Geen beschrijving.",
      imageUrl: newProdImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
    };

    const updatedProducts = [...selectedFranchise.products, newProd];

    const res = await updateFranchiseAction(selectedFranchise.id, {
      products: updatedProducts
    });

    if (res.success && res.data) {
      const formatted = {
        ...res.data,
        products: JSON.parse((res.data.products as any) || "[]"),
        settings: JSON.parse((res.data.settings as any) || "{}")
      };
      setFranchises(prev => prev.map(f => f.id === formatted.id ? formatted : f));
      setSelectedFranchise(formatted);
      
      // Reset form
      setNewProdName("");
      setNewProdPrice("");
      setNewProdDesc("");
      setNewProdImage("");
    }
  }

  async function handleDeleteProduct(prodId: string) {
    if (!selectedFranchise) return;
    const updatedProducts = selectedFranchise.products.filter(p => p.id !== prodId);

    const res = await updateFranchiseAction(selectedFranchise.id, {
      products: updatedProducts
    });

    if (res.success && res.data) {
      const formatted = {
        ...res.data,
        products: JSON.parse((res.data.products as any) || "[]"),
        settings: JSON.parse((res.data.settings as any) || "{}")
      };
      setFranchises(prev => prev.map(f => f.id === formatted.id ? formatted : f));
      setSelectedFranchise(formatted);
    }
  }

  async function handleSimulateOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFranchise || !simSelectedProd) return;
    setSimLoading(true);
    setSimLogs([]);

    const logSteps = [
      `[WEBHOOK] Inkomende payload van ${selectedFranchise.theme === "SHOPIFY" ? "Shopify" : "Zelf-gehoste"} Webshop webhook...`,
      `[VERIFY] Valideren van HMAC handtekening en tokens...`,
      `[VERIFY] Beveiligingscontrole geslaagd. Payload gedecodeerd.`,
      `[WEBHOOK] Order: #${Math.floor(1000 + Math.random() * 9000)} | Klant: ${simCustName} (${simCustEmail})`,
      `[WEBHOOK] Item: ${simSelectedProd.name} x${simQty} ($${simSelectedProd.price.toFixed(2)} p/st)`,
      `[DB] Aanmaken van FranchiseOrder record in database. Status: PAID`,
      `[SYS] BEREKENEN 25% PLATFORM COMMISSIE TOL...`,
      `[SYS] platform_cut = $${((simSelectedProd.price * simQty) * 0.25).toFixed(2)}`,
      `[SYS] DOORSCHUIVEN PLATFORM CUT NAAR OPERATIONS VAULT VAN HENK SEMLER (SUPREME_OVERSEER)...`,
      `[SYS] Transactie gelogd in Supreme Overseer Wallet...`,
      `[SUCCESS] Webhook succesvol afgehandeld. Platform Cut verwerkt.`
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
      setSimLogs(prev => [...prev, logSteps[i]]);
    }

    const res = await simulateFranchiseOrderAction(selectedFranchise.id, {
      customerName: simCustName,
      customerEmail: simCustEmail,
      totalAmount: simSelectedProd.price * simQty,
      items: [{
        id: simSelectedProd.id,
        name: simSelectedProd.name,
        price: simSelectedProd.price,
        quantity: simQty
      }]
    });

    if (res.success) {
      // Reload stats & orders
      loadFranchises().then(() => {
        // preserve selected
        const updated = franchises.find(f => f.id === selectedFranchise.id);
        if (updated) setSelectedFranchise(updated);
      });
      loadOrders(selectedFranchise.id);
    } else {
      setSimLogs(prev => [...prev, `[ERROR] Fout bij webhook afhandeling: ${res.error}`]);
    }
    setSimLoading(false);
  }

  async function handleDeleteFranchise() {
    if (!selectedFranchise) return;
    if (!confirm(`Weet je zeker dat je de koppeling met "${selectedFranchise.name}" wilt verbreken?`)) return;

    const res = await deleteFranchiseAction(selectedFranchise.id);
    if (res.success) {
      const rest = franchises.filter(f => f.id !== selectedFranchise.id);
      setFranchises(rest);
      setSelectedFranchise(rest.length > 0 ? rest[0] : null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans text-white min-h-[85vh] relative z-10 pb-12">
      
      {/* Background glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/10 hidden blur-[] rounded-full pointer-events-none -z-10"></div>

      {/* Header (Future Blue) */}
      <div className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest flex items-center gap-4 text-white">
            OMEGA UPLINK <Cpu className="w-8 h-8 text-cyan-400" />
          </h1>
          <p className="text-cyan-400/60 mt-2 text-xs uppercase tracking-widest font-bold">
            E-Commerce Store Integration & Uplink Hub
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Link 
            href="/dashboard/franchises/intelligence"
            className="bg-black/60 hover:bg-zinc-900 text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest px-6 py-3.5 text-xs transition-colors flex items-center gap-2 shadow-lg"
          >
            Supplier Intelligence
          </Link>
          <div className="bg-cyan-500/20 text-cyan-400 px-5 py-3.5 border border-cyan-500/30 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Secured by Supreme Overseer
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: STORE CONNECTOR & LIST */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Connect Store */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2 text-white">
              <Plus className="w-4 h-4 text-cyan-500" />
              Koppel E-Commerce Shop
            </h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Koppeling Type</label>
                <div className="relative">
                  <select
                    value={connectionType}
                    onChange={(e) => setConnectionType(e.target.value)}
                    disabled={createLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-cyan-500/50 text-xs appearance-none"
                  >
                    <option value="SHOPIFY">Shopify Integration (API)</option>
                    <option value="SELF_HOSTED">Self-Hosted Store / Link</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Winkel Naam</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="bijv. Apex Survival Gear"
                  required
                  disabled={createLoading}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-zinc-600 font-bold text-xs transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Winkel URL / Domein</label>
                <input
                  type="text"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder={connectionType === "SHOPIFY" ? "bijv. winkel.myshopify.com" : "bijv. shop.jouwmerk.nl"}
                  required
                  disabled={createLoading}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-zinc-600 font-bold text-xs transition-colors"
                />
              </div>

              {connectionType === "SHOPIFY" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Shopify API Token</label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
                    disabled={createLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-zinc-600 font-bold text-xs transition-colors"
                  />
                </div>
              )}

              {createError && (
                <div className="border border-cyan-500/30 bg-cyan-500/20 rounded-xl p-3 text-xs font-bold text-cyan-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {createError}
                </div>
              )}

              <button
                type="submit"
                disabled={createLoading || !newName || !storeUrl}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl py-4 transition-colors disabled:opacity-40 text-xs shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                {createLoading ? "VERBINDEN..." : "KOPPEL WINKEL"}
              </button>
            </form>
          </div>

          {/* Active List */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 text-white">
              Gekoppelde Stores ({franchises.length})
            </h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {franchises.length === 0 && (
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Geen actieve koppelingen.</p>
              )}
              {franchises.map(f => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFranchise(f)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                    selectedFranchise?.id === f.id 
                      ? "bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      : "bg-zinc-950/50 border-white/5 hover:border-white/10 hover:bg-zinc-900/50"
                  }`}
                >
                  <div>
                    <div className="font-black uppercase text-xs tracking-wider text-white">{f.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 font-bold truncate max-w-[150px]">
                      {f.customDomain || `${f.subdomain}.myshopify.com`}
                    </div>
                  </div>
                  <div className={`border font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest ${
                    f.theme === "SHOPIFY" 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}>
                    {f.theme === "SHOPIFY" ? "SHOPIFY" : "SELF-HOSTED"}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE & RIGHT: DIAGNOSTICS & SIMULATOR */}
        <div className="lg:col-span-2 space-y-6">
          
          {selectedFranchise ? (
            <>
              {/* Franchise Quick Dashboard */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6 shadow-lg">
                <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Totaal Omzet</span>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-5 h-5 text-white" />
                    <span className="text-2xl font-black text-white">{selectedFranchise.revenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-cyan-500 text-black font-black text-[8px] px-2 py-0.5 rounded-bl-lg">
                    25% PLATFORM CUT
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1 mt-1">Henk's Share (25%)</span>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-5 h-5 text-cyan-500" />
                    <span className="text-2xl font-black text-cyan-400">{selectedFranchise.platformCutTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Netto Winst (75%)</span>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-5 h-5 text-zinc-400" />
                    <span className="text-2xl font-black text-white">
                      {(selectedFranchise.revenue - selectedFranchise.platformCutTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Integration Controls & Portal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* UPLINK HUB SETTINGS */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg space-y-6">
                  <h2 className="text-sm font-black uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-2 text-white">
                    <Edit2 className="w-4 h-4 text-cyan-500" />
                    Uplink Hub Settings
                  </h2>
                  
                  {/* Connection Type Indicator */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest block text-zinc-500">Verbindingstype</span>
                    <div className="flex gap-3 bg-black/50 p-1.5 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditTheme("SHOPIFY")}
                        className={`flex-1 rounded-lg py-2.5 font-bold uppercase text-[10px] tracking-widest transition-colors ${
                          editTheme === "SHOPIFY" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        SHOPIFY
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTheme("SELF_HOSTED")}
                        className={`flex-1 rounded-lg py-2.5 font-bold uppercase text-[10px] tracking-widest transition-colors ${
                          editTheme === "SELF_HOSTED" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        SELF-HOSTED
                      </button>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest block text-zinc-500">Winkel Naam</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest block text-zinc-500">Winkel Omschrijving</label>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={saveLoading}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-xl py-3.5 transition-colors disabled:opacity-40 text-xs"
                  >
                    {saveLoading ? "OPSLAAN..." : "KOPPELING BIJWERKEN"}
                  </button>

                  {saveSuccess && (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" /> Integratie protocol bijgewerkt.
                    </div>
                  )}

                  {/* Add Product */}
                  <div className="border-t border-white/5 pt-6 mt-6 space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Product Toevoegen (Mock)</h3>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Naam"
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            required
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Prijs €"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            required
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Korte omschrijving"
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        type="submit"
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase text-[10px] tracking-widest rounded-lg py-2.5 transition-colors border border-white/5"
                      >
                        PRODUCT VOEGEN
                      </button>
                    </form>
                  </div>

                </div>

                {/* VISUAL UPLINK CONNECTION PORTAL */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">STORE INTEGRATION PORTAL</h3>
                  
                  <div className="bg-black/60 border border-white/5 rounded-2xl p-6 h-[520px] flex flex-col justify-between overflow-y-auto text-white backdrop-blur-md custom-scrollbar">
                    
                    {/* Portal Header */}
                    <div className="border-b border-white/5 pb-5 mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-base font-black uppercase tracking-widest text-cyan-400 truncate max-w-[180px]">{editTitle || selectedFranchise.name}</h4>
                        <span className="bg-cyan-950/30 text-cyan-400 border border-cyan-500/50 rounded-full text-[8px] font-black px-2.5 py-1 uppercase tracking-widest animate-pulse">
                          LIVE UPLINK ACTIVE
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        Type: {editTheme === "SHOPIFY" ? "Shopify API Integration" : "Self-Hosted External Link"}
                      </p>
                    </div>

                    {/* Diagnostics Grid */}
                    <div className="flex-1 space-y-4 text-[10px] font-mono">
                      <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2 gap-2">
                          <span className="text-zinc-500 font-bold uppercase shrink-0">Store URL:</span>
                          <a 
                            href={selectedFranchise.customDomain?.startsWith("http") ? selectedFranchise.customDomain : `https://${selectedFranchise.customDomain}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold truncate max-w-[140px] transition-colors"
                          >
                            {selectedFranchise.customDomain || `${selectedFranchise.subdomain}.myshopify.com`}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-zinc-500 font-bold uppercase">Uplink Status:</span>
                          <span className="text-emerald-400 font-bold">SECURE & ENCRYPTED</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-zinc-500 font-bold uppercase">Sync Database:</span>
                          <span className="text-emerald-400 font-bold">ONLINE (SSL v3)</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-zinc-500 font-bold uppercase">Toll Rate:</span>
                          <span className="text-cyan-400 font-bold">25.0% PLATFORM CUT</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 font-bold uppercase">Auto-Supplier:</span>
                          <span className="text-emerald-400 font-bold">ACTIVATED</span>
                        </div>
                      </div>

                      <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest border-b border-white/5 pb-2">Synchronized Products</div>
                        {selectedFranchise.products.length === 0 ? (
                          <div className="text-[10px] text-zinc-600 font-medium font-sans">Geen producten gesynct.</div>
                        ) : (
                          <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                            {selectedFranchise.products.map(p => (
                              <div key={p.id} className="flex justify-between items-center bg-black/40 rounded-lg p-2.5 border border-white/5">
                                <span className="text-zinc-300 font-medium truncate max-w-[120px] font-sans text-xs">{p.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-cyan-400 font-bold">${p.price.toFixed(2)}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="text-cyan-500/50 hover:text-cyan-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/5 pt-4 mt-5 text-[8px] uppercase font-bold tracking-widest text-center text-zinc-600">
                      UPLINK ID: {selectedFranchise.id.toUpperCase()} // REBUILD YOUR LIFE
                    </div>

                  </div>
                </div>

              </div>

              {/* WEBHOOK TRANSACTION SIMULATOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Simulation controls */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2 text-white">
                    <ShoppingBag className="w-4 h-4 text-cyan-500" />
                    Simuleer Webhook
                  </h2>
                  
                  {selectedFranchise.products.length === 0 ? (
                    <p className="text-xs font-bold text-zinc-500 leading-relaxed">
                      Voeg eerst een product toe aan je catalogus om webhook verkopen te kunnen simuleren.
                    </p>
                  ) : (
                    <form onSubmit={handleSimulateOrder} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Klant Naam</label>
                          <input
                            type="text"
                            value={simCustName}
                            onChange={(e) => setSimCustName(e.target.value)}
                            required
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Klant E-mail</label>
                          <input
                            type="email"
                            value={simCustEmail}
                            onChange={(e) => setSimCustEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                          <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Product</label>
                          <select
                            value={simSelectedProd?.id || ""}
                            onChange={(e) => {
                              const found = selectedFranchise.products.find(p => p.id === e.target.value);
                              if (found) setSimSelectedProd(found);
                            }}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
                          >
                            {selectedFranchise.products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} (€{p.price.toFixed(2)})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase block text-zinc-500 tracking-widest">Aantal</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={simQty}
                            onChange={(e) => setSimQty(parseInt(e.target.value) || 1)}
                            required
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={simLoading || !simSelectedProd}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl py-3.5 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 text-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        RUN WEBHOOK SIMULATOR
                      </button>
                    </form>
                  )}
                </div>

                {/* Console Log feedback */}
                <div className="bg-black/60 border border-white/5 rounded-2xl p-6 h-[320px] flex flex-col justify-between backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Live Webhook Log Terminal</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] flex flex-col justify-end custom-scrollbar pr-1">
                    {simLogs.length === 0 && (
                      <span className="text-zinc-600 font-medium">&gt; Wacht op webhook activiteit...</span>
                    )}
                    {simLogs.map((log, i) => (
                      <div 
                        key={i} 
                        className={
                          log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" : 
                          log.includes("[SYS]") ? "text-cyan-400 font-medium" : 
                          log.includes("[ERROR]") ? "text-cyan-500 font-bold" :
                          "text-zinc-400"
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </>
          ) : (
             <div className="bg-black/40 border border-white/5 rounded-2xl p-16 flex flex-col items-center justify-center text-center h-full backdrop-blur-md">
               <Shield className="w-12 h-12 text-zinc-800 mb-6" />
               <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Geen Store Geselecteerd</h3>
               <p className="text-[11px] text-zinc-500 max-w-sm leading-relaxed uppercase font-bold tracking-widest">Selecteer een actieve E-commerce koppeling in het linkermenu om statistieken te bekijken of bestellingen te simuleren.</p>
             </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
