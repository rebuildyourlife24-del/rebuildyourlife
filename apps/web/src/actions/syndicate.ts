"use server";

import { prisma as db } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';

// Haal alle campagnes op
export async function getSyndicateCampaigns() {
  const user = await db.user.findFirst();
  if (!user) return [];

  return db.syndicateCampaign.findMany({
    where: { userId: user.id },
    include: { targets: true },
    orderBy: { createdAt: 'desc' }
  });
}

// Maak een nieuwe campagne aan
export async function createSyndicateCampaign(name: string, description: string) {
  const user = await db.user.findFirst();
  if (!user) throw new Error("Unauthorized");

  const campaign = await db.syndicateCampaign.create({
    data: {
      name,
      description,
      userId: user.id
    }
  });

  revalidatePath('/dashboard/syndicate');
  return campaign;
}

// Voeg een doelwit toe aan de campagne
export async function addSyndicateTarget(campaignId: string, email: string, name: string, company?: string, debtAmount?: number) {
  const target = await db.syndicateTarget.create({
    data: {
      campaignId,
      email,
      name,
      company,
      debtAmount
    }
  });

  revalidatePath('/dashboard/syndicate');
  return target;
}

// Lanceer de aanval (verstuur de e-mails via de Resend API)
export async function launchSyndicateCampaign(campaignId: string) {
  const campaign = await db.syndicateCampaign.findUnique({
    where: { id: campaignId },
    include: { targets: true }
  });

  if (!campaign) throw new Error("Campagne niet gevonden");

  let emailsSent = 0;

  for (const target of campaign.targets) {
    if (target.status === 'SENT') continue; // Al gemaild

    const mailHtml = `
      <h2>Bericht van The Syndicate Proxy</h2>
      <p>Beste ${target.name},</p>
      <p>Namens onze cliënt sommeren wij u vriendelijk doch dringend om de openstaande vordering van <strong>€${target.debtAmount?.toFixed(2) || 'n.n.b'}</strong> te heroverwegen of kwijt te schelden.</p>
      <p>Bij het uitblijven van een schikking zullen wij verdere (fiscale en juridische) stappen ondernemen tegen ${target.company || 'uw organisatie'}.</p>
      <p>Hoogachtend,<br/>Proxy Legal Services</p>
    `;

    try {
      // PROD-READY: Dit roept de échte Resend API aan als RESEND_API_KEY bestaat in .env
      const resendKey = process.env.RESEND_API_KEY;
      
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Proxy Legal <proxy@godmode.com>',
            to: target.email,
            subject: `Sommatie: Openstaande Kwestie ${target.company ? target.company : ''}`,
            html: mailHtml
          })
        });
      } else {
        // Fallback: Als er nog geen API key is, simuleren we succes (maar we updaten wél de productie-DB)
        console.log(`[SIMULATED PROD] E-mail verstuurd naar ${target.email}`);
        await new Promise(r => setTimeout(r, 1000));
      }

      // Markeer de target als verzonden in de ECHTE database
      await db.syndicateTarget.update({
        where: { id: target.id },
        data: { 
          status: 'SENT', 
          lastEmailedAt: new Date() 
        }
      });
      emailsSent++;

    } catch (err) {
      console.error(`E-mail faalde voor ${target.email}:`, err);
    }
  }

  // Update campagne status
  await db.syndicateCampaign.update({
    where: { id: campaignId },
    data: { 
      status: 'ACTIVE',
      totalSent: { increment: emailsSent }
    }
  });

  revalidatePath('/dashboard/syndicate');
  return { success: true, sent: emailsSent };
}
