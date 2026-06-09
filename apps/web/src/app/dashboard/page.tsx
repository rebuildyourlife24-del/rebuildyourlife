'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/lib/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api, formatCurrency, formatRelativeTime } from '@/lib/api';
import type { DashboardStats, Activity, AIAgent } from '@rebuildyourlife/shared';
import { useLanguage } from '@/lib/i18n/LanguageContext';



const fallbackAgents: Pick<AIAgent, 'name' | 'specialization' | 'status'>[] = [
  { name: 'Financial Advisor', specialization: 'financial_advisor', status: 'online' },
  { name: 'Career Coach', specialization: 'career_coach', status: 'online' },
  { name: 'Wellness Guide', specialization: 'wellness_guide', status: 'busy' },
];

const activityIcons: Record<string, React.ReactNode> = {
  goal_completed: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </div>
  ),
  debt_payment: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
  ),
  ai_interaction: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
        <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4Z" />
      </svg>
    </div>
  ),
  task_completed: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    </div>
  ),
  milestone_reached: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </div>
  ),
  goal_created: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    </div>
  ),
};

const statusColors: Record<string, string> = {
  online: 'bg-success',
  busy: 'bg-warning',
  offline: 'bg-textSecondary/50',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get<{ data: DashboardStats }>('/user/dashboard'),
          api.get<{ data: Activity[] }>('/user/dashboard/activities')
        ]);
        setStats(statsRes.data as unknown as DashboardStats);
        setActivities(activitiesRes.data as unknown as Activity[] || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return <div className="text-white">Laden...</div>;
  }

  const statsCards = [
    {
      label: t('dashboard.activeGoals'),
      value: stats.activeGoals.toString(),
      change: `+${stats.goalsCompletedThisMonth || 0} this month`,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      label: t('dashboard.monthlyBudget'),
      value: formatCurrency(stats.monthlyBudget || 0),
      change: 'Allocated',
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: t('dashboard.totalDebt'),
      value: formatCurrency(stats.totalDebt),
      change: `${formatCurrency(stats.debtPaidThisMonth || 0)} paid this month`,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
    {
      label: t('dashboard.tasksDue'),
      value: (stats.tasksDue || 0).toString(),
      change: 'Due today',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
  ];

  const activityData = [
    { name: 'Goals', active: stats.activeGoals, completed: stats.goalsCompletedThisMonth || 0 },
    { name: 'Tasks', active: stats.tasksDue, completed: stats.tasksOverdue || 0 }, // Using overdue as a secondary metric for now
    { name: 'Programs', active: stats.activePrograms, completed: 0 }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-textPrimary sm:text-3xl">
          {t('dashboard.welcome')}, <span className="gradient-text-gold">{user?.firstName || 'there'}</span>
        </h1>
        <p className="mt-1 text-textSecondary">
          Here&apos;s your recovery dashboard. Keep pushing forward.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label} variant="default" padding="md" hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-textSecondary">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-textSecondary">{stat.change}</p>
              </div>
              <div className={`rounded-xl p-2.5 ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card variant="default" padding="none">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-semibold text-textPrimary">{t('dashboard.recentActivity')}</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 px-6 py-4">
                  {activityIcons[activity.type] || activityIcons.goal_created}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-textPrimary">{activity.title}</p>
                    <p className="text-xs text-textSecondary truncate">{activity.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-textSecondary">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Operator Status */}
          <motion.div variants={itemVariants}>
            <Card variant="glass" padding="md" className="border-t-2 border-t-[#00f0ff] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#00f0ff] mb-1 font-mono">Operator Status // Active</p>
                <h2 className="text-xl font-bold text-textPrimary tracking-wide">
                  Level {(user as any)?.clearanceLevel || 4}: Tactical Operator
                </h2>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-textSecondary">XP: {(user as any)?.experiencePoints || 8500}</span>
                    <span className="text-[#00f0ff]">NEXT RANK: 10,000</span>
                  </div>
                  <ProgressBar value={(user as any)?.experiencePoints || 8500} max={10000} color="gold" size="md" className="drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card variant="default" padding="md">
              <h2 className="mb-4 text-lg font-semibold text-textPrimary">{t('dashboard.quickActions')}</h2>
              <div className="space-y-2">
                <Link href="/dashboard/goals">
                  <Button variant="secondary" fullWidth size="sm" className="justify-start">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                    Set New Goal
                  </Button>
                </Link>
                <Link href="/dashboard/debts">
                  <Button variant="secondary" fullWidth size="sm" className="justify-start">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Log Payment
                  </Button>
                </Link>
                <Link href="/dashboard/ai-team">
                  <Button variant="secondary" fullWidth size="sm" className="justify-start">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
                    </svg>
                    Chat with AI
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* AI Team Status */}
          <motion.div variants={itemVariants}>
            <Card variant="gold" padding="md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-textPrimary">{t('dashboard.aiStatus')}</h2>
                <Link href="/dashboard/ai-team">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {fallbackAgents.map((agent) => (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-sm font-semibold text-gold">
                        {agent.name[0]}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy-light ${statusColors[agent.status]}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-textPrimary">{agent.name}</p>
                      <p className="text-xs text-textSecondary capitalize">
                        {agent.specialization.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge
                      variant={agent.status === 'online' ? 'success' : agent.status === 'busy' ? 'warning' : 'default'}
                      size="sm"
                      dot
                    >
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recovery Progress - Visualised with Recharts */}
          <motion.div variants={itemVariants}>
            <Card variant="default" padding="md">
              <h2 className="mb-4 text-lg font-semibold text-textPrimary">Activity Overview</h2>
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#8892a4" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8892a4" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a2035', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f1f1' }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    />
                    <Bar dataKey="active" name="Active / Due" fill="#d4a853" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="completed" name="Completed / Overdue" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
