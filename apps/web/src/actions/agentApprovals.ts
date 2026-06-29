'use server';

import { prisma } from '@rebuildyourlife/database';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

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

export async function generateDummyAction() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  await prisma.agentAction.create({
    data: {
      userId: user.id,
      agentType: 'HERMES',
      title: 'Zet Winstgevende FB Ad aan',
      description: 'Hermes heeft een scherpe dropship kans gespot op Facebook. Conversie wordt geschat op 4.2%.',
      estimatedCost: 50,
      estimatedRevenue: 150,
      riskLevel: 'MEDIUM',
      reasoningApprove: 'De verwachte ROAS is 300% gebaseerd op lookalike FPD data. We riskeren 50 euro voor een zeer sterke winstkans.',
      reasoningDeny: 'We verliezen first-mover advantage op deze specifieke demografie. Concurrentie pakt mogelijk deze click-share.'
    }
  });
  
  revalidatePath('/dashboard/approvals');
}
