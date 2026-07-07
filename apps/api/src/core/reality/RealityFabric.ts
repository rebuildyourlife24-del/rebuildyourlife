import { IConnectorPlugin } from '../sdk/IConnectorPlugin.js';
import { IEventBus } from '../sdk/IEventBus.js';
import { MemoryEventBus } from '../event-bus/MemoryEventBus.js';
import { EventStoreListener } from '../event-bus/EventStoreListener.js';

// Pre-load connectors for V1.0 (in a real system, these would be loaded dynamically from the db IntegrationPlugin table)
import { ShopifyConnector } from './connectors/ShopifyConnector.js';

export class RealityFabric {
  private connectors: Map<string, IConnectorPlugin> = new Map();
  private bus: IEventBus;

  constructor() {
    this.bus = MemoryEventBus.getInstance();
    
    // Boot the Event Store Listener so it catches all events
    const eventStore = new EventStoreListener(this.bus);
    eventStore.startListening();

    this.registerConnectors();
  }

  private registerConnectors() {
    const shopify = new ShopifyConnector();
    this.connectors.set(shopify.name, shopify);
    console.log(`[RealityFabric] Registered Connector: ${shopify.name}`);
  }

  /**
   * Route an incoming webhook payload to the appropriate connector
   */
  public async handleIncomingWebhook(connectorName: string, payload: any, headers: any) {
    const connector = this.connectors.get(connectorName);
    
    if (!connector) {
      throw new Error(`Connector ${connectorName} not found or not active.`);
    }

    console.log(`[RealityFabric] Routing payload to ${connectorName}`);
    const result = await connector.process(payload, headers, this.bus);
    return result;
  }
}

// Export a singleton instance for the routes to use
export const realityFabricInstance = new RealityFabric();
