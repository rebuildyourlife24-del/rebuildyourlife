'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api, formatApiError } from '@/lib/api';
import Link from 'next/link';
import { 
  User, 
  Lock, 
  Key, 
  CreditCard, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  MonitorPlay
} from 'lucide-react';
import { IntegrationsVault } from '@/components/ui/IntegrationsVault';
import { useCinematicTheme } from '@/lib/contexts/ThemeContext';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const { activeTheme, setActiveTheme } = useCinematicTheme();
  
  // Profile Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [activeTier, setActiveTier] = useState('FREE');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Invoices & Billing
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<{ data: any }>('/user/me');
        if (res.data) {
          const d: any = res.data;
          setFirstName(d.firstName || '');
          setLastName(d.lastName || '');
          setOpenaiKey(d.openaiKey || '');
          setActiveTier(d.subscriptionTier || 'FREE');
        }
      } catch (err: any) {
        console.log("Settings API niet bereikbaar:", err?.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchInvoices = async () => {
      try {
        const res = await api.get<any>('/payments/invoices');
        if (res.data) {
          setInvoices(Array.isArray(res.data) ? res.data : (res.data.data || []));
        }
      } catch (err: any) {
        console.log("Invoices API niet bereikbaar:", err?.message);
      } finally {
        setInvoicesLoading(false);
      }
    };

    fetchProfile();
    fetchInvoices();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileSaving(true);

    try {
      await api.patch('/user/me', { firstName, lastName, openaiKey });
      setProfileMessage('Profiel succesvol opgeslagen!');
    } catch (err) {
      setProfileError(formatApiError(err));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    setPasswordSaving(true);

    try {
      // Fixed endpoint bug from /user/password to /user/me/password
      await api.patch('/user/me/password', { currentPassword, newPassword });
      setPasswordMessage('Wachtwoord succesvol gewijzigd!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(formatApiError(err));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleUpgrade = async (plan: 'PREMIUM' | 'ENTERPRISE') => {
    setCheckoutLoading(plan);
    try {
      const res = await api.post<any>('/payments/checkout', { plan });
      if (res.data) {
        const url = res.data.checkoutUrl || res.data.data?.checkoutUrl;
        if (url) {
          window.location.href = url;
        }
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Er is een fout opgetreden bij het starten van de betaling. Probeer het later opnieuw.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const downloadMockInvoice = (invoice: any) => {
    // Generate simulated PDF text and download
    const invoiceContent = `
=========================================
REBUILD YOUR LIFE - SYSTEM INVOICE
=========================================
Invoice Nr:   ${invoice.invoiceNr}
Date:         ${new Date(invoice.createdAt).toLocaleDateString('nl-NL')}
Description:  ${invoice.description}
Amount:       EUR ${invoice.amount.toFixed(2)}
Status:       ${invoice.status}
=========================================
Thank you for hacking the matrix with us.
Rebuild Your Life.
=========================================
    `;
    const element = document.createElement("a");
    const file = new Blob([invoiceContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Invoice-${invoice.invoiceNr}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing settings core...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto pb-20 font-sans text-white">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">
            System <span className="text-zinc-500">Instellingen</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500 font-mono">
            MANAGE PROFILE, API INTEGRATIONS, AND BILLING PARAMETERS.
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/settings/emails" 
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-mono font-bold uppercase text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-850"
          >
            Email Vault
          </Link>
          <Link 
            href="/dashboard/settings/integrations" 
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-mono font-bold uppercase text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-850"
          >
            System Integrations
          </Link>
          <Link 
            href="/dashboard/settings/business-rules" 
            className="rounded-lg bg-emerald-900/30 px-4 py-2 text-xs font-mono font-bold uppercase text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/50 transition-colors border border-emerald-900/50"
          >
            Business Rules
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Profile Card */}
          <Card className="bg-[#050505] border border-zinc-850 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-850 flex items-center justify-center rounded-xl">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight uppercase">User Profile</h2>
                <p className="text-xs text-zinc-500 font-mono">PERSONAL DATA DEPLOYMENT</p>
              </div>
            </div>

            {profileMessage && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/5 text-green-400 border border-green-500/20 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {profileMessage}
              </div>
            )}
            {profileError && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 text-emerald-400Light border border-emerald-500/20 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Voornaam"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-black border-zinc-850 focus:border-white text-white rounded-xl"
                  required
                />
                <Input
                  label="Achternaam"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-black border-zinc-850 focus:border-white text-white rounded-xl"
                  required
                />
              </div>

              <div className="pt-6 border-t border-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">OpenAI API Key</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed font-light font-mono">
                  Koppel je eigen OpenAI API sleutel om AI agents en coworkers binnen jouw workspace autonoom te laten draaien.
                </p>
                <Input
                  label="OpenAI API Key"
                  type="password"
                  placeholder="sk-proj-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="bg-black border-zinc-855 focus:border-white text-white rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  disabled={profileSaving}
                  className="bg-white hover:bg-zinc-200 text-black font-bold font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300"
                >
                  {profileSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Card */}
          <Card className="bg-[#050505] border border-zinc-850 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-855 flex items-center justify-center rounded-xl">
                <Lock className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight uppercase">Security</h2>
                <p className="text-xs text-zinc-500 font-mono">CREDENTIAL SHIELD PARAMETERS</p>
              </div>
            </div>

            {passwordMessage && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/5 text-green-400 border border-green-500/20 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {passwordMessage}
              </div>
            )}
            {passwordError && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 text-emerald-400Light border border-emerald-500/20 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSave} className="space-y-6">
              <Input
                label="Huidig Wachtwoord"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-black border-zinc-850 focus:border-white text-white rounded-xl"
                required
              />
              <Input
                label="Nieuw Wachtwoord"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black border-zinc-850 focus:border-white text-white rounded-xl"
                required
                minLength={8}
              />
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  variant="secondary" 
                  disabled={passwordSaving}
                  className="border border-zinc-850 hover:border-white bg-transparent hover:bg-zinc-950 text-white font-bold font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300"
                >
                  {passwordSaving ? 'PROCESSING...' : 'UPDATE PASSWORD'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Cinematic Engine Card */}
          <Card className="bg-[#050505] border border-zinc-850 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-855 flex items-center justify-center rounded-xl">
                <MonitorPlay className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight uppercase">Cinematic Engine</h2>
                <p className="text-xs text-zinc-500 font-mono">3D WEBGL ENVIRONMENT THEME</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6 font-light">
              Kies het visuele thema voor jouw fullscreen OS ervaring. Deze wijziging wordt direct globaal doorgevoerd.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTheme('scifi')} 
                className={`p-4 rounded-xl border text-left transition-all ${activeTheme === 'scifi' ? 'border-cyan-400 bg-cyan-950/20' : 'border-zinc-800 hover:border-zinc-600 bg-black'}`}
              >
                <div className="text-cyan-400 font-bold uppercase tracking-wider mb-1">Sci-Fi</div>
                <div className="text-[10px] text-zinc-500 font-mono">Volumetric Lights & Stars</div>
              </button>
              
              <button 
                onClick={() => setActiveTheme('cyberpunk')} 
                className={`p-4 rounded-xl border text-left transition-all ${activeTheme === 'cyberpunk' ? 'border-fuchsia-400 bg-fuchsia-950/20' : 'border-zinc-800 hover:border-zinc-600 bg-black'}`}
              >
                <div className="text-fuchsia-400 font-bold uppercase tracking-wider mb-1">Cyberpunk</div>
                <div className="text-[10px] text-zinc-500 font-mono">Neon Grid & Data Streams</div>
              </button>
              
              <button 
                onClick={() => setActiveTheme('dark')} 
                className={`p-4 rounded-xl border text-left transition-all ${activeTheme === 'dark' ? 'border-[#C8A96B] bg-[#C8A96B]/10' : 'border-zinc-800 hover:border-zinc-600 bg-black'}`}
              >
                <div className="text-[#C8A96B] font-bold uppercase tracking-wider mb-1">Thriller</div>
                <div className="text-[10px] text-zinc-500 font-mono">Deep Shadows & Gold</div>
              </button>
            </div>
          </Card>

        </div>

        {/* Right Column: Billing & Subscription */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Subscription Tier Widget */}
          <Card className="bg-[#050505] border border-zinc-855 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-850 flex items-center justify-center rounded-xl">
                  <CreditCard className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight uppercase">Subscription</h2>
                  <p className="text-xs text-zinc-500 font-mono">TIER SYSTEM CONTROL</p>
                </div>
              </div>

              {/* Tier display */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Active Membership</span>
                <h3 className="text-4xl font-black text-white tracking-tight uppercase">
                  {activeTier} Plan
                </h3>
                <div className="mt-4 flex justify-center">
                  <Badge 
                    variant={activeTier === 'FREE' ? 'outline' : activeTier === 'PREMIUM' ? 'gold' : 'info'}
                    size="md"
                    dot
                  >
                    STATUS: ACTIVE
                  </Badge>
                </div>
              </div>

              {/* Tiers List and upgrade action */}
              <div className="space-y-4">
                <div className="border border-zinc-900 p-4 rounded-2xl bg-black/40 flex items-center justify-between group/tier">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Premium Plan</h4>
                    <p className="text-xs text-zinc-500 font-mono">€14.95 / MAAND</p>
                  </div>
                  {activeTier === 'PREMIUM' ? (
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full uppercase tracking-wider">Actief</span>
                  ) : activeTier === 'ENTERPRISE' ? (
                    <span className="text-[10px] font-mono text-zinc-650 uppercase tracking-wider">Included</span>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade('PREMIUM')}
                      disabled={checkoutLoading !== null}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg border border-zinc-850 hover:border-zinc-700"
                    >
                      {checkoutLoading === 'PREMIUM' ? 'LOADING...' : 'UPGRADE'}
                    </Button>
                  )}
                </div>

                <div className="border border-zinc-900 p-4 rounded-2xl bg-black/40 flex items-center justify-between group/tier">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Enterprise Plan</h4>
                    <p className="text-xs text-zinc-500 font-mono">€49.95 / MAAND</p>
                  </div>
                  {activeTier === 'ENTERPRISE' ? (
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full uppercase tracking-wider">Actief</span>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade('ENTERPRISE')}
                      disabled={checkoutLoading !== null}
                      className="bg-white hover:bg-zinc-200 text-black font-bold font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg"
                    >
                      {checkoutLoading === 'ENTERPRISE' ? 'LOADING...' : 'UPGRADE'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
              <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                Beheer je lidmaatschap rechtstreeks. Betalingen worden veilig verwerkt via Mollie. Wijzigingen worden per direct geactiveerd.
              </p>
            </div>
          </Card>

          {/* Invoices List */}
          <Card className="bg-[#050505] border border-zinc-855 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-850 flex items-center justify-center rounded-xl">
                  <FileText className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight uppercase">Billing history</h2>
                  <p className="text-xs text-zinc-500 font-mono">SYSTEM TRANSACTIONS</p>
                </div>
              </div>
            </div>

            {invoicesLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-900 rounded-2xl">
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">No transaction logs available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div 
                    key={inv.id}
                    className="border border-zinc-900 rounded-xl bg-black/20 p-4 flex items-center justify-between hover:border-zinc-800 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold tracking-wide text-white">{inv.invoiceNr}</span>
                        <Badge 
                          variant={inv.status === 'COMPLETED' || inv.status === 'PAID' ? 'success' : 'warning'} 
                          size="sm"
                        >
                          {inv.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">
                        {new Date(inv.createdAt).toLocaleDateString('nl-NL')}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{inv.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-black text-white">€{inv.amount.toFixed(2)}</span>
                      <button 
                        onClick={() => downloadMockInvoice(inv)}
                        className="w-8 h-8 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-900 hover:border-zinc-700 flex items-center justify-center transition-colors text-zinc-400 hover:text-white"
                        title="Download Factuur TXT"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

      </div>
    </div>
  );
}
