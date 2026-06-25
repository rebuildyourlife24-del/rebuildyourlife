"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSessionAction } from "@/app/actions/auth";

export async function saveShopifyCredentials(formData: FormData) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      return { error: "Niet geauthenticeerd. Log opnieuw in." };
    }

    let userId = session.user.id;
    if (userId === "dev-local-admin-id") {
      const adminUser = await db.user.findUnique({
        where: { email: "hsemler50@gmail.com" }
      });
      if (adminUser) {
        userId = adminUser.id;
      }
    }

    const shopUrl = formData.get("shopUrl")?.toString();
    const accessToken = formData.get("accessToken")?.toString();

    if (!shopUrl || !accessToken) {
      return { error: "Winkel URL en Access Token zijn verplicht." };
    }

    // Maak de URL schoon zodat we alleen de myshopify.com domein overhouden
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

    // 2. Sla de koppeling op in de database
    await db.shopifyStore.upsert({
      where: {
        userId_shopUrl: {
          userId: userId,
          shopUrl: cleanUrl,
        }
      },
      update: {
        accessToken: accessToken,
        status: "ACTIVE"
      },
      create: {
        userId: userId,
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

