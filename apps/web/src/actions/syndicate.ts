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

import { Groq } from 'groq-sdk';

// Lanceer de aanval (verstuur de e-mails via de Resend API)
export async function launchSyndicateCampaign(campaignId: string) {
  const campaign = await db.syndicateCampaign.findUnique({
    where: { id: campaignId },
    include: { targets: true }
  });

  if (!campaign) throw new Error("Campagne niet gevonden");

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  let emailsSent = 0;

  for (const target of campaign.targets) {
    if (target.status === 'SENT') continue; // Al gemaild

    // Generate highly personalized cold email via AI
    let mailHtml = "";
    try {
      const prompt = `Schrijf een professionele maar dwingende (B2B) acquisitie of sommatie e-mail namens 'The Syndicate' aan ${target.name} van het bedrijf '${target.company || 'hun bedrijf'}'. 
De e-mail gaat over de campagne: "${campaign.name}" (${campaign.description || 'Geen extra info'}).
${target.debtAmount ? `Het betreft een financiële kwestie of openstaande post van €${target.debtAmount}.` : 'Het betreft een acquisitie/samenwerkingsvoorstel.'}
De e-mail moet in het Nederlands zijn, formeel, kort (max 3 alinea's), direct, en eindigen met 'Hoogachtend, Proxy Legal Services & The Syndicate'.
Geef ALLEEN de HTML code van de e-mail terug (zonder \`\`\`html tags, gewoon puur de code), gebruik <h2>, <p>, <strong> tags waar nuttig. Maak het strak.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-70b-8192',
        temperature: 0.5,
      });

      mailHtml = chatCompletion.choices[0]?.message?.content || "";
      // Strip possible markdown blocks if AI decides to include them anyway
      mailHtml = mailHtml.replace(/```html/g, "").replace(/```/g, "").trim();
      
      if (!mailHtml) throw new Error("AI returned empty email body");
    } catch (aiErr) {
      console.error("AI Email Generation failed, falling back to template:", aiErr);
      // Fallback
      mailHtml = `
        <h2>Bericht van The Syndicate Proxy</h2>
        <p>Beste ${target.name},</p>
        <p>Namens onze cliënt sommeren wij u vriendelijk doch dringend om contact op te nemen inzake de campagne: ${campaign.name}.</p>
        ${target.debtAmount ? `<p>Het gaat om een bedrag van <strong>€${target.debtAmount?.toFixed(2)}</strong>.</p>` : ''}
        <p>Hoogachtend,<br/>Proxy Legal Services</p>
      `;
    }

    try {
      const resendKey = process.env.RESEND_API_KEY;
      
      if (resendKey) {
        // Gebruik het domein dat geverifieerd is in Resend, of de default testing mail van Resend
        const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'Acquisitie <onboarding@resend.dev>';
        
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: target.email,
            subject: `Confidential: ${campaign.name} - ${target.company || target.name}`,
            html: mailHtml
          })
        });
      } else {
        console.log(`[SIMULATED PROD] E-mail verstuurd naar ${target.email}`);
        await new Promise(r => setTimeout(r, 1000));
      }

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

// ==========================================
// SYNDICATE COMMUNITY FEED ACTIONS
// ==========================================

// Haal posts op gefilterd op tier
export async function getSyndicatePosts() {
  try {
    const user = await db.user.findFirst();
    if (!user) return [];

    const userTier = user.clearanceLevel || 1;

    const posts = await db.syndicatePost.findMany({
      where: {
        tier: {
          lte: userTier
        }
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
            clearanceLevel: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        likes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      ...post,
      isLiked: post.likes.some(like => like.userId === user.id),
      likesCount: post.likes.length
    }));
  } catch (error) {
    console.error('Failed to get syndicate posts:', error);
    return [];
  }
}

// Maak een nieuwe post
export async function createSyndicatePost(content: string, title?: string, tier: number = 1) {
  try {
    const user = await db.user.findFirst();
    if (!user) throw new Error("Unauthorized");

    const post = await db.syndicatePost.create({
      data: {
        title,
        content,
        tier,
        authorId: user.id
      }
    });

    revalidatePath('/dashboard/syndicate');
    return post;
  } catch (error) {
    console.error('Failed to create syndicate post:', error);
    throw new Error('Failed to create post');
  }
}

// Like/Unlike post toggle
export async function toggleSyndicateLike(postId: string) {
  try {
    const user = await db.user.findFirst();
    if (!user) throw new Error("Unauthorized");

    const existingLike = await db.syndicateLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id
        }
      }
    });

    if (existingLike) {
      await db.syndicateLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: user.id
          }
        }
      });
      revalidatePath('/dashboard/syndicate');
      return { liked: false };
    } else {
      await db.syndicateLike.create({
        data: {
          postId,
          userId: user.id
        }
      });
      revalidatePath('/dashboard/syndicate');
      return { liked: true };
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
    throw new Error('Failed to toggle like');
  }
}

// Voeg comment toe
export async function addSyndicateComment(postId: string, content: string) {
  try {
    const user = await db.user.findFirst();
    if (!user) throw new Error("Unauthorized");

    const comment = await db.syndicateComment.create({
      data: {
        content,
        postId,
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    revalidatePath('/dashboard/syndicate');
    return comment;
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw new Error('Failed to add comment');
  }
}

// Seeder
export async function seedSyndicatePostsIfEmpty() {
  try {
    const count = await db.syndicatePost.count();
    if (count > 0) return;

    const user = await db.user.findFirst();
    if (!user) return;

    const mockPosts = [
      {
        title: "SECURE COMMUNICATION ESTABLISHED",
        content: "Welcome to The Syndicate network. This feed is encrypted. All messages here are private to syndicate members and will not leak outside. Use this channel to coordinate land claims, corporate espionage, and proxy mail operations.",
        tier: 1,
      },
      {
        title: "ALGO-TRADING BOT APEX TRIGGERED",
        content: "Apex Aggressive mode has been triggered on the SOL/USDT pair. Expect high volatility. Make sure you have at least 50% liquidity parked in your Treasury Vault to cover potential margin requirements. Do not panic-sell.",
        tier: 2,
      },
      {
        title: "LAND ACQUISITION OPPORTUNITY: PERCEEL 89",
        content: "We have scan locked an abandoned warehouse property in Rotterdam Port. The tax lien cost is €12,500. Expected valuation after AI-notary deed resolution is €240,000. Seeking co-investor at Tier 3 level.",
        tier: 3,
      },
      {
        title: "CONFIDENTIAL ESPIONAGE: PROJECT STARDUST",
        content: "Leaked database schemas from our main e-commerce competitor have been compiled. Faction cut is 25% on all resale profits. Download hash: AES-256-f83a992. Access restricted to Tier 4 (Supreme Overseers) only.",
        tier: 4,
      }
    ];

    for (const p of mockPosts) {
      await db.syndicatePost.create({
        data: {
          title: p.title,
          content: p.content,
          tier: p.tier,
          authorId: user.id
        }
      });
    }
    console.log("Mock syndicate posts seeded successfully!");
    return true;
  } catch (error) {
    console.error("Failed to seed mock syndicate posts:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const user = await db.user.findFirst();
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}


