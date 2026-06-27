import { prisma } from "@rebuildyourlife/database";



export class ShopifySwarmService {
  /**
   * The Product Scraper Agent uses this to find trending products 
   * and queue them in the database for CEO Approval.
   */
  static async scanAndQueueProducts(storeId: string) {
    try {
      // 1. Fetch store credentials
      const store = await prisma.shopifyStore.findUnique({
        where: { id: storeId }
      });

      if (!store) throw new Error("Store not found or Swarm lacks access.");

      // 2. The Agent simulates scraping Shopify / AliExpress for trending products.
      // (In production, this would hit the actual Shopify Admin API or a scraper API).
      const discoveredProducts = [
        {
          shopifyId: `prod_${Date.now()}_1`,
          title: "Viral Titanium Smart Ring",
          description: "High margin wearable tech detected trending on TikTok.",
          price: 149.99,
          margin: 110.00
        },
        {
          shopifyId: `prod_${Date.now()}_2`,
          title: "Ergonomic CEO Desk Setup",
          description: "Premium office equipment. Target audience: high-income earners.",
          price: 899.00,
          margin: 450.00
        }
      ];

      // 3. Queue the products as DRAFT / PENDING_APPROVAL
      const created = await Promise.all(discoveredProducts.map(prod => 
        prisma.shopifyProduct.create({
          data: {
            storeId: store.id,
            shopifyId: prod.shopifyId,
            title: prod.title,
            description: prod.description,
            price: prod.price,
            margin: prod.margin,
            status: "PENDING_APPROVAL" // CEO MUST APPROVE BEFORE GOING LIVE
          }
        })
      ));

      // 4. Log the Agent's action in The Infinite Dossier
      await prisma.agentDossier.create({
        data: {
          agentType: "SHOPIFY_SCRAPER",
          action: "SCANNED_TRENDING_PRODUCTS",
          target: store.shopUrl,
          details: `Found ${created.length} high-margin products. Placed in War Room for CEO approval.`,
          userId: store.userId
        }
      });

      return { success: true, queuedProducts: created.length };
    } catch (error: any) {
      // Log failure to Dossier
      await prisma.agentDossier.create({
        data: {
          agentType: "SHOPIFY_SCRAPER",
          action: "SCANNED_TRENDING_PRODUCTS",
          status: "FAILED",
          details: error.message
        }
      });
      throw error;
    }
  }

  /**
   * The CEO clicks "Approve" in the War Room. The Agent publishes it to the live store.
   */
  static async approveProduct(productId: string, userId: string) {
    const product = await prisma.shopifyProduct.findUnique({ where: { id: productId }});
    if (!product) throw new Error("Product not found");

    // Push to Shopify via their API here...
    
    // Update local DB
    const updated = await prisma.shopifyProduct.update({
      where: { id: productId },
      data: { status: "ACTIVE" }
    });

    // Log approval
    await prisma.agentDossier.create({
      data: {
        agentType: "CEO_OVERRIDE",
        action: "APPROVED_PRODUCT",
        target: product.title,
        userId: userId,
        details: "CEO explicitly approved product for live deployment."
      }
    });

    return updated;
  }

  /**
   * Syncs orders from Shopify to the local database.
   */
  static async syncOrders(storeId: string) {
    try {
      const store = await prisma.shopifyStore.findUnique({ where: { id: storeId } });
      if (!store) throw new Error("ShopifyStore not found");

      // Use standard fetch to call Shopify Admin REST API
      const shopifyApiUrl = `https://${store.shopUrl}/admin/api/2024-01/orders.json?status=any`;
      const response = await fetch(shopifyApiUrl, {
        headers: {
          'X-Shopify-Access-Token': store.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Shopify API responded with ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const orders = data.orders || [];
      let syncedCount = 0;

      for (const order of orders) {
        // Upsert order in DB to avoid duplicates
        await prisma.shopifyOrder.upsert({
          where: { shopifyOrderId: order.id.toString() },
          create: {
            storeId: store.id,
            shopifyOrderId: order.id.toString(),
            totalPrice: parseFloat(order.total_price),
            currency: order.currency,
            status: order.financial_status === 'paid' ? 'COMPLETED' : 'PENDING',
            customerEmail: order.contact_email || order.email || null,
            orderedAt: new Date(order.created_at)
          },
          update: {
            status: order.financial_status === 'paid' ? 'COMPLETED' : 'PENDING',
            totalPrice: parseFloat(order.total_price)
          }
        });
        syncedCount++;
      }

      // Update store total revenue
      const allOrders = await prisma.shopifyOrder.findMany({
        where: { storeId: store.id, status: 'COMPLETED' }
      });
      const totalRev = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);

      await prisma.shopifyStore.update({
        where: { id: store.id },
        data: { totalRevenue: totalRev }
      });

      // Log the sync action
      await prisma.agentDossier.create({
        data: {
          agentType: "SYSTEM",
          action: "SYNCED_SHOPIFY_ORDERS",
          target: store.shopUrl,
          userId: store.userId,
          details: `Synced ${syncedCount} orders successfully.`
        }
      });

      return { success: true, syncedCount, totalRevenue: totalRev };
    } catch (error: any) {
      console.error("Shopify Sync Error:", error);
      throw error;
    }
  }
}
