"use server";

import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET! || "fallback";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function getTickets() {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const tickets = await prisma.helpdeskTicket.findMany({
      where: { userId },
      include: {
        messages: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, tickets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTicketMessage(ticketId: string, body: string, sender: string = "AGENT") {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const msg = await prisma.ticketMessage.create({
      data: {
        ticketId,
        body,
        sender
      }
    });

    return { success: true, message: msg };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createHelpdeskTicket(customerName: string, customerEmail: string, subject: string, initialMessage: string) {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const ticket = await prisma.helpdeskTicket.create({
      data: {
        userId,
        customerName,
        customerEmail,
        subject,
        priority: "MEDIUM",
        messages: {
          create: {
            sender: "CUSTOMER",
            body: initialMessage
          }
        }
      },
      include: {
        messages: true
      }
    });
    return { success: true, ticket };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
