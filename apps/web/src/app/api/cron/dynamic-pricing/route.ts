import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = [
      { id: 'prod_1', name: 'Alpha Focus Supplement', stock: 12, demandScore: 95, currentPrice: 49.99 },
      { id: 'prod_2', name: 'Tactical Backpack', stock: 4, demandScore: 88, currentPrice: 129.99 },
      { id: 'prod_3', name: 'Performance T-Shirt', stock: 50, demandScore: 40, currentPrice: 29.99 },
    ];

    const adjustments = [];

    for (const product of products) {
      if (product.stock < 10 || product.demandScore > 90) {
        const newPrice = product.currentPrice * 1.05;
        adjustments.push({
          productId: product.id,
          name: product.name,
          oldPrice: product.currentPrice,
          newPrice: parseFloat(newPrice.toFixed(2)),
          reason: product.stock < 10 ? 'LOW_STOCK' : 'HIGH_DEMAND',
        });
      }
    }

    if (adjustments.length > 0) {
      const users = await prisma.user.findMany({ take: 1 });
      if (users.length > 0) {
        await prisma.agentAction.create({
          data: {
            userId: users[0].id,
            agentType: 'COO',
            actionType: 'DYNAMIC_PRICING_ADJUSTMENT',
            status: 'SUCCESS',
            title: 'Dynamic Pricing Adjustment',
            description: `Adjusted prices for ${adjustments.length} products based on demand and inventory.`,
            resultData: adjustments,
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dynamic pricing adjustment completed',
      adjustments
    });
  } catch (error: any) {
    console.error('Dynamic pricing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
    return GET(request);
}
