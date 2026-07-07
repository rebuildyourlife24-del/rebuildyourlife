import { IConnectorPlugin, ConnectorResponse } from '../../sdk/IConnectorPlugin.js';
import { IEventBus, EventPayload } from '../../sdk/IEventBus.js';

export class ShopifyConnector implements IConnectorPlugin {
  public readonly name = 'SHOPIFY_CONNECTOR';

  public async validate(rawPayload: any, headers?: any): Promise<boolean> {
    // In production, verify HMAC signature using Shopify Secret
    if (headers && headers['x-shopify-hmac-sha256'] === 'invalid') {
      return false;
    }
    return true;
  }

  public async normalize(rawPayload: any, headers?: any): Promise<EventPayload[]> {
    const topic = headers?.['x-shopify-topic'] || 'orders/create';
    const events: EventPayload[] = [];

    if (topic === 'orders/create') {
      events.push({
        aggregateId: `order_${rawPayload.id || Date.now()}`,
        eventType: 'ORDER_CREATED',
        source: this.name,
        data: {
          totalPrice: rawPayload.total_price,
          currency: rawPayload.currency,
          customer: rawPayload.customer?.email,
          lineItems: rawPayload.line_items?.map((item: any) => ({
            id: item.id,
            sku: item.sku,
            quantity: item.quantity,
          })),
        },
      });
    }

    return events;
  }

  public async process(rawPayload: any, headers: any, bus: IEventBus): Promise<ConnectorResponse> {
    const isValid = await this.validate(rawPayload, headers);
    if (!isValid) {
      return { success: false, eventsPublished: 0, error: 'Signature Validation Failed' };
    }

    const events = await this.normalize(rawPayload, headers);
    
    let publishedCount = 0;
    for (const event of events) {
      await bus.publish(event);
      publishedCount++;
    }

    return { success: true, eventsPublished: publishedCount };
  }
}
