'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api, formatApiError } from '@/lib/api';

interface HealthLog {
  id: string;
  date: string;
  steps: number;
  sleepScore: number;
  weightKg: number | null;
  waterMl: number;
  workoutMinutes: number;
  workoutType: string | null;
}

interface DailyForm {
  steps: string;
  sleepScore: string;
  weightKg: string;
  waterMl: string;
  workoutMinutes: string;
  workoutType: string;
}

const workoutTypes = ['Geen', 'Lopen', 'Fietsen', 'Zwemmen', 'Gym', 'Yoga', 'HIIT', 'Wandelen', 'Anders'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-xl p-3 text-sm">
        <p className="font-semibold text-textPrimary mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-textSecondary">{entry.name}:</span>
            <span className="text-textPrimary font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function HealthPage() {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState<DailyForm>({
    steps: '',
    sleepScore: '',
    weightKg: '',
    waterMl: '',
    workoutMinutes: '',
    workoutType: 'Geen',
  });

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get<HealthLog[]>('/health');
      const data = (res as any).data || res;
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSaving(true);
    try {
      await api.post('/health', {
        steps: parseInt(form.steps) || 0,
        sleepScore: parseFloat(form.sleepScore) || 0,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        waterMl: parseInt(form.waterMl) || 0,
        workoutMinutes: parseInt(form.workoutMinutes) || 0,
        workoutType: form.workoutType === 'Geen' ? null : form.workoutType,
      });
      setIsModalOpen(false);
      setForm({ steps: '', sleepScore: '', weightKg: '', waterMl: '', workoutMinutes: '', workoutType: 'Geen' });
      loadLogs();
    } catch (err) {
      setServerError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  // Build 7-day chart data
  const last7 = [...logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(log => ({
      day: new Intl.DateTimeFormat('nl-NL', { weekday: 'short' }).format(new Date(log.date)),
      Stappen: log.steps,
      Slaap: log.sleepScore,
    }));

  const today = logs[0] || null;
  const todaySteps = today?.steps ?? 0;
  const todaySleep = today?.sleepScore ?? 0;
  const todayWater = today?.waterMl ?? 0;
  const todayWorkout = today?.workoutMinutes ?? 0;

  const statCards = [
    {
      label: 'Stappen Vandaag',
      value: todaySteps.toLocaleString('nl-NL'),
      goal: '10.000',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0" fill="currentColor" stroke="none"/>
          <circle cx="14" cy="4" r="1" />
          <path d="m6.5 6.5 1 5 3-2 1 4.5" />
          <path d="M13 10.5 10 12l-2 6" />
          <path d="m8.5 18 1-3.5" />
        </svg>
      ),
      pct: Math.min((todaySteps / 10000) * 100, 100),
      color: '#00f0ff',
    },
    {
      label: 'Slaap Score',
      value: `${todaySleep}/10`,
      goal: '8/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ),
      pct: Math.min((todaySleep / 10) * 100, 100),
      color: '#a78bfa',
    },
    {
      label: 'Water Intake',
      value: `${todayWater} ml`,
      goal: '2500 ml',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L5 12 a7 7 0 0 0 14 0 Z" />
        </svg>
      ),
      pct: Math.min((todayWater / 2500) * 100, 100),
      color: '#00ffcc',
    },
    {
      label: 'Training',
      value: `${todayWorkout} min`,
      goal: '45 min',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5h11M6.5 17.5h11M6 12h12M4 8.5 2 12l2 3.5M20 8.5l2 3.5-2 3.5" />
        </svg>
      ),
      pct: Math.min((todayWorkout / 45) * 100, 100),
      color: '#ffd500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-textPrimary"
          >
            Welzijn & Vitaliteit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-textSecondary"
          >
            Je lichaam is je commandocentrum — voed het, beweeg het, rust het.
          </motion.p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Log Vandaag
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card variant="glass" className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-textSecondary uppercase tracking-wider">{stat.label}</p>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-textPrimary">{stat.value}</p>
                <p className="text-xs text-textSecondary mt-0.5">Doel: {stat.goal}</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.pct}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 7-Day Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card variant="glass" className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary">7-Daagse Samenvatting</h2>
              <p className="text-xs text-textSecondary mt-1">Stappen (balken) · Slaap score (lijn)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-textSecondary">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded bg-[#00f0ff]" /> Stappen
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded bg-[#a78bfa]" /> Slaap
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center text-textSecondary text-sm">
              Gezondheidsdata laden...
            </div>
          ) : last7.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-textSecondary">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <p className="text-textSecondary text-sm">Nog geen data. Log je eerste dag!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={last7} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#a8c5d6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="steps"
                  orientation="left"
                  tick={{ fill: '#a8c5d6', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <YAxis
                  yAxisId="sleep"
                  orientation="right"
                  domain={[0, 10]}
                  tick={{ fill: '#a8c5d6', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="steps" dataKey="Stappen" fill="url(#stepsGrad)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line
                  yAxisId="sleep"
                  type="monotone"
                  dataKey="Slaap"
                  stroke="#a78bfa"
                  strokeWidth={2.5}
                  dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Card>
      </motion.div>

      {/* Log History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-textPrimary mb-4">Recente Logs</h2>
          {loading ? (
            <p className="text-textSecondary text-sm">Laden...</p>
          ) : logs.length === 0 ? (
            <p className="text-textSecondary text-sm text-center py-8">Nog geen logs. Druk op 'Log Vandaag' om te beginnen.</p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 7).map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-gold/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[52px]">
                      <p className="text-xs text-textSecondary">
                        {new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short' }).format(new Date(log.date))}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:gap-6">
                      <span className="text-xs text-textSecondary">
                        👟 <span className="text-textPrimary font-medium">{log.steps.toLocaleString('nl-NL')}</span> stappen
                      </span>
                      <span className="text-xs text-textSecondary">
                        🌙 <span className="text-textPrimary font-medium">{log.sleepScore}/10</span> slaap
                      </span>
                      <span className="text-xs text-textSecondary">
                        💧 <span className="text-textPrimary font-medium">{log.waterMl} ml</span>
                      </span>
                      {log.workoutMinutes > 0 && (
                        <span className="text-xs text-textSecondary">
                          🏋️ <span className="text-textPrimary font-medium">{log.workoutMinutes} min</span>
                          {log.workoutType ? ` ${log.workoutType}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Log Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setServerError(''); }}
        title="Dagelijkse Gezondheidslog"
        description="Registreer je vitaliteit van vandaag."
        size="lg"
      >
        {serverError && (
          <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stappen"
              type="number"
              min={0}
              placeholder="bijv. 8500"
              value={form.steps}
              onChange={e => setForm({ ...form, steps: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-textSecondary">
                Slaap Score (1-10)
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={form.sleepScore || 7}
                onChange={e => setForm({ ...form, sleepScore: e.target.value })}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a78bfa ${((parseFloat(form.sleepScore || '7') - 1) / 9) * 100}%, rgba(255,255,255,0.05) ${((parseFloat(form.sleepScore || '7') - 1) / 9) * 100}%)`
                }}
              />
              <p className="text-xs text-gold text-right font-semibold">{form.sleepScore || 7}/10</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Water (ml)"
              type="number"
              min={0}
              placeholder="bijv. 2000"
              value={form.waterMl}
              onChange={e => setForm({ ...form, waterMl: e.target.value })}
            />
            <Input
              label="Gewicht (kg) — optioneel"
              type="number"
              step="0.1"
              min={0}
              placeholder="bijv. 75.5"
              value={form.weightKg}
              onChange={e => setForm({ ...form, weightKg: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Training (minuten)"
              type="number"
              min={0}
              placeholder="bijv. 30"
              value={form.workoutMinutes}
              onChange={e => setForm({ ...form, workoutMinutes: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-textSecondary">Type Training</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-navy-light px-4 py-2.5 text-sm text-textPrimary focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
                value={form.workoutType}
                onChange={e => setForm({ ...form, workoutType: e.target.value })}
              >
                {workoutTypes.map(t => (
                  <option key={t} value={t} className="bg-black">{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" loading={saving}>
              Opslaan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
