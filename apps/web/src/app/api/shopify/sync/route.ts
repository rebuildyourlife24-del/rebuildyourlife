import { NextResponse } from 'next/server';
import { ShopifySwarmService } from '@/lib/services/shopify.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
    }

    // Orion triggers the Swarm Agent
    const result = await ShopifySwarmService.scanAndQueueProducts(storeId);

    return NextResponse.json({
      message: 'Swarm Agents deployed successfully.',
      ...result
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
