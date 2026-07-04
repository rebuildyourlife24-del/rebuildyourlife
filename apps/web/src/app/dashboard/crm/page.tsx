import { prisma } from '@rebuildyourlife/database';
import { Users } from 'lucide-react';
import CRMClientList from './CRMClientList';
import { getSessionAction } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function CRMPage() {
  const session = await getSessionAction();
  if (!session?.success || !session?.user?.id) {
    redirect('/login');
  }

  const clients = await prisma.businessClient.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-500" />
          CRM & Facturatie
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Beheer je B2B klanten, leads en facturen. Gekoppeld aan je account.</p>
      </div>

      <CRMClientList initialClients={clients} />
    </div>
  );
}
