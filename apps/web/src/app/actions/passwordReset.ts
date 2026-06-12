"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function requestPasswordResetAction(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Altijd success terugsturen — ook als email niet bestaat (security best practice)
    if (!user) {
      return { success: true };
    }

    // Genereer veilig random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 uur geldig

    // Sla token op in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu"}/auth/reset-password?token=${token}`;

    // Stuur e-mail via Resend (als API key aanwezig is)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "RebuildYourLife <noreply@rebuildyourlife.eu>",
          to: [user.email],
          subject: "Wachtwoord Resetten — RebuildYourLife",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
              <h1 style="color: #d4a853; font-size: 24px; margin-bottom: 8px;">RebuildYourLife</h1>
              <h2 style="font-size: 18px; color: #fff; margin-bottom: 24px;">Wachtwoord resetten</h2>
              <p style="color: #94a3b8; line-height: 1.6;">
                Hallo ${user.firstName},<br><br>
                Je hebt een wachtwoord-reset aangevraagd. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.
                De link is <strong>1 uur geldig</strong>.
              </p>
              <a href="${resetUrl}" style="display: inline-block; margin: 32px 0; padding: 14px 32px; background: #d4a853; color: #0a0e1a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                Nieuw wachtwoord instellen
              </a>
              <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
                Als je dit niet hebt aangevraagd, kun je deze e-mail negeren.<br>
                © 2026 RebuildYourLife
              </p>
            </div>
          `,
        }),
      });
    } else {
      // Development fallback: log de reset link naar console
      console.log(`[DEV] Password reset link voor ${email}: ${resetUrl}`);
    }

    return { success: true };
  } catch (error) {
    console.error("requestPasswordResetAction error:", error);
    return { success: false, error: "Er is een fout opgetreden. Probeer het opnieuw." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    if (!token || !newPassword || newPassword.length < 8) {
      return { success: false, error: "Ongeldig verzoek. Wachtwoord moet minimaal 8 tekens zijn." };
    }

    // Zoek geldig token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { success: false, error: "Reset link is ongeldig of verlopen." };
    }

    if (resetToken.usedAt) {
      return { success: false, error: "Deze reset link is al gebruikt." };
    }

    if (new Date() > resetToken.expiresAt) {
      return { success: false, error: "Reset link is verlopen. Vraag een nieuwe aan." };
    }

    // Hash nieuw wachtwoord
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update wachtwoord + markeer token als gebruikt
    await Promise.all([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("resetPasswordAction error:", error);
    return { success: false, error: "Er is een fout opgetreden. Probeer het opnieuw." };
  }
}
