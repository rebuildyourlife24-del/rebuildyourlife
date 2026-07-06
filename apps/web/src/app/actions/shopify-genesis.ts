'use server';

export async function pushProductToShopifyAction(productData: {
  title: string;
  description: string;
  price: number;
}) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN; // e.g., velvrex.myshopify.com
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!storeDomain || !accessToken) {
    return { success: false, error: "Shopify API keys ontbreken in de configuratie." };
  }

  try {
    const response = await fetch(`https://${storeDomain}/admin/api/2024-01/products.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        product: {
          title: productData.title,
          body_html: `<strong>Ontdek de ${productData.title}</strong><br/>${productData.description}`,
          vendor: "RYL OS AI",
          status: "draft", // Altijd draft zetten zodat de gebruiker het kan controleren op Shopify
          tags: "AI-Generated, Genesis Protocol",
          variants: [
            {
              price: productData.price.toString(),
              inventory_management: null // Geef aan dat we geen voorraad bijhouden (dropshipping)
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API fout: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    return { success: true, product: json.product };
  } catch (error: any) {
    console.error("Shopify Push Error:", error);
    return { success: false, error: error.message };
  }
}
