import { prisma } from "@rebuildyourlife/database";
import { NotFoundError, ForbiddenError, AppError } from "../middleware/errorHandler.js";

export interface CreateFranchiseInput {
  name: string;
  subdomain: string;
  customDomain?: string;
  title?: string;
  description?: string;
  theme?: string;
  products?: any[];
  settings?: any;
}

export interface UpdateFranchiseInput {
  name?: string;
  subdomain?: string;
  customDomain?: string;
  status?: string;
  title?: string;
  description?: string;
  theme?: string;
  products?: any[];
  settings?: any;
}

export async function createFranchise(userId: string, input: CreateFranchiseInput) {
  // Check if subdomain is already taken
  const existingSubdomain = await prisma.franchise.findUnique({
    where: { subdomain: input.subdomain.toLowerCase() }
  });
  if (existingSubdomain) {
    throw new AppError("Subdomein is al in gebruik.", 400, "SUBDOMAIN_TAKEN");
  }

  if (input.customDomain) {
    const existingCustomDomain = await prisma.franchise.findUnique({
      where: { customDomain: input.customDomain.toLowerCase() }
    });
    if (existingCustomDomain) {
      throw new AppError("Custom domein is al in gebruik.", 400, "CUSTOM_DOMAIN_TAKEN");
    }
  }

  const franchise = await prisma.franchise.create({
    data: {
      userId,
      name: input.name,
      subdomain: input.subdomain.toLowerCase(),
      customDomain: input.customDomain?.toLowerCase() || null,
      title: input.title || input.name,
      description: input.description || `Welkom bij ${input.name}`,
      theme: input.theme || "MONOCHROME",
      products: input.products ? JSON.stringify(input.products) : "[]",
      settings: input.settings ? JSON.stringify(input.settings) : "{}",
      status: "ACTIVE"
    }
  });

  return formatFranchise(franchise);
}

export async function getFranchises(userId: string) {
  const franchises = await prisma.franchise.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return franchises.map(formatFranchise);
}

export async function getFranchiseById(userId: string, id: string) {
  const franchise = await prisma.franchise.findUnique({
    where: { id }
  });
  if (!franchise) throw new NotFoundError("Franchise");
  if (franchise.userId !== userId) throw new ForbiddenError();
  return formatFranchise(franchise);
}

export async function getFranchiseBySubdomain(subdomain: string) {
  const franchise = await prisma.franchise.findUnique({
    where: { subdomain: subdomain.toLowerCase() }
  });
  if (!franchise) throw new NotFoundError("Franchise winkel");
  return formatFranchise(franchise);
}

export async function updateFranchise(userId: string, id: string, input: UpdateFranchiseInput) {
  const existing = await prisma.franchise.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Franchise");
  if (existing.userId !== userId) throw new ForbiddenError();

  if (input.subdomain && input.subdomain.toLowerCase() !== existing.subdomain) {
    const existingSubdomain = await prisma.franchise.findUnique({
      where: { subdomain: input.subdomain.toLowerCase() }
    });
    if (existingSubdomain) {
      throw new AppError("Subdomein is al in gebruik.", 400, "SUBDOMAIN_TAKEN");
    }
  }

  if (input.customDomain && input.customDomain.toLowerCase() !== existing.customDomain) {
    const existingCustomDomain = await prisma.franchise.findUnique({
      where: { customDomain: input.customDomain.toLowerCase() }
    });
    if (existingCustomDomain) {
      throw new AppError("Custom domein is al in gebruik.", 400, "CUSTOM_DOMAIN_TAKEN");
    }
  }

  const updated = await prisma.franchise.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.subdomain !== undefined && { subdomain: input.subdomain.toLowerCase() }),
      ...(input.customDomain !== undefined && { customDomain: input.customDomain?.toLowerCase() || null }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.theme !== undefined && { theme: input.theme }),
      ...(input.products !== undefined && { products: JSON.stringify(input.products) }),
      ...(input.settings !== undefined && { settings: JSON.stringify(input.settings) })
    }
  });

  return formatFranchise(updated);
}

export async function deleteFranchise(userId: string, id: string) {
  const existing = await prisma.franchise.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Franchise");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.franchise.delete({ where: { id } });
  return { success: true };
}

// Order simulatie/verwerking
export async function createFranchiseOrder(
  franchiseId: string,
  input: { customerName: string; customerEmail: string; totalAmount: number; items: any[] }
) {
  const franchise = await prisma.franchise.findUnique({
    where: { id: franchiseId }
  });
  if (!franchise) throw new NotFoundError("Franchise");

  const totalAmount = input.totalAmount;
  const platformCut = totalAmount * 0.25; // 25% Platform Cut

  // 1. Maak de order aan
  const order = await prisma.franchiseOrder.create({
    data: {
      franchiseId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      totalAmount,
      platformCut,
      status: "PAID",
      items: JSON.stringify(input.items)
    }
  });

  // 2. Registreer Platform Inkomsten
  await prisma.platformRevenue.create({
    data: {
      franchiseOrderId: order.id,
      franchiseId,
      amount: platformCut
    }
  });

  // 3. Update Franchise omzet en platform cut totalen
  await prisma.franchise.update({
    where: { id: franchiseId },
    data: {
      revenue: { increment: totalAmount },
      platformCutTotal: { increment: platformCut }
    }
  });

  // 4. Stuur door naar de Supreme Overseer (Henk)
  const supremeOverseer = await prisma.user.findFirst({
    where: { role: "SUPREME_OVERSEER" }
  });

  if (supremeOverseer) {
    // Zoek of maak een Operations Vault voor Henk
    let vault = await prisma.treasuryVault.findFirst({
      where: { userId: supremeOverseer.id, vaultType: "OPERATIONS" }
    });

    if (!vault) {
      vault = await prisma.treasuryVault.create({
        data: {
          userId: supremeOverseer.id,
          vaultType: "OPERATIONS",
          balance: 0.0,
          status: "ACTIVE"
        }
      });
    }

    // Verhoog de balance van Henk's vault
    await prisma.treasuryVault.update({
      where: { id: vault.id },
      data: {
        balance: { increment: platformCut }
      }
    });

    // Registreer de wallet transactie
    await prisma.walletTransaction.create({
      data: {
        userId: supremeOverseer.id,
        vaultId: vault.id,
        amount: platformCut,
        type: "PLATFORM_CUT",
        executedBy: "SYSTEM",
        status: "COMPLETED",
        description: `25% Platform cut from Order ${order.id.substring(0, 8)} in franchise ${franchise.name}`
      }
    });
  }

  return {
    order: {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      platformCut: order.platformCut,
      status: order.status,
      items: JSON.parse(order.items as string),
      createdAt: order.createdAt
    }
  };
}

export async function getFranchiseOrders(userId: string, franchiseId: string) {
  const franchise = await prisma.franchise.findUnique({ where: { id: franchiseId } });
  if (!franchise) throw new NotFoundError("Franchise");
  if (franchise.userId !== userId) throw new ForbiddenError();

  const orders = await prisma.franchiseOrder.findMany({
    where: { franchiseId },
    orderBy: { createdAt: "desc" }
  });

  return orders.map(o => ({
    id: o.id,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    totalAmount: o.totalAmount,
    platformCut: o.platformCut,
    status: o.status,
    items: JSON.parse(o.items as string),
    createdAt: o.createdAt
  }));
}

function formatFranchise(f: any) {
  return {
    id: f.id,
    userId: f.userId,
    name: f.name,
    subdomain: f.subdomain,
    customDomain: f.customDomain,
    status: f.status,
    title: f.title,
    description: f.description,
    theme: f.theme,
    products: typeof f.products === "string" ? JSON.parse(f.products) : f.products,
    settings: typeof f.settings === "string" ? JSON.parse(f.settings) : f.settings,
    revenue: f.revenue,
    platformCutTotal: f.platformCutTotal,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt
  };
}
