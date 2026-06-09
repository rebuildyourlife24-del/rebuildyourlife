'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Paywall } from '@/components/ui/Paywall';
import { api, formatApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';

type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

interface BusinessSummary {
  totalRevenue: number;
  outstandingInvoices: number;
  activeClients: number;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: ClientStatus;
  createdAt: string;
}

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string | null;
  issuedAt: string;
  description: string | null;
}

interface ClientForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
}

interface InvoiceForm {
  clientName: string;
  amount: string;
  description: string;
  dueDate: string;
}

const clientStatusConfig: Record<ClientStatus, { label: string; badge: 'success' | 'default' | 'warning' }> = {
  ACTIVE: { label: 'Actief', badge: 'success' },
  INACTIVE: { label: 'Inactief', badge: 'default' },
  PROSPECT: { label: 'Prospect', badge: 'warning' },
};

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; badge: 'default' | 'gold' | 'success' | 'danger'; color: string }> = {
  DRAFT: { label: 'Concept', badge: 'default', color: 'text-textSecondary' },
  SENT: { label: 'Verzonden', badge: 'gold', color: 'text-gold' },
  PAID: { label: 'Betaald', badge: 'success', color: 'text-success' },
  OVERDUE: { label: 'Te Laat', badge: 'danger', color: 'text-danger' },
};

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

export default function BusinessPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<BusinessSummary>({ totalRevenue: 0, outstandingInvoices: 0, activeClients: 0 });
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [clientError, setClientError] = useState('');
  const [invoiceError, setInvoiceError] = useState('');
  const [savingClient, setSavingClient] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);

  const [clientForm, setClientForm] = useState<ClientForm>({
    name: '', email: '', phone: '', company: '', status: 'ACTIVE',
  });
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>({
    clientName: '', amount: '', description: '', dueDate: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, clientsRes, invoicesRes] = await Promise.allSettled([
        api.get<BusinessSummary>('/business/summary'),
        api.get<Client[]>('/business'),
        api.get<Invoice[]>('/business/invoices'),
      ]);
      if (summaryRes.status === 'fulfilled') {
        const d = (summaryRes.value as any).data || summaryRes.value;
        setSummary(d || { totalRevenue: 0, outstandingInvoices: 0, activeClients: 0 });
      }
      if (clientsRes.status === 'fulfilled') {
        const d = (clientsRes.value as any).data || clientsRes.value;
        setClients(Array.isArray(d) ? d : []);
      }
      if (invoicesRes.status === 'fulfilled') {
        const d = (invoicesRes.value as any).data || invoicesRes.value;
        setInvoices(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');
    setSavingClient(true);
    try {
      await api.post('/business', clientForm);
      setIsClientModalOpen(false);
      setClientForm({ name: '', email: '', phone: '', company: '', status: 'ACTIVE' });
      loadData();
    } catch (err) {
      setClientError(formatApiError(err));
    } finally {
      setSavingClient(false);
    }
  };

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceError('');
    setSavingInvoice(true);
    try {
      await api.post('/business/invoices', {
        ...invoiceForm,
        amount: parseFloat(invoiceForm.amount) || 0,
      });
      setIsInvoiceModalOpen(false);
      setInvoiceForm({ clientName: '', amount: '', description: '', dueDate: '' });
      loadData();
    } catch (err) {
      setInvoiceError(formatApiError(err));
    } finally {
      setSavingInvoice(false);
    }
  };

  const statCards = [
    {
      label: 'Totale Omzet',
      value: formatEuro(summary.totalRevenue),
      icon: '💶',
      color: '#00f0ff',
      sub: 'Dit jaar',
    },
    {
      label: 'Uitstaande Facturen',
      value: formatEuro(summary.outstandingInvoices),
      icon: '📄',
      color: '#ffd500',
      sub: 'Te ontvangen',
    },
    {
      label: 'Actieve Klanten',
      value: summary.activeClients.toString(),
      icon: '🤝',
      color: '#00ffcc',
      sub: 'Huidig',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20 text-gold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-gold uppercase">Zakelijk Profiel Actief</p>
          <p className="text-xs text-textSecondary">
            Jouw onderneming, jouw regels. Hier de controle, buiten de chaos.
          </p>
        </div>
      </motion.div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Ondernemer Dashboard</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Beheer je klanten, facturen en bedrijfsprestaties.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            Factuur Maken
          </Button>
          <Button onClick={() => setIsClientModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Klant Toevoegen
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <Paywall requiredTier="ENTERPRISE">
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="glass" className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-textSecondary uppercase tracking-wider">{stat.label}</p>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-textSecondary mt-1">{stat.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Clients Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-textPrimary mb-4">Klantenlijst</h2>
            {loading ? (
              <p className="text-textSecondary text-sm py-6 text-center">Data laden...</p>
            ) : clients.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                <p className="text-textSecondary text-sm">Nog geen klanten. Voeg je eerste klant toe!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Naam</th>
                      <th className="pb-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider hidden sm:table-cell">Bedrijf</th>
                      <th className="pb-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider hidden md:table-cell">Toegevoegd</th>
                      <th className="pb-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clients.map(client => (
                      <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold flex-shrink-0">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-textPrimary">{client.name}</p>
                              {client.email && <p className="text-xs text-textSecondary">{client.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-sm text-textSecondary hidden sm:table-cell">
                          {client.company || '—'}
                        </td>
                        <td className="py-3 pr-4 text-xs text-textSecondary hidden md:table-cell">
                          {formatDate(client.createdAt)}
                        </td>
                        <td className="py-3">
                          <Badge variant={clientStatusConfig[client.status].badge} dot>
                            {clientStatusConfig[client.status].label}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Invoices List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-textPrimary mb-4">Facturen</h2>
            {loading ? (
              <p className="text-textSecondary text-sm py-6 text-center">Facturen laden...</p>
            ) : invoices.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                <p className="text-textSecondary text-sm">Geen facturen gevonden. Maak je eerste factuur!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map(invoice => {
                  const cfg = invoiceStatusConfig[invoice.status];
                  return (
                    <div
                      key={invoice.id}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-colors hover:border-white/10 ${
                        invoice.status === 'OVERDUE'
                          ? 'border-danger/20 bg-danger/[0.03]'
                          : 'border-white/5 bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-textSecondary" strokeLinecap="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-textPrimary">{invoice.clientName}</p>
                          {invoice.description && (
                            <p className="text-xs text-textSecondary truncate max-w-[200px]">{invoice.description}</p>
                          )}
                          {invoice.dueDate && (
                            <p className="text-xs text-textSecondary mt-0.5">
                              Vervaldatum: {formatDate(invoice.dueDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`text-base font-bold ${cfg.color}`}>
                          {formatEuro(invoice.amount)}
                        </p>
                        <Badge variant={cfg.badge} dot>{cfg.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </Paywall>

      {/* Add Client Modal */}
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => { setIsClientModalOpen(false); setClientError(''); }}
        title="Klant Toevoegen"
        size="lg"
      >
        {clientError && (
          <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {clientError}
          </div>
        )}
        <form onSubmit={handleAddClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Naam"
              required
              placeholder="bijv. Jan de Vries"
              value={clientForm.name}
              onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
            />
            <Input
              label="Bedrijfsnaam"
              placeholder="bijv. De Vries BV"
              value={clientForm.company}
              onChange={e => setClientForm({ ...clientForm, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="jan@devries.nl"
              value={clientForm.email}
              onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
            />
            <Input
              label="Telefoon"
              type="tel"
              placeholder="+31 6 12345678"
              value={clientForm.phone}
              onChange={e => setClientForm({ ...clientForm, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textSecondary">Status</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-navy-light px-4 py-2.5 text-sm text-textPrimary focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
              value={clientForm.status}
              onChange={e => setClientForm({ ...clientForm, status: e.target.value as ClientStatus })}
            >
              <option value="ACTIVE" className="bg-black">Actief</option>
              <option value="PROSPECT" className="bg-black">Prospect</option>
              <option value="INACTIVE" className="bg-black">Inactief</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsClientModalOpen(false)}>Annuleren</Button>
            <Button type="submit" loading={savingClient}>Klant Opslaan</Button>
          </div>
        </form>
      </Modal>

      {/* Add Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => { setIsInvoiceModalOpen(false); setInvoiceError(''); }}
        title="Factuur Aanmaken"
        size="lg"
      >
        {invoiceError && (
          <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {invoiceError}
          </div>
        )}
        <form onSubmit={handleAddInvoice} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Klantnaam"
              required
              placeholder="bijv. Jan de Vries"
              value={invoiceForm.clientName}
              onChange={e => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
            />
            <Input
              label="Bedrag (€)"
              type="number"
              step="0.01"
              min={0}
              required
              placeholder="bijv. 1500"
              value={invoiceForm.amount}
              onChange={e => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textSecondary">Omschrijving</label>
            <textarea
              className="w-full rounded-xl border border-white/10 bg-navy-light px-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none h-20"
              placeholder="bijv. Webdesign werkzaamheden maart 2026"
              value={invoiceForm.description}
              onChange={e => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
            />
          </div>
          <Input
            label="Vervaldatum"
            type="date"
            value={invoiceForm.dueDate}
            onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsInvoiceModalOpen(false)}>Annuleren</Button>
            <Button type="submit" loading={savingInvoice}>Factuur Aanmaken</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
