'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSessionAction } from '@/app/actions/auth';

export async function getFranchises() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const franchises = await db.franchise.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return franchises;
  } catch (error) {
    console.error('Failed to get franchises:', error);
    return [];
  }
}

export async function createFranchise(niche: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const name = niche;
    const subdomain = niche.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim();

    // Check duplication
    const existing = await db.franchise.findUnique({
      where: { subdomain }
    });
    if (existing) {
      throw new Error('Subdomein is al in gebruik.');
    }

    const franchise = await db.franchise.create({
      data: {
        userId: session.user.id,
        name,
        subdomain,
        theme: 'MONOCHROME',
        title: name,
        description: `Welkom bij ${name}`,
        products: '[]',
        settings: '{}',
        status: 'ACTIVE'
      }
    });

    revalidatePath('/dashboard/franchises');
    return franchise;
  } catch (error: any) {
    console.error('Failed to create franchise:', error);
    throw new Error(error.message || 'Failed to create franchise');
  }
}

export async function createFranchiseAction(data: {
  name: string;
  subdomain: string;
  customDomain?: string;
  theme?: string;
  title?: string;
  description?: string;
}) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const subdomain = data.subdomain.toLowerCase().trim();
    
    // Check duplication
    const existing = await db.franchise.findUnique({
      where: { subdomain }
    });
    if (existing) {
      throw new Error('Subdomein is al in gebruik.');
    }

    if (data.customDomain) {
      const existingCustom = await db.franchise.findUnique({
        where: { customDomain: data.customDomain.toLowerCase().trim() }
      });
      if (existingCustom) {
        throw new Error('Custom domein is al in gebruik.');
      }
    }

    const franchise = await db.franchise.create({
      data: {
        userId: session.user.id,
        name: data.name,
        subdomain,
        customDomain: data.customDomain?.toLowerCase().trim() || null,
        theme: data.theme || 'MONOCHROME',
        title: data.title || data.name,
        description: data.description || `Welkom bij ${data.name}`,
        products: '[]',
        settings: '{}',
        status: 'ACTIVE'
      }
    });

    revalidatePath('/dashboard/franchises');
    return { success: true, data: franchise };
  } catch (error: any) {
    console.error('Failed to create franchise:', error);
    return { success: false, error: error.message || 'Failed to create franchise' };
  }
}

export async function getFranchiseByIdAction(id: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const franchise = await db.franchise.findUnique({
      where: { id }
    });

    if (!franchise) throw new Error('Franchise niet gevonden');
    if (franchise.userId !== session.user.id) throw new Error('Geen toegang');

    return { success: true, data: franchise };
  } catch (error: any) {
    console.error('Failed to get franchise:', error);
    return { success: false, error: error.message };
  }
}

export async function updateFranchiseAction(id: string, data: {
  name?: string;
  subdomain?: string;
  customDomain?: string | null;
  status?: string;
  theme?: string;
  title?: string;
  description?: string;
  products?: any[];
  settings?: any;
}) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const franchise = await db.franchise.findUnique({ where: { id } });
    if (!franchise) throw new Error('Franchise niet gevonden');
    if (franchise.userId !== session.user.id) throw new Error('Geen toegang');

    if (data.subdomain && data.subdomain.toLowerCase() !== franchise.subdomain) {
      const existing = await db.franchise.findUnique({
        where: { subdomain: data.subdomain.toLowerCase() }
      });
      if (existing) throw new Error('Subdomein is al in gebruik.');
    }

    const updated = await db.franchise.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.subdomain !== undefined && { subdomain: data.subdomain.toLowerCase() }),
        ...(data.customDomain !== undefined && { customDomain: data.customDomain }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.products !== undefined && { products: JSON.stringify(data.products) }),
        ...(data.settings !== undefined && { settings: JSON.stringify(data.settings) })
      }
    });

    revalidatePath('/dashboard/franchises');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Failed to update franchise:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteFranchiseAction(id: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const franchise = await db.franchise.findUnique({ where: { id } });
    if (!franchise) throw new Error('Franchise niet gevonden');
    if (franchise.userId !== session.user.id) throw new Error('Geen toegang');

    await db.franchise.delete({ where: { id } });

    revalidatePath('/dashboard/franchises');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete franchise:', error);
    return { success: false, error: error.message };
  }
}

export async function getFranchiseOrdersAction(franchiseId: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const franchise = await db.franchise.findUnique({ where: { id: franchiseId } });
    if (!franchise) throw new Error('Franchise niet gevonden');
    if (franchise.userId !== session.user.id) throw new Error('Geen toegang');

    const orders = await db.franchiseOrder.findMany({
      where: { franchiseId },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: orders };
  } catch (error: any) {
    console.error('Failed to get orders:', error);
    return { success: false, error: error.message };
  }
}

export async function simulateFranchiseOrderAction(franchiseId: string, orderData: {
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: any[];
}) {
  try {
    const totalAmount = orderData.totalAmount;
    const platformCut = totalAmount * 0.25;

    // 1. Maak de order aan
    const order = await db.franchiseOrder.create({
      data: {
        franchiseId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        totalAmount,
        platformCut,
        status: 'PAID',
        items: JSON.stringify(orderData.items)
      }
    });

    // 2. Registreer Platform Inkomsten
    await db.platformRevenue.create({
      data: {
        franchiseOrderId: order.id,
        franchiseId,
        amount: platformCut
      }
    });

    // 3. Update Franchise omzet en platform cut totalen
    await db.franchise.update({
      where: { id: franchiseId },
      data: {
        revenue: { increment: totalAmount },
        platformCutTotal: { increment: platformCut }
      }
    });

    // 3.5. Verwerk de Supplier Order & Profit Optimization Simulation
    try {
      const { processSupplierOrderSimulation } = await import('./supplier');
      await processSupplierOrderSimulation(order.id, franchiseId, orderData.items);
    } catch (supplierSimError) {
      console.error('Supplier simulation failed, but order was created:', supplierSimError);
    }

    // 4. Stuur door naar de Supreme Overseer (Henk)
    const supremeOverseer = await db.user.findFirst({
      where: { role: 'SUPREME_OVERSEER' }
    });

    if (supremeOverseer) {
      // Zoek of maak een Operations Vault voor Henk
      let vault = await db.treasuryVault.findFirst({
        where: { userId: supremeOverseer.id, vaultType: 'OPERATIONS' }
      });

      if (!vault) {
        vault = await db.treasuryVault.create({
          data: {
            userId: supremeOverseer.id,
            vaultType: 'OPERATIONS',
            balance: 0.0,
            status: 'ACTIVE'
          }
        });
      }

      // Verhoog de balance van Henk's vault
      await db.treasuryVault.update({
        where: { id: vault.id },
        data: {
          balance: { increment: platformCut }
        }
      });

      // Registreer de wallet transactie
      await db.walletTransaction.create({
        data: {
          userId: supremeOverseer.id,
          vaultId: vault.id,
          amount: platformCut,
          type: 'PLATFORM_CUT',
          executedBy: 'SYSTEM',
          status: 'COMPLETED',
          description: `25% Platform cut from Order ${order.id.substring(0, 8)}`
        }
      });
    }

    revalidatePath('/dashboard/franchises');
    return { success: true, data: order };
  } catch (error: any) {
    console.error('Failed to simulate order:', error);
    return { success: false, error: error.message };
  }
}
