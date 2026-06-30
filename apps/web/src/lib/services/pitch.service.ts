import { db } from "@/lib/db";

export interface PitchConfig {
  provider: "resend" | "smtp";
  resendApiKey?: string;
  resendFrom?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
}

export class B2BPitchService {
  /**
   * Send email using Resend API (plain fetch POST)
   */
  private static async sendWithResend(
    to: string,
    subject: string,
    bodyHtml: string,
    config: PitchConfig
  ): Promise<boolean> {
    const apiKey = config.resendApiKey || process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Resend API Key is missing. Add it to settings or .env file.");
    }

    const fromAddress = config.resendFrom || "onboarding@resend.dev";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html: bodyHtml
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend API returned status ${res.status}: ${errText}`);
    }

    return true;
  }

  /**
   * Send email using NodeMailer SMTP (dynamic import to prevent compile issues)
   */
  private static async sendWithSmtp(
    to: string,
    subject: string,
    bodyHtml: string,
    config: PitchConfig
  ): Promise<boolean> {
    const host = config.smtpHost || process.env.SMTP_HOST;
    const port = config.smtpPort || Number(process.env.SMTP_PORT) || 587;
    const secure = config.smtpSecure !== undefined ? config.smtpSecure : (process.env.SMTP_SECURE === "true");
    const user = config.smtpUser || process.env.SMTP_USER;
    const pass = config.smtpPass || process.env.SMTP_PASSWORD;
    const from = config.smtpFrom || process.env.SMTP_FROM || user;

    if (!host || !user || !pass) {
      throw new Error("SMTP configuration details are missing. Host, User, and Password are required.");
    }

    let nodemailer: any;
    try {
      // @ts-ignore
      nodemailer = await import("nodemailer");
    } catch (err) {
      throw new Error("Nodemailer package is not installed. Run 'npm install nodemailer' to use SMTP.");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html: bodyHtml
    });

    return true;
  }

  /**
   * Main pitch method: Sends email to a lead, logs it, and updates DB status
   */
  public static async sendPitch(
    clientId: string,
    email: string,
    subject: string,
    bodyHtml: string,
    config: PitchConfig
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (config.provider === "resend") {
        await this.sendWithResend(email, subject, bodyHtml, config);
      } else {
        await this.sendWithSmtp(email, subject, bodyHtml, config);
      }

      // Update client status in database
      const client = await db.businessClient.findUnique({
        where: { id: clientId }
      });

      if (client) {
        const timestamp = new Date().toISOString();
        const updatedNotes = `${client.notes || ""}\n\n[${timestamp}] Sent pitch email: "${subject}"`;
        await db.businessClient.update({
          where: { id: clientId },
          data: {
            status: "CONTACTED",
            lastContactAt: new Date(),
            notes: updatedNotes?.trim()
          }
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("Failed to send pitch:", err);
      return { success: false, error: err.message || "Unknown error during email sending." };
    }
  }
}
