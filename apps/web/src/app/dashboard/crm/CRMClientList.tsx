'use client';

import { useState } from 'react';
import { Users, FileText, Briefcase, Phone, Mail, Plus, X, Loader2 } from 'lucide-react';

export default function CRMClientList({ initialClients }: { initialClients: any[] }) {
  const [clients, setClients] = useState(initialClients);
  const [showAddClient, setShowAddClient] = useState(false);
  const [loading, setLoading] = useState(false);

  // New Client State
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '' });

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      const data = await res.json();
      if (data.success) {
        setClients([{ ...data.client, invoices: [] }, ...clients]);
        setShowAddClient(false);
        setNewClient({ name: '', email: '', phone: '', company: '' });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddInvoice = async (clientId: string) => {
    const amount = prompt("Factuurbedrag (€):");
    if (!amount || isNaN(parseFloat(amount))) return;

    const description = prompt("Omschrijving van dienst/product:");
    if (!description) return;

    try {
      const res = await fetch('/api/crm/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, amount, description })
      });
      const data = await res.json();
      if (data.success) {
        setClients(clients.map(c => {
          if (c.id === clientId) {
            return { ...c, invoices: [data.invoice, ...c.invoices] };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-500" /> Klantenbestand
        </h2>
        <button 
          onClick={() => setShowAddClient(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Nieuwe Klant
        </button>
      </div>

      {showAddClient && (
        <div className="border border-cyan-500/30 bg-cyan-900/10 p-6 rounded-xl relative">
          <button onClick={() => setShowAddClient(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Klant Toevoegen</h3>
          <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Naam contactpersoon" className="bg-black border border-white/10 rounded p-3 text-white" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
            <input type="text" placeholder="Bedrijfsnaam" className="bg-black border border-white/10 rounded p-3 text-white" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
            <input type="email" placeholder="E-mailadres" className="bg-black border border-white/10 rounded p-3 text-white" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
            <input type="text" placeholder="Telefoonnummer" className="bg-black border border-white/10 rounded p-3 text-white" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
            <button type="submit" disabled={loading} className="col-span-1 md:col-span-2 bg-white text-black font-bold uppercase py-3 rounded mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Opslaan"}
            </button>
          </form>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
          <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Geen Klanten Gevonden</h3>
          <p className="text-zinc-500 mt-2">Voeg je eerste B2B klant toe om facturen te sturen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="border border-white/10 bg-black/40 p-6 rounded-xl hover:border-cyan-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{client.name}</h3>
                  <p className="text-xs font-mono text-cyan-400 uppercase">{client.company || 'Geen bedrijfsnaam'}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-mono ${client.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Mail className="w-3 h-3" /> {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Phone className="w-3 h-3" /> {client.phone}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Facturen ({client.invoices?.length || 0})
                  </h4>
                  <button onClick={() => handleAddInvoice(client.id)} className="text-[10px] uppercase text-cyan-400 hover:text-cyan-300">
                    + Factuur
                  </button>
                </div>
                
                {(!client.invoices || client.invoices.length === 0) ? (
                  <p className="text-xs text-zinc-600">Geen facturen beschikbaar.</p>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto">
                    {client.invoices.map((invoice: any) => (
                      <div key={invoice.id} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5 hover:border-cyan-500/30 cursor-pointer">
                        <div>
                          <span className="font-mono text-zinc-300 block">{invoice.invoiceNr}</span>
                          <span className="text-[9px] text-zinc-500">{invoice.description}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">€{invoice.amount.toFixed(2)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${invoice.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
