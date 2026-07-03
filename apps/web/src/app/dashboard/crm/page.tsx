import { prisma } from '@rebuildyourlife/database';
import { Users, FileText, Briefcase, Phone, Mail } from 'lucide-react';

export default async function CRMPage() {
  const clients = await prisma.businessClient.findMany({
    include: {
      invoices: true
    }
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-500" />
          CRM & Facturatie
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Beheer je B2B klanten, leads en facturen. Gekoppeld aan de database.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
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
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Facturen ({client.invoices.length})
                  </h4>
                  {client.invoices.length === 0 ? (
                    <p className="text-xs text-zinc-600">Geen facturen beschikbaar.</p>
                  ) : (
                    <div className="space-y-2">
                      {client.invoices.map(invoice => (
                        <div key={invoice.id} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5">
                          <span className="font-mono text-zinc-300">{invoice.invoiceNr}</span>
                          <span className="font-bold text-white">€{invoice.amount.toFixed(2)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${invoice.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {invoice.status}
                          </span>
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
    </div>
  );
}
