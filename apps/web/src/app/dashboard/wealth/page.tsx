"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Landmark, TrendingUp, TrendingDown, Shield, RefreshCw, Link as LinkIcon, AlertTriangle, Search, Globe } from 'lucide-react';
import { getWealthData, createBankRequisition, syncBankAccounts, getInstitutions } from '@/actions/wealth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function WealthVaultPage({ searchParams }: { searchParams: { ref?: string } }) {
  const [data, setData] = useState<{ connections: any[], totalWealth: number }>({ connections: [], totalWealth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Bank Selection State
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('NL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If returning from GoCardless with a ref (requisition_id)
    const requisitionId = new URLSearchParams(window.location.search).get('ref');
    if (requisitionId && !isSyncing) {
      handleSync(requisitionId);
    } else {
      loadData();
    }
  }, []);

  useEffect(() => {
    loadInstitutions(selectedCountry);
  }, [selectedCountry]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const wealthData = await getWealthData();
      setData(wealthData);
    } catch (error) {
      console.error("Failed to load wealth data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInstitutions = async (country: string) => {
    setLoadingInstitutions(true);
    try {
      const banks = await getInstitutions(country);
      setInstitutions(Array.isArray(banks) ? banks : []);
    } catch (error) {
      console.error("Failed to load institutions", error);
      setInstitutions([]);
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const handleSync = async (requisitionId: string) => {
    setIsSyncing(true);
    try {
      await syncBankAccounts(requisitionId);
      // Clean up URL
      window.history.replaceState({}, document.title, "/dashboard/wealth");
      await loadData();
    } catch (error) {
      alert("Failed to sync bank accounts. Maybe they are already synced or API keys are missing.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLinkBank = async (institutionId: string) => {
    setIsLinking(true);
    try {
      const redirectUrl = window.location.origin + "/dashboard/wealth";
      const { link, requisitionId } = await createBankRequisition(institutionId, redirectUrl);
      
      // Store requisition ID in URL so we can pick it up when we come back
      window.location.href = `${link}?ref=${requisitionId}`;
    } catch (error: any) {
      alert(error.message);
      setIsLinking(false);
    }
  };

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-20 font-sans select-none relative z-10"
    >
      {/* Background glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-900/10 hidden blur-[] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <motion.div variants={itemVariants} className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase flex items-center gap-4">
               <Shield className="w-8 h-8 text-emerald-500" />
               THE WEALTH VAULT
             </h1>
             <span className="text-[10px] font-bold tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 rounded-full uppercase">
               GLOBAL PSD2 PROTOCOL
             </span>
          </div>
          <p className="text-emerald-400/60 uppercase tracking-widest text-xs flex items-center gap-2 font-bold">
             <Landmark className="w-4 h-4" /> Live Liquidity & Global Bank Synchronization
          </p>
        </div>
      </motion.div>

      {isSyncing && (
        <div className="bg-emerald-950/30 border border-emerald-500/50 p-6 rounded-xl flex items-center justify-center gap-4 animate-pulse text-emerald-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-black uppercase tracking-widest text-sm">SYNCHRONIZING SECURE BANK DATA...</span>
        </div>
      )}

      {/* Main Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">LIVE NET WORTH</h3>
          <div className="text-4xl font-black text-white mb-1 tracking-tight">
            €{data.totalWealth.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> BASED ON SYNCED ASSETS
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Connected Banks */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-500" /> SYNCED BANK ACCOUNTS
              </h2>
            </div>

            {isLoading ? (
               <div className="text-emerald-500 animate-pulse font-black uppercase tracking-widest py-10 text-center text-xs">
                 DECRYPTING LEDGER...
               </div>
            ) : data.connections.length === 0 ? (
               <div className="text-zinc-500 font-bold uppercase tracking-widest bg-zinc-950/40 border border-white/5 p-12 text-center rounded-xl text-xs">
                 NO FINANCIAL INSTITUTIONS CONNECTED.
               </div>
            ) : (
              <div className="space-y-4">
                {data.connections.map((conn) => (
                  <div key={conn.id} className="bg-zinc-950/60 border border-white/5 rounded-xl p-5 flex justify-between items-center hover:border-emerald-500/30 transition-colors">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">{conn.accountName}</h3>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">
                        {conn.provider} • ID: {conn.accountId.substring(0,8)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-400">
                        {conn.transactions.length > 0 
                          ? `€${conn.transactions.find((t:any) => t.type === 'BALANCE_SYNC')?.amount.toLocaleString('nl-NL', {minimumFractionDigits:2})}` 
                          : 'SYNCING...'}
                      </div>
                      <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                        LAST SYNC: {new Date(conn.lastSyncAt).toLocaleString('nl-NL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Col: Add Bank */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="p-6 bg-black/40 border border-white/5 backdrop-blur-md flex flex-col h-full max-h-[600px]">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4 shrink-0">
              <Globe className="w-3 h-3" /> CONNECT GLOBAL BANK (PSD2)
            </h3>
            
            <div className="flex gap-2 mb-4 shrink-0">
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-zinc-950 border border-white/10 rounded-lg text-xs font-bold text-white px-3 py-2 outline-none focus:border-emerald-500 w-24"
              >
                <option value="NL">🇳🇱 NL</option>
                <option value="BE">🇧🇪 BE</option>
                <option value="DE">🇩🇪 DE</option>
                <option value="GB">🇬🇧 GB</option>
                <option value="FR">🇫🇷 FR</option>
                <option value="ES">🇪🇸 ES</option>
                <option value="IT">🇮🇹 IT</option>
                <option value="US">🇺🇸 US</option>
              </select>
              
              <div className="relative flex-1">
                <Search className="w-3 h-3 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Zoek bank..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg text-xs text-white pl-8 pr-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {loadingInstitutions ? (
                <div className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-bold text-center py-8">
                  Fetching Global Institutions...
                </div>
              ) : filteredInstitutions.length === 0 ? (
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold text-center py-8">
                  No banks found or API keys missing in .env
                </div>
              ) : (
                filteredInstitutions.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => handleLinkBank(inst.id)}
                    disabled={isLinking || isSyncing}
                    className="w-full text-left p-3 rounded-lg border border-white/5 bg-black/40 hover:bg-emerald-950/30 hover:border-emerald-500/30 transition-all flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {inst.logo ? (
                         <img src={inst.logo} alt={inst.name} className="w-6 h-6 rounded bg-white object-contain p-0.5" />
                      ) : (
                         <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
                           <Landmark className="w-3 h-3 text-zinc-400" />
                         </div>
                      )}
                      <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{inst.name}</span>
                    </div>
                    <LinkIcon className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </div>
            
            <div className="mt-4 p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg shrink-0">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold leading-relaxed">
                  GoCardless Secret ID & Key vereist in .env voor live connecties.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
