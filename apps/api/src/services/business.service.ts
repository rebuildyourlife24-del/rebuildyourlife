import { prisma } from "@rebuildyourlife/database";
import { NotFoundError, ForbiddenError, ValidationError } from "../middleware/errorHandler.js";

// ============================================================================
// Interfaces
// ============================================================================

export interface CreateClientInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string; // PROSPECT, ACTIVE, INACTIVE
  notes?: string;
}

export interface UpdateClientInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string;
  notes?: string | null;
  lastContactAt?: string | null;
}

export interface CreateInvoiceInput {
  invoiceNr: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

export interface UpdateInvoiceInput {
  invoiceNr?: string;
  description?: string | null;
  amount?: number;
  dueDate?: string | null;
}

// ============================================================================
// Client CRUD
// ============================================================================

export async function createClient(userId: string, input: CreateClientInput) {
  const client = await prisma.businessClient.create({
    data: {
      userId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      status: input.status ?? "PROSPECT",
      notes: input.notes ?? null,
    },
  });

  return formatClient(client);
}

export async function getClients(userId: string, status?: string) {
  const clients = await prisma.businessClient.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      invoices: {
        select: { id: true, invoiceNr: true, amount: true, status: true, dueDate: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return clients.map(formatClientWithInvoices);
}

export async function getClientById(userId: string, clientId: string) {
  const client = await prisma.businessClient.findUnique({
    where: { id: clientId },
    include: {
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) throw new NotFoundError("Klant");
  if (client.userId !== userId) throw new ForbiddenError();

  return formatClientWithInvoices(client);
}

export async function updateClient(
  userId: string,
  clientId: string,
  input: UpdateClientInput,
) {
  const existing = await prisma.businessClient.findUnique({
    where: { id: clientId },
  });
  if (!existing) throw new NotFoundError("Klant");
  if (existing.userId !== userId) throw new ForbiddenError();

  const client = await prisma.businessClient.update({
    where: { id: clientId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.company !== undefined && { company: input.company }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.lastContactAt !== undefined && {
        lastContactAt: input.lastContactAt ? new Date(input.lastContactAt) : null,
      }),
    },
    include: {
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });

  return formatClientWithInvoices(client);
}

export async function deleteClient(userId: string, clientId: string) {
  const existing = await prisma.businessClient.findUnique({
    where: { id: clientId },
  });
  if (!existing) throw new NotFoundError("Klant");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.businessClient.delete({ where: { id: clientId } });
}

// ============================================================================
// Invoice operations
// ============================================================================

export async function createInvoice(
  userId: string,
  clientId: string,
  input: CreateInvoiceInput,
) {
  // Verify the client belongs to this user
  const client = await prisma.businessClient.findUnique({
    where: { id: clientId },
  });
  if (!client) throw new NotFoundError("Klant");
  if (client.userId !== userId) throw new ForbiddenError();

  const invoice = await prisma.businessInvoice.create({
    data: {
      userId,
      clientId,
      invoiceNr: input.invoiceNr,
      description: input.description ?? null,
      amount: input.amount,
      status: "DRAFT",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
  });

  return formatInvoice(invoice);
}

export async function getInvoices(userId: string, status?: string) {
  const invoices = await prisma.businessInvoice.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map(formatInvoiceWithClient);
}

export async function getInvoiceById(userId: string, invoiceId: string) {
  const invoice = await prisma.businessInvoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: { select: { id: true, name: true, company: true } },
    },
  });

  if (!invoice) throw new NotFoundError("Factuur");
  if (invoice.userId !== userId) throw new ForbiddenError();

  return formatInvoiceWithClient(invoice);
}

export async function updateInvoiceStatus(
  userId: string,
  invoiceId: string,
  status: string,
) {
  const validStatuses = ["DRAFT", "SENT", "PAID", "OVERDUE"];
  if (!validStatuses.includes(status)) {
    throw new ValidationError(
      `Ongeldige status. Geldige waarden: ${validStatuses.join(", ")}`,
    );
  }

  const existing = await prisma.businessInvoice.findUnique({
    where: { id: invoiceId },
  });
  if (!existing) throw new NotFoundError("Factuur");
  if (existing.userId !== userId) throw new ForbiddenError();

  const invoice = await prisma.businessInvoice.update({
    where: { id: invoiceId },
    data: {
      status,
      ...(status === "PAID" && { paidAt: new Date() }),
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
    },
  });

  return formatInvoiceWithClient(invoice);
}

export async function updateInvoice(
  userId: string,
  invoiceId: string,
  input: UpdateInvoiceInput,
) {
  const existing = await prisma.businessInvoice.findUnique({
    where: { id: invoiceId },
  });
  if (!existing) throw new NotFoundError("Factuur");
  if (existing.userId !== userId) throw new ForbiddenError();

  // Cannot edit a PAID invoice
  if (existing.status === "PAID") {
    throw new ValidationError("Een betaalde factuur kan niet worden gewijzigd.");
  }

  const invoice = await prisma.businessInvoice.update({
    where: { id: invoiceId },
    data: {
      ...(input.invoiceNr !== undefined && { invoiceNr: input.invoiceNr }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.dueDate !== undefined && {
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      }),
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
    },
  });

  return formatInvoiceWithClient(invoice);
}

export async function deleteInvoice(userId: string, invoiceId: string) {
  const existing = await prisma.businessInvoice.findUnique({
    where: { id: invoiceId },
  });
  if (!existing) throw new NotFoundError("Factuur");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.businessInvoice.delete({ where: { id: invoiceId } });
}

// ============================================================================
// Business Summary
// ============================================================================

/**
 * Returns business KPIs:
 *  - totalRevenue: sum of amounts for PAID invoices
 *  - pendingRevenue: sum of amounts for SENT invoices
 *  - overdueRevenue: sum of amounts for OVERDUE invoices
 *  - totalClients: number of business clients
 *  - activeClients: number of ACTIVE clients
 */
export async function getBusinessSummary(userId: string) {
  const [allInvoices, totalClients, activeClients] = await Promise.all([
    prisma.businessInvoice.findMany({
      where: { userId },
      select: { amount: true, status: true },
    }),
    prisma.businessClient.count({ where: { userId } }),
    prisma.businessClient.count({ where: { userId, status: "ACTIVE" } }),
  ]);

  const totalRevenue = allInvoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingRevenue = allInvoices
    .filter((inv) => inv.status === "SENT")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueRevenue = allInvoices
    .filter((inv) => inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalInvoices = allInvoices.length;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    pendingRevenue: Math.round(pendingRevenue * 100) / 100,
    overdueRevenue: Math.round(overdueRevenue * 100) / 100,
    totalClients,
    activeClients,
    totalInvoices,
  };
}

// ============================================================================
// Formatters
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatClient(client: any) {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    status: client.status,
    notes: client.notes,
    lastContactAt: client.lastContactAt
      ? (client.lastContactAt as Date).toISOString()
      : null,
    createdAt: (client.createdAt as Date).toISOString(),
    updatedAt: (client.updatedAt as Date).toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatClientWithInvoices(client: any) {
  return {
    ...formatClient(client),
    invoices: client.invoices
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.invoices.map((inv: any) => formatInvoice(inv))
      : [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatInvoice(invoice: any) {
  return {
    id: invoice.id,
    invoiceNr: invoice.invoiceNr,
    description: invoice.description,
    amount: invoice.amount,
    status: invoice.status,
    dueDate: invoice.dueDate ? (invoice.dueDate as Date).toISOString() : null,
    paidAt: invoice.paidAt ? (invoice.paidAt as Date).toISOString() : null,
    clientId: invoice.clientId,
    createdAt: (invoice.createdAt as Date).toISOString(),
    updatedAt: (invoice.updatedAt as Date).toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatInvoiceWithClient(invoice: any) {
  return {
    ...formatInvoice(invoice),
    client: invoice.client
      ? {
          id: invoice.client.id,
          name: invoice.client.name,
          company: invoice.client.company,
        }
      : null,
  };
}
