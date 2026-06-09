'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api, formatApiError } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface LifeArea {
  id: string;
  name: string;
  description: string;
  score: number;
}

const LIFE_AREAS_DEFAULT = [
  { name: 'Financiën', description: 'Geld, schulden en financiële stabiliteit' },
  { name: 'Gezondheid', description: 'Lichaam, beweging en vitaliteit' },
  { name: 'Relaties', description: 'Vrienden, familie en verbondenheid' },
  { name: 'Carrière', description: 'Werk, prestaties en ambitie' },
  { name: 'Persoonlijke Groei', description: 'Leren, ontwikkelen en verbeteren' },
  { name: 'Fun', description: 'Plezier, hobby\'s en ontspanning' },
  { name: 'Familie', description: 'Gezin, thuissituatie en thuis gevoel' },
  { name: 'Spiritualiteit', description: 'Zingeving, rust en innerlijke vrede' },
];

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-xl px-3 py-2 text-sm">
        <p className="font-semibold text-textPrimary">{payload[0]?.payload?.name}</p>
        <p className="text-gold font-bold">{payload[0]?.value}/100</p>
      </div>
    );
  }
  return null;
};

export default function LifeBalancePage() {
  const [areas, setAreas] = useState<LifeArea[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const res = await api.get<LifeArea[]>('/life-areas');
      const dataArray: LifeArea[] = (res as any).data || res || [];
      const safeAreas = Array.isArray(dataArray) ? dataArray : [];

      if (safeAreas.length === 0) {
        // Seed local state with defaults at score 50
        const defaultAreas: LifeArea[] = LIFE_AREAS_DEFAULT.map((a, i) => ({
          id: `default-${i}`,
          name: a.name,
          description: a.description,
          score: 50,
        }));
        setAreas(defaultAreas);
        const defaultScores: Record<string, number> = {};
        defaultAreas.forEach(a => { defaultScores[a.id] = a.score; });
        setScores(defaultScores);
      } else {
        setAreas(safeAreas);
        const initScores: Record<string, number> = {};
        safeAreas.forEach(a => { initScores[a.id] = a.score; });
        setScores(initScores);
      }
    } catch (err) {
      console.error(err);
      // Fall back to defaults on error
      const defaultAreas: LifeArea[] = LIFE_AREAS_DEFAULT.map((a, i) => ({
        id: `default-${i}`,
        name: a.name,
        description: a.description,
        score: 50,
      }));
      setAreas(defaultAreas);
      const defaultScores: Record<string, number> = {};
      defaultAreas.forEach(a => { defaultScores[a.id] = a.score; });
      setScores(defaultScores);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setServerError('');
    setSaveSuccess(false);
    try {
      await Promise.all(
        areas.map(area => {
          const score = scores[area.id] ?? area.score;
          if (area.id.startsWith('default-')) {
            // POST new area
            return api.post('/life-areas', { name: area.name, description: area.description, score });
          } else {
            return api.patch(`/life-areas/${area.id}/score`, { score });
          }
        })
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadAreas();
    } catch (err) {
      setServerError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAskCoach = () => {
    const lowestArea = [...areas].sort((a, b) => (scores[a.id] ?? a.score) - (scores[b.id] ?? b.score))[0];
    if (!lowestArea) return;
    const prompt = `Hoi Life Coach, mijn score voor ${lowestArea.name} is momenteel slechts ${scores[lowestArea.id] ?? lowestArea.score}/100. Heb je een stappenplan om dit te verbeteren?`;
    sessionStorage.setItem('ai_initial_prompt', prompt);
    sessionStorage.setItem('ai_target_agent', 'LIFE_COACH');
    router.push('/dashboard/ai-team');
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return '#ff3366';
    if (score < 70) return '#ffd500';
    return '#00ffcc';
  };

  const averageScore = areas.length > 0
    ? Math.round(areas.reduce((acc, a) => acc + (scores[a.id] ?? a.score), 0) / areas.length)
    : 0;

  const radarData = areas.map(a => ({
    name: a.name.length > 10 ? a.name.substring(0, 10) + '..' : a.name,
    fullName: a.name,
    score: scores[a.id] ?? a.score,
  }));

  if (loading && areas.length === 0) {
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
            Levensbalans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-textSecondary"
          >
            Het Wheel of Life — evalueer je leven en ontdek waar je focus nodig is.
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleAskCoach}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
              <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4Z" />
            </svg>
            Vraag AI Coach
          </Button>
          <Button onClick={handleSaveAll} loading={saving}>
            {saveSuccess ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Opgeslagen!
              </>
            ) : (
              'Alles Opslaan'
            )}
          </Button>
        </div>
      </div>

      {serverError && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      {/* Average Score Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4"
      >
        <div>
          <p className="text-sm text-textSecondary">Gemiddelde Levensbalans Score</p>
          <p className="text-xs text-textSecondary mt-0.5">Gebaseerd op alle 8 levensgebieden</p>
        </div>
        <div className="text-right">
          <span
            className="text-4xl font-bold"
            style={{ color: getScoreColor(averageScore) }}
          >
            {averageScore}
          </span>
          <span className="text-xl font-bold text-textSecondary">/100</span>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="p-6 h-full">
            <h2 className="text-base font-semibold text-textPrimary mb-4">Wheel of Life</h2>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: '#a8c5d6', fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#a8c5d6', fontSize: 9 }}
                  tickCount={5}
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#00f0ff"
                  fill="#00f0ff"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ fill: '#00f0ff', r: 4, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Sliders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="glass" className="p-6 h-full">
            <h2 className="text-base font-semibold text-textPrimary mb-5">Pas Scores Aan</h2>
            <div className="space-y-5 overflow-y-auto max-h-[360px] pr-1">
              {areas.map((area, i) => {
                const score = scores[area.id] ?? area.score;
                const color = getScoreColor(score);
                return (
                  <motion.div
                    key={area.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className={`rounded-xl border p-4 transition-all ${
                      score < 40 ? 'border-danger/30 bg-danger/[0.03]' : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-textPrimary">{area.name}</h3>
                        <p className="text-xs text-textSecondary mt-0.5">{area.description}</p>
                      </div>
                      <span className="text-lg font-bold ml-3" style={{ color }}>
                        {score}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={score}
                        onChange={e => handleScoreChange(area.id, parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/30"
                        style={{
                          background: `linear-gradient(to right, ${color} ${score}%, rgba(255,255,255,0.06) ${score}%)`
                        }}
                      />
                    </div>
                    {score < 40 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-danger mt-2"
                      >
                        ⚠️ Dit gebied heeft aandacht nodig
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Save hint */}
      <p className="text-center text-xs text-textSecondary/60">
        Druk op &lsquo;Alles Opslaan&rsquo; om je scores te synchroniseren met de server.
      </p>
    </div>
  );
}
