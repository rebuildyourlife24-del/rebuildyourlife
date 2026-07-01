"use server";

import { prisma } from "@rebuildyourlife/database";

// Dummy function for POC. In production, this imports the real Shopify SDK.
async function executeShopifyGraphql(shopUrl: string, accessToken: string, query: string, variables: any = {}) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { data: { success: true } };
}

export async function executeAgentAction(actionId: string) {
  try {
    const action = await prisma.agentAction.findUnique({
      where: { id: actionId },
      include: { user: { include: { shopifyStores: true } } }
    });

    if (!action) throw new Error("Action not found");
    if (action.status !== 'PENDING' && action.status !== 'APPROVED') {
      throw new Error("Action already processed");
    }

    const payload = action.payload ? JSON.parse(action.payload) : {};
    
    // Example Execution: Update Product Price via Shopify API
    if (payload.action === "UPDATE_PRODUCT_PRICE" && payload.shopifyProductId) {
      const store = action.user.shopifyStores[0];
      if (!store) throw new Error("No active Shopify store linked");

      const mutation = `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id title }
          }
        }
      `;
      
      const variables = {
        input: {
          id: payload.shopifyProductId,
          variants: [{ price: payload.newPrice }]
        }
      };

      await executeShopifyGraphql(store.shopUrl, store.accessToken, mutation, variables);
    }
    
    // Example Execution: Force Stripe Sync
    if (payload.action === "FORCE_STRIPE_SYNC") {
      // Logic to trigger Stripe Sync
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Mark as executed
    const updatedAction = await prisma.agentAction.update({
      where: { id: actionId },
      data: {
        status: "EXECUTED",
        executedAt: new Date()
      }
    });

    return { success: true, action: updatedAction };
  } catch (error: any) {
    console.error("Execution Engine Error:", error);
    await prisma.agentAction.update({
      where: { id: actionId },
      data: { status: "FAILED", errorMessage: error.message }
    });
    return { success: false, error: error.message };
  }
}
