'use client';

import { useState, useTransition } from 'react';
import { Users, FileText, Briefcase, Phone, Mail, Plus, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { createCRMClientAction, createCRMInvoiceAction, generatePaymentLinkAction } from '../../actions/crm';

export default function CRMClientList({ initialClients }: { initialClients: any[] }) {
  const [clients, setClients] = useState(initialClients);
  const [showAddClient, setShowAddClient] = useState(false);
  const [loading, setLoading] = useState(false);

  // New Client State
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '' });

  const [isPending, startTransition] = useTransition();

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createCRMClientAction(newClient);
      if (res.success) {
        setClients([{ ...res.client, invoices: [] }, ...clients]);
        setShowAddClient(false);
        setNewClient({ name: '', email: '', phone: '', company: '' });
      } else {
        alert("Fout bij aanmaken klant: " + res.error);
      }
    });
  };

  const handleAddInvoice = (clientId: string) => {
    const amountStr = prompt("Factuurbedrag (€):");
    if (!amountStr || isNaN(parseFloat(amountStr))) return;

    const description = prompt("Omschrijving van dienst/product:");
    if (!description) return;

    startTransition(async () => {
      const res = await createCRMInvoiceAction({ clientId, amount: parseFloat(amountStr), description });
      if (res.success) {
        setClients(clients.map(c => {
          if (c.id === clientId) {
            return { ...c, invoices: [res.invoice, ...c.invoices] };
          }
          return c;
        }));
      } else {
        alert("Fout bij aanmaken factuur.");
      }
    });
  };

  const handleGenerateLink = (invoiceId: string, clientId: string) => {
    startTransition(async () => {
      const res = await generatePaymentLinkAction(invoiceId);
      if (res.success) {
        alert(`Mollie Betaallink gegenereerd:\n${res.paymentUrl}\n\nDe status is gewijzigd naar SENT.`);
        // Update local state for immediate feedback
        setClients(clients.map(c => {
          if (c.id === clientId) {
            return {
              ...c,
              invoices: c.invoices.map((inv: any) => inv.id === invoiceId ? { ...inv, status: 'SENT' } : inv)
            };
          }
          return c;
        }));
      }
    });
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
            <button type="submit" disabled={isPending} className="col-span-1 md:col-span-2 bg-white text-black font-bold uppercase py-3 rounded mt-2 disabled:opacity-50 flex items-center justify-center">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Opslaan"}
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
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {invoice.status === 'DRAFT' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleGenerateLink(invoice.id, client.id); }}
                                disabled={isPending}
                                className="text-[9px] uppercase text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 rounded hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                              >
                                <LinkIcon className="w-2 h-2" /> Mollie Link
                              </button>
                            )}
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                              invoice.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 
                              invoice.status === 'SENT' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
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
