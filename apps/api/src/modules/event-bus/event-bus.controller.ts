import { Request, Response } from 'express';
import { EventDispatcher, EventTopic } from '@rebuildyourlife/shared';

export class EventBusController {
  
  /**
   * Universal endpoint for receiving external webhooks (e.g. from Stripe, Shopify)
   * and translating them into Internal RYL OS Events.
   */
  static async handleExternalWebhook(req: Request, res: Response) {
    try {
      const { source, eventType, payload } = req.body;

      if (!source || !eventType) {
        return res.status(400).json({ error: 'Missing source or eventType' });
      }

      console.log(`[EventBus] Received Webhook from ${source}: ${eventType}`);

      // Basic routing example
      if (source === 'stripe' && eventType === 'invoice.paid') {
        await EventDispatcher.publish(EventTopic.INVOICE_PAID, {
          invoiceId: payload.data.object.id,
          amount: payload.data.object.amount_paid,
          currency: payload.data.object.currency
        }, req.correlationId);
      }

      res.status(200).json({ status: 'ACK' });

    } catch (error: any) {
      // Return 200 anyway so webhook provider doesn't retry forever on unprocessable events,
      // but log it to Audit/Dead Letter Queue.
      console.error(`[EventBus] Webhook processing failed:`, error.message);
      res.status(200).json({ status: 'FAILED_BUT_ACKED' });
    }
  }
}
