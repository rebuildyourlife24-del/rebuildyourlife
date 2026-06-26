'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api, formatApiError } from '@/lib/api';
import { GoalStatus, GoalTimeframe } from '@rebuildyourlife/shared';

interface Goal {
  id: string;
  title: string;
  description: string | null;
  timeframe: GoalTimeframe;
  status: GoalStatus;
  progress: number;
  targetDate: string | null;
}

const timeframeLabels: Record<GoalTimeframe, string> = {
  YEAR: 'Jaarlijks',
  QUARTER: 'Kwartaal',
  MONTH: 'Maandelijks',
  WEEK: 'Wekelijks',
  DAY: 'Dagelijks'
};

const statusColors: Record<GoalStatus, 'default' | 'success' | 'warning' | 'info' | 'gold' | 'danger'> = {
  NOT_STARTED: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  ABANDONED: 'danger'
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<GoalTimeframe | 'ALL'>('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    timeframe: GoalTimeframe.MONTH
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      // When 'ALL' is selected, omit the timeframe query param entirely
      const endpoint = activeTab === 'ALL' ? '/goals' : `/goals?timeframe=${activeTab}`;
      const res = await api.get<{ data: Goal[] }>(endpoint);
      const dataArray = (res as any).data || res || [];
      setGoals(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error(err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    try {
      await api.post('/goal', form);
      setIsModalOpen(false);
      setForm({ title: '', description: '', timeframe: GoalTimeframe.MONTH });
      loadGoals();
    } catch (err) {
      setServerError(formatApiError(err));
    }
  };

  // Since we re-fetch per tab, all loaded goals are relevant
  const filteredGoals = goals;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Doelen</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Volg je voortgang en bouw aan een nieuwe toekomst.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Nieuw Doel</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'ALL' ? 'bg-emerald-500 text-navy' : 'bg-surface/50 text-textSecondary hover:text-textPrimary hover:bg-surface'
          }`}
        >
          Alle Doelen
        </button>
        {Object.entries(timeframeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as GoalTimeframe)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key ? 'bg-emerald-500 text-navy' : 'bg-surface/50 text-textSecondary hover:text-textPrimary hover:bg-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-12 text-textSecondary">Doelen laden...</div>
        ) : filteredGoals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-light mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-textPrimary">Geen doelen gevonden</h3>
            <p className="text-sm text-textSecondary mt-2">Maak je eerste doel aan om te beginnen.</p>
          </div>
        ) : (
          filteredGoals.map(goal => (
            <Card key={goal.id} variant="glass" className="p-5 flex flex-col gap-4 hover:border-emerald-500/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-semibold text-textPrimary line-clamp-2">{goal.title}</h3>
                <Badge variant={statusColors[goal.status]} dot>{goal.status.replace('_', ' ')}</Badge>
              </div>
              {goal.description && <p className="text-sm text-textSecondary line-clamp-2">{goal.description}</p>}
              
              <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-xs text-textSecondary">
                  <span>Voortgang</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-light rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-gold rounded-full"
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nieuw Doel Maken">
        {serverError && <p className="text-danger text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input
            label="Titel"
            required
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Wat wil je bereiken?"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textPrimary">Beschrijving (Optioneel)</label>
            <textarea
              className="w-full rounded-xl border border-white/[0.06] bg-surface/50 px-4 py-2.5 text-sm text-textPrimary focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all resize-none h-24"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Geef wat meer context over dit doel..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textPrimary">Tijdsframe</label>
            <select
              className="w-full rounded-xl border border-white/[0.06] bg-surface/50 px-4 py-2.5 text-sm text-textPrimary focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
              value={form.timeframe}
              onChange={e => setForm({...form, timeframe: e.target.value as GoalTimeframe})}
            >
              {Object.entries(timeframeLabels).map(([key, label]) => (
                <option key={key} value={key} className="bg-navy">{label}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Annuleren</Button>
            <Button type="submit">Doel Opslaan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
