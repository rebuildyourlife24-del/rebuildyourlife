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
import { Terminal, Shield, Plus, Trash2, Edit2, ShoppingBag, DollarSign, ExternalLink, Play, Check } from "lucide-react";

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
    <div className="max-w-7xl mx-auto space-y-10 font-mono text-black p-4 md:p-8 bg-zinc-100 min-h-screen">
      
      {/* Header (Platinum brutalistisch) */}
      <div className="border-8 border-black bg-zinc-200 p-6 shadow-[8px_8px_0px_#000000] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
            <Terminal className="w-10 h-10 stroke-[3]" />
            OMEGA UPLINK
          </h1>
          <p className="text-zinc-700 text-sm mt-1 uppercase tracking-widest font-bold">
            // E-Commerce Store Integration & Uplink Hub
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Link 
            href="/dashboard/franchises/intelligence"
            className="bg-black text-white hover:bg-zinc-800 border-2 border-black font-black uppercase tracking-wider px-4 py-2 text-xs shadow-[3px_3px_0px_#71717a] transition-all"
          >
            Supplier & Profit Intelligence
          </Link>
          <div className="bg-zinc-300 text-black px-4 py-2 border-2 border-black font-bold uppercase tracking-wider text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-black" />
            Secured by Supreme Overseer
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: STORE CONNECTOR & LIST */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Connect Store */}
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000]">
            <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 stroke-[3]" />
              Koppel E-Commerce Shop
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase block text-zinc-700">Koppeling Type</label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  disabled={createLoading}
                  className="w-full bg-zinc-50 border-2 border-black px-3 py-2 text-black font-bold focus:outline-none text-xs"
                >
                  <option value="SHOPIFY">Shopify Integration (Official API)</option>
                  <option value="SELF_HOSTED">Self-Hosted Store / Custom Domain Link</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase block text-zinc-700">Winkel Naam</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="bijv. Apex Survival Gear"
                  required
                  disabled={createLoading}
                  className="w-full bg-zinc-50 border-2 border-black px-3 py-2 text-black focus:outline-none placeholder:text-zinc-400 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase block text-zinc-700">Winkel URL / Domein</label>
                <input
                  type="text"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder={connectionType === "SHOPIFY" ? "bijv. winkel.myshopify.com" : "bijv. shop.jouwmerk.nl"}
                  required
                  disabled={createLoading}
                  className="w-full bg-zinc-50 border-2 border-black px-3 py-2 text-black focus:outline-none placeholder:text-zinc-400 font-bold text-xs"
                />
              </div>

              {connectionType === "SHOPIFY" && (
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase block text-zinc-700">Shopify API Access Token (shpat_...)</label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
                    disabled={createLoading}
                    className="w-full bg-zinc-50 border-2 border-black px-3 py-2 text-black focus:outline-none placeholder:text-zinc-400 font-bold text-xs"
                  />
                </div>
              )}

              {createError && (
                <div className="border-2 border-black bg-[#0a192f] p-2 text-xs font-bold">
                  [!] {createError}
                </div>
              )}

              <button
                type="submit"
                disabled={createLoading || !newName || !storeUrl}
                className="w-full bg-black text-white hover:bg-zinc-900 border-2 border-black font-black uppercase tracking-wider py-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_#000000] disabled:opacity-50 text-xs"
              >
                {createLoading ? "VERBINDEN..." : "KOPPEL WINKEL"}
              </button>
            </form>
          </div>

          {/* Active List */}
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000]">
            <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
              Jouw Gekoppelde Stores ({franchises.length})
            </h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {franchises.length === 0 && (
                <p className="text-zinc-500 text-xs font-bold">Geen actieve webshop koppelingen gedetecteerd.</p>
              )}
              {franchises.map(f => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFranchise(f)}
                  className={`border-2 border-black p-3 cursor-pointer transition-all flex justify-between items-center ${
                    selectedFranchise?.id === f.id 
                      ? "bg-zinc-300 shadow-[2px_2px_0px_#000000] translate-x-0.5 translate-y-0.5" 
                      : "bg-zinc-50 hover:bg-zinc-100 shadow-[4px_4px_0px_#000000]"
                  }`}
                >
                  <div>
                    <div className="font-black uppercase text-sm tracking-wide">{f.name}</div>
                    <div className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1 truncate max-w-[180px]">
                      {f.customDomain || `${f.subdomain}.myshopify.com`}
                    </div>
                  </div>
                  <div className="bg-black text-white border border-black font-black text-[10px] px-2 py-1 uppercase">
                    {f.theme === "SHOPIFY" ? "SHOPIFY" : "SELF-HOSTED"}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE & RIGHT: DIAGNOSTICS & SIMULATOR */}
        <div className="lg:col-span-2 space-y-8">
          
          {selectedFranchise ? (
            <>
              {/* Franchise Quick Dashboard */}
              <div className="border-4 border-black bg-black text-white p-6 shadow-[6px_6px_0px_#000000] grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-2 border-zinc-800 p-4 bg-zinc-950 flex flex-col justify-between">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Totaal Omzet</span>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    <span className="text-3xl font-black">{selectedFranchise.revenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-2 border-zinc-800 p-4 bg-zinc-950 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gold text-white font-black text-[9px] px-2 py-0.5 border-b-2 border-l-2 border-zinc-800">
                    25% PLATFORM CUT
                  </div>
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Henk's Share (25%)</span>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-6 h-6 text-gold" />
                    <span className="text-3xl font-black text-goldLight">{selectedFranchise.platformCutTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-2 border-zinc-800 p-4 bg-zinc-950 flex flex-col justify-between">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Netto Winst (75%)</span>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                    <span className="text-3xl font-black text-blue-400">
                      {(selectedFranchise.revenue - selectedFranchise.platformCutTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Integration Controls & Portal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* UPLINK HUB SETTINGS */}
                <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2">
                    <Edit2 className="w-5 h-5" />
                    Uplink Hub Settings
                  </h2>
                  
                  {/* Connection Type Indicator */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider block text-zinc-700">Verbindingstype</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditTheme("SHOPIFY")}
                        className={`border-2 border-black py-2 font-black uppercase text-xs ${
                          editTheme === "SHOPIFY" ? "bg-black text-white" : "bg-zinc-100 text-black hover:bg-zinc-200"
                        }`}
                      >
                        SHOPIFY
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTheme("SELF_HOSTED")}
                        className={`border-2 border-black py-2 font-black uppercase text-xs ${
                          editTheme === "SELF_HOSTED" ? "bg-zinc-300 text-black" : "bg-zinc-100 text-black hover:bg-zinc-200"
                        }`}
                      >
                        SELF-HOSTED
                      </button>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-wider block text-zinc-700">Winkel Naam</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-black px-3 py-2 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-wider block text-zinc-700">Winkel Omschrijving</label>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                        className="w-full bg-zinc-50 border-2 border-black px-3 py-2 text-sm font-bold resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={saveLoading}
                    className="w-full bg-black text-white hover:bg-zinc-900 border-2 border-black font-black uppercase tracking-wider py-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_#000000]"
                  >
                    {saveLoading ? "OPSLAAN..." : "KOPPELING BIJWERKEN"}
                  </button>

                  {saveSuccess && (
                    <div className="border-2 border-green-600 bg-green-100 p-2 text-green-800 text-xs font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> [SUCCESS] Integratie protocol bijgewerkt.
                    </div>
                  )}

                  {/* Add Product */}
                  <div className="border-t-2 border-black pt-4 mt-4 space-y-4">
                    <h3 className="text-md font-black uppercase tracking-wider">Product Toevoegen (Handmatige Catalogus)</h3>
                    <form onSubmit={handleAddProduct} className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Productnaam"
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            required
                            className="w-full bg-zinc-50 border-2 border-black px-2 py-1 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Prijs ($)"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            required
                            className="w-full bg-zinc-50 border-2 border-black px-2 py-1 text-xs font-bold"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Afbeelding URL (optioneel)"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-black px-2 py-1 text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Korte omschrijving"
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-black px-2 py-1 text-xs font-bold"
                      />
                      <button
                        type="submit"
                        className="w-full bg-zinc-200 text-black hover:bg-zinc-300 border-2 border-black font-black uppercase text-xs tracking-wider py-2"
                      >
                        PRODUCT IN CATALOGUS VOEGEN
                      </button>
                    </form>
                  </div>

                </div>

                {/* VISUAL UPLINK CONNECTION PORTAL */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">STORE INTEGRATION PORTAL (LIVE UPLINK)</h3>
                  
                  <div className="border-4 border-black p-6 shadow-[8px_8px_0px_#000000] h-[520px] flex flex-col justify-between overflow-y-auto bg-black text-white font-mono">
                    
                    {/* Portal Header */}
                    <div className="border-b-2 border-zinc-800 pb-4 mb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-black uppercase tracking-wide text-green-400 truncate max-w-[180px]">{editTitle || selectedFranchise.name}</h4>
                        <span className="bg-green-900/30 text-green-400 border border-green-500/50 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest animate-pulse">
                          LIVE UPLINK ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 uppercase font-bold">
                        Type: {editTheme === "SHOPIFY" ? "Shopify API Integration" : "Self-Hosted External Link"}
                      </p>
                    </div>

                    {/* Diagnostics Grid */}
                    <div className="flex-1 space-y-4 text-xs">
                      <div className="border-2 border-zinc-800 bg-zinc-950 p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 gap-2">
                          <span className="text-zinc-500 font-bold uppercase shrink-0">Store URL:</span>
                          <a 
                            href={selectedFranchise.customDomain?.startsWith("http") ? selectedFranchise.customDomain : `https://${selectedFranchise.customDomain}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 hover:underline flex items-center gap-1 font-bold truncate max-w-[140px]"
                          >
                            {selectedFranchise.customDomain || `${selectedFranchise.subdomain}.myshopify.com`}
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Uplink Status:</span>
                          <span className="text-green-400 font-black">SECURE & ENCRYPTED</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Sync Database Channel:</span>
                          <span className="text-green-500 font-bold">ONLINE (SSL v3)</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                          <span className="text-zinc-500 font-bold uppercase">Toll Rate:</span>
                          <span className="text-goldLight font-black">25.0% PLATFORM CUT</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 font-bold uppercase">Auto-Supplier Routing:</span>
                          <span className="text-green-500 font-bold">ACTIVATED</span>
                        </div>
                      </div>

                      <div className="border-2 border-zinc-800 bg-zinc-950 p-4 space-y-2">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Synchronized Products</div>
                        {selectedFranchise.products.length === 0 ? (
                          <div className="text-[10px] text-zinc-600 italic font-bold">Geen producten gesynct. Gebruik de Webhook simulator.</div>
                        ) : (
                          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {selectedFranchise.products.map(p => (
                              <div key={p.id} className="flex justify-between items-center text-[10px] border border-zinc-900 px-2 py-1 bg-zinc-900/40">
                                <span className="text-zinc-300 font-bold truncate max-w-[150px]">{p.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400 font-black">${p.price.toFixed(2)}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="text-gold hover:text-goldLight font-bold uppercase text-[9px]"
                                  >
                                    [del]
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 border-zinc-900 pt-3 mt-4 text-[10px] uppercase font-bold text-center text-zinc-600">
                      UPLINK ID: {selectedFranchise.id.toUpperCase()} // REBUILD YOUR LIFE SAAS
                    </div>

                  </div>
                </div>

              </div>

              {/* WEBHOOK TRANSACTION SIMULATOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Simulation controls */}
                <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000]">
                  <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Simuleer Shopify / Store Webhook
                  </h2>
                  
                  {selectedFranchise.products.length === 0 ? (
                    <p className="text-xs font-bold text-zinc-500">
                      [!] Voeg eerst een product toe aan je catalogus om webhook verkopen te kunnen simuleren.
                    </p>
                  ) : (
                    <form onSubmit={handleSimulateOrder} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase block text-zinc-700">Klant Naam</label>
                          <input
                            type="text"
                            value={simCustName}
                            onChange={(e) => setSimCustName(e.target.value)}
                            required
                            className="w-full bg-zinc-50 border-2 border-black px-2 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase block text-zinc-700">Klant E-mail</label>
                          <input
                            type="email"
                            value={simCustEmail}
                            onChange={(e) => setSimCustEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-50 border-2 border-black px-2 py-1.5 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-black uppercase block text-zinc-700">Product</label>
                          <select
                            value={simSelectedProd?.id || ""}
                            onChange={(e) => {
                              const found = selectedFranchise.products.find(p => p.id === e.target.value);
                              if (found) setSimSelectedProd(found);
                            }}
                            className="w-full bg-zinc-50 border-2 border-black px-2 py-1.5 text-xs font-bold focus:outline-none"
                          >
                            {selectedFranchise.products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase block text-zinc-700">Aantal</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={simQty}
                            onChange={(e) => setSimQty(parseInt(e.target.value) || 1)}
                            required
                            className="w-full bg-zinc-50 border-2 border-black px-2 py-1.5 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={simLoading || !simSelectedProd}
                        className="w-full bg-zinc-200 hover:bg-zinc-300 border-2 border-black font-black uppercase tracking-wider py-3 flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        RUN WEBHOOK SIMULATOR
                      </button>
                    </form>
                  )}
                </div>

                {/* Console Log feedback */}
                <div className="border-4 border-black bg-black text-green-400 p-6 shadow-[6px_6px_0px_#000000] h-[300px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-green-500">Live Webhook Log Terminal</span>
                    <div className="w-2.5 h-2.5 bg-gold rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs flex flex-col justify-end">
                    {simLogs.length === 0 && (
                      <span className="text-zinc-600 font-bold">&gt; Wacht op webhook activiteit...</span>
                    )}
                    {simLogs.map((log, i) => (
                      <div 
                        key={i} 
                        className={
                          log.includes("[SUCCESS]") ? "text-green-300 font-black" : 
                          log.includes("[SYS]") ? "text-yellow-400 font-bold" : 
                          log.includes("[ERROR]") ? "text-gold font-black" : "text-green-500"
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Order History */}
              <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000000]">
                <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
                  Uplink Transactie Logbestand & Audit Cut
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b-2 border-black bg-zinc-200">
                        <th className="py-2 px-3 uppercase font-black">Order ID</th>
                        <th className="py-2 px-3 uppercase font-black">Klant</th>
                        <th className="py-2 px-3 uppercase font-black">Items</th>
                        <th className="py-2 px-3 uppercase font-black text-right">Totaal</th>
                        <th className="py-2 px-3 uppercase font-black text-right text-gold">Henk (25% Cut)</th>
                        <th className="py-2 px-3 uppercase font-black text-center">Status</th>
                        <th className="py-2 px-3 uppercase font-black text-right">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-zinc-500 font-bold">
                            Geen transacties gesynchroniseerd via deze shop uplink.
                          </td>
                        </tr>
                      ) : (
                        orders.map((o) => (
                          <tr key={o.id} className="border-b border-zinc-300 hover:bg-zinc-50">
                            <td className="py-2 px-3 font-bold">{o.id.substring(0, 8).toUpperCase()}</td>
                            <td className="py-2 px-3 font-bold">{o.customerName}<br /><span className="text-[10px] text-zinc-500 font-normal">{o.customerEmail}</span></td>
                            <td className="py-2 px-3">
                              {Array.isArray(o.items) ? o.items.map((item: any) => `${item.name} (x${item.quantity})`).join(", ") : "Geen items"}
                            </td>
                            <td className="py-2 px-3 font-black text-right">${o.totalAmount.toFixed(2)}</td>
                            <td className="py-2 px-3 font-black text-right text-gold">${o.platformCut.toFixed(2)}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="bg-green-200 text-green-800 border border-green-600 font-black text-[9px] px-2 py-0.5 uppercase">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-4 border-[#d4af37] bg-[#0a192f] p-6 shadow-[6px_6px_0px_#dc2626]">
                <h2 className="text-xl font-black uppercase text-gold tracking-wider mb-2 flex items-center gap-2">
                  DANGER PROTOCOL
                </h2>
                <p className="text-xs text-[#d4af37] font-bold mb-4">
                  Permanent verbreken van deze winkel-uplink. Dit stopt alle data-synchronisatie kanalen.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteFranchise}
                  className="bg-gold hover:bg-[#0a192f] text-white border-2 border-[#d4af37] font-black uppercase tracking-wider px-4 py-2 text-xs shadow-[2px_2px_0px_#000000]"
                >
                  DEACTIVATE UPLINK permanently
                </button>
              </div>
            </>
          ) : (
            <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0px_#000000] flex flex-col items-center justify-center h-[350px]">
              <Terminal className="w-16 h-16 text-zinc-400 mb-4 stroke-[2]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-800">Geen Store Uplink Geselecteerd</h2>
              <p className="text-zinc-500 text-sm mt-2 font-bold max-w-md uppercase">
                Selecteer een actieve winkel aan de linkerkant of koppel een nieuwe winkel om de diagnostiek te activeren.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

