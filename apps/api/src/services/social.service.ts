import { prisma } from "@rebuildyourlife/database";
import { NotFoundError, ForbiddenError } from "../middleware/errorHandler.js";

export interface CreateContactInput {
  name: string;
  type: string; // FAMILY, FRIEND, PARTNER, COLLEAGUE
  relationship?: string;
  lastContactAt?: string;
  reminderFrequencyDays?: number;
  notes?: string;
  phone?: string;
  email?: string;
  isImportant?: boolean;
}

export interface UpdateContactInput {
  name?: string;
  type?: string;
  relationship?: string;
  lastContactAt?: string | null;
  reminderFrequencyDays?: number | null;
  notes?: string | null;
  phone?: string | null;
  email?: string | null;
  isImportant?: boolean;
}

/**
 * Creates a new social contact for the user.
 */
export async function createContact(userId: string, input: CreateContactInput) {
  const contact = await prisma.socialContact.create({
    data: {
      userId,
      name: input.name,
      type: input.type,
      relationship: input.relationship ?? null,
      lastContactAt: input.lastContactAt ? new Date(input.lastContactAt) : null,
      reminderFrequencyDays: input.reminderFrequencyDays ?? null,
      notes: input.notes ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      isImportant: input.isImportant ?? false,
    },
  });

  return formatContact(contact);
}

/**
 * Returns all social contacts for the user, optionally filtered by type.
 */
export async function getContacts(userId: string, type?: string) {
  const contacts = await prisma.socialContact.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    orderBy: [{ isImportant: "desc" }, { name: "asc" }],
  });

  return contacts.map(formatContact);
}

/**
 * Returns a single social contact by ID, verifying ownership.
 */
export async function getContactById(userId: string, contactId: string) {
  const contact = await prisma.socialContact.findUnique({
    where: { id: contactId },
  });

  if (!contact) throw new NotFoundError("Contact");
  if (contact.userId !== userId) throw new ForbiddenError();

  return formatContact(contact);
}

/**
 * Updates a social contact, verifying ownership.
 */
export async function updateContact(
  userId: string,
  contactId: string,
  input: UpdateContactInput,
) {
  const existing = await prisma.socialContact.findUnique({
    where: { id: contactId },
  });
  if (!existing) throw new NotFoundError("Contact");
  if (existing.userId !== userId) throw new ForbiddenError();

  const contact = await prisma.socialContact.update({
    where: { id: contactId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.relationship !== undefined && { relationship: input.relationship }),
      ...(input.lastContactAt !== undefined && {
        lastContactAt: input.lastContactAt ? new Date(input.lastContactAt) : null,
      }),
      ...(input.reminderFrequencyDays !== undefined && {
        reminderFrequencyDays: input.reminderFrequencyDays,
      }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.isImportant !== undefined && { isImportant: input.isImportant }),
    },
  });

  return formatContact(contact);
}

/**
 * Deletes a social contact, verifying ownership.
 */
export async function deleteContact(userId: string, contactId: string) {
  const existing = await prisma.socialContact.findUnique({
    where: { id: contactId },
  });
  if (!existing) throw new NotFoundError("Contact");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.socialContact.delete({ where: { id: contactId } });
}

/**
 * Returns contacts whose (lastContactAt + reminderFrequencyDays) has passed today.
 * Contacts without a lastContactAt but WITH a reminderFrequencyDays set are also included
 * (they've never been contacted and should be followed up).
 */
export async function getContactsDueForFollowUp(userId: string) {
  const now = new Date();

  // Fetch all contacts that have a reminder frequency set
  const contacts = await prisma.socialContact.findMany({
    where: {
      userId,
      reminderFrequencyDays: { not: null },
    },
  });

  const due = contacts.filter((contact) => {
    // Never contacted but has a reminder set → overdue
    if (!contact.lastContactAt) return true;

    const daysAgo =
      (now.getTime() - contact.lastContactAt.getTime()) / (1000 * 60 * 60 * 24);

    return daysAgo >= (contact.reminderFrequencyDays as number);
  });

  return due.map((contact) => ({
    ...formatContact(contact),
    daysSinceContact: contact.lastContactAt
      ? Math.floor(
          (now.getTime() - contact.lastContactAt.getTime()) / (1000 * 60 * 60 * 24),
        )
      : null,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatContact(contact: any) {
  return {
    id: contact.id,
    name: contact.name,
    type: contact.type,
    relationship: contact.relationship,
    lastContactAt: contact.lastContactAt
      ? (contact.lastContactAt as Date).toISOString()
      : null,
    reminderFrequencyDays: contact.reminderFrequencyDays,
    notes: contact.notes,
    phone: contact.phone,
    email: contact.email,
    isImportant: contact.isImportant,
    createdAt: (contact.createdAt as Date).toISOString(),
    updatedAt: (contact.updatedAt as Date).toISOString(),
  };
}
