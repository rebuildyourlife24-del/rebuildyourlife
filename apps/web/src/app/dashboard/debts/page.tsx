'use client';

import { useState, useEffect } from 'react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Paywall } from '@/components/ui/Paywall';
import { api, formatApiError } from '@/lib/api';
import { scanEmailForDebts, executeNegotiationProtocol } from '@/actions/legal';
import { Radar, Skull, MailWarning, Zap, CheckCircle2, Shield } from 'lucide-react';

interface DebtOverview {
  totalDebts: number;
  totalOwed: number;
  totalMonthlyPayments: number;
  totalPaid: number;
  debtsByStatus: Record<string, number>;
}

interface PayoffScenarioResult {
  method: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  monthlyBreakdown: any[];
}

export default function DebtsPage() {
  const [overview, setOverview] = useState<DebtOverview | null>(null);
  const [scenarios, setScenarios] = useState<PayoffScenarioResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Inbox Scanner State
  const [scannedDebts, setScannedDebts] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [negotiatingId, setNegotiatingId] = useState<string | null>(null);
  const [negotiationResult, setNegotiationResult] = useState<{id: string, message: string} | null>(null);
  
  // New Debt Form
  const [form, setForm] = useState({
    creditorName: '',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    minimumPayment: '',
    monthlyPayment: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewRes, scenariosRes] = await Promise.all([
        api.get<DebtOverview>('/debt/overview'),
        api.get<PayoffScenarioResult[]>('/debt/scenarios'),
      ]);
      setOverview(overviewRes.data as DebtOverview);
      setScenarios((scenariosRes.data as PayoffScenarioResult[]) || []);
    } catch (err: any) {
      console.log("Debts API niet bereikbaar (nog niet gekoppeld):", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    try {
      await api.post('/debt', {
        creditorName: form.creditorName,
        originalAmount: Number(form.originalAmount),
        currentBalance: Number(form.currentBalance),
        interestRate: Number(form.interestRate),
        minimumPayment: Number(form.minimumPayment),
        monthlyPayment: Number(form.monthlyPayment),
      });
      setIsModalOpen(false);
      setForm({
        creditorName: '',
        originalAmount: '',
        currentBalance: '',
        interestRate: '',
        minimumPayment: '',
        monthlyPayment: '',
      });
      loadData();
    } catch (err) {
      setServerError(formatApiError(err));
    }
  };

  const handleScanInbox = async () => {
    setIsScanning(true);
    setScanComplete(false);
    try {
      const results = await scanEmailForDebts();
      setScannedDebts(results);
      setScanComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleNegotiate = async (id: string, action: string) => {
    setNegotiatingId(id);
    try {
      const result = await executeNegotiationProtocol(id, action);
      if (result.success) {
        setNegotiationResult({ id, message: result.message });
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNegotiatingId(null);
    }
  };

  if (loading && !overview) {
    return <div className="text-white">Loading Debt Center...</div>;
  }

  const snowball = scenarios.find(s => s.method === 'snowball');
  const avalanche = scenarios.find(s => s.method === 'avalanche');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Debt Center</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Krijg controle over je schulden met slimme strategieën.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Paywall requiredTier="PREMIUM">
            <Button 
              variant="secondary"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-bold tracking-wide text-xs shadow-[0_0_15px_rgba(212,168,83,0.15)] relative overflow-hidden group h-full"
              onClick={() => alert("Legal PDF wordt gegenereerd...")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mr-2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              LEGAL ENGINE: GENEREER BRIEF
            </Button>
          </Paywall>
          <Button onClick={() => setIsModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Schuld Toevoegen
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="glass" className="p-6">
          <h3 className="text-sm font-medium text-textSecondary">Totale Schuld</h3>
          <p className="mt-2 text-3xl font-bold text-textPrimary">
            € {(overview?.totalOwed || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card variant="glass" className="p-6">
          <h3 className="text-sm font-medium text-textSecondary">Maandelijkse Lasten</h3>
          <p className="mt-2 text-3xl font-bold text-textPrimary">
            € {(overview?.totalMonthlyPayments || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card variant="glass" className="p-6">
          <h3 className="text-sm font-medium text-textSecondary">Aantal Schulden</h3>
          <p className="mt-2 text-3xl font-bold text-textPrimary">
            {overview?.totalDebts}
          </p>
        </Card>
      </div>

      {/* GODBRAIN INBOX SCANNER */}
      <div className="border-2 border-navyLight bg-black p-6 relative overflow-hidden shadow-[inset_0_0_30px_rgba(153,27,27,0.2)] mt-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a192f] to-transparent"></div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
            <Radar className={`w-6 h-6 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
            GODBRAIN E-MAIL SCANNER
          </h2>
          <Button 
            onClick={handleScanInbox} 
            disabled={isScanning}
            className="bg-emerald-500 hover:bg-emerald-500 text-black font-black uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            {isScanning ? 'SCANNING INBOX...' : 'INITIATE SCAN'}
          </Button>
        </div>

        {isScanning && (
          <div className="text-emerald-400 font-mono text-sm animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 
            Zoeken naar facturen, incassobrieven en dreigementen...
          </div>
        )}

        {scanComplete && scannedDebts.length === 0 && (
          <div className="text-emerald-400/70 font-mono text-sm">Geen nieuwe vorderingen gedetecteerd.</div>
        )}

        {scannedDebts.length > 0 && (
          <div className="space-y-4">
            {scannedDebts.map(debt => (
              <div key={debt.id} className="border border-navyLight/50 bg-[#0a192f]/10 p-4 font-mono">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{debt.creditorName}</h3>
                    <p className="text-emerald-400/70 text-xs">Bron: {debt.extractedFromEmail} | {new Date(debt.dateFound).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-navyLight/40 text-emerald-400Light border border-[#d4af37] px-2 py-1 text-xs font-bold tracking-widest">
                    {debt.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 border-y border-navyLight/30 py-3">
                  <div>
                    <div className="text-emerald-400/50 text-xs">Oorspronkelijk Bedrag</div>
                    <div className="text-white font-bold">€{debt.originalAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-emerald-400/50 text-xs">Illegale Kosten (B*llshit)</div>
                    <div className="text-emerald-400 font-bold line-through">€{debt.illegalCollectionFees.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-emerald-400/50 text-xs">Totaal Geëist</div>
                    <div className="text-white font-bold">€{debt.totalClaimed.toFixed(2)}</div>
                  </div>
                </div>

                {negotiationResult?.id === debt.id ? (
                  <div className="bg-green-950/30 border border-green-500 text-green-500 p-3 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {negotiationResult?.message}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-navyLight/20 p-3 border-l-2 border-emerald-500 text-sm">
                      <span className="text-emerald-400 font-bold">AI STRATEGIE: </span>
                      <span className="text-white/80">{debt.aiRecommendation}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        size="sm"
                        disabled={negotiatingId === debt.id}
                        onClick={() => handleNegotiate(debt.id, 'DISPUTE_FEES')}
                        className="bg-black border border-emerald-500 text-emerald-400 hover:bg-[#0a192f]"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        BETWIST INCASSOKOSTEN
                      </Button>
                      <Button 
                        size="sm"
                        disabled={negotiatingId === debt.id}
                        onClick={() => handleNegotiate(debt.id, 'FINAL_SETTLEMENT')}
                        className="bg-emerald-500 text-black hover:bg-emerald-500 font-bold"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        STUUR SCHIKKINGSVOORSTEL
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {scenarios.length > 0 && (
        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-textPrimary mb-4">Aflossingsstrategieën</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-surface/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-emerald-400">Sneeuwbal Methode</h3>
                <span className="text-xs text-textSecondary bg-surface px-2 py-1 rounded">Kleinste eerst</span>
              </div>
              <p className="text-sm text-textSecondary mb-4">Motiveert door snelle overwinningen.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Tijd tot schuldenvrij:</span>
                  <span className="font-medium text-textPrimary">{snowball?.totalMonths} maanden</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Totale rente:</span>
                  <span className="font-medium text-textPrimary">€ {(snowball?.totalInterestPaid || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-surface/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-textPrimary">Lawine Methode</h3>
                <span className="text-xs text-textSecondary bg-surface px-2 py-1 rounded">Hoogste rente eerst</span>
              </div>
              <p className="text-sm text-textSecondary mb-4">Bespaart het meeste geld op lange termijn.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Tijd tot schuldenvrij:</span>
                  <span className="font-medium text-textPrimary">{avalanche?.totalMonths} maanden</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Totale rente:</span>
                  <span className="font-medium text-success">€ {(avalanche?.totalInterestPaid || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {overview?.totalDebts === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-light mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-textPrimary">Geen schulden gevonden</h3>
          <p className="text-sm text-textSecondary mt-2">
            Voeg je eerste schuld toe om inzicht te krijgen in je financiële situatie.
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nieuwe Schuld Toevoegen"
        description="Vul de gegevens in van je schuldeiser."
      >
        {serverError && <p className="text-emerald-400 text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleAddDebt} className="space-y-4">
          <Input
            label="Schuldeiser"
            required
            value={form.creditorName}
            onChange={e => setForm({...form, creditorName: e.target.value})}
            placeholder="Bijv. DUO, Creditcard, Belastingdienst"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Oorspronkelijk Bedrag (€)"
              type="number"
              step="0.01"
              required
              value={form.originalAmount}
              onChange={e => setForm({...form, originalAmount: e.target.value})}
            />
            <Input
              label="Huidig Saldo (€)"
              type="number"
              step="0.01"
              required
              value={form.currentBalance}
              onChange={e => setForm({...form, currentBalance: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Rente (%)"
              type="number"
              step="0.1"
              required
              value={form.interestRate}
              onChange={e => setForm({...form, interestRate: e.target.value})}
            />
            <Input
              label="Min. Betaling (€)"
              type="number"
              step="0.01"
              required
              value={form.minimumPayment}
              onChange={e => setForm({...form, minimumPayment: e.target.value})}
            />
            <Input
              label="Eigen Betaling (€)"
              type="number"
              step="0.01"
              required
              value={form.monthlyPayment}
              onChange={e => setForm({...form, monthlyPayment: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit">Opslaan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

