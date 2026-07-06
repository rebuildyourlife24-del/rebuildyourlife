import { PrismaClient } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
// We should import EventDispatcher, but we can do that via relative paths to shared package.
import { EventDispatcher, EventTopic } from '@repo/shared/src/events/index.js';

const prisma = new PrismaClient();

export class BillingService {
  /**
   * Credits a Workspace Wallet with an amount. (Idempotent)
   */
  static async creditWallet(data: {
    workspaceId: string;
    amount: number;
    currency: string;
    description: string;
    idempotencyKey: string;
    correlationId: string;
  }) {
    // Start Transaction
    return await prisma.$transaction(async (tx) => {
      // 1. Check Idempotency
      const existingEntry = await tx.ledgerEntry.findUnique({
        where: { idempotencyKey: data.idempotencyKey }
      });
      if (existingEntry) return existingEntry; // Already processed

      // 2. Upsert Wallet
      const wallet = await tx.workspaceWallet.upsert({
        where: { workspaceId: data.workspaceId },
        update: { balance: { increment: data.amount } },
        create: { workspaceId: data.workspaceId, balance: data.amount, currency: data.currency }
      });

      // 3. Create Ledger Entry
      const entry = await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          amount: data.amount,
          currency: data.currency,
          type: 'CREDIT',
          description: data.description,
          idempotencyKey: data.idempotencyKey,
          correlationId: data.correlationId
        }
      });

      // 4. Audit Log
      await AuditService.logAction({
        correlationId: data.correlationId,
        action: 'WALLET_CREDITED',
        resource: 'WorkspaceWallet',
        workspaceId: data.workspaceId,
        details: { amount: data.amount, currency: data.currency }
      });

      // 5. Emit Event
      await EventDispatcher.publish(EventTopic.WALLET_CREDITED, {
        workspaceId: data.workspaceId,
        amount: data.amount
      }, data.correlationId);

      return entry;
    });
  }

  /**
   * Deducts AI token costs from the wallet. (Internal API for AI Runtime)
   */
  static async deductTokens(data: {
    workspaceId: string;
    tokenCount: number;
    model: string;
    idempotencyKey: string;
    correlationId: string;
  }) {
    // Hardcoded pricing for now, later fetched from DB
    const COST_PER_1K_TOKENS = data.model.includes('gpt-4') ? 0.03 : 0.001;
    const amountToDeduct = (data.tokenCount / 1000) * COST_PER_1K_TOKENS;

    return await prisma.$transaction(async (tx) => {
      const existingEntry = await tx.ledgerEntry.findUnique({
        where: { idempotencyKey: data.idempotencyKey }
      });
      if (existingEntry) return existingEntry;

      const wallet = await tx.workspaceWallet.findUnique({
        where: { workspaceId: data.workspaceId }
      });

      if (!wallet || wallet.balance < amountToDeduct) {
        // Emit Event for low balance instead of hard failing the agent
        await EventDispatcher.publish(EventTopic.WALLET_BALANCE_LOW, {
          workspaceId: data.workspaceId,
          balance: wallet?.balance || 0
        }, data.correlationId);
        throw new Error('INSUFFICIENT_FUNDS');
      }

      // Decrement Wallet
      await tx.workspaceWallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amountToDeduct } }
      });

      // Ledger Entry
      const entry = await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          amount: amountToDeduct,
          currency: wallet.currency,
          type: 'DEBIT',
          description: `AI Execution: ${data.model} (${data.tokenCount} tokens)`,
          idempotencyKey: data.idempotencyKey,
          correlationId: data.correlationId
        }
      });

      await AuditService.logAction({
        correlationId: data.correlationId,
        action: 'WALLET_DEBITED',
        resource: 'WorkspaceWallet',
        workspaceId: data.workspaceId,
        details: { amountDeducted: amountToDeduct, model: data.model }
      });

      return entry;
    });
  }
}
