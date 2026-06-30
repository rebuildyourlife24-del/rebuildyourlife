'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api, formatApiError } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Network, Search, AlertCircle, Phone, Mail, CheckCircle2, Clock, Plus } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  type: string;
  relationship: string | null;
  lastContactAt: string;
  reminderFrequencyDays: number;
  phone: string | null;
  email: string | null;
  isImportant: boolean;
  notes: string | null;
}

export default function NetworkCRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: 'PARTNER',
    relationship: '',
    email: '',
    phone: '',
    reminderFrequencyDays: '30',
    isImportant: false,
  });

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get<Contact[]>('/network');
      const data = (res as any).data || res;
      setContacts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSaving(true);
    try {
      await api.post('/network', {
        ...form,
        reminderFrequencyDays: parseInt(form.reminderFrequencyDays) || 30,
      });
      setIsModalOpen(false);
      setForm({
        name: '',
        type: 'PARTNER',
        relationship: '',
        email: '',
        phone: '',
        reminderFrequencyDays: '30',
        isImportant: false,
      });
      loadContacts();
    } catch (err) {
      setServerError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogInteraction = async (id: string) => {
    try {
      // Optimistic update
      setContacts(prev => prev.map(c => c.id === id ? { ...c, lastContactAt: new Date().toISOString() } : c));
      await api.put('/network/update', { id, lastContactAt: new Date().toISOString() });
      loadContacts();
    } catch (err) {
      console.error(err);
    }
  };

  // Godbrain Reminders Calculation
  const calculateReminders = () => {
    const today = new Date();
    return contacts.filter(c => {
      const lastContact = new Date(c.lastContactAt);
      const diffTime = Math.abs(today.getTime() - lastContact.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= c.reminderFrequencyDays;
    });
  };

  const reminders = calculateReminders();

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.relationship && c.relationship.toLowerCase().includes(search.toLowerCase())) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans min-h-[85vh] relative z-10 pb-12">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 hidden blur-[] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 border border-indigo-900/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.05)]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase flex items-center gap-4 mb-2">
            <Network className="w-8 h-8 text-indigo-500" />
            Social & Syndicate
          </h1>
          <p className="text-indigo-400/60 uppercase tracking-widest text-xs flex items-center gap-2 font-bold">
            NETWERK CRM & RELATIEBEHEER
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none font-bold tracking-widest uppercase text-xs h-12 px-6 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <Plus className="w-4 h-4 mr-2" />
          Voeg Contact Toe
        </Button>
      </div>

      {/* Godbrain Reminders */}
      {reminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-blue-950/20 border border-blue-900/50 p-6 backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" /> 
              GODBRAIN REMINDERS ({reminders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map(contact => {
                const lastContact = new Date(contact.lastContactAt);
                const diffTime = Math.abs(new Date().getTime() - lastContact.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={`reminder-${contact.id}`} className="bg-black/60 border border-blue-500/20 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-white uppercase tracking-widest text-sm">{contact.name}</span>
                        {contact.isImportant && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[9px]">VIP</Badge>}
                      </div>
                      <p className="text-xs text-zinc-400 font-medium">{contact.type} • {contact.relationship || 'Relatie'}</p>
                      <p className="text-xs text-blue-400 mt-2 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Al {diffDays} dagen niet gesproken
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleLogInteraction(contact.id)}
                      className="w-full mt-4 bg-white hover:bg-zinc-200 text-black border-none font-bold uppercase text-[10px] h-8"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Markeer als Gesproken
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Contacts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-lg font-black text-white uppercase tracking-widest">
            CONTACTEN DATABASE
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Zoek naam of bedrijf..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 backdrop-blur-md"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-indigo-500 animate-pulse font-black uppercase tracking-widest py-16 text-center rounded-2xl bg-black/40 border border-indigo-900/30 backdrop-blur-md text-xs">
            DATA OPHALEN...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-zinc-500 font-bold uppercase tracking-widest rounded-2xl bg-black/40 border border-white/5 p-16 text-center backdrop-blur-md text-xs">
            GEEN CONTACTEN GEVONDEN IN DE DATABASE.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
              >
                <Card className="bg-black/40 border border-white/5 p-6 backdrop-blur-md rounded-2xl hover:border-indigo-500/30 transition-colors h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-black text-white text-lg uppercase tracking-widest">{contact.name}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest font-bold">
                        {contact.relationship || 'Geen rol opgegeven'}
                      </p>
                    </div>
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">
                      {contact.type}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">{contact.phone}</a>
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest border border-white/5 bg-black/50 p-2.5 rounded-lg mt-4">
                      <span className="text-zinc-500">Laatst Gesproken:</span>
                      <span className="text-white">{new Date(contact.lastContactAt).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleLogInteraction(contact.id)}
                    variant="outline"
                    className="w-full border-indigo-900 text-indigo-400 hover:bg-indigo-900/20 text-[10px] uppercase font-black tracking-widest h-10"
                  >
                    Log Interactie (Vandaag)
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setServerError(''); }}
        title="Nieuw Contact Toevoegen"
        description="Breid je Social & Syndicate netwerk uit."
        size="lg"
      >
        {serverError && (
          <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-500">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Naam Contact"
              placeholder="bijv. Elon Musk"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Relatie / Rol / Bedrijf"
              placeholder="bijv. CEO SpaceX / Leverancier"
              value={form.relationship}
              onChange={e => setForm({ ...form, relationship: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-400">Type Relatie</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="SUPPLIER">Leverancier (Supplier)</option>
                <option value="PARTNER">Zakenpartner (Partner)</option>
                <option value="CLIENT">Klant (Client)</option>
                <option value="FRIEND">Vriend (Friend)</option>
                <option value="LEAD">Prospect (Lead)</option>
              </select>
            </div>
            <Input
              label="Herinnering (dagen)"
              type="number"
              min={1}
              placeholder="30"
              value={form.reminderFrequencyDays}
              onChange={e => setForm({ ...form, reminderFrequencyDays: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="E-mailadres"
              type="email"
              placeholder="elon@spacex.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Telefoonnummer"
              type="tel"
              placeholder="+31 6 12 34 56 78"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.isImportant}
                onChange={e => setForm({ ...form, isImportant: e.target.checked })}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${form.isImportant ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.isImportant ? 'translate-x-4' : ''}`}></div>
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-widest">Markeer als VIP</p>
              <p className="text-xs text-zinc-500 mt-1">Hogere prioriteit in de Godbrain waarschuwingen.</p>
            </div>
          </label>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" loading={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none font-bold uppercase tracking-widest text-xs px-8">
              Sla Contact Op
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
