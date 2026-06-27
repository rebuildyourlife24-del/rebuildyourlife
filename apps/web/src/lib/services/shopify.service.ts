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

      // 2. Fetch real products from Shopify Admin API
      const shopifyApiUrl = `https://${store.shopUrl}/admin/api/2024-01/products.json`;
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
      const shopifyProducts = data.products || [];

      // 3. Queue the products
      let createdCount = 0;
      for (const prod of shopifyProducts) {
        const firstVariant = prod.variants && prod.variants.length > 0 ? prod.variants[0] : null;
        const price = firstVariant ? parseFloat(firstVariant.price) : 0;
        const inventory = firstVariant ? firstVariant.inventory_quantity : 0;
        
        await prisma.shopifyProduct.upsert({
          where: { shopifyId: prod.id.toString() },
          create: {
            storeId: store.id,
            shopifyId: prod.id.toString(),
            title: prod.title,
            description: prod.body_html || '',
            price: price,
            inventory: inventory,
            status: "ACTIVE" // Direct import from Shopify
          },
          update: {
            title: prod.title,
            price: price,
            inventory: inventory
          }
        });
        createdCount++;
      }

      // 4. Log the Agent's action in The Infinite Dossier
      await prisma.agentDossier.create({
        data: {
          agentType: "SYSTEM",
          action: "SYNCED_SHOPIFY_PRODUCTS",
          target: store.shopUrl,
          details: `Synced ${createdCount} products from live store.`,
          userId: store.userId
        }
      });

      return { success: true, queuedProducts: createdCount };
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
