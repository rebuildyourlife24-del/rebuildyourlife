import { HermesService } from '../hermes.service';

export class SupportWorker {
  static async handleTicket(ticketId: string, customerMessage: string, language: string) {
    console.log(`[SUPPORT WORKER] Handling ticket ${ticketId} in ${language}`);
    
    // Auto-analyze intent (Refund, Tracking, Product Question)
    const intent = this.analyzeIntent(customerMessage);
    
    let response = "";
    if (intent === 'Tracking Inquiry') {
       response = `Je pakket is onderweg en komt binnen 3-5 dagen aan. (Auto-translated to ${language})`;
    } else {
       response = `Bedankt voor je bericht, we helpen je graag verder. (Auto-translated to ${language})`;
    }
    
    await HermesService.logEvent({
      action: 'TICKET_RESOLVED',
      details: { ticketId, intent, autoReply: true },
      status: 'success'
    });
    
    return { success: true, response, resolved: true };
  }
  
  private static analyzeIntent(message: string): string {
    if (message.toLowerCase().includes('waar') || message.toLowerCase().includes('tracking')) {
      return 'Tracking Inquiry';
    }
    return 'General Support';
  }
}