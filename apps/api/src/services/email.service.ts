// @ts-ignore
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER) {
    console.log(`[STUB EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[STUB EMAIL] Content: ${html}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: '"Orion OS" <noreply@rebuildyourlife.eu>',
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `https://app.rebuildyourlife.eu/reset-password?token=${token}`;
  const html = `
    <h1>Wachtwoord Resetten</h1>
    <p>Je hebt een verzoek ingediend om je wachtwoord te resetten.</p>
    <p>Klik op de onderstaande link om een nieuw wachtwoord in te stellen:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Deze link is 1 uur geldig.</p>
  `;
  await sendEmail(email, 'Orion OS - Wachtwoord Reset', html);
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `https://app.rebuildyourlife.eu/verify-email?token=${token}`;
  const html = `
    <h1>E-mailadres Verifiëren</h1>
    <p>Welkom bij Orion OS!</p>
    <p>Klik op de onderstaande link om je e-mailadres te verifiëren:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>Deze link is 24 uur geldig.</p>
  `;
  await sendEmail(email, 'Orion OS - E-mail Verificatie', html);
}
