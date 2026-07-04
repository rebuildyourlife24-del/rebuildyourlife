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

export async function getEmailCampaigns() {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const campaigns = await prisma.emailCampaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    const subsCount = await prisma.subscriber.count({
      where: { userId, status: "SUBSCRIBED" }
    });

    return { success: true, campaigns, subsCount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createEmailCampaign(name: string, subject: string) {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const campaign = await prisma.emailCampaign.create({
      data: {
        userId,
        name,
        subject,
        htmlContent: "<h1>Nieuwe Campagne</h1><p>Typ hier je mail...</p>",
        status: "DRAFT"
      }
    });

    return { success: true, campaign };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendNewsletterAction(subject: string, content: string, toEmail: string = "test@rebuildyourlife.nl") {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.log('RESEND_API_KEY not found. Simulating email sending.');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, simulated: true, messageId: `mock_${Date.now()}` };
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'The Sovereign Grid <grid@rebuildyourlife.nl>',
        to: [toEmail],
        subject: subject,
        html: content.replace(/\n/g, '<br />')
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email via Resend');
    }

    return { success: true, simulated: false, messageId: data.id };
  } catch (error: any) {
    console.error('Email Send Error:', error);
    return { success: false, error: error.message };
  }
}
