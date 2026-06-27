import { NextResponse } from 'next/server';
import { ShopifySwarmService } from '@/lib/services/shopify.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
    }

    // 1. Orion triggers the Swarm Agent to scan products
    const productScanResult = await ShopifySwarmService.scanAndQueueProducts(storeId);
    
    // 2. Sync all recent orders and calculate revenue
    const orderSyncResult = await ShopifySwarmService.syncOrders(storeId);

    return NextResponse.json({
      message: 'Shopify sync complete.',
      products: productScanResult,
      orders: orderSyncResult
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
