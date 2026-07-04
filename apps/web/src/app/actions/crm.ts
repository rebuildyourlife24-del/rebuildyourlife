'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { getSessionAction } from './auth';

export async function createCRMClientAction(data: { name: string, email: string, phone: string, company: string }) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }
    const userId = session.user.id;

    const client = await prisma.businessClient.create({
      data: {
        userId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        status: "ACTIVE"
      }
    });
    
    revalidatePath('/dashboard/crm');
    return { success: true, client };
  } catch (error: any) {
    console.error("Create client error:", error);
    return { success: false, error: error.message };
  }
}

export async function createCRMInvoiceAction(data: { clientId: string, amount: number, description: string }) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }
    const userId = session.user.id;

    const invoiceCount = await prisma.businessInvoice.count({ where: { userId } });
    const invoiceNr = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(4, '0')}`;

    const invoice = await prisma.businessInvoice.create({
      data: {
        userId,
        clientId: data.clientId,
        invoiceNr,
        description: data.description,
        amount: data.amount,
        status: "DRAFT" // Standaard op draft totdat we de betaallink simuleren
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, invoice };
  } catch (error: any) {
    console.error("Create invoice error:", error);
    return { success: false, error: error.message };
  }
}

export async function generatePaymentLinkAction(invoiceId: string) {
  try {
    const invoice = await prisma.businessInvoice.findUnique({
      where: { id: invoiceId },
      include: { client: true }
    });

    if (!invoice) throw new Error("Factuur niet gevonden");

    const mollieKey = process.env.MOLLIE_API_KEY;
    if (!mollieKey || mollieKey.startsWith("test_REPLACE") || mollieKey === "") {
      throw new Error("Mollie API key niet geconfigureerd");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu";
    
    // Create actual payment via Mollie API
    const paymentResponse = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mollieKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: invoice.amount.toFixed(2),
        },
        description: `${invoice.invoiceNr} - ${invoice.description}`,
        redirectUrl: `${appUrl}/dashboard/crm`,
        metadata: {
          invoiceId: invoice.id,
          clientId: invoice.clientId
        }
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(paymentData.detail || "Mollie betaling aanmaken mislukt");
    }

    const checkoutUrl = paymentData._links?.checkout?.href;
    if (!checkoutUrl) throw new Error("Geen checkout URL ontvangen van Mollie");

    // Update status to SENT
    await prisma.businessInvoice.update({
      where: { id: invoiceId },
      data: { status: "SENT" }
    });
    
    revalidatePath('/dashboard/crm');
    return { 
      success: true, 
      paymentUrl: checkoutUrl 
    };
  } catch (error: any) {
    console.error("Mollie link generation error:", error);
    return { success: false, error: error.message };
  }
}
