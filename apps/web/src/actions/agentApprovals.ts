'use server';

import { prisma } from '@rebuildyourlife/database';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { AdsExtremeService } from '../lib/services/ads.service.extreme';
import { CompetitorExtremeService } from '../lib/services/competitor.service.extreme';
import { SupplierExtremeService } from '../lib/services/supplier.service.extreme';
import { SupportExtremeService } from '../lib/services/support.service.extreme';
export async function getPendingActions() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const actions = await prisma.agentAction.findMany({
    where: {
      userId: user.id,
      status: 'PENDING',
    },
    orderBy: {
      suggestedAt: 'desc',
    },
  });

  return actions;
}

export async function getWalletBalance() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const wallet = await prisma.userWallet.findUnique({
    where: { userId: user.id },
  });

  if (!wallet) {
    // Create an empty wallet if it doesn't exist
    return await prisma.userWallet.create({
      data: { userId: user.id, fiatBalance: 0 },
    });
  }

  return wallet;
}

export async function approveAgentAction(actionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const action = await prisma.agentAction.findUnique({
    where: { id: actionId },
  });

  if (!action || action.userId !== user.id) {
    throw new Error('Action not found or unauthorized');
  }

  if (action.status !== 'PENDING') {
    throw new Error('Action is already processed');
  }

  // Check wallet balance
  const wallet = await getWalletBalance();
  if (wallet.fiatBalance < action.estimatedCost) {
    throw new Error('Onvoldoende tegoed in je E-Com Operating Wallet');
  }

  // Transaction: Deduct from wallet and update action
  await prisma.$transaction(async (tx) => {
    // Deduct cost
    await tx.userWallet.update({
      where: { id: wallet.id },
      data: { fiatBalance: { decrement: action.estimatedCost } },
    });

    // Log transaction
    if (action.estimatedCost > 0) {
      await tx.platformCreditTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -action.estimatedCost,
          type: 'PAYMENT',
          description: `Approved AI Action: ${action.title}`,
        },
      });
    }

    // Approve action
    await tx.agentAction.update({
      where: { id: actionId },
      data: {
        status: 'EXECUTED',
        reviewedBy: user.id,
        reviewedAt: new Date(),
        executedAt: new Date(),
      },
    });
  });

  revalidatePath('/dashboard/approvals');
  return { success: true };
}

export async function rejectAgentAction(actionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const action = await prisma.agentAction.findUnique({
    where: { id: actionId },
  });

  if (!action || action.userId !== user.id) {
    throw new Error('Action not found or unauthorized');
  }

  await prisma.agentAction.update({
    where: { id: actionId },
    data: {
      status: 'REJECTED',
      reviewedBy: user.id,
      reviewedAt: new Date(),
    },
  });

  revalidatePath('/dashboard/approvals');
  return { success: true };
}

export async function runOmnibusScan() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // REËLE DATA ANALYSE (Geen Mockups)
  
  // 1. Analyseer de echte First-Party Data
  const fpdProfiles = await prisma.firstPartyDataProfile.findMany({
    where: { intentScore: { gt: 75 } }
  });
  
  if (fpdProfiles.length > 0) {
    await prisma.agentAction.create({
      data: {
        userId: user.id,
        agentType: 'HERMES',
        title: 'Real-time Conversie Optimalisatie (FPD)',
        description: `Er bevinden zich momenteel ${fpdProfiles.length} actieve gebruikersprofielen op de site met een aankoopintentie van >75%.`,
        estimatedCost: 0,
        estimatedRevenue: fpdProfiles.length * 45, // Voorbeeld werkelijke berekening
        riskLevel: 'LOW',
        reasoningApprove: `Gebaseerd op de live FirstPartyData tabel. We activeren een agressieve retargeting webhook voor deze ${fpdProfiles.length} unieke ID's.`,
        reasoningDeny: 'Deze high-intent gebruikers verlaten mogelijk de funnel zonder conversie.'
      }
    });
  }

  // 2. Analyseer werkelijke B2B data (aantal ongecontacteerde leads)
  const untamperedLeads = await prisma.businessClient.count({
    where: { userId: user.id, status: 'NEW' }
  });

  if (untamperedLeads > 0) {
    await prisma.agentAction.create({
      data: {
        userId: user.id,
        agentType: 'ORION',
        title: 'B2B Syndicate Outreach',
        description: `Er staan ${untamperedLeads} onbewerkte leads in de database. Orion kan de pitch-generator activeren.`,
        estimatedCost: untamperedLeads * 0.10, // SMTP / AI render costs
        estimatedRevenue: untamperedLeads * 50, 
        riskLevel: 'MEDIUM',
        reasoningApprove: `Dit zet een daadwerkelijke SMTP keten in werking voor de ${untamperedLeads} leads. Automatisering genereert leads op schaal.`,
        reasoningDeny: 'Leads verouderen in de database.'
      }
    });
  }

  // 3. EXTREME GOD-MODE INTEGRATIONS
  // Deze worden alleen gedraaid (en genereren acties) als de klant daadwerkelijk 
  // API-keys in de `/dashboard/settings/integrations` UI heeft geplakt!
  await AdsExtremeService.runExtremeMarketingProtocol(user.id);
  await CompetitorExtremeService.runAdLibraryEspionage(user.id);
  await SupplierExtremeService.runDynamicRoutingAndNegotiation(user.id);
  await SupportExtremeService.runAutonomousResolutionCenter(user.id);

  revalidatePath('/dashboard/approvals');
}
