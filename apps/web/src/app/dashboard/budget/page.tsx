'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api, formatApiError } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface Category {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

interface BudgetSummary {
  id?: string;
  month: string;
  hasBudget?: boolean;
  totalIncome: number;
  totalExpenses: number;
  savingsTarget: number;
  totalPlanned: number;
  totalActual: number;
  balance: number;
  categories: Category[];
}

export default function BudgetPage() {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Forms
  const [budgetForm, setBudgetForm] = useState({
    totalIncome: '',
    savingsTarget: '',
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    planned: '',
    actual: '0',
  });

  const getCurrentMonthStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthStr());

  const loadBudget = async () => {
    try {
      setLoading(true);
      const res = await api.get<BudgetSummary>(`/budget/summary/${currentMonth}`);
      setSummary(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSummary(null);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget();
  }, [currentMonth]);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    try {
      await api.post('/budget', {
        month: `${currentMonth}-01T00:00:00Z`, // API expects ISO format or specific parsing, let's just pass ISO format
        totalIncome: Number(budgetForm.totalIncome),
        totalExpenses: 0,
        savingsTarget: Number(budgetForm.savingsTarget),
        categories: [],
      });
      setIsNewBudgetModalOpen(false);
      loadBudget();
    } catch (err) {
      setServerError(formatApiError(err));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;
    setServerError('');
    try {
      await api.post(`/budget/${summary.id}/categories`, {
        name: categoryForm.name,
        planned: Number(categoryForm.planned),
        actual: Number(categoryForm.actual),
      });
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', planned: '', actual: '0' });
      loadBudget();
    } catch (err) {
      setServerError(formatApiError(err));
    }
  };

  const previousMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    let newM = m - 1;
    let newY = y;
    if (newM === 0) {
      newM = 12;
      newY -= 1;
    }
    setCurrentMonth(`${newY}-${String(newM).padStart(2, '0')}`);
  };

  const nextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    let newM = m + 1;
    let newY = y;
    if (newM === 13) {
      newM = 1;
      newY += 1;
    }
    setCurrentMonth(`${newY}-${String(newM).padStart(2, '0')}`);
  };

  if (loading && !summary) {
    return <div className="text-white">Loading Budget...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Budget</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Houd je inkomsten en uitgaven bij om controle te behouden.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface/50 rounded-xl border border-white/5 p-1">
            <button onClick={previousMonth} className="p-2 text-textSecondary hover:text-textPrimary hover:bg-white/5 rounded-lg">
              &lt;
            </button>
            <span className="px-4 font-medium text-textPrimary">{currentMonth}</span>
            <button onClick={nextMonth} className="p-2 text-textSecondary hover:text-textPrimary hover:bg-white/5 rounded-lg">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {!summary || !summary.hasBudget ? (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-light mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-textPrimary">Geen budget voor deze maand</h3>
          <p className="text-sm text-textSecondary mt-2 mb-6">
            Je hebt nog geen budget ingesteld voor {currentMonth}. Maak er een aan om je financiële doelen te bewaken.
          </p>
          <Button onClick={() => setIsNewBudgetModalOpen(true)}>Budget Maken</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-4">
            <Card variant="glass" className="p-6">
              <h3 className="text-sm font-medium text-textSecondary">Inkomen</h3>
              <p className="mt-2 text-2xl font-bold text-success">
                € {(summary.totalIncome || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
            </Card>
            <Card variant="glass" className="p-6">
              <h3 className="text-sm font-medium text-textSecondary">Gepland</h3>
              <p className="mt-2 text-2xl font-bold text-textPrimary">
                € {(summary.totalExpenses || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
            </Card>
            <Card variant="glass" className="p-6">
              <h3 className="text-sm font-medium text-textSecondary">Uitgegeven</h3>
              <p className="mt-2 text-2xl font-bold text-warning">
                € {(summary.totalActual || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
            </Card>
            <Card variant="glass" className="p-6">
              <h3 className="text-sm font-medium text-textSecondary">Restant</h3>
              <p className={`mt-2 text-2xl font-bold ${(summary.balance || 0) < 0 ? 'text-danger' : 'text-emerald-400'}`}>
                € {(summary.balance || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="glass" className="md:col-span-1 p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-textSecondary w-full mb-4">Uitgavenverdeling</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={summary.categories.filter(c => c.actual > 0)} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="actual"
                      nameKey="name"
                    >
                      {summary.categories.filter(c => c.actual > 0).map((_, index) => {
                        const COLORS = ['#d4a853', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />;
                      })}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: any) => `€ ${Number(value).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`}
                      contentStyle={{ backgroundColor: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f1f1' }}
                      itemStyle={{ color: '#d4a853' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card variant="glass" className="md:col-span-2 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-textPrimary">Categorieën</h2>
                <Button size="sm" variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>+ Toevoegen</Button>
              </div>
              {summary.categories.length === 0 ? (
                <div className="p-8 text-center text-textSecondary text-sm">
                  Nog geen categorieën toegevoegd (bijv. Boodschappen, Vervoer).
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {summary.categories.map(cat => (
                    <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div>
                        <h4 className="font-medium text-textPrimary">{cat.name}</h4>
                        <p className="text-xs text-textSecondary">Gepland: € {cat.planned}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-textPrimary">€ {cat.actual}</p>
                        <p className={`text-xs ${cat.planned - cat.actual < 0 ? 'text-danger' : 'text-success'}`}>
                          {cat.planned - cat.actual >= 0 ? 'Over: ' : 'Teveel: '} 
                          € {Math.abs(cat.planned - cat.actual).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal isOpen={isNewBudgetModalOpen} onClose={() => setIsNewBudgetModalOpen(false)} title={`Budget voor ${currentMonth}`}>
        {serverError && <p className="text-danger text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleCreateBudget} className="space-y-4">
          <Input
            label="Verwacht Inkomen (€)"
            type="number" step="0.01" required
            value={budgetForm.totalIncome}
            onChange={e => setBudgetForm({...budgetForm, totalIncome: e.target.value})}
          />
          <Input
            label="Spaardoel (€)"
            type="number" step="0.01" required
            value={budgetForm.savingsTarget}
            onChange={e => setBudgetForm({...budgetForm, savingsTarget: e.target.value})}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsNewBudgetModalOpen(false)}>Annuleren</Button>
            <Button type="submit">Aanmaken</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Categorie Toevoegen">
        {serverError && <p className="text-danger text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Naam (bijv. Boodschappen)"
            required
            value={categoryForm.name}
            onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Gepland Budget (€)"
              type="number" step="0.01" required
              value={categoryForm.planned}
              onChange={e => setCategoryForm({...categoryForm, planned: e.target.value})}
            />
            <Input
              label="Reeds Uitgegeven (€)"
              type="number" step="0.01" required
              value={categoryForm.actual}
              onChange={e => setCategoryForm({...categoryForm, actual: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsCategoryModalOpen(false)}>Annuleren</Button>
            <Button type="submit">Toevoegen</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
