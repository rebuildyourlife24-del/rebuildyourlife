export class WhatsAppService {
  /**
   * Sends a proactive message to a user via WhatsApp (Mocked).
   * @param userId The ID of the user.
   * @param message The message to send.
   */
  public async sendProactiveMessage(userId: string, message: string): Promise<void> {
    console.log(`[TWILIO MOCK] Sending WhatsApp to User ${userId}: ${message}`);
  }
}
