import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { ShopifySwarmService } from '@/lib/services/shopify.service';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { storeId, title, description, price, margin } = body;

    if (!storeId || !title || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdProduct = await ShopifySwarmService.createProductInShopify(
      storeId,
      { title, description, price, margin },
      user.id
    );

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error: any) {
    console.error("Ecommerce Agent Publish Error:", error);
    return NextResponse.json(
      { error: "Failed to publish product to Shopify", details: error.message },
      { status: 500 }
    );
  }
}
