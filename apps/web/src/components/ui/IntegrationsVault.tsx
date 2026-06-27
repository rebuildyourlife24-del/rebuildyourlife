'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, ShoppingCart, Key, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getShopifyConnectionsAction, connectShopifyStoreAction, removeShopifyConnectionAction } from '@/actions/integrations';

export function IntegrationsVault() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [shopUrl, setShopUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    const res = await getShopifyConnectionsAction();
    if (res.success) {
      setConnections(res.data || []);
    }
    setLoading(false);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setMsg({ text: '', type: '' });
    
    const res = await connectShopifyStoreAction(shopUrl, accessToken);
    if (res.success) {
      setMsg({ text: res.message || 'Success', type: 'success' });
      setShopUrl('');
      setAccessToken('');
      await fetchConnections();
    } else {
      setMsg({ text: res.error || 'Connection failed', type: 'error' });
    }
    setConnecting(false);
  };

  const handleRemove = async (id: string) => {
    if(!confirm("Weet je zeker dat je deze koppeling wilt verbreken?")) return;
    const res = await removeShopifyConnectionAction(id);
    if (res.success) {
      await fetchConnections();
    } else {
      alert(res.error);
    }
  };

  return (
    <Card className="bg-[#050505] border border-cyan-900/30 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group mb-8">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 bg-cyan-950 border border-cyan-800 flex items-center justify-center rounded-xl">
          <Lock className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase text-white">Secure Integrations Vault</h2>
          <p className="text-xs text-cyan-500 font-mono">CRYPTOGRAPHIC LOCAL KEY STORAGE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Connection Form */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-cyan-500" /> Connect Shopify
          </h3>
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1 block">Shop URL (bijv. shop.myshopify.com)</label>
              <input 
                type="text" 
                value={shopUrl}
                onChange={e => setShopUrl(e.target.value)}
                placeholder="store-name.myshopify.com"
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1 block">Admin API Access Token</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  placeholder="shpat_..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  required
                />
                <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              </div>
            </div>
            
            {msg.text && (
              <div className={`p-3 rounded-lg border text-xs font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400' : 'bg-cyan-950/30 border-cyan-900 text-cyan-400'}`}>
                {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {msg.text}
              </div>
            )}

            <Button 
              type="submit"
              disabled={connecting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-3 rounded-xl transition-all"
            >
              {connecting ? 'Encrypting & Connecting...' : 'Connect to Sovereign Grid'}
            </Button>
          </form>
        </div>

        {/* Active Connections */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Active Connections</h3>
          {loading ? (
             <div className="flex justify-center p-8"><RefreshCw className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : connections.length === 0 ? (
             <div className="bg-black/40 border border-dashed border-white/10 rounded-xl p-6 text-center">
               <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Geen actieve connecties</p>
             </div>
          ) : (
            <div className="space-y-3">
              {connections.map((conn) => (
                <div key={conn.id} className="bg-black border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:border-cyan-500/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Shopify</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">{conn.shopUrl}</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(conn.id)}
                    className="text-[10px] uppercase font-bold text-cyan-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-cyan-950/50 rounded"
                  >
                    Disconnect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Card>
  );
}
