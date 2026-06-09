'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { api, formatApiError } from '@/lib/api';

type ContactType = 'FAMILY' | 'FRIEND' | 'PARTNER' | 'COLLEAGUE';

interface SocialContact {
  id: string;
  name: string;
  type: ContactType;
  relationship: string | null;
  phone: string | null;
  reminderFrequencyDays: number;
  lastContactAt: string | null;
}

interface ContactForm {
  name: string;
  type: ContactType;
  relationship: string;
  phone: string;
  reminderFrequencyDays: string;
}

const typeLabels: Record<ContactType, string> = {
  FAMILY: 'Familie',
  FRIEND: 'Vrienden',
  PARTNER: 'Partner',
  COLLEAGUE: 'Collega',
};

const typeColors: Record<ContactType, string> = {
  FAMILY: 'text-[#00f0ff]',
  FRIEND: 'text-[#00ffcc]',
  PARTNER: 'text-[#ff6b9d]',
  COLLEAGUE: 'text-[#ffd500]',
};

const typeBg: Record<ContactType, string> = {
  FAMILY: 'bg-[#00f0ff]/10',
  FRIEND: 'bg-[#00ffcc]/10',
  PARTNER: 'bg-[#ff6b9d]/10',
  COLLEAGUE: 'bg-[#ffd500]/10',
};

const typeIcons: Record<ContactType, React.ReactNode> = {
  FAMILY: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M21 22v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  FRIEND: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  PARTNER: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  COLLEAGUE: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
};

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const now = new Date();
  const then = new Date(dateStr);
  return Math.floor((now.getTime() - then.getTime()) / 86400000);
}

export default function SocialPage() {
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [contactingId, setContactingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactForm>({
    name: '',
    type: 'FRIEND',
    relationship: '',
    phone: '',
    reminderFrequencyDays: '14',
  });

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get<SocialContact[]>('/social');
      const data = (res as any).data || res;
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSaving(true);
    try {
      await api.post('/social', {
        ...form,
        reminderFrequencyDays: parseInt(form.reminderFrequencyDays) || 14,
      });
      setIsModalOpen(false);
      setForm({ name: '', type: 'FRIEND', relationship: '', phone: '', reminderFrequencyDays: '14' });
      loadContacts();
    } catch (err) {
      setServerError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleRegisterContact = async (id: string) => {
    setContactingId(id);
    try {
      await api.patch(`/social/${id}`, { lastContactAt: new Date().toISOString() });
      setContacts(prev =>
        prev.map(c => c.id === id ? { ...c, lastContactAt: new Date().toISOString() } : c)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setContactingId(null);
    }
  };

  const grouped = useMemo(() => {
    const order: ContactType[] = ['PARTNER', 'FAMILY', 'FRIEND', 'COLLEAGUE'];
    const map: Record<string, SocialContact[]> = {};
    for (const type of order) {
      const items = contacts.filter(c => c.type === type);
      if (items.length > 0) map[type] = items;
    }
    return map;
  }, [contacts]);

  const overdueCount = contacts.filter(c => {
    const d = daysSince(c.lastContactAt);
    return d === null || d > c.reminderFrequencyDays;
  }).length;

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
            Sociaal Kapitaal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-textSecondary"
          >
            Je relaties zijn je kracht. Investeer bewust in de mensen die ertoe doen.
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          {overdueCount > 0 && (
            <span className="text-sm text-danger font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
              {overdueCount} contact{overdueCount !== 1 ? 'en' : ''} te lang geleden
            </span>
          )}
          <Button onClick={() => setIsModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Contact Toevoegen
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(['PARTNER', 'FAMILY', 'FRIEND', 'COLLEAGUE'] as ContactType[]).map(type => {
          const count = contacts.filter(c => c.type === type).length;
          return (
            <Card key={type} variant="glass" className="p-4 flex items-center gap-3">
              <span className={`${typeBg[type]} ${typeColors[type]} rounded-xl p-2.5`}>
                {typeIcons[type]}
              </span>
              <div>
                <p className="text-xl font-bold text-textPrimary">{count}</p>
                <p className="text-xs text-textSecondary">{typeLabels[type]}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contact groups */}
      {loading ? (
        <div className="text-center py-16 text-textSecondary text-sm">Contacten laden...</div>
      ) : contacts.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-textSecondary">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-textPrimary">Geen contacten</h3>
          <p className="text-sm text-textSecondary mt-2">Voeg je eerste contact toe om je sociale netwerk bij te houden.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {(Object.entries(grouped) as [ContactType, SocialContact[]][]).map(([type, items]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`${typeBg[type]} ${typeColors[type]} rounded-lg p-1.5`}>
                  {typeIcons[type]}
                </span>
                <h2 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
                  {typeLabels[type]}
                </h2>
                <span className="text-xs text-textSecondary">({items.length})</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((contact, i) => {
                  const days = daysSince(contact.lastContactAt);
                  const isOverdue = days === null || days > contact.reminderFrequencyDays;
                  return (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        variant="glass"
                        className={`p-5 flex flex-col gap-4 transition-all ${isOverdue ? 'border-danger/40 bg-danger/[0.03]' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${typeBg[type]} ${typeColors[type]}`}>
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-textPrimary text-sm">{contact.name}</p>
                              {contact.relationship && (
                                <p className="text-xs text-textSecondary mt-0.5">{contact.relationship}</p>
                              )}
                            </div>
                          </div>
                          {isOverdue ? (
                            <Badge variant="danger" dot>Te lang</Badge>
                          ) : (
                            <Badge variant="success" dot>OK</Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-textSecondary border-t border-white/5 pt-3">
                          <span>
                            {days === null
                              ? 'Nooit gecontacteerd'
                              : days === 0
                              ? 'Vandaag gecontacteerd'
                              : `${days} dag${days !== 1 ? 'en' : ''} geleden`}
                          </span>
                          <span className="text-textSecondary/60">
                            Herinner: {contact.reminderFrequencyDays}d
                          </span>
                        </div>

                        <Button
                          variant={isOverdue ? 'primary' : 'secondary'}
                          size="sm"
                          fullWidth
                          loading={contactingId === contact.id}
                          onClick={() => handleRegisterContact(contact.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92Z" />
                          </svg>
                          Contact Geregistreerd
                        </Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setServerError(''); }}
        title="Contact Toevoegen"
        description="Voeg een persoon toe aan je sociale netwerk."
        size="lg"
      >
        {serverError && (
          <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}
        <form onSubmit={handleAddContact} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Naam"
              required
              placeholder="bijv. Sarah de Vries"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-textSecondary">Type</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-navy-light px-4 py-2.5 text-sm text-textPrimary focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as ContactType })}
              >
                {(Object.entries(typeLabels) as [ContactType, string][]).map(([k, v]) => (
                  <option key={k} value={k} className="bg-black">{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Relatie omschrijving"
              placeholder="bijv. Beste vriend"
              value={form.relationship}
              onChange={e => setForm({ ...form, relationship: e.target.value })}
            />
            <Input
              label="Telefoonnummer"
              type="tel"
              placeholder="+31 6 12345678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textSecondary">
              Herinnering elke <span className="text-gold font-bold">{form.reminderFrequencyDays}</span> dagen
            </label>
            <input
              type="range"
              min={1}
              max={90}
              value={form.reminderFrequencyDays}
              onChange={e => setForm({ ...form, reminderFrequencyDays: e.target.value })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00f0ff ${((parseInt(form.reminderFrequencyDays) - 1) / 89) * 100}%, rgba(255,255,255,0.05) ${((parseInt(form.reminderFrequencyDays) - 1) / 89) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-textSecondary">
              <span>1 dag</span>
              <span>90 dagen</span>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" loading={saving}>
              Toevoegen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
