export class TelegramService {
  private static readonly BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  private static readonly CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  private static readonly API_URL = `https://api.telegram.org/bot${TelegramService.BOT_TOKEN}`;

  /**
   * Send a general alert or notification.
   */
  static async sendAlert(message: string, priority: 'LOW' | 'HIGH' = 'LOW') {
    if (!this.BOT_TOKEN || !this.CHAT_ID) {
      console.warn('Telegram token or chat ID is missing. Skipping notification.');
      return false;
    }

    const prefix = priority === 'HIGH' ? '🚨 *URGENT* 🚨\n\n' : 'ℹ️ *Info*\n\n';
    const text = `${prefix}${message}`;

    try {
      const response = await fetch(`${this.API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        console.error('Failed to send Telegram message:', await response.text());
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  }

  /**
   * Send a specific request for approval (e.g. for Hermes budget or SEO).
   */
  static async sendApprovalRequest(title: string, description: string, actionId?: string) {
    const message = `🛡️ *Approval Required (Control Matrix)*\n\n*${title}*\n${description}\n\n👉 Check the dashboard to approve or deny.`;
    return this.sendAlert(message, 'HIGH');
  }
}
