'use server';

export async function getShopifyConnectionsAction() {
  return { success: true, data: [] };
}

export async function connectShopifyStoreAction(shopUrl: string, accessToken: string) {
  return { success: true, message: "Store connected" };
}

export async function removeShopifyConnectionAction(id: string) {
  return { success: true };
}
