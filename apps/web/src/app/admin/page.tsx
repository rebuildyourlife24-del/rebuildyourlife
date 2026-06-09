'use client';

import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Users, Cpu, Euro, ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

const stats = [
  {
    label: 'Actieve Operators',
    value: '842',
    trend: '+12%',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30'
  },
  {
    label: 'Systeembelasting',
    value: '12%',
    trend: '-3%',
    icon: Cpu,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30'
  },
  {
    label: 'Totale Omzet',
    value: '€45.200',
    trend: '+24%',
    icon: Euro,
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/30'
  }
];

const recentRegistrations = [
  { id: 'usr_892a', name: 'Alexander de Grote', email: 'alex@macedonia.com', date: 'Vandaag, 14:32', status: 'Actief', plan: 'Elite' },
  { id: 'usr_892b', name: 'Marie Curie', email: 'marie@radium.io', date: 'Vandaag, 11:15', status: 'Verificatie', plan: 'Pro' },
  { id: 'usr_892c', name: 'Nikola Tesla', email: 'nikola@ac.dc', date: 'Gisteren, 23:45', status: 'Actief', plan: 'Elite' },
  { id: 'usr_892d', name: 'Ada Lovelace', email: 'ada@computing.org', date: 'Gisteren, 18:20', status: 'Actief', plan: 'Standaard' },
  { id: 'usr_892e', name: 'Marcus Aurelius', email: 'marcus@rome.gov', date: '07 Juni, 09:00', status: 'Actief', plan: 'Pro' },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card variant="glass" className={`p-6 h-full border-t-2 ${stat.border} relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300`}>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.trend}
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-sm text-textSecondary font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black text-textPrimary tracking-tight">{stat.value}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card variant="glass" className="p-0 overflow-hidden border border-white/[0.05]">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-surface/50">
              <div>
                <h2 className="text-xl font-bold text-textPrimary">Laatste Registraties</h2>
                <p className="text-sm text-textSecondary mt-1">Recente aanmeldingen binnen het platform.</p>
              </div>
              <button className="text-sm text-gold hover:text-white transition-colors border border-gold/30 px-4 py-2 rounded-lg bg-gold/5 hover:bg-gold/10">
                Bekijk Alle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] text-textSecondary text-xs uppercase tracking-wider border-b border-white/[0.05]">
                    <th className="p-4 font-medium">Gebruiker</th>
                    <th className="p-4 font-medium">Datum</th>
                    <th className="p-4 font-medium">Plan</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {recentRegistrations.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-textPrimary group-hover:text-gold transition-colors">{user.name}</span>
                          <span className="text-xs text-textSecondary">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-textSecondary">{user.date}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded bg-surface border ${
                          user.plan === 'Elite' ? 'text-gold border-gold/30 bg-gold/5' : 
                          user.plan === 'Pro' ? 'text-purple-400 border-purple-400/30 bg-purple-400/5' : 
                          'text-textSecondary border-white/10'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user.status === 'Actief' ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-warning" />
                          )}
                          <span className={`text-sm ${user.status === 'Actief' ? 'text-textPrimary' : 'text-warning'}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Action Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card variant="glass" className="p-6 border-danger/20 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl" />
            <h2 className="text-xl font-bold text-textPrimary mb-6 relative z-10 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-danger" />
              Systeem Status
            </h2>
            
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-surface rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-medium text-textPrimary">Core Database</p>
                  <p className="text-xs text-textSecondary">Main replica (EU-West)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  <span className="text-xs font-medium text-success">Healthy</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-medium text-textPrimary">AI Worker Nodes</p>
                  <p className="text-xs text-textSecondary">OpenAI API Gateway</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  <span className="text-xs font-medium text-success">Online</span>
                </div>
              </div>

              <div className="p-4 bg-danger/10 rounded-xl border border-danger/30 mt-6">
                <h3 className="text-sm font-bold text-danger mb-2">Gevaar Zone</h3>
                <p className="text-xs text-danger/80 mb-4">Waarschuwing: acties hier beïnvloeden de productieomgeving direct.</p>
                <button className="w-full py-2 bg-danger/20 text-danger text-sm font-medium rounded-lg border border-danger/30 hover:bg-danger hover:text-white transition-colors">
                  Forceer Systeem Herstart
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
