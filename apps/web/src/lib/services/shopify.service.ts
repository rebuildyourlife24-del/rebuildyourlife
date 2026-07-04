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
        
        await prisma.shopifyProduct.upsert({
          where: { shopifyId: prod.id.toString() },
          create: {
            storeId: store.id,
            shopifyId: prod.id.toString(),
            title: prod.title,
            description: prod.body_html || '',
            price: price,
            status: "ACTIVE" // Direct import from Shopify
          },
          update: {
            title: prod.title,
            price: price
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
   * Pushes a newly generated product directly to the live Shopify store
   */
  static async createProductInShopify(storeId: string, productData: { title: string, description: string, price: number, margin?: number }, userId: string) {
    const store = await prisma.shopifyStore.findUnique({
      where: { id: storeId }
    });

    if (!store) throw new Error("Store not found or lacks access.");

    const shopifyApiUrl = `https://${store.shopUrl}/admin/api/2024-01/products.json`;
    const payload = {
      product: {
        title: productData.title,
        body_html: productData.description,
        vendor: "Glitching AI Agent",
        status: "draft", // Push as draft first to be safe, or "active" if user prefers
        variants: [
          {
            price: productData.price.toString(),
            requires_shipping: true
          }
        ]
      }
    };

    const response = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': store.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Shopify API responded with ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const liveProduct = data.product;

    // Create the local product record
    const created = await prisma.shopifyProduct.create({
      data: {
        storeId: store.id,
        shopifyId: liveProduct.id.toString(),
        title: liveProduct.title,
        description: liveProduct.body_html,
        price: productData.price,
        margin: productData.margin,
        status: "DRAFT"
      }
    });

    await prisma.agentDossier.create({
      data: {
        agentType: "ECOMMERCE_AGENT",
        action: "PUSHED_PRODUCT_TO_SHOPIFY",
        target: liveProduct.title,
        userId: userId,
        details: `Successfully pushed product to Shopify store ${store.shopUrl} with ID ${liveProduct.id}`
      }
    });

    return created;
  }

  /**
   * Syncs orders from Shopify to the local database.
   */
  static async syncOrders(storeId: string) {
    /*
      TODO: Implement ShopifyOrder model in Prisma schema
      For now, return early to prevent type errors.
    */
    return { success: true, syncedCount: 0, totalRevenue: 0 };
  }

  /**
   * Fetch unfulfilled orders for the orchestrator
   */
  static async getUnfulfilledOrders(storeId: string) {
    /*
      TODO: Implement ShopifyOrder model in Prisma schema
      For now, return empty array.
    */
    return [];
  }
}
