'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Paywall } from '@/components/ui/Paywall';
import { api, formatApiError } from '@/lib/api';

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
    } catch (err) {
      console.error(err);
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
              className="border-gold text-gold hover:bg-gold/10 font-bold tracking-wide text-xs shadow-[0_0_15px_rgba(212,168,83,0.15)] relative overflow-hidden group h-full"
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

      {scenarios.length > 0 && (
        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-textPrimary mb-4">Aflossingsstrategieën</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-surface/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gold">Sneeuwbal Methode</h3>
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold" strokeWidth="1.5">
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
        {serverError && <p className="text-danger text-sm mb-4">{serverError}</p>}
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
