import { MemoryEventBus } from '../event-bus/MemoryEventBus.js';
import { EventPayload } from '../sdk/IEventBus.js';

export interface EnterpriseStateSummary {
  currentRevenue: number;
  totalOrders: number;
  lastUpdated: Date;
}

export class DigitalTwin {
  private static instance: DigitalTwin;
  private state: EnterpriseStateSummary;

  private constructor() {
    this.state = {
      currentRevenue: 0,
      totalOrders: 0,
      lastUpdated: new Date()
    };
    
    // Subscribe to the Event Bus
    const bus = MemoryEventBus.getInstance();
    bus.subscribe('ORDER_CREATED', this.handleOrderCreated.bind(this));
  }

  public static getInstance(): DigitalTwin {
    if (!DigitalTwin.instance) {
      DigitalTwin.instance = new DigitalTwin();
    }
    return DigitalTwin.instance;
  }

  /**
   * Resets the twin state (useful for Replay)
   */
  public resetState(): void {
    this.state = {
      currentRevenue: 0,
      totalOrders: 0,
      lastUpdated: new Date()
    };
  }

  private async handleOrderCreated(event: EventPayload): Promise<void> {
    const data = event.data;
    if (data.totalPrice) {
      this.state.currentRevenue += Number(data.totalPrice);
    }
    this.state.totalOrders += 1;
    this.state.lastUpdated = event.timestamp || new Date();
    
    // In production, we'd log this or emit a TWIN_UPDATED event
    console.log(`[DigitalTwin] State Updated: Revenue = ${this.state.currentRevenue}`);
  }

  public getStateSnapshot(): EnterpriseStateSummary {
    return { ...this.state };
  }
}
