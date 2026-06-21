"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveShopifyCredentials(formData: FormData) {
  try {
    const shopUrl = formData.get("shopUrl")?.toString();
    const accessToken = formData.get("accessToken")?.toString();
    
    // We gebruiken de TEST_USER_ID totdat auth volledig is geconfigureerd
    const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

    if (!shopUrl || !accessToken) {
      return { error: "Winkel URL en Access Token zijn verplicht." };
    }

    // Maak de URL schoon zodat we alleen de mymyshopify.com domein overhouden
    let cleanUrl = shopUrl.replace("https://", "").replace("http://", "").split('/')[0];
    if (!cleanUrl.includes("myshopify.com")) {
      return { error: "De URL moet een .myshopify.com domein zijn." };
    }

    // 1. Verifieer de API Key door een simpele call naar Shopify te doen
    const testUrl = `https://${cleanUrl}/admin/api/2024-01/shop.json`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      }
    });

    if (!response.ok) {
      return { error: "Ongeldige API sleutel of winkel URL. Shopify weigert toegang." };
    }

    // 2. We hebben toegang, laten we ervoor zorgen dat de test user bestaat
    let user = await db.user.findUnique({ where: { id: TEST_USER_ID }});
    if (!user) {
      user = await db.user.create({
        data: {
          id: TEST_USER_ID,
          email: "ceo@godmode.com",
          firstName: "Supreme",
          lastName: "Overseer",
          passwordHash: "hashedpassword",
          role: "USER"
        }
      });
    }

    // 3. Sla de koppeling op in de database
    await db.shopifyStore.upsert({
      where: {
        userId_shopUrl: {
          userId: TEST_USER_ID,
          shopUrl: cleanUrl,
        }
      },
      update: {
        accessToken: accessToken,
        status: "ACTIVE"
      },
      create: {
        userId: TEST_USER_ID,
        shopUrl: cleanUrl,
        accessToken: accessToken,
        status: "ACTIVE"
      }
    });

    revalidatePath("/dashboard/settings/integrations");
    revalidatePath("/dashboard/war-room");

    return { success: "Winkel succesvol gekoppeld aan de Godbrain!" };
  } catch (error: any) {
    console.error("Integration Save Error:", error);
    return { error: "Systeemfout bij het opslaan: " + error.message };
  }
}
