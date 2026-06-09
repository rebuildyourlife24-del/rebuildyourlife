'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { api, formatApiError } from '@/lib/api';

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  orderIndex: number;
}

interface Program {
  id: string;
  name: string;
  description: string | null;
  progress: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  milestones: Milestone[];
}

interface ProgramForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function daysRemaining(endDate: string | null): string {
  if (!endDate) return '';
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)} dagen te laat`;
  if (diff === 0) return 'Eindigt vandaag';
  return `${diff} dagen resterend`;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [completingMilestone, setCompletingMilestone] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const res = await api.get<Program[]>('/programs');
      const dataArray = (res as any).data || res || [];
      setPrograms(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error(err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSaving(true);
    try {
      await api.post('/programs', {
        name: form.name,
        description: form.description || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      setIsModalOpen(false);
      setForm({ name: '', description: '', startDate: '', endDate: '' });
      loadPrograms();
    } catch (err) {
      setServerError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteMilestone = async (programId: string, milestoneId: string) => {
    const key = `${programId}:${milestoneId}`;
    setCompletingMilestone(key);
    try {
      await api.patch(`/programs/${programId}/milestones/${milestoneId}/complete`, {});
      setPrograms(prev =>
        prev.map(p =>
          p.id === programId
            ? {
                ...p,
                milestones: p.milestones.map(m =>
                  m.id === milestoneId ? { ...m, isCompleted: true } : m
                ),
                progress: Math.round(
                  ((p.milestones.filter(m => m.isCompleted || m.id === milestoneId).length) /
                    p.milestones.length) *
                    100
                ),
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setCompletingMilestone(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-gold/20 border-t-gold"
        />
      </div>
    );
  }

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
            Herstel Programma&apos;s
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-textSecondary"
          >
            Volg begeleide trajecten voor een sneller, gerichter herstel.
          </motion.p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nieuw Programma
        </Button>
      </div>

      {/* Program Grid */}
      {programs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-surface/10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-textSecondary">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-textPrimary">Nog geen programma&apos;s</h3>
          <p className="text-sm text-textSecondary mt-2 max-w-sm mx-auto">
            Start een nieuw persoonlijk herstelprogramma om stap voor stap aan je doelen te werken.
          </p>
          <Button className="mt-6" onClick={() => setIsModalOpen(true)}>
            Eerste Programma Starten
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((program, i) => {
            const completedCount = program.milestones.filter(m => m.isCompleted).length;
            const totalCount = program.milestones.length;
            const isComplete = program.progress >= 100;
            const remaining = daysRemaining(program.endDate);
            const isLate = remaining.includes('te laat');

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="glass" className="p-6 flex flex-col gap-5">
                  {/* Program Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-textPrimary truncate">{program.name}</h2>
                      {program.description && (
                        <p className="text-sm text-textSecondary mt-1 line-clamp-2">{program.description}</p>
                      )}
                    </div>
                    <Badge
                      variant={isComplete ? 'success' : program.isActive ? 'gold' : 'default'}
                      dot
                    >
                      {isComplete ? 'Voltooid' : program.isActive ? 'Actief' : 'Inactief'}
                    </Badge>
                  </div>

                  {/* Dates */}
                  {(program.startDate || program.endDate) && (
                    <div className="flex items-center gap-4 text-xs text-textSecondary">
                      {program.startDate && (
                        <span>🗓 Start: {formatDate(program.startDate)}</span>
                      )}
                      {program.endDate && (
                        <span className={isLate ? 'text-danger' : ''}>
                          🏁 Einde: {formatDate(program.endDate)}
                          {remaining && <span className="ml-1 opacity-70">({remaining})</span>}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-textSecondary mb-2">
                      <span>Voortgang</span>
                      <span className="font-semibold text-textPrimary">{program.progress}%</span>
                    </div>
                    <ProgressBar
                      value={program.progress}
                      max={100}
                      color={isComplete ? 'success' : 'gold'}
                      size="md"
                    />
                    {totalCount > 0 && (
                      <p className="text-xs text-textSecondary mt-1.5">
                        {completedCount}/{totalCount} mijlpalen voltooid
                      </p>
                    )}
                  </div>

                  {/* Milestones */}
                  {program.milestones.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Mijlpalen</h3>
                      {[...program.milestones]
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map(milestone => {
                          const milestoneKey = `${program.id}:${milestone.id}`;
                          const isCompleting = completingMilestone === milestoneKey;
                          return (
                            <div
                              key={milestone.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                milestone.isCompleted
                                  ? 'border-success/20 bg-success/5'
                                  : 'border-white/5 bg-white/[0.02] hover:border-gold/20'
                              }`}
                            >
                              <button
                                onClick={() =>
                                  !milestone.isCompleted && handleCompleteMilestone(program.id, milestone.id)
                                }
                                disabled={milestone.isCompleted || isCompleting}
                                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                                  milestone.isCompleted
                                    ? 'bg-success border-success text-white'
                                    : 'border-textSecondary hover:border-gold'
                                } ${isCompleting ? 'animate-pulse' : ''}`}
                              >
                                {milestone.isCompleted && (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${milestone.isCompleted ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>
                                  {milestone.title}
                                </p>
                                {milestone.description && (
                                  <p className="text-xs text-textSecondary mt-0.5">{milestone.description}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Program Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setServerError(''); }}
        title="Nieuw Programma"
        description="Maak een nieuw persoonlijk herstelprogramma aan."
        size="lg"
      >
        {serverError && (
          <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}
        <form onSubmit={handleCreateProgram} className="space-y-4">
          <Input
            label="Programmanaam"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="bijv. Financiële Stabiliteit 2026"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textSecondary">Beschrijving</label>
            <textarea
              className="w-full rounded-xl border border-white/10 bg-navy-light px-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none h-24"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Wat wil je bereiken met dit programma?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Startdatum"
              type="date"
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              label="Einddatum"
              type="date"
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" loading={saving}>
              Programma Aanmaken
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
