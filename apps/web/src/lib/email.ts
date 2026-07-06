import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendEmail({
  to,
  subject,
  html,
  from = "Sovereign OS <onboarding@resend.dev>", // TODO: Replace with user's verified domain in production
  replyTo
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: replyTo,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return { success: false, error: error.message };
  }
}
