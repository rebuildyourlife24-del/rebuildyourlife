import { prisma } from "@rebuildyourlife/database";



export async function generateGodbrainIBAN(userId: string, companyName: string) {
  // Simuleert het aanvragen van een BaaS (Banking-as-a-Service) IBAN bijv. via Stripe Treasury of Swan
  const simulatedIban = `NL99GDBR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const swift = 'GDBRNL2A';

  const account = await prisma.godbrainAccount.create({
    data: {
      userId,
      iban: simulatedIban,
      swift: swift,
      accountHolder: companyName,
      status: 'ACTIVE'
    }
  });

  return account;
}

export async function initializeTreasuryVaults(userId: string) {
  // Maakt de standaard potjes aan voor de nieuwe Neo-Bank klant
  const vaultTypes = ['OPERATIONS', 'TAX', 'SYNDICATE_CAPITAL', 'TRADING'];
  
  for (const vType of vaultTypes) {
    // Check if exists first
    const existing = await prisma.treasuryVault.findFirst({
      where: { userId, vaultType: vType }
    });
    if (!existing) {
      await prisma.treasuryVault.create({
        data: {
          userId,
          vaultType: vType,
          balance: 0.0,
          status: 'ACTIVE'
        }
      });
    }
  }
}

export async function routeIncomingFunds(userId: string, amount: number, percentages: { ops: number, tax: number, capital: number }) {
  if (percentages.ops + percentages.tax + percentages.capital !== 100) {
    throw new Error('Percentages must add up to 100');
  }

  // 1. Zoek de vaults
  const opsVault = await prisma.treasuryVault.findFirst({ where: { userId, vaultType: 'OPERATIONS' } });
  const taxVault = await prisma.treasuryVault.findFirst({ where: { userId, vaultType: 'TAX' } });
  const capitalVault = await prisma.treasuryVault.findFirst({ where: { userId, vaultType: 'SYNDICATE_CAPITAL' } });

  if (!opsVault || !taxVault || !capitalVault) throw new Error('Vaults niet geïnitialiseerd');

  const opsAmount = amount * (percentages.ops / 100);
  const taxAmount = amount * (percentages.tax / 100);
  const capitalAmount = amount * (percentages.capital / 100);

  // 2. Transacties aanmaken en Balances updaten
  await prisma.$transaction(async (tx) => {
    // Ops
    await tx.treasuryVault.update({ where: { id: opsVault.id }, data: { balance: { increment: opsAmount } } });
    await tx.walletTransaction.create({
      data: { userId, vaultId: opsVault.id, amount: opsAmount, type: 'DEPOSIT', executedBy: 'SYSTEM', description: 'Routed to Operations' }
    });

    // Tax
    await tx.treasuryVault.update({ where: { id: taxVault.id }, data: { balance: { increment: taxAmount } } });
    await tx.walletTransaction.create({
      data: { userId, vaultId: taxVault.id, amount: taxAmount, type: 'TAX_RESERVE', executedBy: 'SYSTEM', description: 'Routed to Tax Reserve' }
    });

    // Capital
    await tx.treasuryVault.update({ where: { id: capitalVault.id }, data: { balance: { increment: capitalAmount } } });
    await tx.walletTransaction.create({
      data: { userId, vaultId: capitalVault.id, amount: capitalAmount, type: 'DEPOSIT', executedBy: 'SYSTEM', description: 'Routed to Syndicate Capital' }
    });
  });

  return { success: true, amounts: { opsAmount, taxAmount, capitalAmount } };
}
