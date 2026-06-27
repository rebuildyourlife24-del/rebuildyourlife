import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";
    
    // Pak de meest recente store uit de ShopifyStore tabel
    const store = await db.shopifyStore.findFirst({
      where: { userId: TEST_USER_ID },
      orderBy: { createdAt: 'desc' },
      include: {
        products: true,
        orders: {
          orderBy: { orderedAt: 'desc' }
        }
      }
    });

    if (!store) {
      return NextResponse.json({ error: 'Geen Shopify kassa gekoppeld aan de Godbrain.' }, { status: 404 });
    }

    // Filter orders for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysOrders = store.orders.filter(o => o.orderedAt >= today && o.status === 'COMPLETED');
    const totalRevenueToday = todaysOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const orderCountToday = todaysOrders.length;
    const aov = orderCountToday > 0 ? (totalRevenueToday / orderCountToday).toFixed(2) : 0;
    
    // Find low inventory products (threshold 10)
    const lowInventoryProducts = store.products.filter(p => p.inventory < 10);

    return NextResponse.json({
      success: true,
      shop: store.shopUrl,
      liveData: {
        revenue: totalRevenueToday,
        totalRevenueAllTime: store.totalRevenue,
        orderCount: orderCountToday,
        aov: aov,
        currency: 'EUR',
        lowInventory: lowInventoryProducts.map(p => ({
          title: p.title,
          inventory: p.inventory
        })),
        lastSync: new Date().toISOString(),
        simulated: store.orders.length === 0 // If no actual data yet
      }
    });

  } catch (error: any) {
    console.error('Shopify Assimilation Error:', error);
    return NextResponse.json({ error: 'Systeemfout bij data-extractie', message: error.message }, { status: 500 });
  }
}
