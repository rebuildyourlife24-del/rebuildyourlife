const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch<T>({ cache = 'force-cache', headers, query, tags, variables }: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: any;
}): Promise<{ status: number; body: T } | never> {
  try {
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e: any) {
    console.error("Shopify Error:", e);
    throw {
      error: e.message,
      query
    };
  }
}

const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(limit = 10) {
  if (!domain || !storefrontAccessToken) return [];
  
  try {
    const res = await shopifyFetch<any>({
      query: getProductsQuery,
      variables: { first: limit },
      cache: 'no-store'
    });
    
    return res.body.data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Fout bij ophalen Shopify producten", error);
    return [];
  }
}

// We implement checkout later, for now we need a placeholder
export async function createCheckout(variantId: string) {
  // Logic to create checkout URL via Storefront API
  return { checkoutUrl: "#" };
}

export async function createShopifyProduct(productData: {
  title: string;
  body_html: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  price: string;
  imageUrl?: string;
}) {
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !adminToken) throw new Error("Missing Shopify Admin Token or Domain");

  const endpoint = `https://${domain}/admin/api/2024-01/products.json`;

  const payload: any = {
    product: {
      title: productData.title,
      body_html: productData.body_html,
      vendor: productData.vendor || "Sovereign OS",
      product_type: productData.product_type || "AI Generated",
      tags: productData.tags || "AI Hunter",
      variants: [
        {
          price: productData.price,
          requires_shipping: true
        }
      ]
    }
  };

  if (productData.imageUrl) {
    payload.product.images = [
      {
        src: productData.imageUrl
      }
    ];
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(data.errors));
    }
    return data.product;
  } catch (error: any) {
    console.error("Fout bij aanmaken Shopify product:", error);
    throw error;
  }
}

