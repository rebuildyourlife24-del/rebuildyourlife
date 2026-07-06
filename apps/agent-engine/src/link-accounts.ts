import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  const userId = "dev-local-admin-id";
  const shopUrl = process.env.SHOPIFY_STORE_DOMAIN || "velvrex.myshopify.com";
  const shopifyToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "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";
  const instagramWebhook = process.env.MAKE_WEBHOOK_URL || "https://hook.eu1.make.com/zlml5nu8gb6alwapfcwhk4i73hudc4au";

  console.log(`[LINK INTEGRATIONS] Start koppeling voor User ID: ${userId}`);

  try {
    // 1. Koppel Shopify Store
    const store = await prisma.shopifyStore.upsert({
      where: {
        userId_shopUrl: {
          userId,
          shopUrl
        }
      },
      update: {
        accessToken: shopifyToken,
        status: "ACTIVE"
      },
      create: {
        userId,
        shopUrl,
        accessToken: shopifyToken,
        status: "ACTIVE"
      }
    });
    console.log(`[LINK INTEGRATIONS] Shopify Store gekoppeld: ${store.shopUrl} (ID: ${store.id})`);

    // 2. Koppel Instagram (via Make Webhook URL)
    const social = await prisma.socialPlatformIntegration.upsert({
      where: {
        userId_platform: {
          userId,
          platform: "INSTAGRAM"
        }
      },
      update: {
        accessToken: instagramWebhook,
        status: "CONNECTED"
      },
      create: {
        userId,
        platform: "INSTAGRAM",
        accessToken: instagramWebhook,
        status: "CONNECTED"
      }
    });
    console.log(`[LINK INTEGRATIONS] Instagram gekoppeld via webhook (ID: ${social.id})`);
    
    console.log("=== INTEGRATIES SUCCESVOL GEKOPPELD ===");
  } catch (error) {
    console.error("Fout tijdens koppelen integraties:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
